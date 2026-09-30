<script setup lang="ts">
import { ArrowDownRight, ArrowUpRight, ArrowLeftRight } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { TipoTransacao } from '@/api/categorias.api'

const aberto = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  escolher: [tipo: TipoTransacao]
}>()

function escolher(tipo: TipoTransacao) {
  aberto.value = false
  emit('escolher', tipo)
}
</script>

<template>
  <Dialog v-model:open="aberto">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>O que você quer adicionar?</DialogTitle>
      </DialogHeader>

      <div class="flex flex-col gap-2">
        <button
          type="button"
          class="flex items-center gap-3 rounded-xl border p-3 text-left transition-colors hover:bg-muted"
          @click="escolher('Despesa')"
        >
          <span class="flex size-10 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <ArrowDownRight class="size-5" />
          </span>
          <div>
            <p class="text-sm font-semibold">Despesa</p>
            <p class="text-xs text-muted-foreground">Registrar uma saída</p>
          </div>
        </button>

        <button
          type="button"
          class="flex items-center gap-3 rounded-xl border p-3 text-left transition-colors hover:bg-muted"
          @click="escolher('Receita')"
        >
          <span class="flex size-10 items-center justify-center rounded-full bg-success/15 text-success">
            <ArrowUpRight class="size-5" />
          </span>
          <div>
            <p class="text-sm font-semibold">Receita</p>
            <p class="text-xs text-muted-foreground">Registrar uma entrada</p>
          </div>
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>
