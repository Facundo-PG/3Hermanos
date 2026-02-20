<template>
  <v-app>
    <!-- Navbar -->
    <v-app-bar color="red-darken-2" elevation="4" density="comfortable">
      <v-app-bar-title class="text-h5 font-weight-bold d-flex align-center">
        <v-icon icon="mdi-egg" class="mr-2" size="30"></v-icon>
        <span class="d-none d-sm-inline">Granja 3 Hermanos</span>
        <span class="d-sm-none">3 Hermanos</span>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Usuario logueado -->
      <v-chip variant="tonal" color="white" class="mr-2 d-none d-md-flex">
        <v-icon start icon="mdi-account"></v-icon>
        {{ authStore.user?.nombre || 'Cliente' }}
      </v-chip>

      <!-- Botón carrito -->
      <v-btn icon @click="showCart = true" class="mr-1">
        <v-badge
          :content="cartItemsCount"
          color="white"
          text-color="red-darken-2"
          :model-value="cartItemsCount > 0"
        >
          <v-icon icon="mdi-cart"></v-icon>
        </v-badge>
      </v-btn>

      <v-btn icon="mdi-logout" @click="handleLogout"></v-btn>
    </v-app-bar>

    <v-main class="products-page">
      <!-- Hero Section -->
      <div class="hero-section">
        <v-container>
          <div class="text-center py-8">
            <h1 class="text-h3 text-md-h2 font-weight-black mb-3 text-white">
              Nuestros Productos
            </h1>
            <p class="text-h6 text-white" style="opacity: 0.85;">
              Productos frescos directo de la granja a tu mesa
            </p>
          </div>
        </v-container>
      </div>

      <v-container class="mt-n8" style="position: relative; z-index: 2;">
        <!-- Buscador -->
        <v-row class="mb-4">
          <v-col cols="12" md="6" offset-md="3">
            <v-card elevation="4" class="rounded-xl">
              <v-card-text class="pa-2">
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  placeholder="Buscar productos..."
                  variant="plain"
                  density="comfortable"
                  hide-details
                  clearable
                  class="px-2"
                ></v-text-field>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Filtro de categorías -->
        <div class="d-flex justify-center flex-wrap ga-2 mb-6">
          <v-chip
            :color="selectedCategory === null ? 'red-darken-2' : 'grey-lighten-2'"
            :variant="selectedCategory === null ? 'flat' : 'tonal'"
            size="default"
            class="font-weight-bold text-none"
            @click="selectedCategory = null"
          >
            <v-icon start icon="mdi-view-grid" size="small"></v-icon>
            Todos
          </v-chip>
          <v-chip
            v-for="cat in categoryList"
            :key="cat"
            :color="selectedCategory === cat ? 'red-darken-2' : 'grey-lighten-2'"
            :variant="selectedCategory === cat ? 'flat' : 'tonal'"
            size="default"
            class="font-weight-bold text-none"
            @click="selectedCategory = cat"
          >
            <v-icon start :icon="getCategoryIcon(cat)" size="small"></v-icon>
            {{ cat }}
          </v-chip>
        </div>

        <!-- Loading -->
        <v-row v-if="loading">
          <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
            <v-skeleton-loader type="card" class="rounded-xl"></v-skeleton-loader>
          </v-col>
        </v-row>

        <!-- Productos agrupados por categoría -->
        <template v-else-if="Object.keys(groupedProducts).length > 0">
          <div
            v-for="(categoryProducts, categoryName) in groupedProducts"
            :key="categoryName"
            class="mb-8"
          >
            <!-- Encabezado de categoría -->
            <div class="d-flex align-center mb-4">
              <v-icon :icon="getCategoryIcon(String(categoryName))" color="red-darken-2" size="28" class="mr-3"></v-icon>
              <h2 class="text-h5 font-weight-bold text-grey-darken-3">{{ categoryName }}</h2>
              <v-chip size="small" variant="tonal" color="red-darken-2" class="ml-3">
                {{ categoryProducts.length }} producto{{ categoryProducts.length !== 1 ? 's' : '' }}
              </v-chip>
              <v-divider class="ml-4"></v-divider>
            </div>

            <v-row>
              <v-col
                v-for="product in categoryProducts"
                :key="product.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card
                  class="product-card rounded-xl"
                  elevation="2"
                  :class="{ 'out-of-stock': Number(product.stock) <= 0 || !product.activo }"
                >
              <!-- Imagen del producto -->
              <div class="product-image-wrapper">
                <v-img
                  v-if="product.imagen_url"
                  :src="product.imagen_url"
                  height="200"
                  cover
                  class="product-img"
                >
                  <template v-slot:error>
                    <div class="product-image-fallback">
                      <v-icon icon="mdi-food-drumstick" size="64" color="red-darken-2"></v-icon>
                    </div>
                  </template>
                </v-img>
                <div v-else class="product-image-fallback">
                  <v-icon icon="mdi-food-drumstick" size="64" color="red-darken-2"></v-icon>
                </div>

                <!-- Badges -->
                <v-chip
                  v-if="Number(product.stock) <= 0 || !product.activo"
                  color="error"
                  class="stock-badge"
                  size="small"
                  variant="flat"
                >
                  <v-icon start icon="mdi-close-circle" size="small"></v-icon>
                  Sin Stock
                </v-chip>
                <v-chip
                  v-else-if="Number(product.stock) < 10"
                  color="warning"
                  class="stock-badge"
                  size="small"
                  variant="flat"
                >
                  <v-icon start icon="mdi-alert" size="small"></v-icon>
                  Poco Stock
                </v-chip>
              </div>

              <v-card-text class="pb-0">
                <h3 class="text-h6 font-weight-bold mb-1 text-grey-darken-3">
                  {{ product.nombre }}
                </h3>
                <p v-if="product.descripcion" class="text-body-2 text-medium-emphasis mb-2 product-desc">
                  {{ product.descripcion }}
                </p>
                <div class="d-flex align-center justify-space-between">
                  <div class="price-tag">
                    <span class="text-h5 font-weight-black text-red-darken-2">
                      ${{ Number(product.precio).toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}
                    </span>
                    <span class="text-body-2 text-medium-emphasis ml-1">/ kg</span>
                  </div>
                  <v-chip size="x-small" variant="tonal" :color="Number(product.stock) > 10 ? 'green' : 'orange'">
                    {{ Number(product.stock).toFixed(1) }} kg
                  </v-chip>
                </div>
              </v-card-text>

              <!-- Agregar al carrito -->
              <v-card-actions class="pa-4 pt-3">
                <v-row dense align="center">
                  <v-col cols="5">
                    <v-text-field
                      v-model.number="product.quantity"
                      type="number"
                      label="Kg"
                      variant="outlined"
                      density="compact"
                      min="0.5"
                      step="0.5"
                      :max="Number(product.stock)"
                      :disabled="Number(product.stock) <= 0 || !product.activo"
                      hide-details
                      class="quantity-input"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="7">
                    <v-btn
                      color="red-darken-2"
                      variant="flat"
                      block
                      rounded="lg"
                      :disabled="!product.quantity || product.quantity <= 0 || Number(product.stock) <= 0 || !product.activo"
                      @click="addToCart(product)"
                      class="text-none"
                    >
                      <v-icon start icon="mdi-cart-plus" size="small"></v-icon>
                      Agregar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
          </div>
        </template>

        <!-- Sin resultados -->
        <v-row v-else>
          <v-col cols="12" class="text-center py-16">
            <v-icon icon="mdi-package-variant-remove" size="100" color="grey-lighten-1"></v-icon>
            <h3 class="text-h5 mt-4 text-grey">No se encontraron productos</h3>
            <p class="text-body-1 text-medium-emphasis">Intentá con otro término de búsqueda</p>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- ======================== CARRITO DRAWER ======================== -->
    <v-navigation-drawer
      v-model="showCart"
      location="right"
      temporary
      width="420"
      class="cart-drawer"
    >
      <!-- Header -->
      <div class="cart-header bg-red-darken-2 pa-4 d-flex align-center" style="flex-shrink: 0;">
        <v-icon icon="mdi-cart" color="white" class="mr-3" size="28"></v-icon>
        <div>
          <div class="text-h6 font-weight-bold text-white">Mi Pedido</div>
          <div class="text-body-2 text-white" style="opacity:0.8">
            {{ cartItemsCount }} producto{{ cartItemsCount !== 1 ? 's' : '' }}
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" color="white" @click="showCart = false"></v-btn>
      </div>

      <!-- Scrollable content -->
      <div v-if="cart.length > 0" style="flex: 1; overflow-y: auto;">
        <!-- Items del carrito -->
        <v-card
          v-for="(item, index) in cart"
          :key="item.id"
          class="ma-3 rounded-lg"
          elevation="1"
        >
          <div class="d-flex align-center pa-3">
            <v-avatar size="48" color="red-lighten-5" rounded="lg" class="mr-3">
              <v-img v-if="item.imagen_url" :src="item.imagen_url" cover></v-img>
              <v-icon v-else icon="mdi-food-drumstick" color="red-darken-2"></v-icon>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="font-weight-bold text-body-1">{{ item.nombre }}</div>
              <div class="text-body-2 text-medium-emphasis">
                {{ item.quantity }} kg x ${{ Number(item.precio).toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}
              </div>
            </div>
            <div class="text-right ml-2">
              <div class="font-weight-black text-red-darken-2">
                ${{ (item.quantity * Number(item.precio)).toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}
              </div>
              <v-btn
                icon="mdi-delete-outline"
                variant="text"
                size="x-small"
                color="grey"
                @click="removeFromCart(index)"
              ></v-btn>
            </div>
          </div>
        </v-card>

        <!-- Opciones de pedido -->
        <div class="pa-4">
          <v-divider class="mb-4"></v-divider>

          <v-select
            v-model="tipoEntrega"
            :items="['Retiro', 'Envio']"
            label="Tipo de entrega"
            variant="outlined"
            density="compact"
            hide-details
            class="mb-3"
            :menu-props="{ location: 'top' }"
          ></v-select>

          <v-select
            v-model="metodoPago"
            :items="['Efectivo', 'Transferencia']"
            label="Método de pago"
            variant="outlined"
            density="compact"
            hide-details
            class="mb-3"
            :menu-props="{ location: 'top' }"
          ></v-select>

          <!-- Aviso transferencia -->
          <v-alert
            v-if="metodoPago === 'Transferencia'"
            type="info"
            variant="tonal"
            density="compact"
            class="mb-3"
            icon="mdi-bank-transfer"
          >
            <div class="text-body-2">
              Después de confirmar, transferí al alias:
              <strong class="text-blue-darken-2">granja3hermanos.mp</strong>
            </div>
          </v-alert>

          <v-textarea
            v-model="notas"
            label="Notas (opcional)"
            variant="outlined"
            density="compact"
            rows="2"
            hide-details
            class="mb-4"
          ></v-textarea>

          <!-- Total -->
          <div class="d-flex justify-space-between align-center mb-4 pa-3 bg-red-lighten-5 rounded-lg">
            <span class="text-h6 font-weight-bold">Total:</span>
            <span class="text-h5 font-weight-black text-red-darken-2">
              ${{ cartTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}
            </span>
          </div>

          <v-btn
            color="red-darken-2"
            variant="flat"
            block
            size="large"
            rounded="lg"
            @click="openCheckoutDialog"
            :disabled="!tipoEntrega || !metodoPago"
            class="text-none font-weight-bold mb-2"
          >
            <v-icon start icon="mdi-check-circle"></v-icon>
            Confirmar Pedido
          </v-btn>

          <v-btn
            variant="text"
            color="grey"
            block
            size="small"
            @click="clearCart"
            class="text-none"
          >
            <v-icon start icon="mdi-delete-sweep" size="small"></v-icon>
            Vaciar carrito
          </v-btn>
        </div>
      </div>

      <!-- Carrito vacío -->
      <div v-else class="d-flex flex-column align-center justify-center" style="height: calc(100% - 80px);">
        <v-icon icon="mdi-cart-off" size="80" color="grey-lighten-2"></v-icon>
        <p class="text-h6 mt-4 text-grey">Tu carrito está vacío</p>
        <p class="text-body-2 text-medium-emphasis">Agregá productos para hacer tu pedido</p>
      </div>
    </v-navigation-drawer>

    <!-- ======================== DIALOG CONFIRMAR PEDIDO ======================== -->
    <v-dialog v-model="checkoutDialog" max-width="500" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="bg-red-darken-2 text-white pa-4 d-flex align-center">
          <v-icon icon="mdi-clipboard-check" class="mr-2"></v-icon>
          Confirmar Pedido
        </v-card-title>

        <v-card-text class="pa-5">
          <p class="text-body-1 mb-4">Revisá tu pedido antes de confirmar:</p>

          <v-table density="compact" class="mb-4">
            <thead>
              <tr>
                <th>Producto</th>
                <th class="text-center">Cant.</th>
                <th class="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cart" :key="item.id">
                <td>{{ item.nombre }}</td>
                <td class="text-center">{{ item.quantity }} kg</td>
                <td class="text-right font-weight-bold">
                  ${{ (item.quantity * Number(item.precio)).toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}
                </td>
              </tr>
            </tbody>
          </v-table>

          <v-divider class="mb-3"></v-divider>

          <div class="d-flex justify-space-between mb-2">
            <span class="text-body-2 text-medium-emphasis">Entrega:</span>
            <span class="font-weight-bold">{{ tipoEntrega }}</span>
          </div>
          <div class="d-flex justify-space-between mb-2">
            <span class="text-body-2 text-medium-emphasis">Pago:</span>
            <span class="font-weight-bold">{{ metodoPago }}</span>
          </div>
          <div v-if="notas" class="d-flex justify-space-between mb-2">
            <span class="text-body-2 text-medium-emphasis">Notas:</span>
            <span class="font-weight-bold">{{ notas }}</span>
          </div>

          <v-divider class="my-3"></v-divider>

          <div class="d-flex justify-space-between align-center pa-3 bg-red-lighten-5 rounded-lg">
            <span class="text-h6 font-weight-bold">Total a pagar:</span>
            <span class="text-h5 font-weight-black text-red-darken-2">
              ${{ cartTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}
            </span>
          </div>

          <!-- Datos de transferencia + comprobante -->
          <div v-if="metodoPago === 'Transferencia'" class="mt-4">
            <v-card
              color="blue-lighten-5"
              variant="flat"
              class="rounded-lg mb-4"
            >
              <v-card-text class="pa-4">
                <div class="d-flex align-center mb-3">
                  <v-icon icon="mdi-bank-transfer" color="blue-darken-2" size="28" class="mr-2"></v-icon>
                  <span class="text-subtitle-1 font-weight-bold text-blue-darken-2">Datos para Transferencia</span>
                </div>
                <p class="text-body-2 mb-2">
                  Transferí el monto total al siguiente alias:
                </p>
                <div class="d-flex align-center justify-center pa-3 bg-white rounded-lg mb-2">
                  <span class="text-h6 font-weight-black text-blue-darken-3 mr-2">granja3hermanos.mp</span>
                  <v-btn
                    icon="mdi-content-copy"
                    size="x-small"
                    variant="text"
                    color="blue-darken-2"
                    @click="copyAlias"
                  ></v-btn>
                </div>
                <p class="text-body-2 text-medium-emphasis text-center">
                  Adjuntá el comprobante para agilizar la confirmación.
                </p>
              </v-card-text>
            </v-card>

            <v-file-input
              v-model="comprobanteFile"
              label="Adjuntar comprobante"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              prepend-icon="mdi-receipt"
              variant="outlined"
              density="compact"
              hide-details
              :clearable="true"
              show-size
              class="mb-2"
            ></v-file-input>
            <p class="text-caption text-medium-emphasis">JPG, PNG, WEBP o PDF. Máx 5MB.</p>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-btn
            variant="text"
            @click="checkoutDialog = false"
            class="text-none"
          >
            Volver
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="red-darken-2"
            variant="flat"
            rounded="lg"
            @click="confirmOrder"
            :loading="orderLoading"
            class="text-none font-weight-bold px-6"
          >
            <v-icon start icon="mdi-send"></v-icon>
            Enviar Pedido
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ======================== DIALOG PEDIDO EXITOSO ======================== -->
    <v-dialog v-model="successDialog" max-width="450" persistent>
      <v-card class="rounded-xl text-center pa-6">
        <v-icon icon="mdi-check-circle" size="80" color="green"></v-icon>
        <h2 class="text-h5 font-weight-bold mt-4 mb-2">¡Pedido Realizado!</h2>
        <p class="text-body-1 text-medium-emphasis mb-4">
          Tu pedido fue recibido y está pendiente de confirmación.
          Te notificaremos por email cuando cambie el estado.
        </p>

        <!-- Confirmación transferencia -->
        <v-alert
          v-if="lastPaymentMethod === 'Transferencia'"
          type="info"
          variant="tonal"
          class="mb-4 text-left"
          icon="mdi-bank-transfer"
        >
          <div class="text-body-2">
            Tu comprobante fue adjuntado. Una vez verificada la transferencia, tu pedido pasará a estado <strong>Pagado</strong>.
          </div>
        </v-alert>

        <v-btn
          color="red-darken-2"
          variant="flat"
          rounded="lg"
          @click="successDialog = false"
          class="text-none font-weight-bold"
        >
          Entendido
        </v-btn>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      location="top"
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'

interface Product {
  id: number
  nombre: string
  descripcion: string | null
  precio: number
  stock: number
  imagen_url: string | null
  activo: boolean
  categories: { nombre: string } | null
  quantity: number
}

interface CartItem {
  id: number
  nombre: string
  precio: number
  imagen_url: string | null
  quantity: number
}

const router = useRouter()
const authStore = useAuthStore()

// State
const products = ref<Product[]>([])
const cart = ref<CartItem[]>([])
const loading = ref(false)
const orderLoading = ref(false)
const search = ref('')
const selectedCategory = ref<string | null>(null)
const showCart = ref(false)
const checkoutDialog = ref(false)
const successDialog = ref(false)
const lastPaymentMethod = ref('')
const comprobanteFile = ref<File[] | null>(null)

// Order options
const tipoEntrega = ref('Retiro')
const metodoPago = ref('Efectivo')
const notas = ref('')

// Snackbar
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// Computed
const categoryList = computed(() => {
  const cats = new Set<string>()
  products.value.filter(p => p.activo).forEach(p => {
    const name = p.categories?.nombre || 'Sin categoría'
    cats.add(name)
  })
  return Array.from(cats).sort()
})

const filteredProducts = computed(() => {
  let list = products.value.filter(p => p.activo)
  if (selectedCategory.value) {
    list = list.filter(p => (p.categories?.nombre || 'Sin categoría') === selectedCategory.value)
  }
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(q)) ||
      (p.categories?.nombre && p.categories.nombre.toLowerCase().includes(q))
    )
  }
  return list
})

const groupedProducts = computed(() => {
  const groups: Record<string, Product[]> = {}
  filteredProducts.value.forEach(p => {
    const cat = p.categories?.nombre || 'Sin categoría'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(p)
  })
  // Orden personalizado de categorías
  const categoryOrder = [
    'Congelados y Elaborados',
    'Pollo Fresco',
    'Milanesas',
    'Cerdo',
  ]
  const sorted: Record<string, Product[]> = {}
  // Primero las categorías en el orden definido
  categoryOrder.forEach(cat => {
    const match = Object.keys(groups).find(k => k.toLowerCase() === cat.toLowerCase())
    if (match) {
      sorted[match] = groups[match]
    }
  })
  // Luego las demás categorías que no estén en el orden definido
  Object.keys(groups).forEach(key => {
    if (!sorted[key]) {
      sorted[key] = groups[key]
    }
  })
  return sorted
})

const cartItemsCount = computed(() => cart.value.length)

const cartTotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.quantity * Number(item.precio), 0)
)

// Methods
const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await api.get('/products/list')
    const d = response.data
    let raw = d?.data?.data ?? d?.data ?? d
    const arr = Array.isArray(raw) ? raw : []
    products.value = arr.map((p: any) => ({
      ...p,
      precio: Number(p.precio),
      stock: Number(p.stock),
      quantity: 0,
    }))
  } catch (error) {
    console.error('Error al cargar productos:', error)
    showSnackbar('Error al cargar productos', 'error')
  } finally {
    loading.value = false
  }
}

