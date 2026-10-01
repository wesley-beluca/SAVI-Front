<script setup lang="ts">
import { computed, ref } from 'vue'
import { getLocalTimeZone, today } from '@internationalized/date'
import { Calendar } from '@/components/ui/calendar'
import ItemListaFinanceira from '@/components/transactions/ItemListaFinanceira.vue'
import MovimentacaoFormDialog from '@/components/transactions/MovimentacaoFormDialog.vue'
import { useTransacoesQuery } from '@/mixins/useTransacoes'
import { iconeCategoria } from '@/utils/iconesCategoria'
import type { Transacao } from '@/api/transacoes.api'

// Tipado como `any`: o `DateValue` do reka-ui usa campos privados que fazem o TS
// tratar CalendarDate como nominalmente incompatível com a union em tempo de tipo.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const diaSelecionado = ref<any>(today(getLocalTimeZone()))

const mes = computed(() => diaSelecionado.value.month as number)
const ano = computed(() => diaSelecionado.value.year as number)

const { data: transacoes } = useTransacoesQuery(mes, ano)

const chaveDia = computed(() => diaSelecionado.value.toString())
const lancamentosDoDia = computed(() =>
  (transacoes.value ?? []).filter((transacao) => transacao.data === chaveDia.value),
)

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
        locale="pt-BR"
        :default-placeholder="hoje"
        prevent-deselect
        class="mx-auto select-none"
      />
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
        />
      </ul>
    </div>

    <MovimentacaoFormDialog v-model:open="formAberto" tipo="Despesa" :data-inicial="chaveDia" />
  </div>
</template>
