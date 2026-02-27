<template>
  <v-app>
    <!-- ======================== NAVBAR ======================== -->
    <v-app-bar color="red-darken-2" elevation="4" density="comfortable">
      <v-app-bar-nav-icon @click="menuDrawer = !menuDrawer" color="white" class="d-md-none"></v-app-bar-nav-icon>

      <v-app-bar-title class="text-h5 font-weight-bold d-flex align-center" style="cursor: pointer;" @click="scrollTo('inicio')">
        <v-avatar size="36" class="mr-2">
          <v-img src="/logo.jpeg" alt="Logo"></v-img>
        </v-avatar>
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
        <v-btn variant="text" color="white" class="text-none" @click="scrollTo('como-pedir')">
          <v-icon start icon="mdi-clipboard-list" size="small"></v-icon> Cómo Pedir
        </v-btn>
        <v-btn variant="text" color="white" class="text-none" @click="scrollTo('nosotros')">
          <v-icon start icon="mdi-information" size="small"></v-icon> Nosotros
        </v-btn>
        <v-btn variant="text" color="white" class="text-none" @click="scrollTo('contacto')">
          <v-icon start icon="mdi-map-marker" size="small"></v-icon> Contacto
        </v-btn>
      </div>

      <!-- Botón Ingresar -->
      <v-btn
        variant="outlined"
        color="white"
        class="text-none font-weight-bold mr-2"
        rounded="pill"
        @click="$router.push('/login')"
      >
        <v-icon start icon="mdi-login" size="small"></v-icon>
        Ingresar
      </v-btn>
    </v-app-bar>

    <!-- ======================== MENU DRAWER (mobile) ======================== -->
    <v-navigation-drawer v-model="menuDrawer" temporary>
      <div class="pa-4 bg-red-darken-2">
        <div class="d-flex align-center">
          <v-avatar size="40" class="mr-3">
            <v-img src="/logo.jpeg" alt="Logo"></v-img>
          </v-avatar>
          <div>
            <div class="text-h6 font-weight-bold text-white">Granja 3 Hermanos</div>
            <div class="text-caption text-white" style="opacity: 0.8;">Bienvenido</div>
          </div>
        </div>
      </div>

      <v-list nav density="comfortable">
        <v-list-item prepend-icon="mdi-home" title="Inicio" @click="scrollTo('inicio'); menuDrawer = false"></v-list-item>
        <v-list-item prepend-icon="mdi-food-drumstick" title="Productos" @click="scrollTo('productos'); menuDrawer = false"></v-list-item>
        <v-list-item prepend-icon="mdi-clipboard-list" title="Cómo Pedir" @click="scrollTo('como-pedir'); menuDrawer = false"></v-list-item>
        <v-list-item prepend-icon="mdi-information" title="Nosotros" @click="scrollTo('nosotros'); menuDrawer = false"></v-list-item>
        <v-list-item prepend-icon="mdi-map-marker" title="Contacto" @click="scrollTo('contacto'); menuDrawer = false"></v-list-item>
        <v-divider class="my-2"></v-divider>
        <v-list-item prepend-icon="mdi-login" title="Ingresar" base-color="red-darken-2" @click="$router.push('/login')"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="landing-page">
      <!-- ======================== INICIO / HERO ======================== -->
      <section id="inicio">
        <div class="landing-hero">
          <div class="landing-hero-overlay"></div>
          <v-container class="landing-hero-content">
            <v-row align="center" justify="center" style="min-height: 85vh;">
              <v-col cols="12" md="8" class="text-center">
                <v-avatar size="100" class="mb-6 logo-avatar">
                  <v-img src="/logo.jpeg" alt="Logo"></v-img>
                </v-avatar>
                <h1 class="text-h2 text-md-h1 font-weight-black text-white mb-4 landing-title">
                  Granja 3 Hermanos
                </h1>
                <p class="text-h5 text-md-h4 text-white mb-8" style="opacity: 0.9; font-weight: 300;">
                  Productos frescos directo de la granja a tu mesa
                </p>
                <div class="d-flex flex-wrap justify-center ga-4 mb-12">
                  <v-btn color="white" size="x-large" rounded="pill" class="text-none font-weight-bold text-red-darken-2" @click="$router.push('/login')" elevation="8">
                    <v-icon start icon="mdi-cart"></v-icon>
                    Hacé tu Pedido
                  </v-btn>
                  <v-btn variant="outlined" color="white" size="x-large" rounded="pill" class="text-none font-weight-bold" @click="scrollTo('nosotros')">
                    <v-icon start icon="mdi-information"></v-icon>
                    Conócenos
                  </v-btn>
                </div>

                <!-- Features -->
                <v-row justify="center" class="mt-4">
                  <v-col cols="12" sm="4" v-for="feature in landingFeatures" :key="feature.title">
                    <v-card color="rgba(255,255,255,0.15)" variant="flat" class="rounded-xl pa-5 feature-card" style="backdrop-filter: blur(10px);">
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

      <!-- ======================== PRODUCTOS DESTACADOS ======================== -->
      <section id="productos" class="productos-section">
        <v-container class="py-14">
          <div class="text-center mb-10">
            <v-chip color="red-darken-2" variant="flat" size="small" class="mb-4 font-weight-bold text-none">
              <v-icon start icon="mdi-silverware-fork-knife" size="small"></v-icon>
              NUESTROS PRODUCTOS
            </v-chip>
            <h2 class="text-h3 font-weight-black text-grey-darken-4 mb-3">Lo Mejor de la Granja</h2>
            <p class="text-subtitle-1 text-grey-darken-1" style="max-width: 600px; margin: 0 auto;">
              Descubrí nuestra amplia variedad de productos frescos y elaborados artesanalmente
            </p>
          </div>

          <v-row justify="center">
            <v-col cols="12" sm="6" md="4" v-for="cat in categorias" :key="cat.title">
              <v-card class="rounded-xl producto-cat-card overflow-hidden" elevation="3" height="100%">
                <div class="producto-cat-img" :style="{ background: cat.gradient }">
                  <v-icon :icon="cat.icon" size="64" color="white" style="opacity: 0.9;"></v-icon>
                </div>
                <v-card-text class="pa-5">
                  <h4 class="text-h6 font-weight-black text-grey-darken-4 mb-2">{{ cat.title }}</h4>
                  <p class="text-body-2 text-grey-darken-1 mb-3">{{ cat.desc }}</p>
                  <div class="d-flex flex-wrap ga-2">
                    <v-chip v-for="item in cat.items" :key="item" size="x-small" variant="tonal" color="red-darken-2" class="font-weight-bold">
                      {{ item }}
                    </v-chip>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <div class="text-center mt-8">
            <v-btn color="red-darken-2" size="large" rounded="pill" class="text-none font-weight-bold" @click="$router.push('/login')" elevation="4">
              <v-icon start icon="mdi-cart"></v-icon>
              Ver Todos los Productos
            </v-btn>
          </div>
        </v-container>
      </section>

      <!-- ======================== CÓMO PEDIR ======================== -->
      <section id="como-pedir" class="como-pedir-section">
        <v-container class="py-14">
          <div class="text-center mb-10">
            <v-chip color="red-darken-2" variant="flat" size="small" class="mb-4 font-weight-bold text-none">
              <v-icon start icon="mdi-clipboard-list" size="small"></v-icon>
              MUY FÁCIL
            </v-chip>
            <h2 class="text-h3 font-weight-black text-grey-darken-4 mb-3">¿Cómo Hacer tu Pedido?</h2>
            <p class="text-subtitle-1 text-grey-darken-1" style="max-width: 600px; margin: 0 auto;">
              En solo 4 simples pasos tenés tus productos frescos en la puerta de tu casa
            </p>
          </div>

          <v-row justify="center">
            <v-col cols="12" sm="6" md="3" v-for="(paso, i) in pasos" :key="paso.title">
              <div class="text-center paso-item">
                <div class="paso-number mx-auto mb-4">
                  <span class="text-h4 font-weight-black text-white">{{ i + 1 }}</span>
                </div>
                <v-icon :icon="paso.icon" size="40" color="red-darken-2" class="mb-3"></v-icon>
                <h4 class="text-subtitle-1 font-weight-black text-grey-darken-4 mb-2">{{ paso.title }}</h4>
                <p class="text-body-2 text-grey-darken-1">{{ paso.desc }}</p>
                <v-icon v-if="i < pasos.length - 1" icon="mdi-chevron-right" size="28" color="red-lighten-2" class="paso-arrow d-none d-md-block"></v-icon>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ======================== STATS COUNTER ======================== -->
      <section class="stats-section">
        <v-container class="py-12">
          <v-row justify="center">
            <v-col cols="6" sm="3" v-for="stat in stats" :key="stat.label" class="text-center">
              <div class="stat-number text-h3 text-md-h2 font-weight-black text-white mb-1">{{ stat.value }}</div>
              <div class="text-body-2 text-white" style="opacity: 0.85;">{{ stat.label }}</div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ======================== NOSOTROS ======================== -->
      <section id="nosotros" class="nosotros-section">
        <v-container class="py-14">
          <div class="text-center mb-10">
            <v-chip color="red-darken-2" variant="flat" size="small" class="mb-4 font-weight-bold text-none">
              <v-icon start icon="mdi-heart" size="small"></v-icon>
              SOBRE NOSOTROS
            </v-chip>
            <h2 class="text-h3 font-weight-black text-grey-darken-4 mb-3">Conocé Nuestra Historia</h2>
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
                    <div class="text-caption text-red-darken-2 font-weight-bold">Desde 2020</div>
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
                  <div class="text-body-2 text-medium-emphasis">Producción artesanal desde 2021</div>
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

          <!-- Horarios -->
          <v-row justify="center">
            <v-col cols="12" md="8" lg="6">
              <div class="text-center mb-6">
                <h3 class="text-h5 font-weight-black text-grey-darken-4">Horarios de Atención</h3>
              </div>
              <v-card class="rounded-xl overflow-hidden" elevation="4">
                <div class="bg-red-darken-2 pa-5 d-flex align-center justify-center">
                  <v-icon icon="mdi-store" size="32" color="white" class="mr-3"></v-icon>
                  <h3 class="text-h5 font-weight-black text-white">Granja 3 Hermanos</h3>
                </div>
                <div class="pa-6">
                  <div class="d-flex align-center mb-4">
                    <v-icon icon="mdi-clock-outline" color="red-darken-2" class="mr-2"></v-icon>
                    <span class="text-subtitle-2 font-weight-bold text-grey-darken-3">Horarios</span>
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

          <!-- CTA final -->
          <v-row justify="center" class="mt-12">
            <v-col cols="12" md="8" class="text-center">
              <v-card class="rounded-xl pa-10 cta-card" elevation="6">
                <v-icon icon="mdi-cart-check" size="64" color="red-darken-2" class="mb-4"></v-icon>
                <h3 class="text-h4 font-weight-black text-grey-darken-4 mb-3">¿Listo para hacer tu pedido?</h3>
                <p class="text-body-1 text-grey-darken-1 mb-6">Ingresá a tu cuenta o creá una nueva para empezar a pedir</p>
                <div class="d-flex flex-wrap justify-center ga-4">
                  <v-btn color="red-darken-2" size="x-large" rounded="pill" class="text-none font-weight-bold" @click="$router.push('/login')" elevation="4">
                    <v-icon start icon="mdi-login"></v-icon>
                    Ingresar
                  </v-btn>
                  <v-btn variant="outlined" color="red-darken-2" size="x-large" rounded="pill" class="text-none font-weight-bold" @click="$router.push('/register')">
                    <v-icon start icon="mdi-account-plus"></v-icon>
                    Crear Cuenta
                  </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ======================== TESTIMONIOS ======================== -->
      <section class="testimonios-section">
        <v-container class="py-14">
          <div class="text-center mb-10">
            <v-chip color="red-darken-2" variant="flat" size="small" class="mb-4 font-weight-bold text-none">
              <v-icon start icon="mdi-star" size="small"></v-icon>
              TESTIMONIOS
            </v-chip>
            <h2 class="text-h3 font-weight-black text-grey-darken-4 mb-3">Lo Que Dicen Nuestros Clientes</h2>
            <p class="text-subtitle-1 text-grey-darken-1" style="max-width: 600px; margin: 0 auto;">
              La satisfacción de nuestros clientes es nuestra mayor recompensa
            </p>
          </div>

          <v-row justify="center">
            <v-col cols="12" md="4" v-for="test in testimonios" :key="test.nombre">
              <v-card class="rounded-xl pa-6 testimonio-card" elevation="2" height="100%">
                <div class="d-flex mb-3">
                  <v-icon v-for="s in 5" :key="s" icon="mdi-star" size="18" color="amber-darken-2"></v-icon>
                </div>
                <p class="text-body-1 text-grey-darken-2 mb-4 font-italic" style="line-height: 1.7;">
                  "{{ test.comentario }}"
                </p>
                <v-divider class="mb-4"></v-divider>
                <div class="d-flex align-center">
                  <v-avatar :color="test.color" size="42" class="mr-3">
                    <span class="text-subtitle-2 font-weight-bold text-white">{{ test.iniciales }}</span>
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-2 font-weight-bold text-grey-darken-4">{{ test.nombre }}</div>
                    <div class="text-caption text-grey-darken-1">{{ test.ubicacion }}</div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ======================== FAQ ======================== -->
      <section class="faq-section">
        <v-container class="py-14">
          <div class="text-center mb-10">
            <v-chip color="red-darken-2" variant="flat" size="small" class="mb-4 font-weight-bold text-none">
              <v-icon start icon="mdi-frequently-asked-questions" size="small"></v-icon>
              FAQ
            </v-chip>
            <h2 class="text-h3 font-weight-black text-grey-darken-4 mb-3">Preguntas Frecuentes</h2>
            <p class="text-subtitle-1 text-grey-darken-1" style="max-width: 600px; margin: 0 auto;">
              Resolvé tus dudas antes de hacer tu primer pedido
            </p>
          </div>

          <v-row justify="center">
            <v-col cols="12" md="8">
              <v-expansion-panels variant="accordion" class="rounded-xl">
                <v-expansion-panel v-for="faq in faqs" :key="faq.pregunta" class="rounded-xl mb-2" elevation="1">
                  <v-expansion-panel-title class="font-weight-bold text-grey-darken-3">
                    <v-icon icon="mdi-help-circle" color="red-darken-2" size="20" class="mr-3"></v-icon>
                    {{ faq.pregunta }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text class="text-body-2 text-grey-darken-2" style="line-height: 1.7;">
                    {{ faq.respuesta }}
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- ======================== CONTACTO ======================== -->
      <section id="contacto" class="contacto-section">
        <v-container class="py-14">
          <div class="text-center mb-10">
            <v-chip color="red-darken-2" variant="flat" size="small" class="mb-4 font-weight-bold text-none">
              <v-icon start icon="mdi-map-marker" size="small"></v-icon>
              CONTACTO
            </v-chip>
            <h2 class="text-h3 font-weight-black text-grey-darken-4 mb-3">¿Dónde Estamos?</h2>
            <p class="text-subtitle-1 text-grey-darken-1" style="max-width: 600px; margin: 0 auto;">
              Visitanos en nuestra granja o contactanos por cualquiera de nuestros canales
            </p>
          </div>

          <v-row justify="center">
            <v-col cols="12" md="4" v-for="info in contactInfo" :key="info.title">
              <v-card class="rounded-xl text-center pa-6 contacto-card" elevation="2" height="100%">
                <v-avatar :color="info.color" size="56" class="mb-4">
                  <v-icon :icon="info.icon" size="26" color="white"></v-icon>
                </v-avatar>
                <h4 class="text-subtitle-1 font-weight-black text-grey-darken-4 mb-2">{{ info.title }}</h4>
                <p class="text-body-2 text-grey-darken-1" v-for="line in info.lines" :key="line">{{ line }}</p>
                <v-btn v-if="info.link" :href="info.link" target="_blank" variant="tonal" :color="info.color" size="small" rounded="pill" class="text-none font-weight-bold mt-3">
                  <v-icon start :icon="info.linkIcon" size="small"></v-icon>
                  {{ info.linkText }}
                </v-btn>
              </v-card>
            </v-col>
          </v-row>

          <!-- Mapa embed -->
          <v-row justify="center" class="mt-8">
            <v-col cols="12" md="10">
              <v-card class="rounded-xl overflow-hidden" elevation="4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.5!2d-58.5383!3d-34.5494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb43!2sLaprida%203623%2C%20Villa%20Martelli%2C%20Vicente%20L%C3%B3pez!5e0!3m2!1ses-419!2sar!4v1"
                  width="100%" height="350" style="border:0;" allowfullscreen loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Footer -->
      <footer class="app-footer bg-grey-darken-4 py-10">
        <v-container>
          <v-row>
            <v-col cols="12" md="4" class="mb-6 mb-md-0">
              <div class="d-flex align-center mb-3">
                <v-avatar size="42" class="mr-3">
                  <v-img src="/logo.jpeg" alt="Logo"></v-img>
                </v-avatar>
                <div class="text-h6 font-weight-bold text-white">Granja 3 Hermanos</div>
              </div>
              <p class="text-body-2 text-grey-lighten-1 mb-4" style="line-height: 1.7;">
                Productos frescos directo de la granja a tu mesa. Calidad, frescura y compromiso desde 2021.
              </p>
              <div class="d-flex ga-2">
                <v-btn icon variant="tonal" color="white" size="small" href="https://www.instagram.com/" target="_blank">
                  <v-icon icon="mdi-instagram" size="18"></v-icon>
                </v-btn>
                <v-btn icon variant="tonal" color="white" size="small" href="https://www.facebook.com/" target="_blank">
                  <v-icon icon="mdi-facebook" size="18"></v-icon>
                </v-btn>
                <v-btn icon variant="tonal" color="white" size="small" href="https://wa.me/5491124743204" target="_blank">
                  <v-icon icon="mdi-whatsapp" size="18"></v-icon>
                </v-btn>
              </div>
            </v-col>
            <v-col cols="6" md="2">
              <div class="text-subtitle-2 font-weight-bold text-white mb-3">NAVEGACIÓN</div>
              <div v-for="link in footerLinks" :key="link.label" class="mb-2">
                <a class="footer-link text-body-2 text-grey-lighten-1" @click="scrollTo(link.to)" style="cursor:pointer;">
                  {{ link.label }}
                </a>
              </div>
            </v-col>
            <v-col cols="6" md="3">
              <div class="text-subtitle-2 font-weight-bold text-white mb-3">HORARIOS</div>
              <div class="text-body-2 text-grey-lighten-1 mb-1">Lun a Vie: 09:00 - 21:00</div>
              <div class="text-body-2 text-grey-lighten-1 mb-1">Sábado: 09:00 - 13:00</div>
              <div class="text-body-2 text-grey-lighten-1">Domingo: Cerrado</div>
            </v-col>
            <v-col cols="12" md="3">
              <div class="text-subtitle-2 font-weight-bold text-white mb-3">CONTACTO</div>
              <div class="d-flex align-center mb-2">
                <v-icon icon="mdi-phone" size="16" color="grey-lighten-1" class="mr-2"></v-icon>
                <span class="text-body-2 text-grey-lighten-1">+54 9 11 2474-3204</span>
              </div>
              <div class="d-flex align-center mb-2">
                <v-icon icon="mdi-email" size="16" color="grey-lighten-1" class="mr-2"></v-icon>
                <span class="text-body-2 text-grey-lighten-1">info@granja3hermanos.com.ar</span>
              </div>
              <div class="d-flex align-center">
                <v-icon icon="mdi-map-marker" size="16" color="grey-lighten-1" class="mr-2"></v-icon>
                <span class="text-body-2 text-grey-lighten-1">Laprida 3623, Villa Martelli</span>
              </div>
            </v-col>
          </v-row>
          <v-divider color="grey-darken-2" class="my-6"></v-divider>
          <div class="d-flex flex-column flex-sm-row justify-space-between align-center">
            <div class="text-caption text-grey-lighten-1">
              © {{ new Date().getFullYear() }} Granja 3 Hermanos — Todos los derechos reservados
            </div>
            <div class="text-caption text-grey-darken-1 mt-2 mt-sm-0">
              Hecho con ❤️ en Argentina
            </div>
          </div>
        </v-container>
      </footer>
    </v-main>

    <!-- WhatsApp Float -->
    <div class="whatsapp-float">
      <div v-if="!whatsappTooltipClosed" class="whatsapp-tooltip">
        💬 ¿Necesitás ayuda?
        <button class="whatsapp-tooltip-close" @click.stop="whatsappTooltipClosed = true">×</button>
      </div>
      <a href="https://wa.me/5491124743204" target="_blank" class="whatsapp-btn" title="Contactanos por WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const menuDrawer = ref(false)
const whatsappTooltipClosed = ref(false)

const landingFeatures = [
  { icon: 'mdi-leaf', title: 'Productos Frescos', desc: 'Directo de nuestra granja a tu mesa' },
  { icon: 'mdi-truck-delivery', title: 'Envío a Domicilio', desc: 'Te lo llevamos a donde estés' },
  { icon: 'mdi-shield-check', title: 'Calidad Garantizada', desc: 'Los mejores productos de la región' },
]

const categorias = [
  {
    title: 'Pollo Fresco',
    icon: 'mdi-food-drumstick',
    desc: 'Pollo entero y trozado, criado en nuestra granja con los más altos estándares de calidad.',
    gradient: 'linear-gradient(135deg, #c62828, #e53935)',
    items: ['Pollo Entero', 'Pata Muslo', 'Pechuga', 'Alitas'],
  },
  {
    title: 'Milanesas & Elaborados',
    icon: 'mdi-food-steak',
    desc: 'Milanesas caseras y productos elaborados artesanalmente con recetas tradicionales.',
    gradient: 'linear-gradient(135deg, #e65100, #ff6d00)',
    items: ['Milanesas de Pollo', 'Supremas', 'Nuggets', 'Medallones'],
  },
  {
    title: 'Huevos & Otros',
    icon: 'mdi-egg',
    desc: 'Huevos frescos de campo y una variedad de productos complementarios.',
    gradient: 'linear-gradient(135deg, #2e7d32, #43a047)',
    items: ['Huevos de Campo', 'Maple x 30', 'Media Docena', 'Docena'],
  },
]

const pasos = [
  { icon: 'mdi-account-plus', title: 'Creá tu Cuenta', desc: 'Registrate gratis en segundos con tu email' },
  { icon: 'mdi-format-list-checks', title: 'Elegí tus Productos', desc: 'Explorá nuestro catálogo y agregá al carrito' },
  { icon: 'mdi-cart-check', title: 'Confirmá tu Pedido', desc: 'Revisá tu carrito y confirmá la compra' },
  { icon: 'mdi-truck-fast', title: 'Recibí en tu Casa', desc: 'Te lo llevamos fresco a la puerta de tu hogar' },
]

const stats = [
  { value: '+500', label: 'Clientes Satisfechos' },
  { value: '+20', label: 'Productos Disponibles' },
  { value: '+5', label: 'Años de Experiencia' },
  { value: '100%', label: 'Productos Frescos' },
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

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    const offset = 64
    const y = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

const testimonios = [
  {
    nombre: 'María García',
    iniciales: 'MG',
    ubicacion: 'Buenos Aires',
    color: 'pink-darken-1',
    comentario: 'Excelente calidad en todos los productos. El pollo siempre fresco y las milanesas son increíbles. ¡Super recomendable!',
  },
  {
    nombre: 'Carlos Rodríguez',
    iniciales: 'CR',
    ubicacion: 'Zona Norte',
    color: 'blue-darken-2',
    comentario: 'Hace más de 6 meses que les compro y nunca me fallaron. El sistema de pedidos online es muy práctico y la atención es de primera.',
  },
  {
    nombre: 'Laura Martínez',
    iniciales: 'LM',
    ubicacion: 'Zona Norte',
    color: 'green-darken-2',
    comentario: 'Los mejores precios de la zona y la calidad es inmejorable. El envío siempre puntual. Mi familia los elige siempre.',
  },
]

const faqs = [
  {
    pregunta: '¿Cómo hago mi primer pedido?',
    respuesta: 'Es muy fácil: creá tu cuenta con tu email, explorá nuestro catálogo de productos, agregá lo que quieras al carrito y confirmá tu pedido. Te llegará un mail con los datos de la entrega.',
  },
  {
    pregunta: '¿Hacen envíos a domicilio?',
    respuesta: 'Sí, realizamos envíos a domicilio en toda la zona. También podés retirar tu pedido directamente en nuestra granja.',
  },
  {
    pregunta: '¿Cuáles son los medios de pago?',
    respuesta: 'Aceptamos efectivo, transferencia bancaria y Mercado Pago. Podés abonar al momento de la entrega o pre-pagar por transferencia.',
  },
  {
    pregunta: '¿Cuál es el pedido mínimo?',
    respuesta: 'No tenemos pedido mínimo. Podés pedir la cantidad que necesites. Para envíos a domicilio, consultanos las condiciones.',
  },
  {
    pregunta: '¿Los productos son frescos?',
    respuesta: '¡Sí! Todos nuestros productos son frescos del día. Trabajamos con producción propia y controlamos cada etapa del proceso para garantizar la máxima frescura y calidad.',
  },
  {
    pregunta: '¿Puedo hacer pedidos por WhatsApp?',
    respuesta: 'Sí, podés contactarnos por WhatsApp al +54 9 11 2474-3204. Pero te recomendamos usar nuestra plataforma online para mayor comodidad y seguimiento de tu pedido.',
  },
]

const contactInfo = [
  {
    title: 'Teléfono',
    icon: 'mdi-phone',
    color: 'green-darken-2',
    lines: ['+54 9 11 2474-3204', 'Lunes a Sábado'],
    link: 'tel:+5491124743204',
    linkIcon: 'mdi-phone',
    linkText: 'Llamar Ahora',
  },
  {
    title: 'WhatsApp',
    icon: 'mdi-whatsapp',
    color: 'green',
    lines: ['Escribinos por WhatsApp', 'Respuesta rápida'],
    link: 'https://wa.me/5491124743204',
    linkIcon: 'mdi-whatsapp',
    linkText: 'Enviar Mensaje',
  },
  {
    title: 'Ubicación',
    icon: 'mdi-map-marker',
    color: 'red-darken-2',
    lines: ['Laprida 3623', 'Villa Martelli, Vicente López'],
    link: null,
    linkIcon: '',
    linkText: '',
  },
]

const footerLinks = [
  { label: 'Inicio', to: 'inicio' },
  { label: 'Productos', to: 'productos' },
  { label: 'Cómo Pedir', to: 'como-pedir' },
  { label: 'Nosotros', to: 'nosotros' },
  { label: 'Contacto', to: 'contacto' },
]
</script>

<style scoped>
.landing-page {
  background: #f5f5f5;
  min-height: 100vh;
}

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

.logo-avatar {
  border: 3px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
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

section {
  scroll-margin-top: 64px;
}

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

.cta-card {
  background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%) !important;
  border: 2px solid rgba(198, 40, 40, 0.1) !important;
}

/* Productos */
.productos-section {
  background: white;
}

.producto-cat-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05) !important;
}

