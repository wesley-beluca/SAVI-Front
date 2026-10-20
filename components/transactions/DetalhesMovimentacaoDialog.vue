<script setup lang="ts">
import { computed } from 'vue'
import { CircleCheck, Pencil, Trash2, Undo2 } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Transacao } from '@/api/transacoes.api'
import { useDefinirPagamentoMutation, useRemoverTransacaoMutation } from '@/mixins/useTransacoes'
import { iconeCategoria } from '@/utils/iconesCategoria'
import { formatarMoeda, formatarDataCompleta, dataIsoLocal } from '@/utils/formatters'
import { ESTILO_STATUS, statusPagamento } from '@/utils/statusPagamento'

const props = defineProps<{
  movimentacao: Transacao | null
}>()

const aberto = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  editar: [movimentacao: Transacao]
}>()

const removerMutation = useRemoverTransacaoMutation()
const pagamentoMutation = useDefinirPagamentoMutation()

const status = computed(() => (props.movimentacao ? statusPagamento(props.movimentacao) : null))

const rotuloStatus = computed(() => {
  const pagoEm = props.movimentacao?.pagoEm
  if (status.value === 'paga' && pagoEm) return `Paga em ${formatarDataCompleta(dataIsoLocal(new Date(pagoEm)))}`
  return status.value ? ESTILO_STATUS[status.value].rotulo : ''
})

async function alternarPagamento() {
  if (!props.movimentacao) return

  const pago = !props.movimentacao.pago

  try {
    await pagamentoMutation.mutateAsync({ transacao: props.movimentacao, pago })
    toast.success(pago ? 'Despesa marcada como paga.' : 'Pagamento desmarcado.')
    aberto.value = false
  } catch {
    toast.error('Não foi possível atualizar o pagamento. Tente novamente.')
  }
}

function editar() {
  if (props.movimentacao) emit('editar', props.movimentacao)
}

async function excluir() {
  if (!props.movimentacao) return

  try {
    await removerMutation.mutateAsync(props.movimentacao.id)
    toast.success('Movimentação excluída.')
    aberto.value = false
  } catch {
    toast.error('Não foi possível excluir a movimentação. Tente novamente.')
  }
}
</script>

<template>
  <Dialog v-model:open="aberto">
    <DialogContent v-if="movimentacao" class="sm:max-w-md">
      <div class="flex flex-col items-center gap-2 pt-2 text-center">
        <span
          class="flex size-14 items-center justify-center rounded-full"
          :style="{ backgroundColor: `${movimentacao.categoriaCor}1A`, color: movimentacao.categoriaCor }"
        >
          <component :is="iconeCategoria(movimentacao.categoriaIcone)" class="size-6" />
        </span>
        <p class="text-base font-semibold">{{ movimentacao.descricao }}</p>
        <p
          class="text-2xl font-bold"
          :class="movimentacao.tipo === 'Receita' ? 'text-success' : 'text-destructive'"
        >
          {{ movimentacao.tipo === 'Receita' ? '+' : '-' }}{{ formatarMoeda(movimentacao.valor) }}
        </p>
      </div>

      <dl class="flex flex-col divide-y rounded-xl border text-sm">
        <div class="flex items-center justify-between px-3 py-2.5">
          <dt class="text-muted-foreground">Categoria</dt>
          <dd class="font-medium">{{ movimentacao.categoriaNome }}</dd>
        </div>
        <div class="flex items-center justify-between px-3 py-2.5">
          <dt class="text-muted-foreground">Data</dt>
          <dd class="font-medium">{{ formatarDataCompleta(movimentacao.data) }}</dd>
        </div>
        <div v-if="status" class="flex items-center justify-between px-3 py-2.5">
          <dt class="text-muted-foreground">Situação</dt>
          <dd class="font-medium" :class="ESTILO_STATUS[status].texto">{{ rotuloStatus }}</dd>
        </div>
        <div class="flex items-center justify-between px-3 py-2.5">
          <dt class="text-muted-foreground">Conta</dt>
          <dd class="font-medium">{{ movimentacao.conta }}</dd>
        </div>
        <div class="flex items-center justify-between px-3 py-2.5">
          <dt class="text-muted-foreground">Parcelas</dt>
          <dd class="font-medium">{{ movimentacao.parcelas > 1 ? `${movimentacao.parcelas}x` : '1x (à vista)' }}</dd>
        </div>
        <div class="flex items-center justify-between px-3 py-2.5">
          <dt class="text-muted-foreground">Recorrente</dt>
          <dd class="font-medium">{{
            movimentacao.mesesRecorrencia > 1
              ? `Sim (${movimentacao.ocorrencia} de ${movimentacao.mesesRecorrencia} meses)`
              : movimentacao.recorrente ? 'Sim' : 'Não'
          }}</dd>
        </div>
      </dl>

      <Button
        v-if="status"
        :variant="movimentacao.pago ? 'outline' : 'default'"
        class="w-full"
        :disabled="pagamentoMutation.isPending.value"
        @click="alternarPagamento"
      >
        <component :is="movimentacao.pago ? Undo2 : CircleCheck" />
        {{ movimentacao.pago ? 'Desmarcar pagamento' : 'Marcar como paga' }}
      </Button>

      <div class="flex gap-2">
        <Button variant="outline" class="flex-1" @click="editar">
          <Pencil />
          Editar
        </Button>
        <Button variant="destructive" class="flex-1" :disabled="removerMutation.isPending.value" @click="excluir">
          <Trash2 />
          Excluir
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
