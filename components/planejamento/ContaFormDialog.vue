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
import type { Conta } from '@/api/contas.api'
import { useCriarContaMutation, useAtualizarContaMutation, useRemoverContaMutation } from '@/mixins/useContas'

const props = defineProps<{
  conta?: Conta | null
}>()

const aberto = defineModel<boolean>('open', { required: true })

const criarMutation = useCriarContaMutation()
const atualizarMutation = useAtualizarContaMutation()
const removerMutation = useRemoverContaMutation()

const nome = ref('')
const banco = ref('')
const saldo = ref('')

const modoEdicao = computed(() => !!props.conta)

const { erros, validar, resetar } = useValidacaoFormulario(() => ({
  nome: !nome.value.trim() && campoObrigatorio('Nome da conta'),
  banco: !banco.value.trim() && campoObrigatorio('Banco'),
  saldo: String(saldo.value).trim() !== '' && Number.isNaN(Number(saldo.value)) && 'Informe um saldo válido.',
}))

watch(aberto, (estaAberto) => {
  if (!estaAberto) return

  resetar()
  nome.value = props.conta?.nome ?? ''
  banco.value = props.conta?.banco ?? ''
  saldo.value = props.conta ? String(props.conta.saldo) : ''
})

async function salvar() {
  if (!validar()) return

  const dados = { nome: nome.value.trim(), banco: banco.value.trim(), saldo: Number(saldo.value) || 0 }

  try {
    if (props.conta) {
      await atualizarMutation.mutateAsync({ id: props.conta.id, dados })
      toast.success('Conta atualizada.')
    } else {
      await criarMutation.mutateAsync(dados)
      toast.success('Conta criada.')
    }

    aberto.value = false
  } catch {
    toast.error('Não foi possível salvar a conta. Tente novamente.')
  }
}

async function excluir() {
  if (!props.conta) return

  try {
    await removerMutation.mutateAsync(props.conta.id)
    toast.success('Conta excluída.')
    aberto.value = false
  } catch {
    toast.error('Não foi possível excluir a conta. Tente novamente.')
  }
}
</script>

<template>
  <Dialog v-model:open="aberto">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ modoEdicao ? 'Editar conta' : 'Nova conta' }}</DialogTitle>
      </DialogHeader>

      <form class="flex flex-col gap-4" novalidate @submit.prevent="salvar">
        <div class="flex flex-col gap-1.5">
          <Label for="conta-nome">Nome da conta *</Label>
          <Input
            id="conta-nome"
            v-model="nome"
            maxlength="100"
            placeholder="Ex: Conta principal"
            required
            :aria-invalid="!!erros.nome || undefined"
            aria-describedby="conta-nome-erro"
          />
          <FieldError id="conta-nome-erro" :mensagem="erros.nome" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="conta-banco">Banco *</Label>
          <Input
            id="conta-banco"
            v-model="banco"
            maxlength="100"
            placeholder="Ex: Banco do Brasil"
            required
            :aria-invalid="!!erros.banco || undefined"
            aria-describedby="conta-banco-erro"
          />
          <FieldError id="conta-banco-erro" :mensagem="erros.banco" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="conta-saldo">Saldo atual</Label>
          <Input
            id="conta-saldo"
            v-model="saldo"
            type="number"
            step="0.01"
            placeholder="0,00"
            :aria-invalid="!!erros.saldo || undefined"
            aria-describedby="conta-saldo-erro"
          />
          <FieldError id="conta-saldo-erro" :mensagem="erros.saldo" />
        </div>

        <DialogFooter class="flex-col sm:flex-col">
          <Button type="submit" class="w-full" :disabled="criarMutation.isPending.value || atualizarMutation.isPending.value">
            Salvar conta
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
            Excluir conta
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
