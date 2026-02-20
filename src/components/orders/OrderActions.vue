<template>
  <div class="d-flex gap-1">
    <v-btn
      icon="mdi-eye"
      size="small"
      variant="text"
      color="info"
      @click="$emit('view')"
    ></v-btn>
    <v-btn
      icon="mdi-pencil"
      size="small"
      variant="text"
      color="primary"
      @click="$emit('edit')"
    ></v-btn>
    <v-btn
      icon="mdi-delete"
      size="small"
      variant="text"
      color="error"
      @click="$emit('delete')"
    ></v-btn>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  pedido: any
}>()

defineEmits<{
  view: []
  edit: []
  delete: []
}>()
</script>
