<template>
  <div class="d-flex gap-1">
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
  edit: []
  delete: []
}>()
</script>
