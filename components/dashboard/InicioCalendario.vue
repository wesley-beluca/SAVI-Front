<script setup lang="ts">
import { computed, ref } from 'vue'
import { getLocalTimeZone, today } from '@internationalized/date'
import { Calendar } from '@/components/ui/calendar'
import ItemListaFinanceira from '@/components/transactions/ItemListaFinanceira.vue'
import BotaoPagamento from '@/components/transactions/BotaoPagamento.vue'
import MovimentacaoFormDialog from '@/components/transactions/MovimentacaoFormDialog.vue'
import { useTransacoesQuery } from '@/mixins/useTransacoes'
import { iconeCategoria } from '@/utils/iconesCategoria'
import { dataIsoLocal } from '@/utils/formatters'
import { ESTILO_STATUS, statusPagamento, type StatusPagamento } from '@/utils/statusPagamento'
import type { Transacao } from '@/api/transacoes.api'

// Tipado como `any`: o `DateValue` do reka-ui usa campos privados que fazem o TS
// tratar CalendarDate como nominalmente incompatível com a union em tempo de tipo.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const diaSelecionado = ref<any>(today(getLocalTimeZone()))
// Mês exibido no calendário (muda com as setas sem alterar o dia selecionado).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mesExibido = ref<any>(today(getLocalTimeZone()))

const mes = computed(() => diaSelecionado.value.month as number)
const ano = computed(() => diaSelecionado.value.year as number)

const { data: transacoes } = useTransacoesQuery(mes, ano)
const { data: transacoesDoMesExibido } = useTransacoesQuery(
  computed(() => mesExibido.value.month as number),
  computed(() => mesExibido.value.year as number),
)

const hojeIso = dataIsoLocal()

const chaveDia = computed(() => diaSelecionado.value.toString())
const lancamentosDoDia = computed(() =>
  (transacoes.value ?? []).filter((transacao) => transacao.data === chaveDia.value),
)

// Em ordem crescente de urgência: o marcador do dia mostra a despesa mais urgente.
const URGENCIA: StatusPagamento[] = ['paga', 'pendente', 'vencida']
const LEGENDA: StatusPagamento[] = ['pendente', 'vencida', 'paga']

const statusPorDia = computed(() => {
  const mapa = new Map<string, StatusPagamento>()

  for (const transacao of transacoesDoMesExibido.value ?? []) {
    const status = statusPagamento(transacao, hojeIso)
    if (!status) continue

    const atual = mapa.get(transacao.data)
    if (!atual || URGENCIA.indexOf(status) > URGENCIA.indexOf(atual)) mapa.set(transacao.data, status)
  }

  return mapa
})

const tituloDia = computed(() => {
  const data = diaSelecionado.value.toDate(getLocalTimeZone())
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' }).format(data)
})

const hoje = today(getLocalTimeZone())

const formAberto = ref(false)

// O primeiro clique já seleciona o dia via v-model; o duplo clique só abre o formulário para ele.
function aoClicarDuasVezes(evento: MouseEvent) {
  if (!(evento.target as HTMLElement).closest('[data-slot="calendar-cell-trigger"]')) return
  formAberto.value = true
}

function legendaLancamento(lancamento: Transacao) {
  return lancamento.mesesRecorrencia > 1
    ? `${lancamento.categoriaNome} · ${lancamento.ocorrencia}/${lancamento.mesesRecorrencia}`
    : lancamento.categoriaNome
}
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-4">
    <div>
      <h1 class="text-lg font-semibold">Calendário financeiro</h1>
      <p class="text-xs text-muted-foreground">Toque duas vezes em um dia para adicionar um lançamento.</p>
    </div>

    <div class="rounded-2xl border" @dblclick="aoClicarDuasVezes">
      <Calendar
        v-model="diaSelecionado"
        v-model:placeholder="mesExibido"
        locale="pt-BR"
        :default-placeholder="hoje"
        prevent-deselect
        class="mx-auto select-none"
      >
        <template #calendar-cell="{ day }">
          {{ day.day }}
          <span
            v-if="statusPorDia.has(day.toString())"
            class="absolute bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full ring-1 ring-background"
            :class="ESTILO_STATUS[statusPorDia.get(day.toString())!].ponto"
          >
            <span class="sr-only">{{ ESTILO_STATUS[statusPorDia.get(day.toString())!].rotulo }}</span>
          </span>
        </template>
      </Calendar>

      <ul class="flex justify-center gap-4 border-t px-3 py-2 text-xs text-muted-foreground">
        <li v-for="status in LEGENDA" :key="status" class="flex items-center gap-1.5">
          <span class="size-2 rounded-full" :class="ESTILO_STATUS[status].ponto" />
          {{ ESTILO_STATUS[status].rotulo }}
        </li>
      </ul>
    </div>

    <div>
      <h2 class="mb-2 text-sm font-semibold capitalize">{{ tituloDia }}</h2>

      <p v-if="lancamentosDoDia.length === 0" class="text-sm text-muted-foreground">
        Nenhum lançamento nesse dia.
      </p>

      <ul v-else class="flex flex-col gap-2">
        <ItemListaFinanceira
          v-for="lancamento in lancamentosDoDia"
          :key="lancamento.id"
          :icone="iconeCategoria(lancamento.categoriaIcone)"
          :titulo="lancamento.descricao"
          :legenda="legendaLancamento(lancamento)"
          :valor="lancamento.valor"
          :tipo="lancamento.tipo"
          :cor="lancamento.categoriaCor"
          :status="statusPagamento(lancamento, hojeIso)"
        >
          <template #acao>
            <BotaoPagamento v-if="lancamento.tipo === 'Despesa'" :transacao="lancamento" />
            <span v-else class="size-8 shrink-0" aria-hidden="true" />
          </template>
        </ItemListaFinanceira>
      </ul>
    </div>

    <MovimentacaoFormDialog v-model:open="formAberto" tipo="Despesa" :data-inicial="chaveDia" />
  </div>
</template>
