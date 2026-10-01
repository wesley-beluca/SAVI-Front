<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FieldError } from '@/components/ui/field-error'
import { campoObrigatorio, useValidacaoFormulario } from '@/mixins/useValidacaoFormulario'
import { useOrcamentoQuery, useDefinirOrcamentoMutation } from '@/mixins/useOrcamento'

const props = defineProps<{ mes: number; ano: number }>()

const aberto = defineModel<boolean>('open', { required: true })

const mes = computed(() => props.mes)
const ano = computed(() => props.ano)

const { data: orcamento } = useOrcamentoQuery(mes, ano)
const definirMutation = useDefinirOrcamentoMutation()

const rendaPrevista = ref('')
const limitePlanejado = ref('')

function erroValorPositivo(valor: string, rotulo: string) {
  if (String(valor).trim() === '') return campoObrigatorio(rotulo)
  return !(Number(valor) > 0) && `O campo "${rotulo}" deve ser maior que zero.`
}

const { erros, validar, resetar } = useValidacaoFormulario(() => ({
  rendaPrevista: erroValorPositivo(rendaPrevista.value, 'Renda prevista'),
  limitePlanejado: erroValorPositivo(limitePlanejado.value, 'Limite planejado'),
}))

watch(aberto, (estaAberto) => {
  if (!estaAberto) return

  resetar()
  rendaPrevista.value = orcamento.value ? String(orcamento.value.rendaPrevista) : ''
  limitePlanejado.value = orcamento.value ? String(orcamento.value.limitePlanejado) : ''
})

async function salvar() {
  if (!validar()) return

  try {
    await definirMutation.mutateAsync({
      mes: props.mes,
      ano: props.ano,
      rendaPrevista: Number(rendaPrevista.value),
      limitePlanejado: Number(limitePlanejado.value),
    })
    toast.success('Orçamento atualizado.')
    aberto.value = false
  } catch {
    toast.error('Não foi possível salvar o orçamento. Tente novamente.')
  }
}
</script>

<template>
  <Dialog v-model:open="aberto">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Editar orçamento</DialogTitle>
      </DialogHeader>

      <form class="flex flex-col gap-4" novalidate @submit.prevent="salvar">
        <div class="flex flex-col gap-1.5">
          <Label for="orcamento-renda">Renda prevista *</Label>
          <Input
            id="orcamento-renda"
            v-model="rendaPrevista"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            required
            :aria-invalid="!!erros.rendaPrevista || undefined"
            aria-describedby="orcamento-renda-erro"
          />
          <FieldError id="orcamento-renda-erro" :mensagem="erros.rendaPrevista" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="orcamento-limite">Limite planejado *</Label>
          <Input
            id="orcamento-limite"
            v-model="limitePlanejado"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            required
            :aria-invalid="!!erros.limitePlanejado || undefined"
            aria-describedby="orcamento-limite-erro"
          />
          <FieldError id="orcamento-limite-erro" :mensagem="erros.limitePlanejado" />
        </div>

        <DialogFooter>
          <Button type="submit" class="w-full" :disabled="definirMutation.isPending.value">Salvar orçamento</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
