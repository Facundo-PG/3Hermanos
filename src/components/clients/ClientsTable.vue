<template>
  <v-card elevation="4" class="clients-card">
    <v-card-text class="pa-0">
      <v-data-table
        :headers="headers"
        :items="clients"
        :search="search"
        :loading="loading"
        :items-per-page="10"
        class="elevation-0"
        item-value="id"
      >
        <!-- Nombre Column -->
        <template v-slot:item.nombre="{ item }">
          <div class="d-flex align-center">
            <v-icon icon="mdi-account-circle" size="small" class="mr-2" color="blue-grey"></v-icon>
            <span class="font-weight-medium">{{ item.nombre || '-' }}</span>
          </div>
        </template>

        <!-- Email Column -->
        <template v-slot:item.email="{ item }">
          <span>{{ item.email || '-' }}</span>
        </template>

        <!-- Teléfono Column -->
        <template v-slot:item.telefono="{ item }">
          <span>{{ item.telefono || '-' }}</span>
        </template>

        <!-- Dirección Column -->
        <template v-slot:item.direccion="{ item }">
          <span>{{ item.direccion || '-' }}</span>
        </template>

        <!-- Rol Column -->
        <template v-slot:item.rol="{ item }">
          <v-chip
            :color="item.rol === 'admin' ? 'red-darken-2' : 'blue-grey'"
            size="small"
            variant="flat"
          >
            {{ item.rol === 'admin' ? 'Administrador' : 'Cliente' }}
          </v-chip>
        </template>

        <!-- Verificado Column -->
        <template v-slot:item.verificado="{ item }">
          <v-icon
            :icon="item.verificado ? 'mdi-check-circle' : 'mdi-close-circle'"
            :color="item.verificado ? 'success' : 'grey'"
            size="small"
          ></v-icon>
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
  clients: any[]
  search: string
  loading: boolean
}>()

defineEmits<{
  edit: [client: any]
  delete: [client: any]
}>()

const headers = [
  { title: 'ID', key: 'id', sortable: true, width: '70px' },
  { title: 'Nombre', key: 'nombre', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Teléfono', key: 'telefono', sortable: false },
  { title: 'Dirección', key: 'direccion', sortable: false },
  { title: 'Rol', key: 'rol', sortable: true },
  { title: 'Registro', key: 'created_at', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' as const, width: '120px' },
]

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
.clients-card {
  border-radius: 12px !important;
  overflow: hidden;
}
</style>