const addToCart = (product: Product) => {
  if (!product.quantity || product.quantity <= 0) return

  const existing = cart.value.find(item => item.id === product.id)
  if (existing) {
    existing.quantity += product.quantity
  } else {
    cart.value.push({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen_url: product.imagen_url,
      quantity: product.quantity,
    })
  }

  showSnackbar(`${product.nombre} agregado al carrito`, 'success')
  product.quantity = 0
  showCart.value = true
}

const removeFromCart = (index: number) => {
  cart.value.splice(index, 1)
}

const clearCart = () => {
  cart.value = []
  tipoEntrega.value = 'Retiro'
  metodoPago.value = 'Efectivo'
  notas.value = ''
}

const getCategoryIcon = (category: string): string => {
  const lower = category.toLowerCase()
  const icons: Record<string, string> = {
    pollo: 'mdi-food-drumstick',
    pollos: 'mdi-food-drumstick',
    huevos: 'mdi-egg',
    huevo: 'mdi-egg',
    cerdo: 'mdi-pig',
    carne: 'mdi-food-steak',
    carnes: 'mdi-food-steak',
    verduras: 'mdi-leaf',
    frutas: 'mdi-fruit-watermelon',
    lácteos: 'mdi-cup',
    lacteos: 'mdi-cup',
    bebidas: 'mdi-bottle-soda',
    embutidos: 'mdi-sausage',
    chacinados: 'mdi-sausage',
    fiambres: 'mdi-food-variant',
    congelados: 'mdi-snowflake',
    panadería: 'mdi-bread-slice',
    panaderia: 'mdi-bread-slice',
  }
  for (const [key, icon] of Object.entries(icons)) {
    if (lower.includes(key)) return icon
  }
  return 'mdi-tag'
}

