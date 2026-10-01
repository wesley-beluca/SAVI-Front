<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { formatarMesAno } from '@/utils/formatters'

const data = defineModel<Date>({ required: true })

function mudarMes(delta: number) {
  const nova = new Date(data.value)
  nova.setMonth(nova.getMonth() + delta)
  data.value = nova
}
</script>

<template>
  <div class="flex items-center justify-center gap-3 text-sm font-medium">
    <button type="button" class="text-muted-foreground hover:text-foreground" @click="mudarMes(-1)">
      <ChevronLeft class="size-4" />
    </button>
    {{ formatarMesAno(data) }}
    <button type="button" class="text-muted-foreground hover:text-foreground" @click="mudarMes(1)">
      <ChevronRight class="size-4" />
    </button>
  </div>
</template>
