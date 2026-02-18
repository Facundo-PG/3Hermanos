<template>
  <v-container>
    <v-card border>
      <v-card-title class="d-flex align-center py-4">
        <v-icon icon="mdi-food-apple" class="me-2"></v-icon>
        Gestión de Productos
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar pollo, milanesa..."
          single-line
          hide-details
          variant="outlined"
          density="compact"
          class="me-4"
        ></v-text-field>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreate">
          Nuevo Producto
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="products"
        :search="search"
        :loading="loading"
        hover
      >
        <!-- Slot para mostrar el precio formateado -->
        <template v-slot:item.precio="{ item }">
          $ {{ Number(item.precio).toLocaleString() }}
        </template>

        <!-- Slot para el Stock con colores -->
        <template v-slot:item.stock="{ item }">
          <v-chip :color="item.stock < 5 ? 'error' : 'success'" size="small">
            {{ item.stock }} kg
          </v-chip>
        </template>

        <!-- Slot para Acciones -->
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" class="me-3" @click="openEdit(item)">mdi-pencil</v-icon>
          <v-icon color="error" @click="confirmDelete(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Componente Hijo (Modal) -->
    <ProductForm
      v-model="showForm"
      :item="selectedItem"
      :categories="categories"
      @refresh="fetchData"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import ProductForm from '@/components/products/ProductForm.vue'

const products = ref([])
const categories = ref([])
const loading = ref(false)
const search = ref('')

// Control del modal
const showForm = ref(false)
const selectedItem = ref(null)

const headers = [
  { title: 'Nombre', key: 'nombre' },
  { title: 'Precio', key: 'precio' },
  { title: 'Stock', key: 'stock' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

const fetchData = async () => {
  loading.value = true
  try {
    const [prodRes, catRes] = await Promise.all([
      api.get('/products'),
      api.get('/categories')
    ])
    products.value = prodRes.data
    categories.value = catRes.data
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  selectedItem.value = null
  showForm.value = true
}

const openEdit = (item: any) => {
  selectedItem.value = { ...item }
  showForm.value = true
}

onMounted(fetchData)
</script>