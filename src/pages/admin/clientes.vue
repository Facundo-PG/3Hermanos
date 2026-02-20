<route lang="yaml">
meta:
  layout: adminlayout
</route>

<template>
  <div class="clientes-page">
    <v-container fluid class="pa-6">
      <!-- Header -->
      <v-row class="mb-4">
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold mb-2 text-black">
                <v-icon icon="mdi-account-group" color="red-darken-2" class="mr-2"></v-icon>
                Gestión de Clientes
              </h1>
              <p class="text-body-2 text-grey-darken-2">Administra los clientes del sistema</p>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Search & Actions -->
      <v-row class="mb-4">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Buscar por nombre, email, teléfono..."
            variant="outlined"
            density="comfortable"
            clearable
            hide-details
            color="red-darken-2"
            bg-color="white"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="8" class="d-flex align-center justify-end gap-2">
          <v-chip class="mr-2" color="primary" variant="text">
            <v-icon start icon="mdi-account-group"></v-icon>
            Total: {{ clients.length }} clientes
          </v-chip>
        </v-col>
      </v-row>

      <!-- Tabla de Clientes -->
      <v-row>
        <v-col cols="12">
          <ClientsTable
            :clients="clients"
            :search="search"
            :loading="loading"
            @edit="editClient"
            @delete="confirmDelete"
          />
        </v-col>
      </v-row>
    </v-container>

    <!-- Edit Dialog -->
    <ClientEditDialog
      v-model="editDialog"
      :client="editedClient"
      :saving="saving"
      @close="closeEdit"
      @save="saveClient"
    />

    <!-- Delete Dialog -->
    <ClientDeleteDialog
      v-model="deleteDialog"
      :client="clientToDelete"
      :deleting="deleting"
      @close="deleteDialog = false"
      @confirm="removeClient"
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
import { obtainClients, updateClient, deleteClient } from '@/services/admin/obtainClients.service'
import ClientsTable from '@/components/clients/ClientsTable.vue'
import ClientEditDialog from '@/components/clients/ClientEditDialog.vue'
import ClientDeleteDialog from '@/components/clients/ClientDeleteDialog.vue'

interface Client {
  id: number
  nombre: string
  email: string
  telefono: string
  direccion: string
  rol: string
  verificado: boolean
  created_at: string
}

// State
const clients = ref<Client[]>([])
const search = ref('')
const loading = ref(false)
const editDialog = ref(false)
const deleteDialog = ref(false)
const editedClient = ref<Client | null>(null)
const clientToDelete = ref<Client | null>(null)
const saving = ref(false)
const deleting = ref(false)

// Snackbar
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// Fetch
const fetchClients = async () => {
  loading.value = true
  try {
    const response = await obtainClients()
    const d = response.data
    const arr = Array.isArray(d?.data?.data)
      ? d.data.data
      : Array.isArray(d?.data)
        ? d.data
        : Array.isArray(d)
          ? d
          : []
    clients.value = arr
  } catch (error) {
    console.error('Error al cargar clientes:', error)
    showSnackbar('Error al cargar los clientes', 'error')
  } finally {
    loading.value = false
  }
}

// Edit
const editClient = (client: Client) => {
  editedClient.value = { ...client }
  editDialog.value = true
}

const closeEdit = () => {
  editDialog.value = false
  editedClient.value = null
}

const saveClient = async () => {
  if (!editedClient.value) return
  saving.value = true
  try {
    const updateData = {
      nombre: editedClient.value.nombre,
      email: editedClient.value.email,
      telefono: editedClient.value.telefono,
      direccion: editedClient.value.direccion,
      rol: editedClient.value.rol,
    }
    await updateClient(editedClient.value.id, updateData)
    showSnackbar('Cliente actualizado correctamente', 'success')
    await fetchClients()
    closeEdit()
  } catch (error: any) {
    console.error('Error al actualizar cliente:', error)
    const msg = error?.response?.data?.message || 'Error al actualizar el cliente'
    showSnackbar(msg, 'error')
  } finally {
    saving.value = false
  }
}

// Delete
const confirmDelete = (client: Client) => {
  clientToDelete.value = client
  deleteDialog.value = true
}

const removeClient = async () => {
  if (!clientToDelete.value) return
  deleting.value = true
  try {
    await deleteClient(clientToDelete.value.id)
    showSnackbar('Cliente eliminado correctamente', 'success')
    await fetchClients()
    deleteDialog.value = false
    clientToDelete.value = null
  } catch (error: any) {
    console.error('Error al eliminar cliente:', error)
    const msg = error?.response?.data?.message || 'Error al eliminar el cliente'
    showSnackbar(msg, 'error')
  } finally {
    deleting.value = false
  }
}

const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

onMounted(() => {
  fetchClients()
})
</script>

<style scoped>
.clientes-page {
  background: linear-gradient(135deg, #eceff1 0%, #cfd8dc 100%);
  min-height: 100vh;
}
</style>
