<script setup lang="ts">
import type { Component } from 'vue'
import { formatarMoeda } from '@/utils/formatters'

const props = defineProps<{
  icone: Component
  titulo: string
  legenda?: string
  legendaDestaque?: boolean
  valor: number
  tipo?: 'Receita' | 'Despesa'
  cor?: string
}>()
</script>

<template>
  <li class="flex items-center gap-3 rounded-xl border p-3">
    <span
      class="flex size-9 items-center justify-center rounded-full"
      :class="!cor && 'bg-muted text-muted-foreground'"
      :style="cor ? { backgroundColor: `${cor}1A`, color: cor } : undefined"
    >
      <component :is="icone" class="size-4" />
    </span>
    <div class="flex-1">
      <p class="text-sm font-medium">{{ titulo }}</p>
      <p v-if="legenda" class="text-xs" :class="legendaDestaque ? 'font-medium text-destructive' : 'text-muted-foreground'">
        {{ legenda }}
      </p>
    </div>
    <p
      class="text-sm font-semibold"
      :class="{ 'text-success': props.tipo === 'Receita', 'text-destructive': props.tipo === 'Despesa' }"
    >
      <template v-if="props.tipo === 'Receita'">+</template>
      <template v-else-if="props.tipo === 'Despesa'">-</template>
      {{ formatarMoeda(valor) }}
    </p>
  </li>
</template>