.producto-cat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 32px rgba(0,0,0,0.15) !important;
}

.producto-cat-img {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Cómo Pedir */
.como-pedir-section {
  background: linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%);
}

.paso-item {
  position: relative;
}

.paso-number {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c62828, #e53935);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(198, 40, 40, 0.3);
}

.paso-arrow {
  position: absolute;
  right: -20px;
  top: 30px;
}

/* Stats */
.stats-section {
  background: linear-gradient(135deg, #c62828 0%, #b71c1c 50%, #880e4f 100%);
}

.stat-number {
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* Testimonios */
.testimonios-section {
  background: white;
}

.testimonio-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05) !important;
}

.testimonio-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.1) !important;
}

/* FAQ */
.faq-section {
  background: linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%);
}

/* Contacto */
.contacto-section {
  background: white;
}

.contacto-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05) !important;
}

.contacto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important;
}

/* Footer */
.footer-link {
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: white !important;
}

.app-footer {
  margin-top: 0;
}

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
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.3); }
  50% { transform: scale(1.1); }
  70% { transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}

@media (max-width: 600px) {
  .whatsapp-float { bottom: 18px; right: 18px; }
  .whatsapp-tooltip { display: none; }
  .whatsapp-btn { width: 52px; height: 52px; }
}
</style>
