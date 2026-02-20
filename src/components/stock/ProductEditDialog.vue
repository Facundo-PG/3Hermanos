<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="550px" persistent>
    <v-card>
      <v-card-title class="bg-grey-darken-4 text-white">
        <v-icon icon="mdi-pencil" class="mr-2"></v-icon>
        Editar Producto #{{ product?.id }}
      </v-card-title>
      <v-card-text class="pt-6">
        <v-form ref="formRef" v-if="product">
          <v-text-field
            v-model="product.nombre"
            label="Nombre del Producto"
            :rules="[rules.required]"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>

          <v-textarea
            v-model="product.descripcion"
            label="Descripción"
            variant="outlined"
            density="comfortable"
            rows="2"
            class="mb-4"
          ></v-textarea>

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model.number="product.precio"
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
                v-model.number="product.stock"
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
  product: any
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
  minPrecio: (v: number) => (v && v > 0) ? true : 'El precio debe ser mayor a 0',
  minStock: (v: number) => (v !== null && v !== undefined && v >= 0) ? true : 'El stock no puede ser negativo',
}

const handleSave = async () => {
  const { valid } = await formRef.value!.validate()
  if (valid) {
    emit('save')
  }
}
</script>
