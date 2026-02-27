<template>
  <v-card elevation="4" class="pedidos-card">
    <v-card-text class="pa-0">
      <v-data-table
        :headers="headers"
        :items="pedidos"
        :search="search"
        :loading="loading"
        :items-per-page="10"
        class="elevation-0"
        item-value="id"
      >
        <!-- Estado Column -->
        <template v-slot:item.estado="{ item }">
          <v-chip
            :color="getEstadoColor(item.estado)"
            size="small"
            variant="flat"
          >
            {{ formatEstado(item.estado) }}
          </v-chip>
        </template>

        <!-- Total Column -->
        <template v-slot:item.total="{ item }">
          <span class="font-weight-bold">${{ Number(item.total).toFixed(2) }}</span>
        </template>

        <!-- Cliente Column -->
        <template v-slot:item.user="{ item }">
          <div class="d-flex align-center">
            <v-icon icon="mdi-account-circle" size="small" class="mr-2" color="grey"></v-icon>
            <span>{{ item.users?.nombre || 'Sin nombre' }}</span>
          </div>
        </template>

        <!-- Direccion Column -->
        <template v-slot:item.direccion="{ item }">
          <span>{{ item.users?.direccion || item.direccion || '-' }}</span>
        </template>

        <!-- Telefono Column -->
        <template v-slot:item.telefono="{ item }">
          <span>{{ item.users?.telefono || item.telefono || '-' }}</span>
        </template>

        <!-- Tipo Entrega Column -->
        <template v-slot:item.tipo_entrega="{ item }">
          <v-chip size="small" variant="tonal" color="blue-grey">
            {{ formatTipoEntrega(item.tipo_entrega) }}
          </v-chip>
        </template>

        <!-- Método Pago Column -->
        <template v-slot:item.metodo_pago="{ item }">
          <v-chip size="small" variant="tonal" color="green">
            {{ formatMetodoPago(item.metodo_pago) }}
          </v-chip>
        </template>

        <!-- Comprobante Column -->
        <template v-slot:item.comprobante_url="{ item }">
          <template v-if="item.comprobante_url">
            <!-- Imagen: abrir preview en diálogo -->
            <v-btn
              v-if="isImage(item.comprobante_url)"
              size="small"
              variant="tonal"
              color="blue-darken-2"
              prepend-icon="mdi-image"
              class="text-none"
              @click="openImagePreview(item.comprobante_url)"
            >
              Ver
            </v-btn>
            <!-- PDF: abrir en nueva pestaña -->
            <v-btn
              v-else
              :href="getComprobanteUrl(item.comprobante_url)"
              target="_blank"
              size="small"
              variant="tonal"
              color="blue-darken-2"
              prepend-icon="mdi-file-pdf-box"
              class="text-none"
            >
              Ver
            </v-btn>
          </template>
          <span v-else class="text-medium-emphasis">—</span>
        </template>

        <!-- Fecha Column -->
        <template v-slot:item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>

        <!-- Actions Column -->
        <template v-slot:item.actions="{ item }">
          <OrderActions
            :pedido="item"
            @view="$emit('view', item)"
            @edit="$emit('edit', item)"
            @delete="$emit('delete', item)"
          />
        </template>

        <!-- Loading -->
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>

        <!-- No Data -->
        <template v-slot:no-data>
          <div class="text-center pa-8">
            <v-icon icon="mdi-package-variant-closed" size="64" color="grey"></v-icon>
            <p class="text-h6 mt-4">No hay pedidos disponibles</p>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  <!-- Diálogo de preview de imagen -->
  <v-dialog v-model="imagePreviewDialog" max-width="600">
    <v-card>
      <v-card-title class="bg-grey-darken-4 text-white d-flex align-center">
        <v-icon icon="mdi-image" class="mr-2"></v-icon>
        Comprobante
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" color="white" size="small" @click="imagePreviewDialog = false"></v-btn>
      </v-card-title>
      <v-card-text class="pa-4 text-center">
        <v-img :src="imagePreviewUrl" max-height="500" contain class="rounded">
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular indeterminate color="grey-lighten-2"></v-progress-circular>
            </div>
          </template>
          <template v-slot:error>
            <div class="d-flex flex-column align-center justify-center fill-height pa-4">
              <v-icon icon="mdi-image-broken" size="48" color="grey"></v-icon>
              <span class="text-grey mt-2">No se pudo cargar la imagen</span>
            </div>
          </template>
        </v-img>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="imagePreviewDialog = false">Cerrar</v-btn>
        <v-btn color="blue-darken-2" variant="tonal" :href="imagePreviewUrl" target="_blank" prepend-icon="mdi-open-in-new">Abrir en nueva pestaña</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import OrderActions from './OrderActions.vue'

