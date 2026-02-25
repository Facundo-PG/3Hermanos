<route lang="yaml">
meta:
  layout: adminlayout
</route>

<template>
  <div class="pedidos-page">
    <v-container fluid class="pa-6">
      <!-- Header -->
      <v-row class="mb-4">
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold mb-2 text-black">
                <v-icon icon="mdi-package-variant" color="red-darken-2" class="mr-2"></v-icon>
                Gestión de Pedidos
              </h1>
              <p class="text-body-2 text-grey-darken-2">Administra todos los pedidos del sistema</p>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Search Bar -->
      <v-row class="mb-4" align="center">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Buscar por estado, entrega, pago o cliente..."
            variant="outlined"
            density="comfortable"
            clearable
            hide-details
            color="red-darken-2"
            bg-color="white"
            @keyup.enter="fetchPedidos"
            @click:clear="search = ''; fetchPedidos()"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="dateFrom"
            label="Desde"
            type="date"
            variant="outlined"
            density="comfortable"
            hide-details
            color="red-darken-2"
            bg-color="white"
            @change="fetchPedidos"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="dateTo"
            label="Hasta"
            type="date"
            variant="outlined"
            density="comfortable"
            hide-details
            color="red-darken-2"
            bg-color="white"
            @change="fetchPedidos"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2" class="d-flex ga-2">
          <v-btn
            color="red-darken-2"
            variant="elevated"
            prepend-icon="mdi-magnify"
            @click="fetchPedidos"
            class="text-none"
          >
            Buscar
          </v-btn>
          <v-btn
            variant="outlined"
            color="grey-darken-1"
            prepend-icon="mdi-filter-off"
            @click="clearFilters"
            class="text-none"
          >
            Todos
          </v-btn>
        </v-col>
      </v-row>

      <!-- Pedidos Via Web -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card elevation="2" rounded="lg">
            <v-card-title class="bg-red-darken-2 text-white d-flex align-center">
              <v-icon icon="mdi-web" class="mr-2"></v-icon>
              Pedidos Via Web
              <v-spacer></v-spacer>
              <v-chip color="white" variant="flat" size="small" class="text-red-darken-2 font-weight-bold">
                {{ pedidosWeb.length }} pedidos
              </v-chip>
              <v-btn
                class="ml-3"
                prepend-icon="mdi-plus"
                color="white"
                variant="outlined"
                size="small"
                @click="createDialog = true"
              >
                Agregar Pedido
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-0">
              <TableOrders
                :pedidos="pedidosWeb"
                :search="''"
                :loading="loading"
                @view="viewPedido"
                @edit="editPedido"
                @delete="confirmDelete"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Pedidos Locales -->
      <v-row>
        <v-col cols="12">
          <v-card elevation="2" rounded="lg">
            <v-card-title class="bg-orange-darken-2 text-white d-flex align-center">
              <v-icon icon="mdi-store" class="mr-2"></v-icon>
              Pedidos del Local
              <v-spacer></v-spacer>
              <v-chip color="white" variant="flat" size="small" class="text-orange-darken-2 font-weight-bold">
                {{ pedidosLocal.length }} pedidos
              </v-chip>
              <v-btn
                class="ml-3"
                prepend-icon="mdi-plus"
                color="white"
                variant="outlined"
                size="small"
                @click="localDialog = true"
              >
                Agregar Pedido
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-0">
              <TableOrders
                :pedidos="pedidosLocal"
                :search="''"
                :loading="loading"
                @view="viewPedido"
                @edit="editPedido"
                @delete="confirmDelete"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Edit Dialog -->
    <OrderEditDialog
      v-model="editDialog"
      :pedido="editedPedido"
      :saving="saving"
      @close="closeEdit"
      @save="savePedido"
    />

    <OrderViewDialog
      v-model="viewDialog"
      :pedido="viewedPedido"
      @close="closeView"
    />

    <OrderCreateDialog
      v-model="createDialog"
      :saving="saving"
      @close="closeCreate"
      @save="savePedidoCreate"
    />

    <OrderLocalDialog
      v-model="localDialog"
      :saving="saving"
      @close="localDialog = false"
      @save="savePedidoLocal"
    />

    <!-- Delete Confirmation Dialog -->
    <OrderDeleteDialog
      v-model="deleteDialog"
      :pedido="pedidoToDelete"
      :deleting="deleting"
      @close="deleteDialog = false"
      @confirm="deletePedido"
    />

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { obtainOrders, updateOrder, deleteOrder, createOrder } from '@/services/admin/obtainOrders.service'
import { sendEmailNotification } from '@/services/admin/sendWhatsapp.service'
import TableOrders from '@/components/orders/TableOrders.vue'
import OrderEditDialog from '@/components/orders/OrderEditDialog.vue'
import OrderDeleteDialog from '@/components/orders/OrderDeleteDialog.vue'
import OrderViewDialog from '@/components/orders/OrderViewDialog.vue'
import OrderCreateDialog from '@/components/orders/OrderCreateDialog.vue'
import OrderLocalDialog from '@/components/orders/OrderLocalDialog.vue'

interface Pedido {
  id: number
  user_id: number
  total: number
  estado: string
  tipo_entrega: string
  notas: string
  created_at: string
  metodo_pago: string
  users?: {
    nombre: string
    email: string
    telefono?: string
  }
}

