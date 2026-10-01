<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from '@lucide/vue'
import { Card, CardContent } from '@/components/ui/card'
import GraficoEvolucaoMensal from '@/components/charts/GraficoEvolucaoMensal.vue'
import { formatarMesAbreviado } from '@/utils/formatters'
import { useEvolucaoMensalQuery } from '@/mixins/useTransacoes'

const PERIODOS = [3, 6, 12] as const

const indicePeriodo = ref(1)

const periodoAtual = computed(() => PERIODOS[indicePeriodo.value]!)
const rotuloPeriodo = computed(() => `Últimos ${periodoAtual.value} meses`)

const { data: evolucao } = useEvolucaoMensalQuery(periodoAtual)

const pontosGrafico = computed(() =>
  (evolucao.value ?? []).map((ponto) => ({
    mes: formatarMesAbreviado(ponto.mes),
    receitas: ponto.receitas,
    despesas: ponto.despesas,
  })),
)

function mudarPeriodo(delta: number) {
  indicePeriodo.value = (indicePeriodo.value + delta + PERIODOS.length) % PERIODOS.length
}

const variacaoDespesas = computed(() => {
  const pontos = evolucao.value ?? []
  if (pontos.length < 2) return 0

  const ultimo = pontos.at(-1)!
  const penultimo = pontos.at(-2)!
  if (penultimo.despesas === 0) return 0

  return Math.round(((ultimo.despesas - penultimo.despesas) / penultimo.despesas) * 100)
})
</script>

<template>
  <div class="mx-auto flex max-w-lg flex-col gap-5 px-4 py-4">
    <div class="flex items-center justify-center gap-3 text-sm font-medium">
      <button type="button" class="text-muted-foreground hover:text-foreground" @click="mudarPeriodo(-1)">
        <ChevronLeft class="size-4" />
      </button>
      {{ rotuloPeriodo }}
      <button type="button" class="text-muted-foreground hover:text-foreground" @click="mudarPeriodo(1)">
        <ChevronRight class="size-4" />
      </button>
    </div>

    <Card>
      <CardContent>
        <GraficoEvolucaoMensal :pontos="pontosGrafico" />
      </CardContent>
    </Card>

    <div class="rounded-2xl border p-4">
      <h2 class="text-sm font-semibold">Sua evolução</h2>

      <div class="mt-2 flex items-center gap-2">
        <span
          class="flex size-8 items-center justify-center rounded-full"
          :class="variacaoDespesas <= 0 ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'"
        >
          <component :is="variacaoDespesas <= 0 ? TrendingDown : TrendingUp" class="size-4" />
        </span>
        <p class="text-lg font-bold" :class="variacaoDespesas <= 0 ? 'text-success' : 'text-destructive'">
          {{ Math.abs(variacaoDespesas) }}% em despesas
        </p>
      </div>

      <p class="mt-1 text-xs text-muted-foreground">
        Você gastou {{ Math.abs(variacaoDespesas) }}% {{ variacaoDespesas <= 0 ? 'menos' : 'a mais' }} que no mês anterior.
      </p>
    </div>
  </div>
</template>
