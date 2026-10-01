<script setup lang="ts">
import { computed } from 'vue'
import { useTransacoesQuery } from '@/mixins/useTransacoes'
import { useOrcamentoQuery } from '@/mixins/useOrcamento'
import { gerarInsights } from '@/utils/gerarInsights'

const hoje = new Date()
const mesAtual = hoje.getMonth() + 1
const anoAtual = hoje.getFullYear()

const dataAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)
const mesAnterior = dataAnterior.getMonth() + 1
const anoAnterior = dataAnterior.getFullYear()

const { data: transacoesAtual } = useTransacoesQuery(mesAtual, anoAtual)
const { data: transacoesAnterior } = useTransacoesQuery(mesAnterior, anoAnterior)
const { data: orcamento } = useOrcamentoQuery(mesAtual, anoAtual)

const insights = computed(() =>
  gerarInsights(transacoesAtual.value ?? [], transacoesAnterior.value ?? [], orcamento.value, hoje),
)
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-4">
    <h1 class="text-lg font-semibold">SAVI percebeu</h1>

    <p v-if="insights.length === 0" class="py-8 text-center text-sm text-muted-foreground">
      Ainda não há dados suficientes para gerar insights. Registre algumas movimentações para começar.
    </p>

    <ul v-else class="flex flex-col gap-3">
      <li v-for="insight in insights" :key="insight.id" class="flex items-start gap-3 rounded-xl border p-3">
        <span class="flex size-9 shrink-0 items-center justify-center rounded-full" :class="insight.cor">
          <component :is="insight.icone" class="size-4" />
        </span>
        <p class="pt-1.5 text-sm">{{ insight.texto }}</p>
      </li>
    </ul>
  </div>
</template>
