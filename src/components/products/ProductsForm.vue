<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ isEdit ? 'Editar Producto' : 'Nuevo Producto' }}</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="form.nombre" label="Nombre del Producto" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="form.category_id"
                :items="categories"
                item-title="nombre"
                item-value="id"
                label="Categoría"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model.number="form.precio" label="Precio" prefix="$" type="number"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model.number="form.stock" label="Stock Actual" type="number"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-switch v-model="form.activo" label="Producto Activo" color="primary"></v-switch>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="close">Cancelar</v-btn>
        <v-btn color="primary" @click="save" :loading="loading">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import api from '@/api/axios'

const props = defineProps(['modelValue', 'item', 'categories'])
const emit = defineEmits(['update:modelValue', 'refresh'])

const dialog = ref(props.modelValue)
const isEdit = ref(false)
const loading = ref(false)

const form = reactive({
  id: null,
  nombre: '',
  precio: 0,
  stock: 0,
  category_id: null,
  activo: true
})

// Sincronizar el modal con el padre
watch(() => props.modelValue, (val) => { dialog.value = val })
watch(() => dialog.value, (val) => { emit('update:modelValue', val) })

// Si recibimos un item, es edición
watch(() => props.item, (val) => {
  if (val) {
    isEdit.value = true
    Object.assign(form, val)
  } else {
    isEdit.value = false
    resetForm()
  }
}, { deep: true })

const resetForm = () => {
  form.id = null
  form.nombre = ''
  form.precio = 0
  form.stock = 0
  form.activo = true
}

const close = () => { dialog.value = false }

const save = async () => {
  loading.value = true
  try {
    if (isEdit.value) {
      await api.patch(`/products/${form.id}`, form)
    } else {
      await api.post('/products', form)
    }
    emit('refresh')
    close()
  } catch (error) {
    console.error("Error al guardar", error)
  } finally {
    loading.value = false
  }
}
</script>