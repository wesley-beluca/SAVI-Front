<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Eye, EyeOff, ArrowUpRight, ArrowDownRight, ChevronRight } from '@lucide/vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { useAuthStore } from '@/store/auth.store'
import { formatarMoeda } from '@/utils/formatters'
import { iconeCategoria } from '@/utils/iconesCategoria'
import { useTransacoesQuery } from '@/mixins/useTransacoes'
import { useOrcamentoQuery } from '@/mixins/useOrcamento'
import NavegadorMes from '@/components/transactions/NavegadorMes.vue'
import ItemListaFinanceira from '@/components/transactions/ItemListaFinanceira.vue'

const authStore = useAuthStore()

const saldoVisivel = ref(true)
const dataReferencia = ref(new Date())
const hoje = new Date()

const mes = computed(() => dataReferencia.value.getMonth() + 1)
const ano = computed(() => dataReferencia.value.getFullYear())

const { data: transacoes } = useTransacoesQuery(mes, ano)
const { data: orcamento } = useOrcamentoQuery(mes, ano)

const receitas = computed(() => somar(transacoes.value ?? [], 'Receita'))
const despesas = computed(() => somar(transacoes.value ?? [], 'Despesa'))
const saldoDisponivel = computed(() => receitas.value - despesas.value)

const orcamentoTotal = computed(() => orcamento.value?.limitePlanejado ?? 0)
const orcamentoGasto = computed(() => orcamento.value?.utilizado ?? despesas.value)
const percentualOrcamento = computed(() =>
  orcamentoTotal.value > 0 ? Math.round((orcamentoGasto.value / orcamentoTotal.value) * 100) : 0,
)
const restanteOrcamento = computed(() => orcamentoTotal.value - orcamentoGasto.value)

const proximasContas = computed(() =>
  (transacoes.value ?? [])
    .filter((transacao) => transacao.tipo === 'Despesa' && new Date(`${transacao.data}T00:00:00`) >= hoje)
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 5),
)

function somar(lista: { tipo: string; valor: number }[], tipo: string) {
  return lista.filter((item) => item.tipo === tipo).reduce((soma, item) => soma + item.valor, 0)
}

const iniciais = computed(() => {
  const nome = authStore.usuario?.nome ?? ''
  return nome
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('')
})
</script>

<template>
  <div class="flex flex-col gap-5 px-4 py-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-lg font-semibold">Olá, {{ authStore.usuario?.nome }}! 👋</h1>
        <p class="text-sm text-muted-foreground">Que bom te ver por aqui.</p>
      </div>
      <Avatar>
        <AvatarFallback class="bg-primary/10 text-primary">{{ iniciais }}</AvatarFallback>
      </Avatar>
    </div>

    <NavegadorMes v-model="dataReferencia" />

    <div class="rounded-2xl bg-brand-soft p-5 text-brand-soft-foreground">
      <div class="flex items-center justify-between">
        <span class="text-sm opacity-80">Saldo disponível</span>
        <button type="button" @click="saldoVisivel = !saldoVisivel">
          <component :is="saldoVisivel ? Eye : EyeOff" class="size-4 opacity-70" />
        </button>
      </div>
      <p class="mt-1 text-3xl font-bold">
        {{ saldoVisivel ? formatarMoeda(saldoDisponivel) : 'R$ •••••' }}
      </p>

      <div class="mt-4 grid grid-cols-2 gap-3">
        <div class="flex items-center gap-2">
          <span class="flex size-8 items-center justify-center rounded-full bg-success/15 text-success">
            <ArrowUpRight class="size-4" />
          </span>
          <div>
            <p class="text-xs opacity-70">Receitas</p>
            <p class="text-sm font-semibold">{{ formatarMoeda(receitas) }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="flex size-8 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <ArrowDownRight class="size-4" />
          </span>
          <div>
            <p class="text-xs opacity-70">Despesas</p>
            <p class="text-sm font-semibold">{{ formatarMoeda(despesas) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-2xl border p-4">
      <div class="flex items-center justify-between text-sm">
        <span class="font-medium">Orçamento do mês</span>
        <span class="text-muted-foreground">
          {{ formatarMoeda(orcamentoGasto) }} / {{ formatarMoeda(orcamentoTotal) }}
          <strong class="ml-1 text-foreground">{{ percentualOrcamento }}%</strong>
        </span>
      </div>
      <Progress :model-value="Math.min(100, percentualOrcamento)" class="mt-2" />
      <p v-if="orcamentoTotal > 0" class="mt-2 text-xs text-muted-foreground">
        Você ainda pode gastar <strong class="text-foreground">{{ formatarMoeda(restanteOrcamento) }}</strong>
      </p>
      <p v-else class="mt-2 text-xs text-muted-foreground">
        Defina um orçamento na aba Planejamento para acompanhar seus limites.
      </p>
    </div>

    <div>
      <div class="mb-2 flex items-center justify-between">
        <h2 class="text-sm font-semibold">Próximas contas</h2>
        <RouterLink
          :to="{ name: 'movimentacoes' }"
          class="flex items-center text-xs font-medium text-primary hover:underline"
        >
          Ver todas
          <ChevronRight class="size-3.5" />
        </RouterLink>
      </div>

      <p v-if="proximasContas.length === 0" class="py-4 text-center text-sm text-muted-foreground">
        Nenhuma conta a vencer neste período.
      </p>

      <ul v-else class="flex flex-col gap-2">
        <ItemListaFinanceira
          v-for="conta in proximasContas"
          :key="conta.id"
          :icone="iconeCategoria(conta.categoriaIcone)"
          :titulo="conta.descricao"
          :legenda="conta.categoriaNome"
          :valor="conta.valor"
          :cor="conta.categoriaCor"
        />
      </ul>
    </div>
  </div>
</template>
