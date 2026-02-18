<route lang="yaml">
meta:
  layout: adminlayout
</route>

<template>
  <div class="dashboard-page">
    <v-container fluid class="pa-6">
        <!-- Métricas Principales -->
        <v-row class="mb-6">
          <!-- Número de Productos -->
          <v-col cols="12" sm="6" md="3">
            <v-card class="metric-card" elevation="4">
              <v-card-text class="text-center pa-6">
                <div class="metric-label mb-2">Número de productos</div>
                <div class="metric-value">{{ stats.totalProductos || 0 }}</div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Precio Medio -->
          <v-col cols="12" sm="6" md="3">
            <v-card class="metric-card" elevation="4">
              <v-card-text class="text-center pa-6">
                <div class="metric-label mb-2">Precio medio</div>
                <div class="metric-value">${{ (stats.precioMedio || 0).toFixed(2) }}</div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Ventas del Día -->
          <v-col cols="12" sm="6" md="3">
            <v-card class="metric-card" elevation="4">
              <v-card-text class="text-center pa-6">
                <div class="metric-label mb-2">Ventas de hoy</div>
                <div class="metric-value">${{ (stats.ventasHoy || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 }) }}</div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Stock Total -->
          <v-col cols="12" sm="6" md="3">
            <v-card class="metric-card" elevation="4">
              <v-card-text class="text-center pa-6">
                <div class="metric-label mb-2">Stock total (kg)</div>
                <div class="metric-value">{{ (stats.stockTotal || 0).toFixed(1) }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Gráficos Principales -->
        <v-row class="mb-6">
          <!-- Distribución de Productos -->
          <v-col cols="12" md="6">
            <v-card class="chart-card" elevation="4">
              <v-card-title class="chart-header">
                <v-icon icon="mdi-chart-donut" class="mr-2" color="red-darken-2"></v-icon>
                Distribución de Stock
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="pa-6">
                <div class="chart-container">
                  <Doughnut :data="doughnutData" :options="doughnutOptions" />
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Estado de Pedidos -->
          <v-col cols="12" md="6">
            <v-card class="chart-card" elevation="4">
              <v-card-title class="chart-header">
                <v-icon icon="mdi-cart-check" class="mr-2" color="red-darken-2"></v-icon>
                Estado de Pedidos
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="pa-6">
                <div class="stats-grid">
                  <div class="stat-box pending-box">
                    <v-icon icon="mdi-clock-alert" size="32" class="mb-2"></v-icon>
                    <div class="stat-number">{{ stats.pendientes || 0 }}</div>
                    <div class="stat-text">Pendientes</div>
                  </div>
                  <div class="stat-box completed-box">
                    <v-icon icon="mdi-check-circle" size="32" class="mb-2"></v-icon>
                    <div class="stat-number">{{ stats.realizados || 0 }}</div>
                    <div class="stat-text">Realizados</div>
                  </div>
                  <div class="stat-box rejected-box">
                    <v-icon icon="mdi-close-circle" size="32" class="mb-2"></v-icon>
                    <div class="stat-number">{{ stats.rechazados || 0 }}</div>
                    <div class="stat-text">Rechazados</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Gráfico de Ventas por Producto -->
        <v-row class="mb-6">
          <v-col cols="12" md="8">
            <v-card class="chart-card" elevation="4">
              <v-card-title class="chart-header">
                <v-icon icon="mdi-chart-bar" class="mr-2" color="red-darken-2"></v-icon>
                Ventas por Producto
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="pa-6">
                <div class="chart-container-bar">
                  <Bar :data="barData" :options="barOptions" />
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Alertas de Stock -->
          <v-col cols="12" md="4">
            <v-card class="chart-card stock-alerts" elevation="4">
              <v-card-title class="chart-header alert-header">
                <v-icon icon="mdi-alert-circle" class="mr-2"></v-icon>
                Alertas de Stock
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="pa-0">
                <v-list v-if="stats.alertasStock && stats.alertasStock.length > 0" density="compact">
                  <v-list-item
                    v-for="(prod, index) in stats.alertasStock"
                    :key="index"
                    class="alert-item"
                  >
                    <template v-slot:prepend>
                      <v-icon 
                        :icon="prod.stock === 0 ? 'mdi-alert-circle' : 'mdi-alert'" 
                        :color="prod.stock === 0 ? 'error' : 'warning'"
                      ></v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">{{ prod.nombre }}</v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      {{ prod.stock }} kg disponibles
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
                <div v-else class="text-center pa-8">
                  <v-icon icon="mdi-check-circle-outline" size="48" color="success"></v-icon>
                  <p class="text-body-2 mt-3 text-medium-emphasis">Stock saludable</p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { obtainDashboard } from '@/services/admin/obtainDashboard.service'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js'
import { Doughnut, Bar } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const stats = ref({
  ventasHoy: 0,
  pendientes: 0,
  realizados: 0,
  rechazados: 0,
  alertasStock: [] as any[],
  totalProductos: 0,
  precioMedio: 0,
  stockTotal: 0,
  topProductos: [] as any[],
  distribucionStock: [] as any[]
})

// Configuración del gráfico de dona
const doughnutData = computed(() => ({
  labels: stats.value.distribucionStock?.map(p => p.nombre) || [],
  datasets: [{
    data: stats.value.distribucionStock?.map(p => p.stock) || [],
    backgroundColor: [
      '#EF5350',
      '#FF7043',
      '#FFA726',
      '#FFCA28',
      '#66BB6A',
      '#26A69A',
      '#42A5F5',
      '#5C6BC0',
    ],
    borderColor: '#1E1E1E',
    borderWidth: 2,
  }]
}))

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#333',
        font: {
          size: 12,
          family: 'Roboto'
        },
        padding: 15
      }
    },
    tooltip: {
      backgroundColor: 'rgba(30, 30, 30, 0.9)',
      titleColor: '#fff',
      bodyColor: '#fff',
      callbacks: {
        label: function(context: any) {
          return `${context.label}: ${context.parsed} kg`
        }
      }
    }
  }
}

