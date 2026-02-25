<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600px" persistent>
    <v-card>
      <v-card-title class="bg-grey-darken-4 text-white">
        <v-icon icon="mdi-cog" class="mr-2"></v-icon>
        Editar Configuración
      </v-card-title>
      <v-card-text class="pt-6">
        <v-form ref="formRef" v-if="setting">
          <v-text-field
            v-model="setting.nombre_negocio"
            label="Nombre del Negocio"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            readonly
            bg-color="grey-lighten-4"
            hint="Este campo no es editable"
            persistent-hint
          ></v-text-field>

          <v-row class="mb-4">
            <v-col cols="6">
              <v-text-field
                v-model.number="setting.costo_delivery"
                label="Costo Delivery"
                type="number"
                prefix="$"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="setting.whatsapp_notificaciones"
                label="WhatsApp Notificaciones"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-whatsapp"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-text-field
            v-model="setting.direccion_local"
            label="Dirección del Local"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-map-marker"
            class="mb-4"
          ></v-text-field>

          <v-textarea
            v-model="setting.mensaje_alerta"
            label="Mensaje de Alerta"
            variant="outlined"
            density="comfortable"
            rows="2"
            class="mb-4"
          ></v-textarea>

          <v-card variant="outlined" class="pa-4 rounded-lg">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="font-weight-bold text-body-1">Estado del Local</div>
                <div class="text-caption text-grey-darken-1">
                  {{ setting.esta_abierto ? 'El local está abierto y aceptando pedidos' : 'El local está cerrado' }}
                </div>
              </div>
              <v-switch
                v-model="setting.esta_abierto"
                color="green-darken-1"
                hide-details
                inset
              ></v-switch>
            </div>
          </v-card>
        </v-form>
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="$emit('close')">Cancelar</v-btn>
        <v-btn
          color="red-darken-2"
          variant="flat"
          :loading="saving"
          @click="handleSave"
        >
          Guardar Cambios
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { VForm } from 'vuetify/components'

defineProps<{
  modelValue: boolean
  setting: any
  saving: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  save: []
}>()

const formRef = ref<InstanceType<typeof VForm> | null>(null)

const rules = {
  required: (v: any) => (!!v || v === 0) ? true : 'Este campo es obligatorio',
}

const handleSave = async () => {
  const { valid } = await formRef.value!.validate()
  if (valid) {
    emit('save')
  }
}
</script>
