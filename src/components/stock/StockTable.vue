<template>
  <v-card elevation="4" class="stock-card">
    <v-card-text class="pa-0">
      <v-data-table
        :headers="headers"
        :items="products"
        :search="search"
        :loading="loading"
        :items-per-page="10"
        class="elevation-0"
        item-value="id"
      >
        <!-- Stock Column -->
        <template v-slot:item.stock="{ item }">
          <v-chip
            :color="getStockColor(Number(item.stock))"
            size="small"
            variant="flat"
          >
            {{ Number(item.stock).toFixed(1) }} kg
          </v-chip>
        </template>

        <!-- Precio Column -->
        <template v-slot:item.precio="{ item }">
          <span class="font-weight-bold">${{ Number(item.precio).toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}</span>
        </template>

        <!-- Nombre Column -->
        <template v-slot:item.nombre="{ item }">
          <div class="d-flex align-center">
            <v-icon icon="mdi-package-variant-closed" size="small" class="mr-2" color="brown"></v-icon>
            <span class="font-weight-medium">{{ item.nombre }}</span>
          </div>
        </template>

        <!-- Descripcion Column -->
        <template v-slot:item.descripcion="{ item }">
          <span class="text-grey-darken-1">{{ item.descripcion || '-' }}</span>
        </template>

        <!-- Fecha Column -->
        <template v-slot:item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>

        <!-- Acciones -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex ga-1">
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              color="warning"
              @click="$emit('edit', item)"
            ></v-btn>
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="$emit('delete', item)"
            ></v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  products: any[]
  search: string
  loading: boolean
}>()

defineEmits<{
  edit: [product: any]
  delete: [product: any]
}>()

const headers = [
  { title: 'ID', key: 'id', sortable: true, width: '70px' },
  { title: 'Producto', key: 'nombre', sortable: true },
  { title: 'Descripción', key: 'descripcion', sortable: false },
  { title: 'Precio', key: 'precio', sortable: true },
  { title: 'Stock', key: 'stock', sortable: true },
  { title: 'Fecha', key: 'created_at', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' as const, width: '120px' },
]

const getStockColor = (stock: number): string => {
  if (stock === 0) return 'error'
  if (stock < 10) return 'warning'
  if (stock < 50) return 'info'
  return 'success'
}

const formatDate = (date: string): string => {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
</script>

<style scoped>
.stock-card {
  border-radius: 12px !important;
  overflow: hidden;
}
</style>
