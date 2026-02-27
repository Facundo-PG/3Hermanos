<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="700px">
    <v-card>
      <v-card-title class="bg-grey-darken-4 text-white">
        <v-icon icon="mdi-eye" class="mr-2"></v-icon>
        Ver Pedido #{{ pedido?.id || '-' }}
        <v-spacer></v-spacer>
        <v-chip size="small" variant="tonal" color="blue-grey">
          {{ estadoLabel }}
        </v-chip>
      </v-card-title>
      <v-card-text class="pt-6">
        <div class="items-title text-blue-grey">Productos</div>
        <div v-if="!items.length" class="empty-state">
          No hay productos cargados en este pedido.
        </div>
        <v-table v-else density="compact">
          <thead>
            <tr>
              <th>Producto</th>
              <th class="text-right">Cantidad</th>
              <th class="text-right">Precio</th>
              <th class="text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="`item-${index}`">
              <td>{{ item.name }}</td>
              <td class="text-right">{{ item.quantity }}</td>
              <td class="text-right">{{ item.priceLabel }}</td>
              <td class="text-right">{{ item.subtotalLabel }}</td>
            </tr>
          </tbody>
        </v-table>
        <div class="total-row">
          <span>Total</span>
          <strong>{{ totalLabel }}</strong>
        </div>

        <!-- Comprobante de transferencia -->
        <div v-if="pedido?.comprobante_url" class="mt-4">
          <v-divider class="mb-4"></v-divider>
          <div class="items-title text-blue-grey">Comprobante de Transferencia</div>
          <v-card variant="outlined" class="rounded-lg pa-2" max-width="400">
            <v-img
              v-if="isImage(pedido.comprobante_url)"
              :src="comprobanteFullUrl"
              max-height="300"
              contain
              class="rounded cursor-pointer"
              @click="openComprobante"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate color="grey-lighten-2"></v-progress-circular>
                </div>
              </template>
            </v-img>
            <div v-else-if="isPdf(pedido.comprobante_url)" class="d-flex align-center pa-3">
              <v-icon icon="mdi-file-pdf-box" color="red" size="40" class="mr-3"></v-icon>
              <div>
                <div class="font-weight-bold">Comprobante PDF</div>
                <a :href="comprobanteFullUrl" target="_blank" class="text-blue-darken-2">Ver archivo</a>
              </div>
            </div>
            <div v-else class="d-flex align-center pa-3">
              <v-icon icon="mdi-file-document-outline" color="blue" size="40" class="mr-3"></v-icon>
              <div>
                <div class="font-weight-bold">Comprobante</div>
                <a :href="comprobanteFullUrl" target="_blank" class="text-blue-darken-2">Ver archivo</a>
              </div>
            </div>
          </v-card>
        </div>
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="$emit('close')">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  pedido: any
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const items = computed(() => {
  const source =
    props.pedido?.items ||
    props.pedido?.order_items ||
    props.pedido?.productos ||
    props.pedido?.detalle ||
    []

  if (!Array.isArray(source)) return []

  return source.map((item: any) => {
    const product = item.product || item.producto || item.products || item
    const name = product?.nombre || product?.name || item.nombre || item.name || 'Producto'
    const quantity = Number(item.cantidad || item.quantity || item.qty || 0)
    const price = item.precio || item.price || item.precio_unitario || null

    const priceNumber = price ? Number(price) : null
    const subtotal = priceNumber !== null ? priceNumber * quantity : null

    return {
      name,
      quantity,
      price: priceNumber,
      priceLabel: priceNumber !== null ? formatCurrency(priceNumber) : '-',
      subtotalLabel: subtotal !== null ? formatCurrency(subtotal) : '-',
    }
  })
})

const estadoLabel = computed(() => {
  const estado = props.pedido?.estado
  const estados: Record<string, string> = {
    pendiente: 'Pendiente',
    pagado: 'Pagado',
    en_proceso: 'En proceso',
    completado: 'Completado',
    cancelado: 'Cancelado',
    entregado: 'Entregado',
  }
  return estados[estado] || estado || 'Sin estado'
})

const totalLabel = computed(() => {
  const total = Number(props.pedido?.total)
  return Number.isFinite(total) ? formatCurrency(total) : '-'
})

const formatCurrency = (value: number) => {
  return `$${value.toFixed(2)}`
}

const comprobanteFullUrl = computed(() => {
  const url = props.pedido?.comprobante_url
  if (!url) return ''
  if (url.startsWith('http')) return url
  const backendUrl = import.meta.env.VITE_PREFI_API || 'http://localhost:3001'
  return `${backendUrl}/uploads/${url}`
})

const isImage = (url: string) => {
  return /\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(url)
}

const isPdf = (url: string) => {
  return /\.pdf$/i.test(url)
}

const openComprobante = () => {
  window.open(comprobanteFullUrl.value, '_blank')
}
</script>

<style scoped>
.empty-state {
  text-align: center;
  color: #757575;
  padding: 16px 0;
}

.items-title {
  font-weight: 700;
  color: #263238;
  margin-bottom: 8px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  font-size: 14px;
}
</style>