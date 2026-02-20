<template>
  <v-app>
    <div class="login-wrapper">
      <div class="background-blur"></div>
      <div class="background-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>

      <v-container fluid class="fill-height">
        <v-row align="center" justify="center" class="fill-height">
          <v-col cols="12" md="6" lg="5" class="d-flex justify-center">
            <div class="login-box">
              <div class="logo-circle success-circle">
                <v-icon icon="mdi-check-bold" size="50" color="white"></v-icon>
              </div>

              <h2 class="login-title">Gracias por registrarse, ahora puede operar</h2>

              <p v-if="loading" class="confirm-subtitle">
                Confirmando tu cuenta...
              </p>

              <template v-else>
                <p v-if="errorMsg" class="error-text">
                  {{ errorMsg }}
                </p>
                <template v-else>
                  <p class="confirm-subtitle">
                    Tu cuenta fue confirmada correctamente.
                  </p>
                  <p class="countdown-text">
                    En {{ redirectCountdown }} segundos te redirigimos al login.
                  </p>
                </template>
              </template>

              <div class="login-links mt-6">
                <RouterLink to="/login" class="link-text">Ir al login</RouterLink>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="6" lg="5" class="d-none d-md-flex align-center justify-center">
            <div class="hero-text">
              <h1 class="display-text">
                GRANJA<br>
                <span class="text-red">3 HERMANOS</span>
              </h1>
              <p class="subtitle-text">Cuenta confirmada</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { confirmEmail } from '@/services/auth/confirmEmail.service';

const router = useRouter();
const route = useRoute();
const token = computed(() => String(route.query.token || ''));
const redirectCountdown = ref(6);
const loading = ref(true);
const errorMsg = ref('');

let countdownInterval: ReturnType<typeof setInterval> | null = null;

const clearCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
};

const startCountdown = () => {
  clearCountdown();
  redirectCountdown.value = 6;
  countdownInterval = setInterval(() => {
    if (redirectCountdown.value > 1) {
      redirectCountdown.value -= 1;
      return;
    }

    clearCountdown();
    redirectCountdown.value = 0;
    router.push('/login');
  }, 1000);
};

onMounted(async () => {
  if (!token.value) {
    loading.value = false;
    errorMsg.value = 'El enlace no contiene un token valido.';
    return;
  }

  try {
    await confirmEmail(token.value);
    loading.value = false;
    startCountdown();
  } catch (error: any) {
    loading.value = false;
    errorMsg.value = error.response?.data?.message || 'No se pudo confirmar la cuenta.';
  }
});

onBeforeUnmount(() => {
  clearCountdown();
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
  0%,
  100% {
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

.login-box {
  background: rgba(20, 20, 20, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.logo-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32px;
}

.success-circle {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  box-shadow: 0 10px 30px rgba(76, 175, 80, 0.4);
}

.login-title {
  color: #ffffff;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
}

.confirm-subtitle {
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
  line-height: 1.5;
  margin-bottom: 8px;
}

.countdown-text {
  color: #69f0ae;
  text-align: center;
  font-weight: 600;
  margin-bottom: 20px;
}

.error-text {
  color: #ff5252;
  text-align: center;
  font-weight: 600;
  margin-bottom: 16px;
}

.login-links {
  display: flex;
  justify-content: center;
  text-align: center;
}

.link-text {
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link-text:hover {
  color: #69f0ae;
}

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