// Configuración del gráfico de barras
const barData = computed(() => ({
  labels: stats.value.topProductos?.map(p => p.nombre) || [],
  datasets: [{
    label: 'Ventas (unidades)',
    data: stats.value.topProductos?.map(p => p.ventas || 0) || [],
    backgroundColor: '#EF5350',
    borderColor: '#D32F2F',
    borderWidth: 1,
    borderRadius: 8,
  }]
}))

const barOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(30, 30, 30, 0.9)',
      titleColor: '#fff',
      bodyColor: '#fff'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        color: '#666',
        font: {
          size: 11
        }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#666',
        font: {
          size: 11
        }
      }
    }
  }
}

const fetchStats = async () => {
  try {
    const response = await obtainDashboard()
    const apiData = response.data.data
    
    stats.value = {
      ventasHoy: apiData.ventas_totales_hoy || 0,
      pendientes: apiData.pedidos_pendientes || 0,
      realizados: apiData.pedidos_realizados || 0,
      rechazados: apiData.pedidos_rechazados || 0,
      alertasStock: apiData.stock_critico.map((item: any) => ({
        nombre: item.nombre,
        stock: item.stock
      })),
      totalProductos: apiData.total_productos || apiData.productos_mas_vendidos.length,
      precioMedio: apiData.precio_promedio || 0,
      stockTotal: apiData.stock_total || 0,
      topProductos: apiData.productos_mas_vendidos.map((item: any) => ({
        nombre: item.nombre,
        precio: item.precio || 0,
        stock: item.stock || 0,
        ventas: item.cantidad_vendida
      })),
      distribucionStock: apiData.productos_mas_vendidos.map((item: any) => ({
        nombre: item.nombre,
        stock: item.stock || item.cantidad_vendida || 0
      }))
    }
  } catch (error) {
    console.error('Error al cargar estadísticas', error)
    // Datos de ejemplo si falla la API
    stats.value = {
      ventasHoy: 0,
      pendientes: 0,
      realizados: 0,
      rechazados: 0,
      alertasStock: [],
      totalProductos: 0,
      precioMedio: 0,
      stockTotal: 0,
      topProductos: [],
      distribucionStock: []
    }
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.dashboard-page {
  background: linear-gradient(135deg, #eceff1 0%, #cfd8dc 100%);
  min-height: 100vh;
}

/* Metric Cards */
.metric-card {
  background: white;
  border-radius: 12px !important;
  border-left: 4px solid #EF5350;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.metric-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 900;
  color: #1E1E1E;
  line-height: 1;
}

/* Chart Cards */
.chart-card {
  background: white;
  border-radius: 12px !important;
  overflow: hidden;
}

.chart-header {
  background: linear-gradient(135deg, #263238 0%, #37474f 100%);
  color: white !important;
  padding: 16px 20px !important;
  font-size: 1.125rem !important;
  font-weight: 600 !important;
}

.alert-header {
  background: linear-gradient(135deg, #EF5350 0%, #D32F2F 100%);
}

.chart-container {
  height: 300px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-container-bar {
  height: 350px;
  position: relative;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  height: 300px;
  align-items: center;
}

.stat-box {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.01) 100%);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.stat-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.pending-box {
  border-color: #FFA726;
}

.pending-box .v-icon {
  color: #FFA726;
}

.completed-box {
  border-color: #66BB6A;
}

.completed-box .v-icon {
  color: #66BB6A;
}

.rejected-box {
  border-color: #EF5350;
}

.rejected-box .v-icon {
  color: #EF5350;
}

.stat-number {
  font-size: 3rem;
  font-weight: 900;
  color: #1E1E1E;
  line-height: 1;
  margin: 12px 0 8px 0;
}

.stat-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Stock Alerts */
.stock-alerts {
  height: 100%;
}

.alert-item {
  border-left: 3px solid #EF5350;
  transition: background 0.2s ease;
}

.alert-item:hover {
  background: rgba(239, 83, 80, 0.05);
}

/* Table Styles */
.v-table {
  background: transparent !important;
}

.v-table thead tr th {
  background: #f5f5f5 !important;
  color: #1E1E1E !important;
  font-size: 0.875rem !important;
  padding: 16px !important;
}

.v-table tbody tr {
  transition: background 0.2s ease;
}

.v-table tbody tr:hover {
  background: rgba(239, 83, 80, 0.05) !important;
}

.v-table tbody tr td {
  padding: 16px !important;
  font-size: 0.875rem !important;
}

/* Responsive */
@media (max-width: 960px) {
  .metric-value {
    font-size: 2rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    height: auto;
  }
  
  .chart-container,
  .chart-container-bar {
    height: 250px;
  }
}

@media (max-width: 600px) {
  .metric-label {
    font-size: 0.75rem;
  }
  
  .metric-value {
    font-size: 1.75rem;
  }
}
</style>