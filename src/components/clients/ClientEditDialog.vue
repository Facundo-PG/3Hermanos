<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="550px" persistent>
    <v-card>
      <v-card-title class="bg-grey-darken-4 text-white">
        <v-icon icon="mdi-account-edit" class="mr-2"></v-icon>
        Editar Cliente #{{ client?.id }}
      </v-card-title>
      <v-card-text class="pt-6">
        <v-form ref="formRef" v-if="client">
          <v-text-field
            v-model="client.nombre"
            label="Nombre completo"
            :rules="[rules.required]"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="client.email"
            label="Email"
            type="email"
            :rules="[rules.required, rules.email]"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="client.telefono"
            label="Teléfono"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="client.direccion"
            label="Dirección"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>

          <v-select
            v-model="client.rol"
            label="Rol"
            :items="['cliente', 'admin']"
            :rules="[rules.required]"
            variant="outlined"
            density="comfortable"
          ></v-select>
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
  client: any
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
  email: (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
}

const handleSave = async () => {
  const { valid } = await formRef.value!.validate()
  if (valid) {
    emit('save')
  }
}
</script>
