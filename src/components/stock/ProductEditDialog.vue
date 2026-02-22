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

          <v-select
            v-model="product.category_id"
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
                :model-value="Number(product.stock).toFixed(1)"
                label="Stock Actual"
                suffix="Kg"
                variant="outlined"
                density="comfortable"
                readonly
                disabled
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model.number="stockToAdd"
                label="Cantidad a agregar al stock"
                type="number"
                suffix="Kg"
                :rules="[rules.minStockAdd]"
                variant="outlined"
                density="comfortable"
                hint="Ingresá la cantidad de stock que querés sumar"
                persistent-hint
                color="teal-darken-2"
                prepend-inner-icon="mdi-plus-circle-outline"
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
  categories: { id: number; nombre: string }[]
}>() 

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  save: [stockToAdd: number]
}>()

const formRef = ref<InstanceType<typeof VForm> | null>(null)
const stockToAdd = ref(0)

const rules = {
  required: (v: any) => (!!v || v === 0) ? true : 'Este campo es obligatorio',
  minPrecio: (v: number) => (v && v > 0) ? true : 'El precio debe ser mayor a 0',
  minStockAdd: (v: number) => (v !== null && v !== undefined && v >= 0) ? true : 'La cantidad no puede ser negativa',
}

const handleSave = async () => {
  const { valid } = await formRef.value!.validate()
  if (valid) {
    emit('save', stockToAdd.value || 0)
    stockToAdd.value = 0
  }
}
</script>
