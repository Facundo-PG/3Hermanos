<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600px" persistent>
    <v-card>
      <v-card-title class="bg-grey-darken-4 text-white">
        <v-icon icon="mdi-pencil" class="mr-2"></v-icon>
        Editar Pedido #{{ pedido?.id }}
      </v-card-title>
      <v-card-text class="pt-6">
        <v-form ref="formRef" v-if="pedido">
          <v-row>
            <v-col cols="12">
              <v-text-field
                :model-value="`$${pedido.total}`"
                label="Total"
                variant="outlined"
                color="grey"
                readonly
                disabled
                hint="El total no se puede modificar"
                persistent-hint
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="pedido.estado"
                :items="estadosOptions"
                label="Estado del Pedido"
                variant="outlined"
                color="red-darken-2"
                :rules="[v => !!v || 'Estado es requerido']"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="pedido.tipo_entrega"
                :items="tipoEntregaOptions"
                label="Tipo de Entrega"
                variant="outlined"
                color="red-darken-2"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="pedido.metodo_pago"
                :items="metodoPagoOptions"
                label="Método de Pago"
                variant="outlined"
                color="red-darken-2"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="pedido.notas"
                label="Notas"
                variant="outlined"
                rows="3"
                color="red-darken-2"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="$emit('close')">
          Cancelar
        </v-btn>
        <v-btn
          color="red-darken-2"
          variant="flat"
          @click="handleSave"
          :loading="saving"
        >
          Guardar Cambios
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: boolean
  pedido: any
  saving: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  save: []
}>()

const formRef = ref()

const estadosOptions = [
  { title: 'Pendiente', value: 'pendiente' },
  { title: 'En proceso', value: 'en_proceso' },
  { title: 'En camino', value: 'en_camino' },
  { title: 'Entregado', value: 'entregado' }
]

const tipoEntregaOptions = [
  { title: 'Retiro', value: 'retiro' },
  { title: 'Envío', value: 'envio' },
  { title: 'Local', value: 'local' }
]

const metodoPagoOptions = [
  { title: 'Efectivo', value: 'efectivo' },
  { title: 'Transferencia', value: 'transferencia' }
]

const handleSave = async () => {
  const { valid } = await formRef.value.validate()
  if (valid) {
    emit('save')
  }
}
</script>
