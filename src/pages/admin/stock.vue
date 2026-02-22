<route lang="yaml">
meta:
  layout: adminlayout
</route>

<template>
  <div class="stock-page">
    <v-container fluid class="pa-6">
      <!-- Header -->
      <v-row class="mb-4">
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold mb-2 text-black">
                <v-icon icon="mdi-warehouse" color="red-darken-2" class="mr-2"></v-icon>
                Stock / Inventario
              </h1>
              <p class="text-body-2 text-grey-darken-2">Controla el stock y los productos del sistema</p>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Search & Actions -->
      <v-row class="mb-4">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Buscar producto..."
            variant="outlined"
            density="comfortable"
            clearable
            hide-details
            color="red-darken-2"
            bg-color="white"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="8" class="d-flex align-center justify-end gap-2">
          <v-chip class="mr-2" color="primary" variant="text">
            <v-icon start icon="mdi-package-variant-closed"></v-icon>
            Total: {{ products.length }} productos
          </v-chip>
          <v-btn
            prepend-icon="mdi-plus"
            color="teal-darken-2"
            variant="elevated"
            @click="createDialog = true"
          >
            Agregar Producto
          </v-btn>
        </v-col>
      </v-row>

      <!-- Tabla de Stock -->
      <v-row>
        <v-col cols="12">
          <StockTable
            :products="products"
            :search="search"
            :loading="loading"
            @edit="editProduct"
            @delete="confirmDelete"
          />
        </v-col>
      </v-row>
    </v-container>

    <!-- Create Dialog -->
    <ProductCreateDialog
      v-model="createDialog"
      :saving="saving"
      @close="createDialog = false"
      @save="saveNewProduct"
    />

    <!-- Edit Dialog -->
    <ProductEditDialog
      v-model="editDialog"
      :product="editedProduct"
      :saving="saving"
      @close="closeEdit"
      @save="saveProduct"
    />

    <!-- Delete Dialog -->
    <ProductDeleteDialog
      v-model="deleteDialog"
      :product="productToDelete"
      :deleting="deleting"
      @close="deleteDialog = false"
      @confirm="removeProduct"
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
import { obtainProducts, createProduct, updateProduct, deleteProduct } from '@/services/admin/obtainProducts.service'
import StockTable from '@/components/stock/StockTable.vue'
import ProductCreateDialog from '@/components/stock/ProductCreateDialog.vue'
import ProductEditDialog from '@/components/stock/ProductEditDialog.vue'
import ProductDeleteDialog from '@/components/stock/ProductDeleteDialog.vue'

interface Product {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  created_at: string
}

// State
const products = ref<Product[]>([])
const search = ref('')
const loading = ref(false)
const createDialog = ref(false)
const editDialog = ref(false)
const deleteDialog = ref(false)
const editedProduct = ref<Product | null>(null)
const originalStock = ref(0)
const productToDelete = ref<Product | null>(null)
const saving = ref(false)
const deleting = ref(false)

// Snackbar
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// Fetch
const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await obtainProducts()
    const d = response.data
    const arr = Array.isArray(d?.data?.data)
      ? d.data.data
      : Array.isArray(d?.data)
        ? d.data
        : Array.isArray(d)
          ? d
          : []
    // Normalize field names (camelCase → snake_case) for dates
    products.value = arr.map((p: any) => ({
      ...p,
      created_at: p.created_at || p.createdAt || null,
      updated_at: p.updated_at || p.updatedAt || null,
    }))
  } catch (error) {
    console.error('Error al cargar productos:', error)
    showSnackbar('Error al cargar los productos', 'error')
  } finally {
    loading.value = false
  }
}

// Create
const saveNewProduct = async (data: any) => {
  saving.value = true
  try {
    await createProduct(data)
    showSnackbar('Producto creado correctamente', 'success')
    await fetchProducts()
    createDialog.value = false
  } catch (error: any) {
    console.error('Error al crear producto:', error)
    const msg = error?.response?.data?.message || 'Error al crear el producto'
    showSnackbar(msg, 'error')
  } finally {
    saving.value = false
  }
}

// Edit
const editProduct = (product: Product) => {
  editedProduct.value = { ...product }
  originalStock.value = Number(product.stock)
  editDialog.value = true
}

const closeEdit = () => {
  editDialog.value = false
  editedProduct.value = null
}

const saveProduct = async (stockToAdd: number) => {
  if (!editedProduct.value) return
  saving.value = true
  try {
    const newStock = originalStock.value + Number(stockToAdd || 0)
    const updateData = {
      nombre: editedProduct.value.nombre,
      descripcion: editedProduct.value.descripcion,
      precio: Number(editedProduct.value.precio),
      stock: newStock,
    }
    await updateProduct(editedProduct.value.id, updateData)
    showSnackbar('Producto actualizado correctamente', 'success')
    await fetchProducts()
    closeEdit()
  } catch (error: any) {
    console.error('Error al actualizar producto:', error)
    const msg = error?.response?.data?.message || 'Error al actualizar el producto'
    showSnackbar(msg, 'error')
  } finally {
    saving.value = false
  }
}

// Delete
const confirmDelete = (product: Product) => {
  productToDelete.value = product
  deleteDialog.value = true
}

const removeProduct = async () => {
  if (!productToDelete.value) return
  deleting.value = true
  try {
    await deleteProduct(productToDelete.value.id)
    showSnackbar('Producto eliminado correctamente', 'success')
    await fetchProducts()
    deleteDialog.value = false
    productToDelete.value = null
  } catch (error: any) {
    console.error('Error al eliminar producto:', error)
    const msg = error?.response?.data?.message || 'Error al eliminar el producto'
    showSnackbar(msg, 'error')
  } finally {
    deleting.value = false
  }
}

const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.stock-page {
  background: linear-gradient(135deg, #eceff1 0%, #cfd8dc 100%);
  min-height: 100vh;
}
</style>
