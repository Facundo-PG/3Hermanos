<template>
  <v-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" max-width="550px">
    <v-card>
      <v-card-title class="bg-blue-grey-darken-2 text-white">
        <v-icon icon="mdi-account-plus" class="mr-2"></v-icon>
        Agregar Cliente
      </v-card-title>
      <v-card-text class="pt-6">
        <v-form ref="formRef">
          <v-text-field
            v-model="formData.nombre"
            label="Nombre completo"
            :rules="[rules.required]"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="formData.email"
            label="Email"
            type="email"
            :rules="[rules.required, rules.email]"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="formData.password"
            label="Contraseña"
            type="password"
            :rules="[rules.required, rules.minLength]"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="formData.telefono"
            label="Teléfono"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="formData.direccion"
            label="Dirección"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>

          <v-select
            v-model="formData.rol"
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
        <v-btn variant="text" @click="closeDialog">Cancelar</v-btn>
        <v-btn
          variant="elevated"
          color="blue-grey-darken-2"
          :loading="saving"
          @click="handleSave"
        >
          Crear Cliente
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
  saving?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  save: [data: any]
}>()

const formRef = ref<InstanceType<typeof VForm> | null>(null)

const rules = {
  required: (v: any) => (!!v || v === 0) ? true : 'Este campo es obligatorio',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
  minLength: (v: string) => (v && v.length >= 6) ? true : 'Mínimo 6 caracteres',
}

const formData = ref({
  nombre: '',
  email: '',
  password: '',
  telefono: '',
  direccion: '',
  rol: 'cliente',
})

const handleSave = async () => {
  const { valid } = await formRef.value!.validate()
  if (!valid) return

  emit('save', { ...formData.value })
}

const closeDialog = () => {
  emit('close')
  emit('update:modelValue', false)
}
</script>