const imagePreviewDialog = ref(false)
const imagePreviewUrl = ref('')

interface Pedido {
  id: number
  user_id: number
  total: number
  estado: string
  tipo_entrega: string
  notas: string
  direccion?: string
  telefono?: string
  created_at: string
  metodo_pago: string
  comprobante_url?: string
  users?: {
    nombre: string
    email: string
    direccion?: string
    telefono?: string
  }
}

defineProps<{
  pedidos: Pedido[]
  search: string
  loading: boolean
}>()

defineEmits<{
  view: [pedido: Pedido]
  edit: [pedido: Pedido]
  delete: [pedido: Pedido]
}>()

// Table headers
const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Cliente', key: 'user', sortable: false },
  { title: 'Direccion', key: 'direccion', sortable: false },
  { title: 'Telefono', key: 'telefono', sortable: false },
  { title: 'Total', key: 'total', sortable: true },
  { title: 'Estado', key: 'estado', sortable: true },
  { title: 'Tipo Entrega', key: 'tipo_entrega', sortable: true },
  { title: 'Método Pago', key: 'metodo_pago', sortable: true },
  { title: 'Comprobante', key: 'comprobante_url', sortable: false, align: 'center' as const },
  { title: 'Fecha', key: 'created_at', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' as const }
]

const getEstadoColor = (estado: string) => {
  const colors: Record<string, string> = {
    pendiente: 'orange',
    en_proceso: 'blue',
    en_camino: 'purple',
    entregado: 'teal'
  }
  return colors[estado] || 'grey'
}

const formatEstado = (estado: string) => {
  const estados: Record<string, string> = {
    pendiente: 'Pendiente',
    en_proceso: 'En proceso',
    en_camino: 'En camino',
    entregado: 'Entregado'
  }
  return estados[estado] || estado
}

const formatTipoEntrega = (tipo: string) => {
  const tipos: Record<string, string> = {
    retiro: 'Retiro',
    envio: 'Envío',
    local: 'Local'
  }
  return tipos[tipo] || tipo
}

const formatMetodoPago = (metodo: string) => {
  const metodos: Record<string, string> = {
    efectivo: 'Efectivo',
    transferencia: 'Transferencia',
    tarjeta: 'Tarjeta',
    mercado_pago: 'Mercado Pago'
  }
  return metodos[metodo] || metodo
}

const isImage = (url: string) => {
  return /\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(url)
}

const getComprobanteUrl = (url: string) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const backendUrl = import.meta.env.VITE_PREFI_API || 'http://localhost:3001'
  return `${backendUrl}/uploads/${url}`
}

const openImagePreview = (url: string) => {
  imagePreviewUrl.value = getComprobanteUrl(url)
  imagePreviewDialog.value = true
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.pedidos-card {
  border-radius: 12px !important;
  overflow: hidden;
}

.v-data-table {
  background: transparent;
}

:deep(.v-data-table-header) {
  background-color: #263238;
}

:deep(.v-data-table-header th) {
  color: white !important;
  font-weight: 600;
}

:deep(.v-data-table__td) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}

:deep(.v-data-table__tr:hover) {
  background-color: rgba(239, 83, 80, 0.05) !important;
}
</style>
