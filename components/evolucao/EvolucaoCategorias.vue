<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronRight } from '@lucide/vue'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { TipoTransacao } from '@/api/categorias.api'
import { iconeCategoria } from '@/utils/iconesCategoria'
import { formatarMoeda } from '@/utils/formatters'
import { agruparPorCategoria } from '@/utils/agruparPorCategoria'
import { useTransacoesQuery } from '@/mixins/useTransacoes'

const hoje = new Date()
const { data: transacoes } = useTransacoesQuery(hoje.getMonth() + 1, hoje.getFullYear())

const tipo = ref<TipoTransacao>('Despesa')

const categorias = computed(() => agruparPorCategoria(transacoes.value ?? [], tipo.value))
</script>

<template>
  <div class="mx-auto flex max-w-lg flex-col gap-4 px-4 py-4">
    <Tabs v-model="tipo">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="Despesa">Despesas</TabsTrigger>
        <TabsTrigger value="Receita">Receitas</TabsTrigger>
      </TabsList>
    </Tabs>

    <p v-if="categorias.length === 0" class="py-8 text-center text-sm text-muted-foreground">
      Nenhum lançamento neste mês.
    </p>

    <ul v-else class="flex flex-col gap-2">
      <li
        v-for="categoria in categorias"
        :key="categoria.categoriaId"
        class="flex items-center gap-3 rounded-xl border p-3"
      >
        <span
          class="flex size-9 shrink-0 items-center justify-center rounded-full"
          :style="{ backgroundColor: `${categoria.cor}1A`, color: categoria.cor }"
        >
          <component :is="iconeCategoria(categoria.icone)" class="size-4" />
        </span>
        <div class="flex-1">
          <p class="text-sm font-medium">{{ categoria.nome }}</p>
          <p class="text-xs text-muted-foreground">{{ formatarMoeda(categoria.valor) }}</p>
        </div>
        <span class="text-sm font-semibold text-muted-foreground">{{ categoria.percentual }}%</span>
        <ChevronRight class="size-4 text-muted-foreground" />
      </li>
    </ul>
  </div>
</template>