// State
const pedidos = ref<Pedido[]>([])
const search = ref('')
const dateFrom = ref(new Date().toISOString().split('T')[0])
const dateTo = ref(new Date().toISOString().split('T')[0])
const loading = ref(false)
const editDialog = ref(false)
const viewDialog = ref(false)
const deleteDialog = ref(false)
const createDialog = ref(false)
const localDialog = ref(false)
const editedPedido = ref<Pedido | null>(null)
const viewedPedido = ref<Pedido | null>(null)
const pedidoToDelete = ref<Pedido | null>(null)
const saving = ref(false)
const deleting = ref(false)

// Computed: separar pedidos web y local
const pedidosWeb = computed(() =>
  pedidos.value.filter(p => p.tipo_entrega?.toLowerCase() !== 'local')
)
const pedidosLocal = computed(() =>
  pedidos.value.filter(p => p.tipo_entrega?.toLowerCase() === 'local')
)

// Snackbar
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// Methods
const fetchPedidos = async () => {
  loading.value = true
  try {
    const params: any = {}
    if (search.value) params.search = search.value
    if (dateFrom.value) params.dateFrom = dateFrom.value
    if (dateTo.value) params.dateTo = dateTo.value
    const response = await obtainOrders(params)
    pedidos.value = response.data.data?.data || []
  } catch (error) {
    console.error('Error al cargar pedidos:', error)
    showSnackbar('Error al cargar los pedidos', 'error')
  } finally {
    loading.value = false
  }
}

const clearFilters = async () => {
  search.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  await fetchPedidos()
}

const editPedido = (pedido: Pedido) => {
  editedPedido.value = { ...pedido }
  editDialog.value = true
}

const viewPedido = (pedido: Pedido) => {
  viewedPedido.value = { ...pedido }
  viewDialog.value = true
}

const closeEdit = () => {
  editDialog.value = false
  editedPedido.value = null
}

const closeView = () => {
  viewDialog.value = false
  viewedPedido.value = null
}

const closeCreate = () => {
  createDialog.value = false
}

const savePedidoLocal = async (data: any) => {
  saving.value = true
  try {
    await createOrder(data)
    showSnackbar('Venta local registrada correctamente', 'success')
    await fetchPedidos()
    localDialog.value = false
  } catch (error: any) {
    console.error('Error al crear pedido local:', error)
    const mensajeBack = error?.response?.data?.data?.mensajeError || ''
    const stockMatch = mensajeBack.match(/Stock insuficiente para (.+?)\./) 
    if (stockMatch) {
      showSnackbar(`Sin stock de ${stockMatch[1]}`, 'error')
    } else if (mensajeBack) {
      showSnackbar(mensajeBack.replace('Error al crear la orden: ', ''), 'error')
    } else {
      showSnackbar('Error al registrar la venta', 'error')
    }
  } finally {
    saving.value = false
  }
}

const savePedidoCreate = async (data: any) => {
  saving.value = true
  try {
    // Enviar todos los items en una sola llamada
    await createOrder(data)
    showSnackbar('Pedido creado correctamente', 'success')
    await fetchPedidos()
    createDialog.value = false
  } catch (error: any) {
    console.error('Error al crear pedido:', error)
    const mensajeBack = error?.response?.data?.data?.mensajeError || ''
    const stockMatch = mensajeBack.match(/Stock insuficiente para (.+?)\./)
    if (stockMatch) {
      showSnackbar(`El pedido no puede ser creado ya que nos quedamos sin stock de ${stockMatch[1]}`, 'error')
    } else if (mensajeBack) {
      showSnackbar(mensajeBack.replace('Error al crear la orden: ', ''), 'error')
    } else {
      showSnackbar('Error al crear el pedido', 'error')
    }
  } finally {
    saving.value = false
  }
}

const savePedido = async () => {
  if (!editedPedido.value) return

  const estadoAnterior = pedidos.value.find(p => p.id === editedPedido.value?.id)?.estado
  const estadoNuevo = editedPedido.value.estado
  const estadoCambio = estadoAnterior !== estadoNuevo

  saving.value = true
  try {
    // Solo enviar los campos que el backend acepta en el update
    const updateData = {
      estado: editedPedido.value.estado,
      tipo_entrega: editedPedido.value.tipo_entrega,
      metodo_pago: editedPedido.value.metodo_pago,
      notas: editedPedido.value.notas
    }
    await updateOrder(editedPedido.value.id, updateData)
    
    // Enviar email si cambió el estado
     if (estadoCambio) {
      showSnackbar('Orden modificada. El email se envió correctamente al cliente', 'success')
    } else {
      showSnackbar('Pedido actualizado correctamente', 'success')
    }
    await fetchPedidos()
    closeEdit()
  } catch (error) {
    console.error('Error al actualizar pedido:', error)
    showSnackbar('Error al actualizar el pedido', 'error')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (pedido: Pedido) => {
  pedidoToDelete.value = pedido
  deleteDialog.value = true
}

const deletePedido = async () => {
  if (!pedidoToDelete.value) return

  deleting.value = true
  try {
    await deleteOrder(pedidoToDelete.value.id)
    showSnackbar('Pedido eliminado correctamente', 'success')
    await fetchPedidos()
    deleteDialog.value = false
    pedidoToDelete.value = null
  } catch (error) {
    console.error('Error al eliminar pedido:', error)
    showSnackbar('Error al eliminar el pedido', 'error')
  } finally {
    deleting.value = false
  }
}

const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

// Lifecycle
onMounted(() => {
  fetchPedidos()
})
</script>

<style scoped>
.pedidos-page {
  background: linear-gradient(135deg, #eceff1 0%, #cfd8dc 100%);
  min-height: 100vh;
}
</style>
