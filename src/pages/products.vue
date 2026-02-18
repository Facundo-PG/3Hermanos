<template>
  <v-app>
    <v-app-bar color="red-darken-2" prominent>
      <v-app-bar-title class="text-h5 font-weight-bold">
        <v-icon icon="mdi-egg" class="mr-2"></v-icon>
        Granja 3 Hermanos
      </v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <v-badge 
        :content="cartItemsCount" 
        color="white" 
        text-color="red-darken-2"
        v-if="cartItemsCount > 0"
      >
        <v-btn 
          icon="mdi-cart" 
          @click="showCart = true"
        ></v-btn>
      </v-badge>
      
      <v-btn 
        icon="mdi-cart" 
        @click="showCart = true"
        v-else
      ></v-btn>
      
      <v-btn 
        icon="mdi-logout" 
        @click="handleLogout"
        class="ml-2"
      ></v-btn>
    </v-app-bar>

    <v-main class="products-page">
      <v-container>
        <!-- Encabezado -->
        <v-row class="mb-6">
          <v-col cols="12">
            <div class="text-center">
              <h1 class="text-h3 font-weight-bold mb-2">Nuestros Productos</h1>
              <p class="text-h6 text-medium-emphasis">Selecciona los productos que deseas ordenar</p>
            </div>
          </v-col>
        </v-row>

        <!-- Buscador -->
        <v-row class="mb-4">
          <v-col cols="12" md="6" offset-md="3">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Buscar productos..."
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Grid de productos -->
        <v-row v-if="!loading">
          <v-col 
            v-for="product in filteredProducts" 
            :key="product.id"
            cols="12" 
            sm="6" 
            md="4" 
            lg="3"
          >
            <v-card 
              class="product-card" 
              elevation="2"
              :class="{ 'out-of-stock': product.stock <= 0 }"
            >
              <div class="product-image">
                <v-icon 
                  icon="mdi-food-drumstick" 
                  size="80" 
                  color="red-darken-2"
                ></v-icon>
                <v-chip 
                  v-if="product.stock <= 0" 
                  color="error" 
                  class="stock-badge"
                  size="small"
                >
                  Sin Stock
                </v-chip>
                <v-chip 
                  v-else-if="product.stock < 10" 
                  color="warning" 
                  class="stock-badge"
                  size="small"
                >
                  Poco Stock
                </v-chip>
              </div>

              <v-card-title class="text-center">
                {{ product.nombre }}
              </v-card-title>

              <v-card-subtitle class="text-center">
                Stock: {{ product.stock }} kg
              </v-card-subtitle>

              <v-card-text class="text-center">
                <div class="text-h5 font-weight-bold text-red-darken-2">
                  ${{ product.precio.toFixed(2) }}
                  <span class="text-body-2 text-medium-emphasis">/ kg</span>
                </div>
              </v-card-text>

              <v-card-actions class="pa-4">
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      v-model.number="product.quantity"
                      type="number"
                      label="Cantidad (kg)"
                      variant="outlined"
                      density="compact"
                      min="0"
                      :max="product.stock"
                      :disabled="product.stock <= 0"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      color="red-darken-2"
                      variant="flat"
                      block
                      :disabled="!product.quantity || product.quantity <= 0 || product.stock <= 0"
                      @click="addToCart(product)"
                    >
                      <v-icon left>mdi-cart-plus</v-icon>
                      Agregar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Loading -->
        <v-row v-else>
          <v-col cols="12" class="text-center py-12">
            <v-progress-circular
              indeterminate
              color="red-darken-2"
              size="64"
            ></v-progress-circular>
            <p class="mt-4 text-h6">Cargando productos...</p>
          </v-col>
        </v-row>

        <!-- Sin resultados -->
        <v-row v-if="!loading && filteredProducts.length === 0">
          <v-col cols="12" class="text-center py-12">
            <v-icon icon="mdi-package-variant" size="80" color="grey"></v-icon>
            <p class="text-h6 mt-4">No se encontraron productos</p>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Drawer del carrito -->
    <v-navigation-drawer
      v-model="showCart"
      location="right"
      temporary
      width="400"
    >
      <v-card flat>
        <v-card-title class="d-flex align-center pa-4 bg-red-darken-2 text-white">
          <v-icon icon="mdi-cart" class="mr-2"></v-icon>
          Mi Pedido
          <v-spacer></v-spacer>
          <v-btn 
            icon="mdi-close" 
            variant="text" 
            @click="showCart = false"
            color="white"
          ></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <!-- Items del carrito -->
        <v-list v-if="cart.length > 0">
          <v-list-item
            v-for="(item, index) in cart"
            :key="index"
            class="mb-2"
          >
            <template v-slot:prepend>
              <v-avatar color="red-lighten-5">
                <v-icon icon="mdi-food-drumstick" color="red-darken-2"></v-icon>
              </v-avatar>
            </template>

            <v-list-item-title>{{ item.nombre }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ item.quantity }} kg × ${{ item.precio.toFixed(2) }}
            </v-list-item-subtitle>

            <template v-slot:append>
              <div class="d-flex flex-column align-end">
                <div class="text-h6 font-weight-bold">
                  ${{ (item.quantity * item.precio).toFixed(2) }}
                </div>
                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  size="small"
                  color="error"
                  @click="removeFromCart(index)"
                ></v-btn>
              </div>
            </template>
          </v-list-item>
        </v-list>

        <div v-else class="text-center pa-8">
          <v-icon icon="mdi-cart-outline" size="64" color="grey"></v-icon>
          <p class="text-body-1 mt-4 text-medium-emphasis">Tu carrito está vacío</p>
        </div>

        <!-- Total y acciones -->
        <template v-if="cart.length > 0">
          <v-divider></v-divider>
          
          <v-card-text class="pa-4">
            <div class="d-flex justify-space-between align-center mb-4">
              <span class="text-h6">Total:</span>
              <span class="text-h5 font-weight-bold text-red-darken-2">
                ${{ cartTotal.toFixed(2) }}
              </span>
            </div>

            <v-btn
              color="red-darken-2"
              variant="flat"
              block
              size="large"
              @click="confirmOrder"
              :loading="orderLoading"
            >
              <v-icon left>mdi-check</v-icon>
              Confirmar Pedido
            </v-btn>

            <v-btn
              variant="outlined"
              color="error"
              block
              class="mt-2"
              @click="clearCart"
            >
              Vaciar Carrito
            </v-btn>
          </v-card-text>
        </template>
      </v-card>
    </v-navigation-drawer>

    <!-- Snackbar de confirmación -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      location="top"
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/api/axios';