const openCheckoutDialog = () => {
  checkoutDialog.value = true
}

const confirmOrder = async () => {
  orderLoading.value = true
  try {
    const orderData = {
      user_id: authStore.user?.id || 0,
      tipo_entrega: tipoEntrega.value,
      metodo_pago: metodoPago.value.toLowerCase().replace(' ', '_'),
      notas: notas.value || undefined,
      items: cart.value.map(item => ({
        product_id: item.id,
        cantidad: item.quantity,
      })),
    }

    const orderRes = await api.post('/orders/create', orderData)
    const orderId = orderRes.data?.data?.id
    console.log('Order created, ID:', orderId, 'Response:', orderRes.data)

    // Subir comprobante si se adjuntó
    const files = comprobanteFile.value
    const file = Array.isArray(files) ? files[0] : files
    console.log('Comprobante file:', file, 'orderId:', orderId)

    if (file && orderId) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        const uploadRes = await api.post(`/orders/upload-comprobante?order_id=${orderId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        console.log('Comprobante uploaded:', uploadRes.data)
      } catch (uploadErr) {
        console.error('Error al subir comprobante:', uploadErr)
      }
    }

    lastPaymentMethod.value = metodoPago.value
    checkoutDialog.value = false
    showCart.value = false
    successDialog.value = true
    clearCart()
    comprobanteFile.value = null
    fetchProducts() // Refrescar stock
  } catch (error: any) {
    console.error('Error al confirmar pedido:', error)
    const msg = error.response?.data?.data?.mensajeError
      || error.response?.data?.message
      || 'Error al realizar el pedido'
    showSnackbar(msg, 'error')
  } finally {
    orderLoading.value = false
  }
}

const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

const copyAlias = () => {
  navigator.clipboard.writeText('granja3hermanos.mp')
  showSnackbar('Alias copiado al portapapeles', 'success')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.products-page {
  background: #f5f5f5;
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #c62828 0%, #b71c1c 40%, #880e4f 100%);
  padding-bottom: 60px;
}

/* Product Cards */
.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15) !important;
}

.product-card.out-of-stock {
  opacity: 0.55;
  filter: grayscale(30%);
}

.product-image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image-fallback {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
}

.product-img {
  transition: transform 0.4s ease;
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

.stock-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-weight: 600;
}

.category-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-weight: 600;
}

.product-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.quantity-input :deep(.v-field) {
  border-radius: 8px;
}

/* Cart Drawer */
.cart-drawer :deep(.v-navigation-drawer__content) {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
