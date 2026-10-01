<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useMetasQuery } from '@/mixins/useMetas'
import type { Meta } from '@/api/metas.api'
import { iconeMeta } from '@/utils/iconesMeta'
import { formatarMoeda } from '@/utils/formatters'
import MetaFormDialog from './MetaFormDialog.vue'

const { data: metas } = useMetasQuery()

const formAberto = ref(false)
const metaSelecionada = ref<Meta | null>(null)

function abrirNova() {
  metaSelecionada.value = null
  formAberto.value = true
}

function abrirEdicao(meta: Meta) {
  metaSelecionada.value = meta
  formAberto.value = true
}

function percentual(meta: Meta) {
  return Math.min(100, Math.round((meta.valorAtual / meta.valorAlvo) * 100))
}
</script>

<template>
  <div class="mx-auto flex max-w-lg flex-col gap-4 px-4 py-4">
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-semibold">Minhas metas</h1>
      <Button size="sm" @click="abrirNova">
        <Plus />
        Nova meta
      </Button>
    </div>

    <p v-if="(metas ?? []).length === 0" class="py-8 text-center text-sm text-muted-foreground">
      Nenhuma meta cadastrada ainda.
    </p>

    <ul class="flex flex-col gap-3">
      <li
        v-for="meta in metas"
        :key="meta.id"
        class="cursor-pointer rounded-xl border p-3 transition-colors hover:bg-muted"
        @click="abrirEdicao(meta)"
      >
        <div class="flex items-center gap-3">
          <span
            class="flex size-9 shrink-0 items-center justify-center rounded-full"
            :style="{ backgroundColor: `${meta.cor}1A`, color: meta.cor }"
          >
            <component :is="iconeMeta(meta.icone)" class="size-4" />
          </span>
          <div class="flex-1">
            <p class="text-sm font-medium">{{ meta.nome }}</p>
            <p class="text-xs text-muted-foreground">
              {{ formatarMoeda(meta.valorAtual) }} / {{ formatarMoeda(meta.valorAlvo) }}
            </p>
          </div>
          <span class="text-sm font-semibold">{{ percentual(meta) }}%</span>
        </div>

        <Progress :model-value="percentual(meta)" class="mt-3" />
      </li>
    </ul>

    <MetaFormDialog v-model:open="formAberto" :meta="metaSelecionada" />
  </div>
</template>
