<script setup lang="ts">
import { Circle, CircleCheck } from '@lucide/vue'
import { toast } from 'vue-sonner'
import type { Transacao } from '@/api/transacoes.api'
import { useDefinirPagamentoMutation } from '@/mixins/useTransacoes'

const props = defineProps<{
  transacao: Transacao
}>()

const pagamentoMutation = useDefinirPagamentoMutation()

async function alternar() {
  const pago = !props.transacao.pago

  try {
    await pagamentoMutation.mutateAsync({ transacao: props.transacao, pago })
    toast.success(pago ? 'Despesa marcada como paga.' : 'Pagamento desmarcado.')
  } catch {
    toast.error('Não foi possível atualizar o pagamento. Tente novamente.')
  }
}
</script>

<template>
  <button
    type="button"
    class="flex size-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-muted disabled:opacity-50"
    :class="transacao.pago ? 'text-success' : 'text-muted-foreground'"
    :aria-label="transacao.pago ? `Desmarcar pagamento de ${transacao.descricao}` : `Marcar ${transacao.descricao} como paga`"
    :aria-pressed="transacao.pago"
    :disabled="pagamentoMutation.isPending.value"
    @click.stop="alternar"
  >
    <component :is="transacao.pago ? CircleCheck : Circle" class="size-5" />
  </button>
</template>
