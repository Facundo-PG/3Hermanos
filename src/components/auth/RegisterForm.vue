<template>
  <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
    <div class="form-group mb-3">
      <label class="form-label">Nombre</label>
      <v-text-field
        v-model="formData.nombre"
        placeholder="Ingrese su nombre"
        prepend-inner-icon="mdi-account-outline"
        variant="solo"
        density="comfortable"
        bg-color="rgba(255, 255, 255, 0.05)"
        :rules="[(v) => !!v || 'Nombre requerido']"
        required
        hide-details="auto"
        class="dark-input"
        flat
      ></v-text-field>
    </div>

    <div class="form-group mb-3">
      <label class="form-label">Correo electrónico</label>
      <v-text-field
        v-model="formData.email"
        placeholder="Ingrese su correo electrónico"
        prepend-inner-icon="mdi-email-outline"
        type="email"
        variant="solo"
        density="comfortable"
        bg-color="rgba(255, 255, 255, 0.05)"
        :rules="[
          (v) => !!v || 'Correo electrónico requerido',
          (v) => /.+@.+\..+/.test(v) || 'Correo electrónico no válido'
        ]"
        required
        hide-details="auto"
        class="dark-input"
        flat
      ></v-text-field>
    </div>

    <div class="form-group mb-3">
      <label class="form-label">Teléfono</label>
      <v-text-field
        v-model="formData.telefono"
        placeholder="Ingrese su teléfono"
        prepend-inner-icon="mdi-phone-outline"
        variant="solo"
        density="comfortable"
        bg-color="rgba(255, 255, 255, 0.05)"
        :rules="[
          (v) => !!v || 'Teléfono requerido',
          (v) => /^[0-9]{8,15}$/.test(v) || 'Ingrese solo números (8 a 15 dígitos)'
        ]"
        required
        hide-details="auto"
        class="dark-input"
        flat
      ></v-text-field>
    </div>

    <div class="form-group mb-3">
      <label class="form-label">Dirección</label>
      <v-text-field
        v-model="formData.direccion"
        placeholder="Ingrese su dirección"
        prepend-inner-icon="mdi-map-marker-outline"
        variant="solo"
        density="comfortable"
        bg-color="rgba(255, 255, 255, 0.05)"
        :rules="[(v) => !!v || 'Dirección requerida']"
        required
        hide-details="auto"
        class="dark-input"
        flat
      ></v-text-field>
    </div>

    <div class="form-group mb-6">
      <label class="form-label">Contraseña</label>
      <v-text-field
        v-model="formData.password"
        placeholder="Ingrese su contraseña"
        prepend-inner-icon="mdi-lock-outline"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
        variant="solo"
        density="comfortable"
        bg-color="rgba(255, 255, 255, 0.05)"
        :rules="[
          (v) => !!v || 'Contraseña requerida',
          (v) => v.length >= 6 || 'Debe tener al menos 6 caracteres'
        ]"
        required
        hide-details="auto"
        class="dark-input"
        flat
      ></v-text-field>
    </div>

    <v-btn
      :loading="loading"
      :disabled="!valid"
      color="#d50000"
      block
      size="x-large"
      type="submit"
      variant="flat"
      class="login-btn text-none font-weight-bold"
      rounded="xl"
    >
      Crear usuario
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

defineProps<{ loading: boolean }>();

const emit = defineEmits<{
  (event: 'submit', payload: {
    email: string;
    password: string;
    nombre: string;
    telefono: string;
    direccion: string;
  }): void;
}>();

const valid = ref(false);
const showPassword = ref(false);

const formData = reactive({
  email: '',
  password: '',
  nombre: '',
  telefono: '',
  direccion: '',
});

const handleSubmit = () => {
  if (valid.value) {
    emit('submit', { ...formData });
  }
};
</script>

<style scoped>
.form-group {
  margin-bottom: 20px;
}

.form-label {
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  display: block;
  margin-bottom: 8px;
  letter-spacing: 0.3px;
}

.dark-input :deep(.v-field) {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.dark-input :deep(.v-field:hover) {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.2);
}

.dark-input :deep(.v-field--focused) {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: #ff1744;
  box-shadow: 0 0 0 2px rgba(255, 23, 68, 0.2);
}

.dark-input :deep(.v-field__input) {
  color: #ffffff !important;
  font-size: 15px;
  padding-top: 12px;
  padding-bottom: 12px;
  min-height: 48px;
}

.dark-input :deep(.v-field__input::placeholder) {
  color: rgba(255, 255, 255, 0.4);
  opacity: 1;
}

.dark-input :deep(.v-field__prepend-inner),
.dark-input :deep(.v-field__append-inner) {
  color: rgba(255, 255, 255, 0.5);
  padding-top: 12px;
}

.dark-input :deep(.v-field--focused .v-field__prepend-inner),
.dark-input :deep(.v-field--focused .v-field__append-inner) {
  color: #ff1744;
}

.login-btn {
  background: linear-gradient(135deg, #ff1744 0%, #d50000 100%) !important;
  color: white !important;
  font-size: 16px;
  letter-spacing: 1px;
  text-transform: uppercase;
  height: 56px !important;
  box-shadow: 0 8px 24px rgba(213, 0, 0, 0.4);
  transition: all 0.3s ease;
  margin-top: 8px;
}

.login-btn:hover {
  box-shadow: 0 12px 32px rgba(213, 0, 0, 0.6);
  transform: translateY(-2px);
}

.login-btn:active {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.5;
  background: rgba(255, 255, 255, 0.1) !important;
  box-shadow: none;
}

.dark-input :deep(.v-messages__message) {
  color: #ff5252;
  font-size: 12px;
  margin-top: 4px;
}
</style>