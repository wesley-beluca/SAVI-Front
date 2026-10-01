import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import VueApexCharts from 'vue3-apexcharts'

import App from './App.vue'
import router from '@/router'
import { registrarEventosInstalacao } from '@/mixins/useInstalacaoPwa'

registrarEventosInstalacao()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)
app.use(VueApexCharts)

app.mount('#app')
