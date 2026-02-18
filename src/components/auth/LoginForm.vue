<template>
  <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
    <!-- Email Field -->
    <div class="form-group mb-4">
      <label class="form-label">Nombre de Usuario</label>
      <v-text-field
        v-model="credentials.email"
        placeholder="Ingrese su nombre de usuario"
        prepend-inner-icon="mdi-account-outline"
        type="email"
        variant="solo"
        density="comfortable"
        bg-color="rgba(255, 255, 255, 0.05)"
        :rules="[v => !!v || 'Nombre de usuario requerido', v => /.+@.+\..+/.test(v) || 'Nombre de usuario no válido']"
        required
        hide-details="auto"
        class="dark-input"
        flat
      ></v-text-field>
    </div>

    <!-- Password Field -->
    <div class="form-group mb-6">
      <label class="form-label">Contraseña</label>
      <v-text-field
        v-model="credentials.password"
        placeholder="Ingrese su contraseña"
        prepend-inner-icon="mdi-lock-outline"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
        variant="solo"
        density="comfortable"
        bg-color="rgba(255, 255, 255, 0.05)"
        :rules="[v => !!v || 'Contraseña requerida']"
        required
        hide-details="auto"
        class="dark-input"
        flat
      ></v-text-field>
    </div>

    <!-- Login Button -->
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
      Ingresar
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const props = defineProps<{ loading: boolean }>();
const emit = defineEmits(['submit']);

const valid = ref(false);
const showPassword = ref(false);
const credentials = reactive({
  email: '',
  password: ''
});

const handleSubmit = () => {
  if (valid.value) {
    emit('submit', credentials);
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

/* Dark Input Styling */
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

/* Login Button */
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

/* Error messages */
.dark-input :deep(.v-messages__message) {
  color: #ff5252;
  font-size: 12px;
  margin-top: 4px;
}
</style>
