// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 1. Si intenta ir a la raíz "/" lo mandamos al login o al dashboard según sesión
  if (to.path === '/') {
    return authStore.isAuthenticated ? next('/admin/dashboard') : next('/login')
  }

  // 2. Si la ruta es protegida (ej: /admin/...) y no está logueado, al login
  if (to.path.startsWith('/admin') && !authStore.isAuthenticated) {
    return next('/login')
  }

  next()
})

export default router