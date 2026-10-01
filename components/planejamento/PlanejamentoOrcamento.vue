<script setup lang="ts">
import { computed, ref } from 'vue'
import { Wallet, Target, TriangleAlert, PiggyBank, Pencil, Calendar } from '@lucide/vue'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useOrcamentoQuery } from '@/mixins/useOrcamento'
import { formatarMoeda, formatarNomeMes } from '@/utils/formatters'
import OrcamentoFormDialog from './OrcamentoFormDialog.vue'
import PlanejamentoFuturoDialog from './PlanejamentoFuturoDialog.vue'

const hoje = new Date()
const mes = ref(hoje.getMonth() + 1)
const ano = ref(hoje.getFullYear())

const mesSelecionado = computed(() => `${formatarNomeMes(mes.value)} de ${ano.value}`)

const formAberto = ref(false)
const futuroAberto = ref(false)

const { data: orcamento } = useOrcamentoQuery(mes, ano)

const rendaPrevista = computed(() => orcamento.value?.rendaPrevista ?? 0)
const limitePlanejado = computed(() => orcamento.value?.limitePlanejado ?? 0)
const utilizado = computed(() => orcamento.value?.utilizado ?? 0)
const disponivel = computed(() => limitePlanejado.value - utilizado.value)
const percentualUtilizado = computed(() =>
  limitePlanejado.value > 0 ? Math.round((utilizado.value / limitePlanejado.value) * 100) : 0,
)

const linhas = computed(() => [
  { rotulo: 'Renda prevista', valor: rendaPrevista.value, icone: Wallet, cor: 'bg-success/15 text-success' },
  { rotulo: 'Limite planejado', valor: limitePlanejado.value, icone: Target, cor: 'bg-warning/15 text-warning' },
  {
    rotulo: 'Utilizado',
    valor: utilizado.value,
    sufixo: `(${percentualUtilizado.value}%)`,
    icone: TriangleAlert,
    cor: 'bg-destructive/15 text-destructive',
  },
  { rotulo: 'Disponível', valor: disponivel.value, icone: PiggyBank, cor: 'bg-info/15 text-info' },
])
</script>

<template>
  <div class="mx-auto flex max-w-lg flex-col gap-4 px-4 py-4">
    <button
      type="button"
      class="flex items-center justify-center gap-2 self-center text-sm font-medium text-muted-foreground hover:text-foreground"
      @click="futuroAberto = true"
    >
      <Calendar class="size-4" />
      {{ mesSelecionado }}
    </button>

    <Card>
      <CardHeader>
        <CardTitle class="text-base">Orçamento do mês</CardTitle>
        <CardAction>
          <Button variant="ghost" size="icon-sm" @click="formAberto = true">
            <Pencil />
            <span class="sr-only">Editar orçamento</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent class="flex flex-col gap-1">
        <div v-for="linha in linhas" :key="linha.rotulo" class="flex items-center gap-3 py-2">
          <span class="flex size-9 shrink-0 items-center justify-center rounded-full" :class="linha.cor">
            <component :is="linha.icone" class="size-4" />
          </span>
          <div class="flex-1">
            <p class="text-xs text-muted-foreground">{{ linha.rotulo }}</p>
            <p class="text-base font-semibold">
              {{ formatarMoeda(linha.valor) }}
              <span v-if="linha.sufixo" class="text-sm font-normal text-muted-foreground">{{ linha.sufixo }}</span>
            </p>
          </div>
        </div>

        <Progress :model-value="Math.min(100, percentualUtilizado)" class="mt-1" />
      </CardContent>
    </Card>

    <OrcamentoFormDialog v-model:open="formAberto" :mes="mes" :ano="ano" />
    <PlanejamentoFuturoDialog v-model:open="futuroAberto" v-model:mes="mes" v-model:ano="ano" />
  </div>
</template>
