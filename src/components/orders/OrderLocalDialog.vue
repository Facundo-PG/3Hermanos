<template>
  <v-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" max-width="550px">
    <v-card>
      <v-card-title class="bg-orange-darken-2 text-white">
        <v-icon icon="mdi-store" class="mr-2"></v-icon>
        Pedido Local
      </v-card-title>
      <v-card-text class="pt-6">
        <v-form ref="formRef">
          <!-- Método de Pago -->
          <v-select
            v-model="formData.metodo_pago"
            label="Método de Pago"
            :items="['Efectivo', 'Transferencia']"
            :rules="[rules.required]"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-select>

          <!-- Notas -->
          <v-text-field
            v-model="formData.notas"
            label="Notas (opcional)"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>

          <!-- Productos -->
          <div class="mb-4">
            <div class="font-weight-bold mb-2">Productos</div>
            <div v-for="(item, index) in formData.items" :key="index" class="item-card mb-3">
              <v-row class="align-center">
                <v-col cols="7">
                  <v-autocomplete
                    v-model="item.product_id"
                    label="Producto"
                    :items="productsList || []"
                    item-title="nombre"
                    item-value="id"
                    :rules="[rules.required]"
                    variant="outlined"
                    density="comfortable"
                    no-data-text="Sin productos disponibles"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model.number="item.cantidad"
                    label="Cantidad"
                    type="number"
                    :rules="[rules.required, rules.minCantidad]"
                    variant="outlined"
                    density="comfortable"
                    suffix="Kg"
                  ></v-text-field>
                </v-col>
                <v-col cols="1" class="d-flex justify-center">
                  <v-btn
                    v-if="formData.items.length > 1"
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    color="error"
                    @click="removeItem(index)"
                  ></v-btn>
                </v-col>
              </v-row>
            </div>
            <v-btn
              prepend-icon="mdi-plus"
              variant="outlined"
              color="orange-darken-2"
              block
              @click="addItem"
              size="small"
            >
              Agregar Producto
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="closeDialog">Cancelar</v-btn>
        <v-btn
          variant="elevated"
          color="orange-darken-2"
          :loading="saving"
          @click="handleSave"
        >
          Registrar Venta
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
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

const authStore = useAuthStore()
const formRef = ref<InstanceType<typeof VForm> | null>(null)

const rules = {
  required: (v: any) => (!!v || v === 0) ? true : 'Este campo es obligatorio',
  minCantidad: (v: number) => (v && v > 0) ? true : 'La cantidad debe ser mayor a 0',
}

const formData = ref({
  metodo_pago: 'Efectivo',
  notas: '',
  items: [{ product_id: null as number | null, cantidad: 1 }]
})

const productsList = ref<Array<{ id: number; nombre: string }>>([])

const addItem = () => {
  formData.value.items.push({ product_id: null, cantidad: 1 })
}

const removeItem = (index: number) => {
  formData.value.items.splice(index, 1)
}

const handleSave = async () => {
  const { valid } = await formRef.value!.validate()
  if (!valid) return

  const data = {
    user_id: Number(authStore.user?.id) || 0,
    tipo_entrega: 'Local',
    metodo_pago: formData.value.metodo_pago,
    notas: formData.value.notas || '',
    items: formData.value.items.map((item) => ({
      product_id: Number(item.product_id),
      cantidad: Number(item.cantidad)
    }))
  }

  emit('save', data)
}

const closeDialog = () => {
  emit('close')
  emit('update:modelValue', false)
}

const resetForm = () => {
  formData.value = {
    metodo_pago: 'Efectivo',
    notas: '',
    items: [{ product_id: null, cantidad: 1 }]
  }
  formRef.value?.resetValidation()
}

const fetchProducts = async () => {
  try {
    const api = (await import('@/api/axios')).default
    const response = await api.get('/products/list')
    const d = response.data
    const arr = Array.isArray(d?.data?.data)
      ? d.data.data
      : Array.isArray(d?.data)
        ? d.data
        : Array.isArray(d)
          ? d
          : []
    productsList.value = arr
  } catch (error) {
    console.error('Error al cargar productos:', error)
    productsList.value = []
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.item-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  padding: 12px;
}
</style>
