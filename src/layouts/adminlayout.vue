<template>
  <v-app>
    <v-app-bar color="grey-darken-4" prominent elevation="2">
      <v-app-bar-nav-icon @click="drawer = !drawer" color="red-darken-2"></v-app-bar-nav-icon>
      
      <v-app-bar-title class="text-h5 font-weight-bold">
        <v-icon icon="mdi-egg" class="mr-2" color="red-darken-2"></v-icon>
        Granja 3 Hermanos
      </v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <v-chip class="mr-4" color="red-darken-2" variant="flat">
        <v-icon start icon="mdi-shield-crown"></v-icon>
        Administrador
      </v-chip>
      
      <v-btn
        color="red-darken-2"
        variant="outlined"
        prepend-icon="mdi-logout"
        @click="handleLogout"
        class="text-none"
      >
        Cerrar Sesión
      </v-btn>
    </v-app-bar>

    <!-- Sidebar Navigation -->
    <v-navigation-drawer
      v-model="drawer"
      color="grey-darken-4"
      permanent
      elevation="2"
    >
      <v-list>
        <!-- Header del Sidebar -->
        <v-list-item class="px-4 py-4">
          <div class="text-center">
            <v-icon icon="mdi-egg" size="48" color="red-darken-2"></v-icon>
            <div class="text-h6 font-weight-bold mt-2">Panel Admin</div>
          </div>
        </v-list-item>
        
        <v-divider class="my-2"></v-divider>
        
        <!-- Items del Menú -->
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.route"
          :prepend-icon="item.icon"
          :title="item.title"
          :active="item.route === currentRoute"
          color="red-darken-2"
          rounded="lg"
          class="my-1 mx-2"
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Sidebar state
const drawer = ref(true)
const currentRoute = computed(() => router.currentRoute.value.path)

// Menu items
const menuItems = ref([
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    route: '/admin/dashboard'
  },
  {
    title: 'Pedidos',
    icon: 'mdi-package-variant',
    route: '/admin/pedidos'
  },
  {
    title: 'Productos',
    icon: 'mdi-egg',
    route: '/admin/productos'
  },
  {
    title: 'Stock / Inventario',
    icon: 'mdi-warehouse',
    route: '/admin/stock'
  },
  {
    title: 'Clientes',
    icon: 'mdi-account-group',
    route: '/admin/clientes'
  },
  {
    title: 'Configuración',
    icon: 'mdi-cog',
    route: '/admin/configuracion'
  }
])

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Sidebar Styles */
.v-navigation-drawer {
  border-right: 1px solid rgba(239, 83, 80, 0.2) !important;
}

.v-list-item {
  margin-bottom: 4px;
}

.v-list-item:hover {
  background-color: rgba(239, 83, 80, 0.1) !important;
}

.v-list-item--active {
  background-color: rgba(239, 83, 80, 0.15) !important;
  border-left: 3px solid #EF5350;
}
</style>
