<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { Trash2 } from '@lucide/vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FieldError } from '@/components/ui/field-error'
import { campoObrigatorio, useValidacaoFormulario } from '@/mixins/useValidacaoFormulario'
import type { Cartao } from '@/api/cartoes.api'
import { useCriarCartaoMutation, useAtualizarCartaoMutation, useRemoverCartaoMutation } from '@/mixins/useCartoes'

const props = defineProps<{
  cartao?: Cartao | null
}>()

const aberto = defineModel<boolean>('open', { required: true })

const criarMutation = useCriarCartaoMutation()
const atualizarMutation = useAtualizarCartaoMutation()
const removerMutation = useRemoverCartaoMutation()

const nome = ref('')
const banco = ref('')
const faturaAtual = ref('')
const diaFechamento = ref('')
const diaVencimento = ref('')

const modoEdicao = computed(() => !!props.cartao)

function erroDia(valor: string, rotulo: string) {
  if (String(valor).trim() === '') return campoObrigatorio(rotulo)
  const dia = Number(valor)
  return (!Number.isInteger(dia) || dia < 1 || dia > 31) && `O campo "${rotulo}" deve ser um dia entre 1 e 31.`
}

const { erros, validar, resetar } = useValidacaoFormulario(() => ({
  nome: !nome.value.trim() && campoObrigatorio('Nome do cartão'),
  banco: !banco.value.trim() && campoObrigatorio('Banco / bandeira'),
  faturaAtual: String(faturaAtual.value).trim() !== '' && !(Number(faturaAtual.value) >= 0) && 'A fatura atual não pode ser negativa.',
  diaFechamento: erroDia(diaFechamento.value, 'Dia do fechamento'),
  diaVencimento: erroDia(diaVencimento.value, 'Dia do vencimento'),
}))

watch(aberto, (estaAberto) => {
  if (!estaAberto) return

  resetar()

  nome.value = props.cartao?.nome ?? ''
  banco.value = props.cartao?.banco ?? ''
  faturaAtual.value = props.cartao ? String(props.cartao.faturaAtual) : ''
  diaFechamento.value = props.cartao ? String(props.cartao.diaFechamento) : ''
  diaVencimento.value = props.cartao ? String(props.cartao.diaVencimento) : ''
})

async function salvar() {
  if (!validar()) return

  const dados = {
    nome: nome.value.trim(),
    banco: banco.value.trim(),
    faturaAtual: Number(faturaAtual.value) || 0,
    diaFechamento: Number(diaFechamento.value),
    diaVencimento: Number(diaVencimento.value),
  }

  try {
    if (props.cartao) {
      await atualizarMutation.mutateAsync({ id: props.cartao.id, dados })
      toast.success('Cartão atualizado.')
    } else {
      await criarMutation.mutateAsync(dados)
      toast.success('Cartão criado.')
    }

    aberto.value = false
  } catch {
    toast.error('Não foi possível salvar o cartão. Tente novamente.')
  }
}

async function excluir() {
  if (!props.cartao) return

  try {
    await removerMutation.mutateAsync(props.cartao.id)
    toast.success('Cartão excluído.')
    aberto.value = false
  } catch {
    toast.error('Não foi possível excluir o cartão. Tente novamente.')
  }
}
</script>

<template>
  <Dialog v-model:open="aberto">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ modoEdicao ? 'Editar cartão' : 'Novo cartão' }}</DialogTitle>
      </DialogHeader>

      <form class="flex flex-col gap-4" novalidate @submit.prevent="salvar">
        <div class="flex flex-col gap-1.5">
          <Label for="cartao-nome">Nome do cartão *</Label>
          <Input
            id="cartao-nome"
            v-model="nome"
            maxlength="100"
            placeholder="Ex: Nubank"
            required
            :aria-invalid="!!erros.nome || undefined"
            aria-describedby="cartao-nome-erro"
          />
          <FieldError id="cartao-nome-erro" :mensagem="erros.nome" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="cartao-banco">Banco / bandeira *</Label>
          <Input
            id="cartao-banco"
            v-model="banco"
            maxlength="100"
            placeholder="Ex: Nubank"
            required
            :aria-invalid="!!erros.banco || undefined"
            aria-describedby="cartao-banco-erro"
          />
          <FieldError id="cartao-banco-erro" :mensagem="erros.banco" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="cartao-fatura">Fatura atual</Label>
          <Input
            id="cartao-fatura"
            v-model="faturaAtual"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            :aria-invalid="!!erros.faturaAtual || undefined"
            aria-describedby="cartao-fatura-erro"
          />
          <FieldError id="cartao-fatura-erro" :mensagem="erros.faturaAtual" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1.5">
            <Label for="cartao-fechamento">Dia do fechamento *</Label>
            <Input
              id="cartao-fechamento"
              v-model="diaFechamento"
              type="number"
              min="1"
              max="31"
              required
              :aria-invalid="!!erros.diaFechamento || undefined"
              aria-describedby="cartao-fechamento-erro"
            />
            <FieldError id="cartao-fechamento-erro" :mensagem="erros.diaFechamento" />
          </div>
          <div class="flex flex-col gap-1.5">
            <Label for="cartao-vencimento">Dia do vencimento *</Label>
            <Input
              id="cartao-vencimento"
              v-model="diaVencimento"
              type="number"
              min="1"
              max="31"
              required
              :aria-invalid="!!erros.diaVencimento || undefined"
              aria-describedby="cartao-vencimento-erro"
            />
            <FieldError id="cartao-vencimento-erro" :mensagem="erros.diaVencimento" />
          </div>
        </div>

        <DialogFooter class="flex-col sm:flex-col">
          <Button type="submit" class="w-full" :disabled="criarMutation.isPending.value || atualizarMutation.isPending.value">
            Salvar cartão
          </Button>
          <Button
            v-if="modoEdicao"
            type="button"
            variant="destructive"
            class="w-full"
            :disabled="removerMutation.isPending.value"
            @click="excluir"
          >
            <Trash2 />
            Excluir cartão
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
