<route lang="yaml">
meta:
  layout: adminlayout
</route>

<template>
  <div class="config-page">
    <v-container fluid class="pa-6">
      <!-- Header -->
      <v-row class="mb-4">
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold mb-2 text-black">
                <v-icon icon="mdi-cog" color="red-darken-2" class="mr-2"></v-icon>
                Configuración
              </h1>
              <p class="text-body-2 text-grey-darken-2">Configuración general del negocio</p>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Tabla de Configuración -->
      <v-row>
        <v-col cols="12">
          <SettingsTable
            :settings="settings"
            :loading="loading"
            @edit="editSetting"
            @toggle-open="toggleOpen"
          />
        </v-col>
      </v-row>
    </v-container>

    <!-- Edit Dialog -->
    <SettingsEditDialog
      v-model="editDialog"
      :setting="editedSetting"
      :saving="saving"
      @close="closeEdit"
      @save="saveSetting"
    />

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { obtainSettings, updateSettings } from '@/services/admin/obtainSettings.service'
import SettingsTable from '@/components/settings/SettingsTable.vue'
import SettingsEditDialog from '@/components/settings/SettingsEditDialog.vue'

interface Setting {
  id: number
  nombre_negocio: string
  costo_delivery: number
  whatsapp_notificaciones: string
  esta_abierto: boolean
  direccion_local: string
  mensaje_alerta: string
}

// State
const settings = ref<Setting[]>([])
const loading = ref(false)
const editDialog = ref(false)
const editedSetting = ref<Setting | null>(null)
const saving = ref(false)

// Snackbar
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// Fetch
const fetchSettings = async () => {
  loading.value = true
  try {
    const response = await obtainSettings()
    const d = response.data
    console.log('Settings API response:', JSON.stringify(d))
    let raw = d?.data?.data ?? d?.data ?? d
    const arr = Array.isArray(raw) ? raw : (raw && typeof raw === 'object' ? [raw] : [])
    settings.value = arr
  } catch (error) {
    console.error('Error al cargar configuración:', error)
    showSnackbar('Error al cargar la configuración', 'error')
  } finally {
    loading.value = false
  }
}

// Toggle abierto/cerrado rápido
const toggleOpen = async (setting: Setting) => {
  try {
    await updateSettings(setting.id, { esta_abierto: !setting.esta_abierto })
    showSnackbar(
      !setting.esta_abierto ? 'Local abierto' : 'Local cerrado',
      !setting.esta_abierto ? 'success' : 'warning'
    )
    await fetchSettings()
  } catch (error) {
    console.error('Error al cambiar estado:', error)
    showSnackbar('Error al cambiar el estado', 'error')
  }
}

// Edit
const editSetting = (setting: Setting) => {
  editedSetting.value = { ...setting }
  editDialog.value = true
}

const closeEdit = () => {
  editDialog.value = false
  editedSetting.value = null
}

const saveSetting = async () => {
  if (!editedSetting.value) return
  saving.value = true
  try {
    const data = {
      nombre_negocio: editedSetting.value.nombre_negocio,
      costo_delivery: Number(editedSetting.value.costo_delivery),
      whatsapp_notificaciones: editedSetting.value.whatsapp_notificaciones,
      esta_abierto: editedSetting.value.esta_abierto,
      direccion_local: editedSetting.value.direccion_local,
      mensaje_alerta: editedSetting.value.mensaje_alerta,
    }
    await updateSettings(editedSetting.value.id, data)
    showSnackbar('Configuración actualizada correctamente', 'success')
    await fetchSettings()
    closeEdit()
  } catch (error: any) {
    console.error('Error al actualizar configuración:', error)
    const msg = error?.response?.data?.message || 'Error al actualizar la configuración'
    showSnackbar(msg, 'error')
  } finally {
    saving.value = false
  }
}

const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

onMounted(() => {
  fetchSettings()
})
</script>

<style scoped>
.config-page {
  background: linear-gradient(135deg, #eceff1 0%, #cfd8dc 100%);
  min-height: 100vh;
}
</style>
