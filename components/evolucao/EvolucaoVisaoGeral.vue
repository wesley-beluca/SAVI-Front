<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { ApexOptions } from 'apexcharts'
import { ArrowUpRight, ArrowDownRight, Wallet, ChevronRight } from '@lucide/vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import NavegadorMes from '@/components/transactions/NavegadorMes.vue'
import GraficoEvolucaoMensal from '@/components/charts/GraficoEvolucaoMensal.vue'
import { formatarMoeda, formatarMesAbreviado, formatarNomeMes } from '@/utils/formatters'
import { agruparPorCategoria } from '@/utils/agruparPorCategoria'
import { useTransacoesQuery, useEvolucaoMensalQuery } from '@/mixins/useTransacoes'

const emit = defineEmits<{ verCategorias: [] }>()

const mesReferencia = ref(new Date())
const mes = computed(() => mesReferencia.value.getMonth() + 1)
const ano = computed(() => mesReferencia.value.getFullYear())

const { data: transacoes } = useTransacoesQuery(mes, ano)
const { data: evolucao } = useEvolucaoMensalQuery(6)

const receitas = computed(() => somar(transacoes.value ?? [], 'Receita'))
const despesas = computed(() => somar(transacoes.value ?? [], 'Despesa'))
const resultado = computed(() => receitas.value - despesas.value)

function somar(lista: { tipo: string; valor: number }[], tipo: string) {
  return lista.filter((item) => item.tipo === tipo).reduce((soma, item) => soma + item.valor, 0)
}

const gastosPorCategoria = computed(() => agruparPorCategoria(transacoes.value ?? [], 'Despesa'))

const pontosGrafico = computed(
  () => (evolucao.value ?? []).map((ponto) => ({
    mes: formatarMesAbreviado(ponto.mes),
    receitas: ponto.receitas,
    despesas: ponto.despesas,
  })),
)

const opcoesDonut = computed<ApexOptions>(() => ({
  chart: { type: 'donut', fontFamily: 'inherit' },
  labels: gastosPorCategoria.value.map((categoria) => categoria.nome),
  colors: gastosPorCategoria.value.map((categoria) => categoria.cor),
  dataLabels: { enabled: false },
  legend: { show: false },
  stroke: { width: 0 },
  plotOptions: {
    pie: {
      donut: {
        size: '72%',
        labels: {
          show: true,
          total: { show: true, label: 'Total', formatter: () => formatarMoeda(despesas.value) },
        },
      },
    },
  },
}))

const seriesDonut = computed(() => gastosPorCategoria.value.map((categoria) => categoria.valor))

const mesAnteriorNome = computed(() => {
  const indice = mesReferencia.value.getMonth() === 0 ? 12 : mesReferencia.value.getMonth()
  return formatarNomeMes(indice).toLowerCase()
})
</script>

<template>
  <div class="mx-auto flex w-full max-w-lg flex-col gap-5 px-4 py-4 lg:max-w-6xl lg:gap-6 lg:px-6 lg:py-6">
    <NavegadorMes v-model="mesReferencia" />

    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      <div class="order-3 col-span-2 rounded-2xl bg-brand-soft p-5 text-brand-soft-foreground lg:order-1">
        <div class="flex items-center gap-2">
          <span class="flex size-8 items-center justify-center rounded-full bg-background/60">
            <Wallet class="size-4" />
          </span>
          <span class="text-sm opacity-80">Resultado do mês</span>
        </div>
        <p class="mt-1 text-2xl font-bold">{{ formatarMoeda(resultado) }}</p>
      </div>

      <div class="order-1 rounded-2xl border p-4 lg:order-2">
        <span class="flex size-8 items-center justify-center rounded-full bg-success/15 text-success">
          <ArrowUpRight class="size-4" />
        </span>
        <p class="mt-2 text-xs text-muted-foreground">Receitas</p>
        <p class="text-base font-semibold">{{ formatarMoeda(receitas) }}</p>
      </div>
      <div class="order-2 rounded-2xl border p-4 lg:order-3">
        <span class="flex size-8 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <ArrowDownRight class="size-4" />
        </span>
        <p class="mt-2 text-xs text-muted-foreground">Despesas</p>
        <p class="text-base font-semibold">{{ formatarMoeda(despesas) }}</p>
      </div>
    </div>

    <div class="flex flex-col gap-5 lg:grid lg:grid-cols-3 lg:items-start lg:gap-4">
      <Card>
        <CardHeader>
          <CardTitle class="text-base">Receitas x despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <GraficoEvolucaoMensal :pontos="pontosGrafico" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="text-base">Gastos por categoria</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <p v-if="gastosPorCategoria.length === 0" class="py-6 text-center text-sm text-muted-foreground">
            Nenhuma despesa registrada neste mês.
          </p>
          <template v-else>
            <apexchart type="donut" height="220" :options="opcoesDonut" :series="seriesDonut" />

            <ul class="flex flex-col gap-2">
              <li v-for="categoria in gastosPorCategoria" :key="categoria.categoriaId" class="flex items-center gap-2 text-sm">
                <span class="size-2.5 shrink-0 rounded-full" :style="{ backgroundColor: categoria.cor }" />
                <span class="flex-1">{{ categoria.nome }}</span>
                <span class="font-medium text-muted-foreground">{{ categoria.percentual }}%</span>
              </li>
            </ul>
          </template>

          <Button variant="outline" class="w-full" @click="emit('verCategorias')">
            Ver detalhes
            <ChevronRight />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="text-base">Fechamento do mês</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-3">
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted-foreground">Receitas</span>
            <span class="font-semibold text-success">{{ formatarMoeda(receitas) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted-foreground">Despesas</span>
            <span class="font-semibold text-destructive">{{ formatarMoeda(despesas) }}</span>
          </div>
          <div class="flex items-center justify-between border-t pt-3 text-sm">
            <span class="font-medium">Saldo final</span>
            <span class="font-semibold">{{ formatarMoeda(resultado) }}</span>
          </div>

          <p class="rounded-xl bg-muted p-3 text-xs text-muted-foreground">
            Resultado de {{ formatarMoeda(resultado) }} em relação a {{ mesAnteriorNome }}.
          </p>

          <Button as-child class="w-full">
            <RouterLink :to="{ name: 'movimentacoes' }">Ver relatório completo</RouterLink>
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
