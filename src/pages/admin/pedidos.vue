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
      <v-row class="mb-4">
        <v-col cols="12" md="2">
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
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="10" class="d-flex align-center justify-end">
          <v-chip class="mr-2" color="primary" variant="text">
            <v-icon start icon="mdi-package"></v-icon>
            Total: {{ pedidos.length }} pedidos
          </v-chip>
        </v-col>
      </v-row>

      <!-- Tabla de Pedidos -->
      <v-row>
        <v-col cols="12">
          <TableOrders
            :pedidos="pedidos"
            :search="search"
            :loading="loading"
            @edit="editPedido"
            @delete="confirmDelete"
          />
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
import { ref, onMounted } from 'vue'
import { obtainOrders, updateOrder, deleteOrder } from '@/services/admin/obtainOrders.service'
import { sendEmailNotification } from '@/services/admin/sendWhatsapp.service'
import TableOrders from '@/components/orders/TableOrders.vue'
import OrderEditDialog from '@/components/orders/OrderEditDialog.vue'
import OrderDeleteDialog from '@/components/orders/OrderDeleteDialog.vue'

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
const loading = ref(false)
const editDialog = ref(false)
const deleteDialog = ref(false)
const editedPedido = ref<Pedido | null>(null)
const pedidoToDelete = ref<Pedido | null>(null)
const saving = ref(false)
const deleting = ref(false)

// Snackbar
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// Methods
const fetchPedidos = async () => {
  loading.value = true
  try {
    const response = await obtainOrders()
    pedidos.value = response.data.data?.data || []
  } catch (error) {
    console.error('Error al cargar pedidos:', error)
    showSnackbar('Error al cargar los pedidos', 'error')
  } finally {
    loading.value = false
  }
}

const editPedido = (pedido: Pedido) => {
  editedPedido.value = { ...pedido }
  editDialog.value = true
}

const closeEdit = () => {
  editDialog.value = false
  editedPedido.value = null
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
