<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Filter } from '@lucide/vue'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import NavegadorMes from '@/components/transactions/NavegadorMes.vue'
import ItemListaFinanceira from '@/components/transactions/ItemListaFinanceira.vue'
import EscolherTipoMovimentacaoDialog from '@/components/transactions/EscolherTipoMovimentacaoDialog.vue'
import MovimentacaoFormDialog from '@/components/transactions/MovimentacaoFormDialog.vue'
import DetalhesMovimentacaoDialog from '@/components/transactions/DetalhesMovimentacaoDialog.vue'
import FiltrosMovimentacoesDialog from '@/components/transactions/FiltrosMovimentacoesDialog.vue'
import type { Transacao } from '@/api/transacoes.api'
import type { TipoTransacao } from '@/api/categorias.api'
import { useTransacoesQuery } from '@/mixins/useTransacoes'
import { iconeCategoria } from '@/utils/iconesCategoria'
import { formatarDataGrupo } from '@/utils/formatters'

const route = useRoute()
const router = useRouter()

const mesReferencia = ref(new Date())
const mes = computed(() => mesReferencia.value.getMonth() + 1)
const ano = computed(() => mesReferencia.value.getFullYear())

const { data: transacoes } = useTransacoesQuery(mes, ano)

const filtroTipo = ref<'Todas' | TipoTransacao>('Todas')
const filtroCategoria = ref('')
const filtroConta = ref('')
const filtroValorMinimo = ref('')
const filtroValorMaximo = ref('')
const apenasRecorrentes = ref(false)
const apenasParcelamentos = ref(false)

const filtrosAbertos = ref(false)
const escolhaAberta = ref(false)
const formAberto = ref(false)
const formTipo = ref<TipoTransacao>('Despesa')
const movimentacaoEditando = ref<Transacao | null>(null)
const detalhesAbertos = ref(false)
const movimentacaoSelecionada = ref<Transacao | null>(null)

watch(
  () => route.query.criar,
  (criar) => {
    if (!criar) return
    escolhaAberta.value = true
    router.replace({ query: {} })
  },
  { immediate: true },
)

const movimentacoesFiltradas = computed(() =>
  (transacoes.value ?? [])
    .filter((movimentacao) => {
      if (filtroTipo.value !== 'Todas' && movimentacao.tipo !== filtroTipo.value) return false
      if (filtroCategoria.value && movimentacao.categoriaNome !== filtroCategoria.value) return false
      if (filtroConta.value && movimentacao.conta !== filtroConta.value) return false
      if (filtroValorMinimo.value && movimentacao.valor < Number(filtroValorMinimo.value)) return false
      if (filtroValorMaximo.value && movimentacao.valor > Number(filtroValorMaximo.value)) return false
      if (apenasRecorrentes.value && !movimentacao.recorrente) return false
      if (apenasParcelamentos.value && movimentacao.parcelas <= 1) return false
      return true
    })
    .sort((a, b) => b.data.localeCompare(a.data)),
)

const gruposPorDia = computed(() => {
  const mapa = new Map<string, Transacao[]>()
  for (const movimentacao of movimentacoesFiltradas.value) {
    if (!mapa.has(movimentacao.data)) mapa.set(movimentacao.data, [])
    mapa.get(movimentacao.data)!.push(movimentacao)
  }
  return [...mapa.entries()].map(([data, itens]) => ({ data, itens }))
})

function abrirDetalhes(movimentacao: Transacao) {
  movimentacaoSelecionada.value = movimentacao
  detalhesAbertos.value = true
}

function aoEscolherTipo(tipo: TipoTransacao) {
  movimentacaoEditando.value = null
  formTipo.value = tipo
  formAberto.value = true
}

function aoEditar(movimentacao: Transacao) {
  detalhesAbertos.value = false
  movimentacaoEditando.value = movimentacao
  formTipo.value = movimentacao.tipo
  formAberto.value = true
}
</script>

<template>
  <div class="mx-auto max-w-lg">
    <div class="sticky top-0 z-10 flex flex-col gap-3 bg-background/95 px-4 pt-4 backdrop-blur">
      <div class="flex items-center justify-between gap-2">
        <h1 class="text-lg font-semibold">Movimentações</h1>
        <Button variant="outline" size="icon" @click="filtrosAbertos = true">
          <Filter />
          <span class="sr-only">Filtros</span>
        </Button>
      </div>

      <NavegadorMes v-model="mesReferencia" />

      <Tabs v-model="filtroTipo" class="w-full">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="Todas">Todas</TabsTrigger>
          <TabsTrigger value="Receita">Receitas</TabsTrigger>
          <TabsTrigger value="Despesa">Despesas</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>

    <div class="flex flex-col gap-5 px-4 py-4">
      <p v-if="gruposPorDia.length === 0" class="py-8 text-center text-sm text-muted-foreground">
        Nenhuma movimentação encontrada neste período.
      </p>

      <div v-for="grupo in gruposPorDia" :key="grupo.data" class="flex flex-col gap-2">
        <h2 class="text-sm font-semibold capitalize">{{ formatarDataGrupo(grupo.data) }}</h2>
        <ul class="flex flex-col gap-2">
          <ItemListaFinanceira
            v-for="movimentacao in grupo.itens"
            :key="movimentacao.id"
            class="cursor-pointer transition-colors hover:bg-muted"
            :icone="iconeCategoria(movimentacao.categoriaIcone)"
            :titulo="movimentacao.descricao"
            :legenda="movimentacao.categoriaNome"
            :valor="movimentacao.valor"
            :tipo="movimentacao.tipo"
            :cor="movimentacao.categoriaCor"
            @click="abrirDetalhes(movimentacao)"
          />
        </ul>
      </div>
    </div>

    <EscolherTipoMovimentacaoDialog v-model:open="escolhaAberta" @escolher="aoEscolherTipo" />

    <MovimentacaoFormDialog
      v-model:open="formAberto"
      :tipo="formTipo"
      :movimentacao="movimentacaoEditando"
    />

    <DetalhesMovimentacaoDialog
      v-model:open="detalhesAbertos"
      :movimentacao="movimentacaoSelecionada"
      @editar="aoEditar"
    />

    <FiltrosMovimentacoesDialog
      v-model:open="filtrosAbertos"
      v-model:tipo="filtroTipo"
      v-model:categoria="filtroCategoria"
      v-model:conta="filtroConta"
      v-model:valor-minimo="filtroValorMinimo"
      v-model:valor-maximo="filtroValorMaximo"
      v-model:apenas-recorrentes="apenasRecorrentes"
      v-model:apenas-parcelamentos="apenasParcelamentos"
    />
  </div>
</template>
