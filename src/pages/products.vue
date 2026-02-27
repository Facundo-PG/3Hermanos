<template>
    <!-- ======================== NAVBAR ======================== -->
    <v-app-bar color="red-darken-2" elevation="4" density="comfortable">
      <v-app-bar-nav-icon @click="menuDrawer = !menuDrawer" color="white"></v-app-bar-nav-icon>

      <v-app-bar-title class="text-h5 font-weight-bold d-flex align-center" style="cursor: pointer;" @click="scrollTo('inicio')">
        <v-icon icon="mdi-egg" class="mr-2" size="30"></v-icon>
        <span class="d-none d-sm-inline">Granja 3 Hermanos</span>
        <span class="d-sm-none">3 Hermanos</span>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Links desktop -->
      <div class="d-none d-md-flex align-center ga-1 mr-2">
        <v-btn variant="text" color="white" class="text-none" @click="scrollTo('inicio')">
          <v-icon start icon="mdi-home" size="small"></v-icon> Inicio
        </v-btn>
        <v-btn variant="text" color="white" class="text-none" @click="scrollTo('productos')">
          <v-icon start icon="mdi-food-drumstick" size="small"></v-icon> Productos
        </v-btn>
        <v-btn variant="text" color="white" class="text-none" @click="scrollTo('nosotros')">
          <v-icon start icon="mdi-information" size="small"></v-icon> Nosotros
        </v-btn>
      </div>

      <!-- Usuario logueado -->
      <v-chip variant="tonal" color="white" class="mr-2 d-none d-sm-flex">
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

    <!-- ======================== MENU DRAWER (hamburguesa) ======================== -->
    <v-navigation-drawer v-model="menuDrawer" temporary>
      <div class="pa-4 bg-red-darken-2">
        <div class="d-flex align-center">
          <v-icon icon="mdi-egg" color="white" size="36" class="mr-3"></v-icon>
          <div>
            <div class="text-h6 font-weight-bold text-white">Granja 3 Hermanos</div>
            <div class="text-caption text-white" style="opacity: 0.8;">{{ authStore.user?.nombre || 'Cliente' }}</div>
          </div>
        </div>
      </div>

      <v-list nav density="comfortable">
        <v-list-item
          prepend-icon="mdi-home"
          title="Inicio"
          @click="scrollTo('inicio'); menuDrawer = false"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-food-drumstick"
          title="Productos"
          @click="scrollTo('productos'); menuDrawer = false"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-cart"
          title="Mi Carrito"
          @click="showCart = true; menuDrawer = false"
        >
          <template v-slot:append>
            <v-badge v-if="cartItemsCount > 0" :content="cartItemsCount" color="red-darken-2" inline></v-badge>
          </template>
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-information"
          title="Nosotros"
          @click="scrollTo('nosotros'); menuDrawer = false"
        ></v-list-item>
        <v-divider class="my-2"></v-divider>
        <v-list-item
          prepend-icon="mdi-logout"
          title="Cerrar Sesión"
          base-color="red-darken-2"
          @click="handleLogout"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="products-page">
      <!-- ======================== INICIO / LANDING ======================== -->
      <section id="inicio">
        <div class="landing-hero">
          <div class="landing-hero-overlay"></div>
          <v-container class="landing-hero-content">
            <v-row align="center" justify="center" style="min-height: 85vh;">
              <v-col cols="12" md="8" class="text-center">
                <v-icon icon="mdi-egg" size="80" color="white" class="mb-4 landing-icon"></v-icon>
                <h1 class="text-h2 text-md-h1 font-weight-black text-white mb-4 landing-title">
                  {{ settings?.nombre_negocio || 'Granja 3 Hermanos' }}
                </h1>
                <p class="text-h5 text-md-h4 text-white mb-8" style="opacity: 0.9; font-weight: 300;">
                  Productos frescos directo de la granja a tu mesa
                </p>
                <div class="d-flex flex-wrap justify-center ga-4 mb-12">
                  <v-btn
                    color="white"
                    size="x-large"
                    rounded="pill"
                    class="text-none font-weight-bold text-red-darken-2"
                    @click="scrollTo('productos')"
                    elevation="8"
                  >
                    <v-icon start icon="mdi-food-drumstick"></v-icon>
                    Ver Productos
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    color="white"
                    size="x-large"
                    rounded="pill"
                    class="text-none font-weight-bold"
                    @click="scrollTo('nosotros')"
                  >
                    <v-icon start icon="mdi-information"></v-icon>
                    Conócenos
                  </v-btn>
                </div>

                <!-- Features -->
                <v-row justify="center" class="mt-4">
                  <v-col cols="12" sm="4" v-for="feature in landingFeatures" :key="feature.title">
                    <v-card
                      color="rgba(255,255,255,0.15)"
                      variant="flat"
                      class="rounded-xl pa-5 feature-card"
                      style="backdrop-filter: blur(10px);"
                    >
                      <v-icon :icon="feature.icon" size="40" color="white" class="mb-3"></v-icon>
                      <div class="text-subtitle-1 font-weight-bold text-white">{{ feature.title }}</div>
                      <div class="text-body-2 text-white" style="opacity: 0.8;">{{ feature.desc }}</div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </section>

      <!-- ======================== PRODUCTOS ======================== -->
      <section id="productos">
        <div class="section-header-productos text-center pt-14 pb-8">
          <v-container>
            <v-chip color="red-darken-2" variant="flat" size="small" class="mb-4 font-weight-bold text-none">
              <v-icon start icon="mdi-food-drumstick" size="small"></v-icon>
              CATÁLOGO
            </v-chip>
            <h2 class="text-h3 font-weight-black text-grey-darken-4 mb-3">
              Nuestros Productos
            </h2>
            <p class="text-subtitle-1 text-grey-darken-1 mb-8" style="max-width: 500px; margin: 0 auto;">
              Elegí lo que necesitás y hacé tu pedido online
            </p>

            <!-- Buscador -->
            <v-row justify="center" class="mb-6">
              <v-col cols="12" sm="8" md="6">
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  placeholder="Buscar productos..."
                  variant="solo"
                  density="comfortable"
                  hide-details
                  clearable
                  rounded="pill"
                  class="search-field"
                  bg-color="white"
                  flat
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Filtro de categorías -->
            <div class="d-flex justify-center flex-wrap ga-2">
              <v-chip
                :color="selectedCategory === null ? 'red-darken-2' : 'grey-darken-3'"
                :variant="selectedCategory === null ? 'flat' : 'outlined'"
                size="default"
                class="font-weight-bold text-none category-chip"
                @click="selectedCategory = null"
              >
                <v-icon start icon="mdi-view-grid" size="small"></v-icon>
                Todos
              </v-chip>
              <v-chip
                v-for="cat in categoryList"
                :key="cat"
                :color="selectedCategory === cat ? 'red-darken-2' : 'grey-darken-3'"
                :variant="selectedCategory === cat ? 'flat' : 'outlined'"
                size="default"
                class="font-weight-bold text-none category-chip"
                @click="selectedCategory = cat"
              >
                <v-icon start :icon="getCategoryIcon(cat)" size="small"></v-icon>
            {{ cat }}
              </v-chip>
            </div>
          </v-container>
        </div>

        <v-container>

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
                    <span class="text-body-2 text-medium-emphasis ml-1">{{ isPromocion(product) ? '/ promo' : '/ kg' }}</span>
                  </div>
                  <v-chip v-if="isPromocion(product)" size="x-small" variant="tonal" color="deep-purple">
                    Promoción
                  </v-chip>
                  <v-chip v-else size="x-small" variant="tonal" :color="Number(product.stock) > 10 ? 'green' : 'orange'">
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
                      :label="isPromocion(product) ? 'Cant.' : 'Kg'"
                      :suffix="isPromocion(product) ? 'u' : 'kg'"
                      variant="outlined"
                      density="compact"
                      :min="isPromocion(product) ? 1 : 0.5"
                      :step="isPromocion(product) ? 1 : 0.5"
                      :max="isPromocion(product) ? undefined : Number(product.stock)"
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
      </section>

      <!-- ======================== NOSOTROS ======================== -->
      <section id="nosotros" class="nosotros-section">
        <v-container class="py-16">
          <!-- Header -->
          <div class="text-center mb-12">
            <v-chip color="red-darken-2" variant="flat" size="small" class="mb-4 font-weight-bold text-none">
              <v-icon start icon="mdi-heart" size="small"></v-icon>
              SOBRE NOSOTROS
            </v-chip>
            <h2 class="text-h3 font-weight-black text-grey-darken-4 mb-3">
              Conocé Nuestra Historia
            </h2>
            <p class="text-subtitle-1 text-grey-darken-1" style="max-width: 600px; margin: 0 auto;">
              Somos una empresa familiar dedicada a la producción y comercialización de productos avícolas de la más alta calidad
            </p>
          </div>

          <!-- Historia + Imagen -->
          <v-row justify="center" align="center" class="mb-12">
            <v-col cols="12" md="6">
              <v-card class="rounded-xl pa-8" elevation="0" color="white">
                <div class="d-flex align-center mb-4">
                  <v-avatar color="red-darken-2" size="48" class="mr-4">
                    <v-icon icon="mdi-egg" color="white"></v-icon>
                  </v-avatar>
                  <div>
                    <h3 class="text-h5 font-weight-black text-grey-darken-4">Nuestra Historia</h3>
                    <div class="text-caption text-red-darken-2 font-weight-bold">Desde 2018</div>
                  </div>
                </div>
                <p class="text-body-1 text-grey-darken-2 mb-4" style="line-height: 1.8;">
                  Lo que comenzó como un emprendimiento familiar hace más de 5 años, hoy se convirtió en una granja
                  de referencia en la zona. Nos especializamos en pollo fresco, milanesas caseras, productos congelados
                  y elaborados artesanales.
                </p>
                <p class="text-body-1 text-grey-darken-2 mb-6" style="line-height: 1.8;">
                  Trabajamos día a día para ofrecer productos de primera calidad, con procesos que garantizan
                  la frescura y el sabor que nos caracteriza. Nuestro compromiso es llevar lo mejor del campo
                  directamente a tu mesa.
                </p>
                <div class="d-flex flex-wrap ga-3">
                  <v-chip variant="tonal" color="red-darken-2" size="small" class="font-weight-bold">
                    <v-icon start icon="mdi-calendar" size="small"></v-icon> +5 años
                  </v-chip>
                  <v-chip variant="tonal" color="red-darken-2" size="small" class="font-weight-bold">
                    <v-icon start icon="mdi-account-group" size="small"></v-icon> Empresa Familiar
                  </v-chip>
                  <v-chip variant="tonal" color="red-darken-2" size="small" class="font-weight-bold">
                    <v-icon start icon="mdi-star" size="small"></v-icon> Calidad Premium
                  </v-chip>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card class="rounded-xl overflow-hidden" elevation="4">
                <div class="nosotros-image-placeholder d-flex flex-column align-center justify-center">
                  <v-icon icon="mdi-barn" size="80" color="red-darken-2" class="mb-4" style="opacity: 0.6;"></v-icon>
                  <div class="text-h6 font-weight-bold text-grey-darken-1">Granja 3 Hermanos</div>
                  <div class="text-body-2 text-medium-emphasis">Producción artesanal desde 2018</div>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Valores -->
          <v-row class="mb-12" justify="center">
            <v-col cols="12" sm="6" md="3" v-for="valor in valores" :key="valor.title">
              <v-card class="rounded-xl text-center pa-6 valor-card" elevation="2" height="100%">
                <v-avatar :color="valor.color" size="60" class="mb-4">
                  <v-icon :icon="valor.icon" size="28" color="white"></v-icon>
                </v-avatar>
                <h4 class="text-subtitle-1 font-weight-black text-grey-darken-4 mb-2">{{ valor.title }}</h4>
                <p class="text-body-2 text-grey-darken-1">{{ valor.desc }}</p>
              </v-card>
            </v-col>
          </v-row>

          <!-- Info del negocio (desde settings) -->
          <v-row justify="center">
            <v-col cols="12" md="8" lg="6">
              <div class="text-center mb-6">
                <h3 class="text-h5 font-weight-black text-grey-darken-4">Información del Local</h3>
              </div>
              <v-card class="rounded-xl overflow-hidden" elevation="4">
                <div class="bg-red-darken-2 pa-5 d-flex align-center justify-center">
                  <v-icon icon="mdi-store" size="32" color="white" class="mr-3"></v-icon>
                  <h3 class="text-h5 font-weight-black text-white">
                    {{ settings?.nombre_negocio || 'Granja 3 Hermanos' }}
                  </h3>
                  <v-chip
                    :color="settings?.esta_abierto ? 'green' : 'grey'"
                    size="small"
                    variant="flat"
                    class="ml-4 font-weight-bold"
                  >
                    {{ settings?.esta_abierto ? 'Abierto' : 'Cerrado' }}
                  </v-chip>
                </div>

                <v-card-text class="pa-0">
                  <v-list lines="two" class="py-0">
                    <v-list-item v-if="settings?.direccion_local" class="py-4 px-6">
                      <template v-slot:prepend>
                        <v-avatar color="red-lighten-5" rounded="lg" size="44">
                          <v-icon icon="mdi-map-marker" color="red-darken-2"></v-icon>
                        </v-avatar>
                      </template>
                      <v-list-item-subtitle class="text-caption text-medium-emphasis">Dirección</v-list-item-subtitle>
                      <v-list-item-title class="font-weight-bold">{{ settings.direccion_local }}</v-list-item-title>
                    </v-list-item>
                    <v-divider v-if="settings?.direccion_local"></v-divider>

                    <v-list-item v-if="settings?.whatsapp_notificaciones" class="py-4 px-6">
                      <template v-slot:prepend>
                        <v-avatar color="green-lighten-5" rounded="lg" size="44">
                          <v-icon icon="mdi-whatsapp" color="green-darken-2"></v-icon>
                        </v-avatar>
                      </template>
                      <v-list-item-subtitle class="text-caption text-medium-emphasis">WhatsApp</v-list-item-subtitle>
                      <v-list-item-title class="font-weight-bold">{{ settings.whatsapp_notificaciones }}</v-list-item-title>
                      <template v-slot:append>
                        <v-btn
                          variant="tonal"
                          color="green"
                          size="small"
                          rounded="pill"
                          class="text-none"
                          :href="'https://wa.me/' + settings.whatsapp_notificaciones.replace(/[^0-9]/g, '')"
                          target="_blank"
                        >
                          <v-icon start icon="mdi-open-in-new" size="small"></v-icon>
                          Contactar
                        </v-btn>
                      </template>
                    </v-list-item>
                    <v-divider v-if="settings?.whatsapp_notificaciones"></v-divider>

                    <v-list-item v-if="settings?.costo_delivery != null" class="py-4 px-6">
                      <template v-slot:prepend>
                        <v-avatar color="blue-lighten-5" rounded="lg" size="44">
                          <v-icon icon="mdi-truck-delivery" color="blue-darken-2"></v-icon>
                        </v-avatar>
                      </template>
                      <v-list-item-subtitle class="text-caption text-medium-emphasis">Costo de envío</v-list-item-subtitle>
                      <v-list-item-title class="font-weight-bold text-h6">
                        ${{ Number(settings.costo_delivery).toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}
                      </v-list-item-title>
                    </v-list-item>

                    <template v-if="settings?.mensaje_alerta">
                      <v-divider></v-divider>
                      <v-list-item class="py-4 px-6">
                        <template v-slot:prepend>
                          <v-avatar color="orange-lighten-5" rounded="lg" size="44">
                            <v-icon icon="mdi-alert-circle" color="orange-darken-2"></v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-subtitle class="text-caption text-medium-emphasis">Aviso importante</v-list-item-subtitle>
                        <v-list-item-title class="font-weight-bold text-wrap">{{ settings.mensaje_alerta }}</v-list-item-title>
                      </v-list-item>
                    </template>
                  </v-list>
                </v-card-text>

                <!-- Horarios placeholder -->
                <v-divider></v-divider>
                <div class="pa-6">
                  <div class="d-flex align-center mb-4">
                    <v-icon icon="mdi-clock-outline" color="red-darken-2" class="mr-2"></v-icon>
                    <span class="text-subtitle-2 font-weight-bold text-grey-darken-3">Horarios de Atención</span>
                  </div>
                  <v-row dense>
                    <v-col cols="6" v-for="horario in horarios" :key="horario.dia">
                      <div class="d-flex justify-space-between align-center py-1">
                        <span class="text-body-2 text-grey-darken-2">{{ horario.dia }}</span>
                        <v-chip :color="horario.abierto ? 'green' : 'grey'" size="x-small" variant="tonal" class="font-weight-bold">
                          {{ horario.horario }}
                        </v-chip>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Footer -->
      <footer class="app-footer bg-grey-darken-4 py-8 text-center">
        <v-container>
          <v-icon icon="mdi-egg" color="red-darken-2" size="36" class="mb-3"></v-icon>
          <div class="text-h6 font-weight-bold text-white mb-1">{{ settings?.nombre_negocio || 'Granja 3 Hermanos' }}</div>
          <div class="text-body-2 text-grey-lighten-1 mb-4">Productos frescos directo de la granja a tu mesa</div>
          <v-divider color="grey-darken-2" class="mb-4"></v-divider>
          <div class="text-caption text-grey-lighten-1">
            © {{ new Date().getFullYear() }} {{ settings?.nombre_negocio || 'Granja 3 Hermanos' }} — Todos los derechos reservados
          </div>
        </v-container>
      </footer>
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
                {{ item.quantity }} {{ item.unitType === 'unidad' ? (item.quantity === 1 ? 'unidad' : 'unidades') : 'kg' }} x ${{ Number(item.precio).toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}
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
              <strong class="text-blue-darken-2">granjahermanos3</strong>
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

          <!-- Subtotal + Envío + Total -->
          <div class="pa-3 bg-red-lighten-5 rounded-lg mb-4">
            <div class="d-flex justify-space-between mb-1">
              <span class="text-body-2 text-medium-emphasis">Subtotal:</span>
              <span class="font-weight-bold">${{ cartSubtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}</span>
            </div>
            <div v-if="shippingCost > 0" class="d-flex justify-space-between mb-1">
              <span class="text-body-2 text-medium-emphasis">Envío:</span>
              <span class="font-weight-bold">${{ shippingCost.toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}</span>
            </div>
            <v-divider class="my-2"></v-divider>
            <div class="d-flex justify-space-between align-center">
              <span class="text-h6 font-weight-bold">Total:</span>
              <span class="text-h5 font-weight-black text-red-darken-2">
                ${{ cartTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}
              </span>
            </div>
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
                <td class="text-center">{{ item.quantity }} {{ item.unitType === 'unidad' ? (item.quantity === 1 ? 'u' : 'u') : 'kg' }}</td>
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

          <div class="pa-3 bg-red-lighten-5 rounded-lg">
            <div class="d-flex justify-space-between mb-1">
              <span class="text-body-2 text-medium-emphasis">Subtotal:</span>
              <span class="font-weight-bold">${{ cartSubtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}</span>
            </div>
            <div v-if="shippingCost > 0" class="d-flex justify-space-between mb-1">
              <span class="text-body-2 text-medium-emphasis">Costo de envío:</span>
              <span class="font-weight-bold">${{ shippingCost.toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}</span>
            </div>
            <v-divider class="my-2"></v-divider>
            <div class="d-flex justify-space-between align-center">
              <span class="text-h6 font-weight-bold">Total a pagar:</span>
              <span class="text-h5 font-weight-black text-red-darken-2">
                ${{ cartTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}
              </span>
            </div>
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
                  <span class="text-h6 font-weight-black text-blue-darken-3 mr-2">granjahermanos3</span>
                  <v-btn
                    icon="mdi-content-copy"
                    size="x-small"
                    variant="text"
                    color="blue-darken-2"
                    @click="copyAlias"
                  ></v-btn>
                </div>
                <p class="text-body-2 text-medium-emphasis text-center">
                  Adjuntá el comprobante para confirmar tu pedido.
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
              :error="comprobanteExceedsSize"
              hide-details
              :clearable="true"
              show-size
              class="mb-2"
            ></v-file-input>
            <v-alert
              v-if="comprobanteExceedsSize"
              type="error"
              density="compact"
              variant="tonal"
              class="mt-2 mb-1"
            >
              El tamaño del archivo supera el peso esperado (1MB)
            </v-alert>
            <p v-else class="text-caption text-medium-emphasis">JPG, PNG, WEBP o PDF. Máx 1MB.</p>
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
            :disabled="comprobanteExceedsSize || (metodoPago === 'Transferencia' && (!comprobanteFile || (Array.isArray(comprobanteFile) && comprobanteFile.length === 0)))"
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
            Tu comprobante fue adjuntado. Una vez verificada la transferencia, tu pedido será procesado.
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

    <!-- ======================== WHATSAPP FLOTANTE ======================== -->
    <div class="whatsapp-float">
      <div class="whatsapp-tooltip" @click="showWaTooltip = false">
        <span>¿Tenés dudas? ¡Estamos para ayudarte!</span>
        <button class="whatsapp-tooltip-close">&times;</button>
      </div>
      <a
        href="https://wa.me/1124743204?text=Hola%2C%20tengo%20una%20consulta"
        target="_blank"
        class="whatsapp-btn"
        aria-label="Contactar por WhatsApp"
      >
        <v-icon icon="mdi-whatsapp" size="32" color="white"></v-icon>
      </a>
    </div>
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
  unitType: 'kg' | 'unidad'
}

interface CartItem {
  id: number
  nombre: string
  precio: number
  imagen_url: string | null
  quantity: number
  unitType: 'kg' | 'unidad'
}

const router = useRouter()
const authStore = useAuthStore()

const isPromocion = (product: Product): boolean => {
  if (!product.descripcion) return false
  return /promoci[oó]n/i.test(product.descripcion)
}

// Menu & Settings
const menuDrawer = ref(false)
const settings = ref<any>(null)

const landingFeatures = [
  { icon: 'mdi-leaf', title: 'Productos Frescos', desc: 'Directo de nuestra granja a tu mesa' },
  { icon: 'mdi-truck-delivery', title: 'Envío a Domicilio', desc: 'Te lo llevamos a donde estés' },
  { icon: 'mdi-shield-check', title: 'Calidad Garantizada', desc: 'Los mejores productos de la región' },
]

const valores = [
  { icon: 'mdi-hand-heart', title: 'Compromiso', desc: 'Trabajamos con pasión para ofrecerte lo mejor cada día', color: 'red-darken-2' },
  { icon: 'mdi-leaf', title: 'Frescura', desc: 'Productos del día, sin intermediarios, de la granja a tu mesa', color: 'green-darken-2' },
  { icon: 'mdi-account-group', title: 'Familia', desc: 'Somos una empresa familiar que cuida a sus clientes como propios', color: 'blue-darken-2' },
  { icon: 'mdi-medal', title: 'Calidad', desc: 'Control riguroso en cada etapa para garantizar el mejor producto', color: 'orange-darken-2' },
]

const horarios = [
  { dia: 'Lunes', horario: '09:00 - 13:00 / 15:00 - 21:00', abierto: true },
  { dia: 'Martes', horario: '09:00 - 13:00 / 15:00 - 21:00', abierto: true },
  { dia: 'Miércoles', horario: '09:00 - 13:00 / 15:00 - 21:00', abierto: true },
  { dia: 'Jueves', horario: '09:00 - 13:00 / 15:00 - 21:00', abierto: true },
  { dia: 'Viernes', horario: '09:00 - 13:00 / 15:00 - 21:00', abierto: true },
  { dia: 'Sábado', horario: '09:00 - 13:00', abierto: true },
  { dia: 'Domingo', horario: 'Cerrado', abierto: false },
  { dia: 'Feriados', horario: 'Consultar', abierto: false },
]

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
const comprobanteExceedsSize = computed(() => {
  const files = comprobanteFile.value
  const file = Array.isArray(files) ? files[0] : files
  return file ? file.size > 1 * 1024 * 1024 : false
})

// Order options
const tipoEntrega = ref('Retiro')
const metodoPago = ref('Efectivo')
const notas = ref('')

// Snackbar
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const showWaTooltip = ref(true)

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
    if (match && groups[match]) {
      sorted[match] = groups[match]!
    }
  })
  // Luego las demás categorías que no estén en el orden definido
  Object.keys(groups).forEach(key => {
    if (!sorted[key] && groups[key]) {
      sorted[key] = groups[key]!
    }
  })
  return sorted
})

const cartItemsCount = computed(() => cart.value.length)

const cartSubtotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.quantity * Number(item.precio), 0)
)

const shippingCost = computed(() => {
  if (tipoEntrega.value === 'Envio' && settings.value?.costo_delivery != null) {
    return Number(settings.value.costo_delivery)
  }
  return 0
})

const cartTotal = computed(() => cartSubtotal.value + shippingCost.value)

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
      unitType: (/promoci[oó]n/i.test(p.descripcion || '') ? 'unidad' : 'kg') as 'kg' | 'unidad',
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
      unitType: isPromocion(product) ? 'unidad' : 'kg',
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
  // Validar comprobante obligatorio en transferencia
  if (metodoPago.value === 'Transferencia') {
    const files = comprobanteFile.value
    const file = Array.isArray(files) ? files[0] : files
    if (!file) {
      showSnackbar('Debés adjuntar el comprobante de transferencia', 'error')
      return
    }
  }

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
      // Validar tamaño máximo 1MB
      if (file.size > 1 * 1024 * 1024) {
        showSnackbar('El comprobante no puede superar 1MB', 'error')
      } else {
        try {
          const formData = new FormData()
          formData.append('file', file)
          const uploadRes = await api.post(`/orders/upload-comprobante?order_id=${orderId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          console.log('Comprobante uploaded:', uploadRes.data)
        } catch (uploadErr: any) {
          console.error('Error al subir comprobante:', uploadErr)
          showSnackbar('Error al subir el comprobante. Contactá al local.', 'error')
        }
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
    const mensajeBack = error.response?.data?.data?.mensajeError || ''
    const cleanMsg = mensajeBack.replace('Error al crear la orden: ', '')
    const msg = cleanMsg
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
  navigator.clipboard.writeText('granjahermanos3')
  showSnackbar('Alias copiado al portapapeles', 'success')
}

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    const offset = 64
    const y = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

const fetchSettings = async () => {
  try {
    const response = await api.get('/settings/list')
    const d = response.data
    const raw = d?.data?.data ?? d?.data ?? d
    if (Array.isArray(raw)) {
      settings.value = raw.length > 0 ? raw[0] : null
    } else if (raw && typeof raw === 'object') {
      settings.value = raw
    } else {
      settings.value = null
    }
  } catch (error) {
    console.error('Error al cargar configuración:', error)
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchProducts()
  fetchSettings()
})
</script>

<style scoped>
.products-page {
  background: #f5f5f5;
  min-height: 100vh;
}

/* Landing Hero */
.landing-hero {
  position: relative;
  background: linear-gradient(135deg, #c62828 0%, #b71c1c 30%, #880e4f 70%, #4a148c 100%);
  overflow: hidden;
}

.landing-hero-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 0%, transparent 50%);
}

.landing-hero-content {
  position: relative;
  z-index: 1;
}

.landing-title {
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.landing-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.feature-card {
  text-align: center;
  transition: transform 0.3s ease;
  border: 1px solid rgba(255,255,255,0.2) !important;
}

.feature-card:hover {
  transform: translateY(-5px);
}

/* Section styling */
.section-header-productos {
  background: #f8f8f8;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

.search-field {
  max-width: 100%;
}

.search-field :deep(.v-field) {
  box-shadow: 0 2px 12px rgba(0,0,0,0.08) !important;
  border: 1px solid rgba(0,0,0,0.08);
}

.search-field :deep(.v-field:focus-within) {
  box-shadow: 0 4px 20px rgba(198, 40, 40, 0.15) !important;
  border-color: #c62828;
}

.category-chip {
  transition: all 0.2s ease;
  cursor: pointer;
}

.category-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(0,0,0,0.12);
}

section {
  scroll-margin-top: 64px;
}

/* Nosotros */
.nosotros-section {
  background: linear-gradient(180deg, #f5f5f5 0%, #eeeeee 100%);
}

.nosotros-image-placeholder {
  height: 350px;
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 50%, #ef9a9a 100%);
}

.valor-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05) !important;
}

.valor-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.12) !important;
}

/* Footer */
.app-footer {
  margin-top: 0;
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

/* WhatsApp Float */
.whatsapp-float {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
}

.whatsapp-tooltip {
  background: white;
  color: #333;
  padding: 10px 16px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: fadeInLeft 0.5s ease 1s both;
}

.whatsapp-tooltip-close {
  background: none;
  border: none;
  font-size: 18px;
  color: #999;
  cursor: pointer;
  padding: 0 0 0 4px;
  line-height: 1;
}

.whatsapp-tooltip-close:hover {
  color: #333;
}

.whatsapp-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #25D366;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4);
  transition: all 0.3s ease;
  text-decoration: none;
  flex-shrink: 0;
  animation: bounceIn 0.6s ease 0.5s both;
}

.whatsapp-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(37, 211, 102, 0.5);
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.1);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 600px) {
  .whatsapp-float {
    bottom: 18px;
    right: 18px;
  }
  .whatsapp-tooltip {
    display: none;
  }
  .whatsapp-btn {
    width: 52px;
    height: 52px;
  }
}
</style>
