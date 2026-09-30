<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft, ChevronRight, Plus } from '@lucide/vue'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCategoriasQuery } from '@/mixins/useCategorias'
import type { Categoria, TipoTransacao } from '@/api/categorias.api'
import { iconeCategoria } from '@/utils/iconesCategoria'
import CategoriaFormDialog from '@/components/categorias/CategoriaFormDialog.vue'

const tipo = ref<TipoTransacao>('Despesa')

const { data: categorias, isPending } = useCategoriasQuery()

const categoriasDoTipo = computed(() => (categorias.value ?? []).filter((categoria) => categoria.tipo === tipo.value))

const formAberto = ref(false)
const categoriaSelecionada = ref<Categoria | null>(null)

function novaCategoria() {
  categoriaSelecionada.value = null
  formAberto.value = true
}

// Categorias padrão são compartilhadas entre usuários e não podem ser alteradas.
function editarCategoria(categoria: Categoria) {
  if (!categoria.customizada) return

  categoriaSelecionada.value = categoria
  formAberto.value = true
}
</script>

<template>
  <div class="mx-auto flex max-w-lg flex-col gap-4 px-4 py-4">
    <div class="flex items-center gap-2">
      <Button as-child variant="ghost" size="icon" aria-label="Voltar para o perfil">
        <RouterLink :to="{ name: 'perfil' }">
          <ArrowLeft />
        </RouterLink>
      </Button>
      <h1 class="flex-1 text-lg font-semibold">Categorias</h1>
      <Button size="sm" @click="novaCategoria">
        <Plus />
        Nova categoria
      </Button>
    </div>

    <Tabs v-model="tipo">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="Despesa">Despesas</TabsTrigger>
        <TabsTrigger value="Receita">Receitas</TabsTrigger>
      </TabsList>
    </Tabs>

    <p v-if="!isPending && categoriasDoTipo.length === 0" class="py-8 text-center text-sm text-muted-foreground">
      Nenhuma categoria de {{ tipo === 'Despesa' ? 'despesa' : 'receita' }} cadastrada ainda.
    </p>

    <ul class="flex flex-col gap-2">
      <li
        v-for="categoria in categoriasDoTipo"
        :key="categoria.id"
        class="flex items-center gap-3 rounded-xl border p-3"
        :class="{ 'cursor-pointer transition-colors hover:bg-muted': categoria.customizada }"
        @click="editarCategoria(categoria)"
      >
        <span
          class="flex size-9 shrink-0 items-center justify-center rounded-full"
          :style="{ backgroundColor: `${categoria.cor}1A`, color: categoria.cor }"
        >
          <component :is="iconeCategoria(categoria.icone)" class="size-4" />
        </span>
        <p class="flex-1 text-sm font-medium">{{ categoria.nome }}</p>
        <Badge v-if="!categoria.customizada" variant="secondary">Padrão</Badge>
        <ChevronRight v-else class="size-4 text-muted-foreground" />
      </li>
    </ul>

    <CategoriaFormDialog v-model:open="formAberto" :tipo="tipo" :categoria="categoriaSelecionada" />
  </div>
</template>
