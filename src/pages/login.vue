<template>
    <div class="login-wrapper">
      <!-- Fondo animado con blur -->
      <div class="background-blur"></div>
      <div class="background-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>

      <v-container fluid class="fill-height">
        <v-row align="center" justify="center" class="fill-height">
          <!-- Columna del formulario -->
          <v-col cols="12" md="5" lg="4" class="d-flex justify-center">
            <div class="login-box" :class="{ 'shake': showError }">
              <!-- Logo circular -->
              <div class="logo-circle">
                <v-icon icon="mdi-egg" size="50" color="white"></v-icon>
              </div>

              <!-- Título -->
              <h2 class="login-title">Ingreso</h2>

              <!-- Formulario -->
              <LoginForm 
                :loading="authStore.loading" 
                @submit="handleLogin" 
              />

              <!-- Error message -->
              <v-fade-transition>
                <div v-if="errorMsg" class="error-message">
                  <v-icon icon="mdi-alert-circle" size="small" class="mr-1"></v-icon>
                  {{ errorMsg }}
                </div>
              </v-fade-transition>

              <!-- Links -->
              <div class="login-links">
                <RouterLink to="/register" class="register-link">
                  <v-icon icon="mdi-account-plus" size="small" class="mr-1"></v-icon>
                  Crear una cuenta
                </RouterLink>
                <RouterLink to="/forgot-password" class="forgot-link">
                  <v-icon icon="mdi-lock-reset" size="small" class="mr-1"></v-icon>
                  Reestablecer o cambiar contraseña
                </RouterLink>
              </div>
            </div>
          </v-col>

          <!-- Columna del texto grande -->
          <v-col cols="12" md="6" lg="5" class="d-none d-md-flex align-center justify-center">
            <div class="hero-text">
              <h1 class="display-text">
                GRANJA<br>
                <span class="text-red">3 HERMANOS</span>
              </h1>
              <p class="subtitle-text">Sistema de Gestión</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import LoginForm from '@/components/auth/LoginForm.vue';

const authStore = useAuthStore();
const router = useRouter();
const errorMsg = ref('');
const showError = ref(false);

const handleLogin = async (credentials: any) => {
  errorMsg.value = '';
  showError.value = false;
  
  const result = await authStore.login(credentials);
  
  if (result.success) {
    if (authStore.isAdmin) {
      router.push('/admin/dashboard');
    } else {
      // Los clientes van a la página de productos para hacer pedidos
      router.push('/products');
    }
  } else {
    errorMsg.value = result.message;
    showError.value = true;
    setTimeout(() => showError.value = false, 500);
  }
};

watch(() => authStore.loading, (newVal) => {
  if (newVal) {
    errorMsg.value = '';
  }
});
</script>

<style scoped>
.login-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background: #0a0a0a;
}

/* Fondo con blur animado */
.background-blur {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a0a1f 0%, #0a0a1a 50%, #1a0f0a 100%);
  filter: blur(0px);
  z-index: 0;
}

.background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #ff1744 0%, #d50000 100%);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #2962ff 0%, #0091ea 100%);
  bottom: -150px;
  right: -150px;
  animation-delay: 7s;
}

.shape-3 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #d500f9 0%, #aa00ff 100%);
  top: 50%;
  right: 10%;
  animation-delay: 14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(50px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-50px, 50px) scale(0.9);
  }
}

.fill-height {
  position: relative;
  z-index: 2;
}

/* Login Box */
.login-box {
  background: rgba(20, 20, 20, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease;
}

.login-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6);
}

/* Logo circular */
.logo-circle {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #ff1744 0%, #d50000 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32px;
  box-shadow: 0 10px 30px rgba(255, 23, 68, 0.4);
  animation: pulse 3s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 10px 30px rgba(255, 23, 68, 0.4);
  }
  50% {
    box-shadow: 0 10px 50px rgba(255, 23, 68, 0.7);
  }
}

/* Título */
.login-title {
  color: #ffffff;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 32px;
  letter-spacing: 0.5px;
}

/* Error message */
.error-message {
  background: rgba(244, 67, 54, 0.15);
  border: 1px solid rgba(244, 67, 54, 0.3);
  color: #ff5252;
  padding: 12px 16px;
  border-radius: 12px;
  margin-top: 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Links */
.login-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 28px;
  text-align: center;
}

.register-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
}

.register-link:hover {
  background: rgba(255, 23, 68, 0.15);
  border-color: #ff1744;
  color: #ff1744;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(255, 23, 68, 0.2);
}

.forgot-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.forgot-link:hover {
  color: #ff1744;
  background: rgba(255, 255, 255, 0.05);
}

/* Animación shake */
@keyframes shake {
  0%, 100% { transform: translateX(0) translateY(0); }
  25% { transform: translateX(-10px) translateY(0); }
  75% { transform: translateX(10px) translateY(0); }
}

.shake {
  animation: shake 0.5s ease-in-out;
}

/* Hero Text */
.hero-text {
  text-align: center;
  padding: 40px;
}

.display-text {
  font-size: clamp(48px, 8vw, 80px);
  font-weight: 900;
  color: #ffffff;
  line-height: 1.1;
  margin-bottom: 16px;
  letter-spacing: -2px;
  text-transform: uppercase;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.text-red {
  background: linear-gradient(135deg, #ff1744 0%, #f50057 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle-text {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 300;
  letter-spacing: 4px;
  text-transform: uppercase;
}

/* Responsive */
@media (max-width: 960px) {
  .login-box {
    padding: 40px 32px;
  }
  
  .display-text {
    font-size: 48px;
  }
}

@media (max-width: 600px) {
  .login-box {
    padding: 32px 24px;
  }
  
  .login-title {
    font-size: 28px;
  }
  
  .logo-circle {
    width: 80px;
    height: 80px;
  }
  
  .logo-circle :deep(.v-icon) {
    font-size: 40px !important;
  }
}
</style>
