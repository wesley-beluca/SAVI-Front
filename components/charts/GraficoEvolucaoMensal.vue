<script setup lang="ts">
import { computed } from 'vue'
import type { ApexOptions } from 'apexcharts'

interface PontoMensal {
  mes: string
  receitas: number
  despesas: number
}

const props = defineProps<{ pontos: PontoMensal[] }>()

const series = computed(() => [
  { name: 'Receitas', data: props.pontos.map((p) => p.receitas) },
  { name: 'Despesas', data: props.pontos.map((p) => p.despesas) },
])

const opcoes = computed<ApexOptions>(() => ({
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
  dataLabels: { enabled: false },
  plotOptions: { bar: { columnWidth: '55%', borderRadius: 4, borderRadiusApplication: 'end' } },
  colors: ['#16A34A', '#EF4444'],
  grid: { strokeDashArray: 4 },
  xaxis: { categories: props.pontos.map((p) => p.mes) },
  yaxis: { labels: { formatter: (valor: number) => `R$ ${valor.toLocaleString('pt-BR')}` } },
  legend: { position: 'top' },
}))
</script>

<template>
  <apexchart type="bar" height="260" :options="opcoes" :series="series" />
</template>
