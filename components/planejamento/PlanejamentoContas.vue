<script setup lang="ts">
import { ref } from 'vue'
import { Plus, ChevronRight, Landmark, CreditCard } from '@lucide/vue'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useContasQuery } from '@/mixins/useContas'
import { useCartoesQuery } from '@/mixins/useCartoes'
import type { Conta } from '@/api/contas.api'
import type { Cartao } from '@/api/cartoes.api'
import { corPorIndice } from '@/utils/coresPreset'
import { formatarMoeda } from '@/utils/formatters'
import EscolherTipoContaDialog from './EscolherTipoContaDialog.vue'
import ContaFormDialog from './ContaFormDialog.vue'
import CartaoFormDialog from './CartaoFormDialog.vue'

const subaba = ref<'contas' | 'cartoes'>('contas')

const { data: contas } = useContasQuery()
const { data: cartoes } = useCartoesQuery()

const escolhaAberta = ref(false)
const contaFormAberto = ref(false)
const cartaoFormAberto = ref(false)
const contaSelecionada = ref<Conta | null>(null)
const cartaoSelecionado = ref<Cartao | null>(null)

function aoEscolherTipo(tipo: 'conta' | 'cartao') {
  if (tipo === 'conta') {
    contaSelecionada.value = null
    contaFormAberto.value = true
  } else {
    cartaoSelecionado.value = null
    cartaoFormAberto.value = true
  }
}

function abrirNovoCartao() {
  cartaoSelecionado.value = null
  cartaoFormAberto.value = true
}

function editarConta(conta: Conta) {
  contaSelecionada.value = conta
  contaFormAberto.value = true
}

function editarCartao(cartao: Cartao) {
  cartaoSelecionado.value = cartao
  cartaoFormAberto.value = true
}
</script>

<template>
  <div class="mx-auto flex max-w-lg flex-col gap-4 px-4 py-4">
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-semibold">{{ subaba === 'contas' ? 'Minhas contas' : 'Cartões de crédito' }}</h1>
      <Button v-if="subaba === 'cartoes'" size="sm" @click="abrirNovoCartao">
        <Plus />
        Novo cartão
      </Button>
    </div>

    <Tabs v-model="subaba">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="contas">Contas</TabsTrigger>
        <TabsTrigger value="cartoes">Cartões</TabsTrigger>
      </TabsList>
    </Tabs>

    <template v-if="subaba === 'contas'">
      <p v-if="(contas ?? []).length === 0" class="py-8 text-center text-sm text-muted-foreground">
        Nenhuma conta cadastrada ainda.
      </p>

      <ul class="flex flex-col gap-2">
        <li
          v-for="(conta, indice) in contas"
          :key="conta.id"
          class="flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted"
          @click="editarConta(conta)"
        >
          <span
            class="flex size-9 shrink-0 items-center justify-center rounded-full"
            :style="{ backgroundColor: `${corPorIndice(indice)}1A`, color: corPorIndice(indice) }"
          >
            <Landmark class="size-4" />
          </span>
          <div class="flex-1">
            <p class="text-sm font-medium">{{ conta.nome }}</p>
            <p class="text-xs text-muted-foreground">{{ conta.banco }}</p>
          </div>
          <p class="text-sm font-semibold">{{ formatarMoeda(conta.saldo) }}</p>
          <ChevronRight class="size-4 text-muted-foreground" />
        </li>
      </ul>

      <button
        type="button"
        class="flex items-center justify-center gap-2 rounded-xl border border-dashed p-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        @click="escolhaAberta = true"
      >
        <Plus class="size-4" />
        Adicionar conta ou cartão
      </button>
    </template>

    <template v-else>
      <p v-if="(cartoes ?? []).length === 0" class="py-8 text-center text-sm text-muted-foreground">
        Nenhum cartão cadastrado ainda.
      </p>

      <ul class="flex flex-col gap-2">
        <li
          v-for="(cartao, indice) in cartoes"
          :key="cartao.id"
          class="flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted"
          @click="editarCartao(cartao)"
        >
          <span
            class="flex size-9 shrink-0 items-center justify-center rounded-full"
            :style="{ backgroundColor: `${corPorIndice(indice)}1A`, color: corPorIndice(indice) }"
          >
            <CreditCard class="size-4" />
          </span>
          <div class="flex-1">
            <p class="text-sm font-medium">{{ cartao.nome }}</p>
            <p class="text-xs text-muted-foreground">
              Fecha dia {{ cartao.diaFechamento }} · Vence dia {{ cartao.diaVencimento }}
            </p>
          </div>
          <p class="text-sm font-semibold">{{ formatarMoeda(cartao.faturaAtual) }}</p>
          <ChevronRight class="size-4 text-muted-foreground" />
        </li>
      </ul>
    </template>

    <EscolherTipoContaDialog v-model:open="escolhaAberta" @escolher="aoEscolherTipo" />
    <ContaFormDialog v-model:open="contaFormAberto" :conta="contaSelecionada" />
    <CartaoFormDialog v-model:open="cartaoFormAberto" :cartao="cartaoSelecionado" />
  </div>
</template>