const router = useRouter();
const authStore = useAuthStore();

const products = ref<any[]>([]);
const cart = ref<any[]>([]);
const loading = ref(false);
const orderLoading = ref(false);
const search = ref('');
const showCart = ref(false);
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

// Computed
const filteredProducts = computed(() => {
  if (!search.value) return products.value;
  
  return products.value.filter(p => 
    p.nombre.toLowerCase().includes(search.value.toLowerCase())
  );
});

const cartItemsCount = computed(() => cart.value.length);

const cartTotal = computed(() => {
  return cart.value.reduce((total, item) => {
    return total + (item.quantity * item.precio);
  }, 0);
});

// Methods
const fetchProducts = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/products');
    products.value = data.map((p: any) => ({ ...p, quantity: 0 }));
  } catch (error) {
    console.error('Error al cargar productos', error);
    showSnackbar('Error al cargar productos', 'error');
  } finally {
    loading.value = false;
  }
};

const addToCart = (product: any) => {
  if (!product.quantity || product.quantity <= 0) return;
  
  const existingItem = cart.value.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += product.quantity;
  } else {
    cart.value.push({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      quantity: product.quantity
    });
  }
  
  product.quantity = 0;
  showSnackbar(`${product.nombre} agregado al carrito`, 'success');
  showCart.value = true;
};

const removeFromCart = (index: number) => {
  cart.value.splice(index, 1);
  showSnackbar('Producto eliminado del carrito', 'info');
};

const clearCart = () => {
  cart.value = [];
  showSnackbar('Carrito vaciado', 'info');
};

const confirmOrder = async () => {
  orderLoading.value = true;
  try {
    const orderData = {
      items: cart.value.map(item => ({
        producto_id: item.id,
        cantidad: item.quantity,
        precio_unitario: item.precio
      }))
    };
    
    await api.post('/orders', orderData);
    
    showSnackbar('¡Pedido realizado con éxito!', 'success');
    cart.value = [];
    showCart.value = false;
    fetchProducts(); // Actualizar stock
  } catch (error: any) {
    console.error('Error al confirmar pedido', error);
    const message = error.response?.data?.message || 'Error al realizar el pedido';
    showSnackbar(message, 'error');
  } finally {
    orderLoading.value = false;
  }
};

const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

// Lifecycle
onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.products-page {
  background: linear-gradient(to bottom, #fafafa 0%, #f5f5f5 100%);
  min-height: 100vh;
}

.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.product-card.out-of-stock {
  opacity: 0.6;
}

.product-image {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 160px;
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
}

.stock-badge {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>
