<script setup lang="ts">
import { Landmark, CreditCard } from '@lucide/vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const aberto = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  escolher: [tipo: 'conta' | 'cartao']
}>()

function escolher(tipo: 'conta' | 'cartao') {
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
          @click="escolher('conta')"
        >
          <span class="flex size-10 items-center justify-center rounded-full bg-success/15 text-success">
            <Landmark class="size-5" />
          </span>
          <div>
            <p class="text-sm font-semibold">Conta bancária</p>
            <p class="text-xs text-muted-foreground">Conta corrente, poupança ou carteira</p>
          </div>
        </button>

        <button
          type="button"
          class="flex items-center gap-3 rounded-xl border p-3 text-left transition-colors hover:bg-muted"
          @click="escolher('cartao')"
        >
          <span class="flex size-10 items-center justify-center rounded-full bg-info/15 text-info">
            <CreditCard class="size-5" />
          </span>
          <div>
            <p class="text-sm font-semibold">Cartão de crédito</p>
            <p class="text-xs text-muted-foreground">Fatura e limite</p>
          </div>
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>
