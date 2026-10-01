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
import type { Meta } from '@/api/metas.api'
import { useCriarMetaMutation, useAtualizarMetaMutation, useRemoverMetaMutation } from '@/mixins/useMetas'
import { ESTILOS_META, iconeMeta } from '@/utils/iconesMeta'

const props = defineProps<{
  meta?: Meta | null
}>()

const aberto = defineModel<boolean>('open', { required: true })

const criarMutation = useCriarMetaMutation()
const atualizarMutation = useAtualizarMetaMutation()
const removerMutation = useRemoverMetaMutation()

const nome = ref('')
const valorAtual = ref('')
const valorAlvo = ref('')
const estiloSelecionado = ref(ESTILOS_META[0]!)

const modoEdicao = computed(() => !!props.meta)

const { erros, validar, resetar } = useValidacaoFormulario(() => ({
  icone: !estiloSelecionado.value?.icone && campoObrigatorio('Ícone'),
  nome: !nome.value.trim() && campoObrigatorio('Nome da meta'),
  valorAtual: String(valorAtual.value).trim() !== '' && !(Number(valorAtual.value) >= 0) && 'O valor atual não pode ser negativo.',
  valorAlvo:
    String(valorAlvo.value).trim() === ''
      ? campoObrigatorio('Valor alvo')
      : !(Number(valorAlvo.value) > 0) && 'O valor alvo deve ser maior que zero.',
}))

watch(aberto, (estaAberto) => {
  if (!estaAberto) return

  resetar()

  nome.value = props.meta?.nome ?? ''
  valorAtual.value = props.meta ? String(props.meta.valorAtual) : ''
  valorAlvo.value = props.meta ? String(props.meta.valorAlvo) : ''
  estiloSelecionado.value = props.meta
    ? (ESTILOS_META.find((estilo) => estilo.icone === props.meta?.icone) ?? ESTILOS_META[0]!)
    : ESTILOS_META[0]!
})

async function salvar() {
  if (!validar()) return

  const dados = {
    nome: nome.value.trim(),
    icone: estiloSelecionado.value.icone,
    cor: estiloSelecionado.value.cor,
    valorAtual: Number(valorAtual.value) || 0,
    valorAlvo: Number(valorAlvo.value),
  }

  try {
    if (props.meta) {
      await atualizarMutation.mutateAsync({ id: props.meta.id, dados })
      toast.success('Meta atualizada.')
    } else {
      await criarMutation.mutateAsync(dados)
      toast.success('Meta criada.')
    }

    aberto.value = false
  } catch {
    toast.error('Não foi possível salvar a meta. Tente novamente.')
  }
}

async function excluir() {
  if (!props.meta) return

  try {
    await removerMutation.mutateAsync(props.meta.id)
    toast.success('Meta excluída.')
    aberto.value = false
  } catch {
    toast.error('Não foi possível excluir a meta. Tente novamente.')
  }
}
</script>

<template>
  <Dialog v-model:open="aberto">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ modoEdicao ? 'Editar meta' : 'Nova meta' }}</DialogTitle>
      </DialogHeader>

      <form class="flex flex-col gap-4" novalidate @submit.prevent="salvar">
        <div class="flex flex-col gap-1.5">
          <Label>Ícone *</Label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="estilo in ESTILOS_META"
              :key="estilo.icone"
              type="button"
              class="flex size-10 items-center justify-center rounded-full border-2 transition-colors"
              :class="estiloSelecionado.icone === estilo.icone ? 'border-foreground' : 'border-transparent'"
              :style="{ backgroundColor: `${estilo.cor}1A`, color: estilo.cor }"
              @click="estiloSelecionado = estilo"
            >
              <component :is="iconeMeta(estilo.icone)" class="size-4" />
            </button>
          </div>
          <FieldError :mensagem="erros.icone" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="meta-nome">Nome da meta *</Label>
          <Input
            id="meta-nome"
            v-model="nome"
            maxlength="100"
            placeholder="Ex: Comprar um carro"
            required
            :aria-invalid="!!erros.nome || undefined"
            aria-describedby="meta-nome-erro"
          />
          <FieldError id="meta-nome-erro" :mensagem="erros.nome" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1.5">
            <Label for="meta-atual">Valor atual</Label>
            <Input
              id="meta-atual"
              v-model="valorAtual"
              type="number"
              min="0"
              step="0.01"
              placeholder="0,00"
              :aria-invalid="!!erros.valorAtual || undefined"
              aria-describedby="meta-atual-erro"
            />
            <FieldError id="meta-atual-erro" :mensagem="erros.valorAtual" />
          </div>
          <div class="flex flex-col gap-1.5">
            <Label for="meta-alvo">Valor alvo *</Label>
            <Input
              id="meta-alvo"
              v-model="valorAlvo"
              type="number"
              min="0"
              step="0.01"
              placeholder="0,00"
              required
              :aria-invalid="!!erros.valorAlvo || undefined"
              aria-describedby="meta-alvo-erro"
            />
            <FieldError id="meta-alvo-erro" :mensagem="erros.valorAlvo" />
          </div>
        </div>

        <DialogFooter class="flex-col sm:flex-col">
          <Button type="submit" class="w-full" :disabled="criarMutation.isPending.value || atualizarMutation.isPending.value">
            Salvar meta
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
            Excluir meta
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
