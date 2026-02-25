<template>
  <v-card elevation="4" class="settings-card">
    <v-card-text class="pa-0">
      <v-data-table
        :headers="headers"
        :items="settings"
        :loading="loading"
        class="elevation-0"
        item-value="id"
        :items-per-page="-1"
        hide-default-footer
      >
        <!-- Nombre Negocio -->
        <template v-slot:item.nombre_negocio="{ item }">
          <div class="d-flex align-center">
            <v-icon icon="mdi-store" size="small" class="mr-2" color="red-darken-2"></v-icon>
            <span class="font-weight-bold">{{ item.nombre_negocio }}</span>
          </div>
        </template>

        <!-- Costo Delivery -->
        <template v-slot:item.costo_delivery="{ item }">
          <span class="font-weight-bold">${{ Number(item.costo_delivery).toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}</span>
        </template>

        <!-- WhatsApp -->
        <template v-slot:item.whatsapp_notificaciones="{ item }">
          <v-chip size="small" variant="tonal" color="green">
            <v-icon start icon="mdi-whatsapp" size="small"></v-icon>
            {{ item.whatsapp_notificaciones || '-' }}
          </v-chip>
        </template>

        <!-- Esta Abierto Switch -->
        <template v-slot:item.esta_abierto="{ item }">
          <div class="d-flex align-center ga-2" style="white-space: nowrap;">
            <v-switch
              :model-value="item.esta_abierto"
              color="green-darken-1"
              hide-details
              density="compact"
              inset
              readonly
              @click="$emit('toggleOpen', item)"
            ></v-switch>
            <v-chip
              :color="item.esta_abierto ? 'green-darken-1' : 'grey'"
              size="small"
              variant="flat"
            >
              {{ item.esta_abierto ? 'Abierto' : 'Cerrado' }}
            </v-chip>
          </div>
        </template>

        <!-- Dirección -->
        <template v-slot:item.direccion_local="{ item }">
          <div class="d-flex align-center">
            <v-icon icon="mdi-map-marker" size="small" class="mr-1" color="red"></v-icon>
            <span>{{ item.direccion_local || '-' }}</span>
          </div>
        </template>

        <!-- Mensaje Alerta -->
        <template v-slot:item.mensaje_alerta="{ item }">
          <span class="text-truncate d-inline-block" style="max-width: 250px;">
            {{ item.mensaje_alerta || '-' }}
          </span>
        </template>

        <!-- Acciones -->
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            color="warning"
            @click="$emit('edit', item)"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  settings: any[]
  loading: boolean
}>()

defineEmits<{
  edit: [setting: any]
  toggleOpen: [setting: any]
}>()

const headers = [
  { title: 'ID', key: 'id', sortable: false, width: '60px' },
  { title: 'Negocio', key: 'nombre_negocio', sortable: false },
  { title: 'Costo Delivery', key: 'costo_delivery', sortable: false },
  { title: 'WhatsApp', key: 'whatsapp_notificaciones', sortable: false },
  { title: 'Estado Local', key: 'esta_abierto', sortable: false, minWidth: '200px' },
  { title: 'Dirección', key: 'direccion_local', sortable: false, minWidth: '150px' },
  { title: 'Mensaje Alerta', key: 'mensaje_alerta', sortable: false, minWidth: '200px' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' as const, width: '80px' },
]
</script>

<style scoped>
.settings-card {
  border-radius: 12px !important;
  overflow: hidden;
}

.settings-card :deep(.v-table__wrapper) {
  overflow-x: auto;
}

.settings-card :deep(table) {
  min-width: 1000px;
}
</style>
