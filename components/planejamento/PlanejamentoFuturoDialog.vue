<script setup lang="ts">
import { Check } from '@lucide/vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const aberto = defineModel<boolean>('open', { required: true })
const mes = defineModel<number>('mes', { required: true })
const ano = defineModel<number>('ano', { required: true })

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function selecionar(indice: number) {
  mes.value = indice + 1
  aberto.value = false
}
</script>

<template>
  <Dialog v-model:open="aberto">
    <DialogContent class="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle>Selecione o mês</DialogTitle>
      </DialogHeader>

      <p class="text-sm font-semibold text-muted-foreground">{{ ano }}</p>

      <ul class="flex max-h-80 flex-col gap-1 overflow-y-auto">
        <li v-for="(nomeMes, indice) in MESES" :key="nomeMes">
          <button
            type="button"
            class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
            :class="mes === indice + 1 && 'bg-primary/10 font-medium text-primary'"
            @click="selecionar(indice)"
          >
            {{ nomeMes }}
            <Check v-if="mes === indice + 1" class="size-4" />
          </button>
        </li>
      </ul>
    </DialogContent>
  </Dialog>
</template>
