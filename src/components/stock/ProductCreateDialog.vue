<template>
  <v-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" max-width="550px">
    <v-card>
      <v-card-title class="bg-teal-darken-2 text-white">
        <v-icon icon="mdi-plus" class="mr-2"></v-icon>
        Agregar Producto
      </v-card-title>
      <v-card-text class="pt-6">
        <v-form ref="formRef">
          <v-text-field
            v-model="formData.nombre"
            label="Nombre del Producto"
            :rules="[rules.required]"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>

          <v-textarea
            v-model="formData.descripcion"
            label="Descripción (opcional)"
            variant="outlined"
            density="comfortable"
            rows="2"
            class="mb-4"
          ></v-textarea>

          <v-select
            v-model="formData.category_id"
            :items="categories"
            item-title="nombre"
            item-value="id"
            label="Categoría"
            variant="outlined"
            density="comfortable"
            clearable
            class="mb-4"
            prepend-inner-icon="mdi-tag"
          ></v-select>

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model.number="formData.precio"
                label="Precio"
                type="number"
                prefix="$"
                :rules="[rules.required, rules.minPrecio]"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="formData.stock"
                label="Stock"
                type="number"
                suffix="Kg"
                :rules="[rules.required, rules.minStock]"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="closeDialog">Cancelar</v-btn>
        <v-btn
          variant="elevated"
          color="teal-darken-2"
          :loading="saving"
          @click="handleSave"
        >
          Crear Producto
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
  categories: { id: number; nombre: string }[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  save: [data: any]
}>()

const formRef = ref<InstanceType<typeof VForm> | null>(null)

const rules = {
  required: (v: any) => (!!v || v === 0) ? true : 'Este campo es obligatorio',
  minPrecio: (v: number) => (v && v > 0) ? true : 'El precio debe ser mayor a 0',
  minStock: (v: number) => (v !== null && v !== undefined && v >= 0) ? true : 'El stock no puede ser negativo',
}

const formData = ref({
  nombre: '',
  descripcion: '',
  precio: null as number | null,
  stock: null as number | null,
  category_id: null as number | null,
})

const handleSave = async () => {
  const { valid } = await formRef.value!.validate()
  if (!valid) return

  emit('save', {
    nombre: formData.value.nombre,
    descripcion: formData.value.descripcion || '',
    precio: Number(formData.value.precio),
    stock: Number(formData.value.stock),
    category_id: formData.value.category_id || undefined,
  })
}

const closeDialog = () => {
  emit('close')
  emit('update:modelValue', false)
}
</script>
