<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="400px">
    <v-card>
      <v-card-title class="text-h6">
        <v-icon icon="mdi-alert-circle" color="error" class="mr-2"></v-icon>
        Confirmar Eliminación
      </v-card-title>
      <v-card-text>
        ¿Está seguro que desea eliminar al cliente <strong>{{ client?.nombre }}</strong>?
        <br>
        <span class="text-error">Esta acción no se puede deshacer.</span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="$emit('close')">
          Cancelar
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          @click="$emit('confirm')"
          :loading="deleting"
        >
          Eliminar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  client: any
  deleting: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  confirm: []
}>()
</script>
