<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Switch } from '@/components/ui/switch'
import { FieldError } from '@/components/ui/field-error'
import { useCategoriasQuery } from '@/mixins/useCategorias'
import { campoObrigatorio, useValidacaoFormulario } from '@/mixins/useValidacaoFormulario'
import { useCriarTransacaoMutation, useAtualizarTransacaoMutation } from '@/mixins/useTransacoes'
import { useContasQuery } from '@/mixins/useContas'
import { useCartoesQuery } from '@/mixins/useCartoes'
import type { Transacao } from '@/api/transacoes.api'
import type { TipoTransacao } from '@/api/categorias.api'

const props = defineProps<{
  tipo: TipoTransacao
  movimentacao?: Transacao | null
  /** Data (YYYY-MM-DD) pré-preenchida ao criar uma nova movimentação. */
  dataInicial?: string
}>()

const aberto = defineModel<boolean>('open', { required: true })

const { data: categorias } = useCategoriasQuery()
const { data: contas } = useContasQuery()
const { data: cartoes } = useCartoesQuery()

const criarMutation = useCriarTransacaoMutation()
const atualizarMutation = useAtualizarTransacaoMutation()

const contasDisponiveis = computed(() => [
  ...(contas.value ?? []).map((conta) => conta.nome),
  ...(cartoes.value ?? []).map((cartao) => `${cartao.nome} (Crédito)`),
])

const tipo = ref<TipoTransacao>(props.tipo)
const valor = ref('')
const categoriaId = ref('')
const conta = ref('')
const data = ref(hojeIso())
const descricao = ref('')
const recorrente = ref(false)
const mesesRecorrencia = ref('2')

const MAXIMO_MESES_RECORRENCIA = 120

const categoriasDoTipo = computed(() => (categorias.value ?? []).filter((categoria) => categoria.tipo === tipo.value))

const modoEdicao = computed(() => !!props.movimentacao)
const salvando = computed(() => criarMutation.isPending.value || atualizarMutation.isPending.value)

const { erros, validar, resetar } = useValidacaoFormulario(() => {
  const valorNumerico = Number(valor.value)
  const meses = Number(mesesRecorrencia.value)

  return {
    valor: String(valor.value).trim() === '' ? campoObrigatorio('Valor') : !(valorNumerico > 0) && 'O valor deve ser maior que zero.',
    categoria: !categoriasDoTipo.value.some((categoria) => categoria.id === categoriaId.value) && campoObrigatorio('Categoria'),
    conta: !conta.value && campoObrigatorio('Conta / Cartão'),
    data: !data.value && campoObrigatorio('Data'),
    descricao: !descricao.value.trim() && campoObrigatorio('Descrição'),
    mesesRecorrencia:
      recorrente.value &&
      (String(mesesRecorrencia.value).trim() === ''
        ? campoObrigatorio('Repetir por quantos meses?')
        : (!Number.isInteger(meses) || meses < 2 || meses > MAXIMO_MESES_RECORRENCIA) &&
          `A recorrência deve ser entre 2 e ${MAXIMO_MESES_RECORRENCIA} meses.`),
  }
})

function hojeIso(): string {
  return new Date().toISOString().slice(0, 10)
}

watch(aberto, (estaAberto) => {
  if (!estaAberto) return

  resetar()

  tipo.value = props.movimentacao?.tipo ?? props.tipo
  valor.value = props.movimentacao ? String(props.movimentacao.valor) : ''
  conta.value = props.movimentacao?.conta ?? ''
  data.value = props.movimentacao?.dataInicio ?? props.dataInicial ?? hojeIso()
  descricao.value = props.movimentacao?.descricao ?? ''
  recorrente.value = props.movimentacao?.recorrente ?? false
  mesesRecorrencia.value = String(Math.max(props.movimentacao?.mesesRecorrencia ?? 2, 2))
  categoriaId.value = props.movimentacao?.categoriaId ?? ''
})

async function salvar() {
  if (!validar()) return

  const dados = {
    tipo: tipo.value,
    descricao: descricao.value.trim(),
    valor: Number(valor.value),
    data: data.value,
    categoriaId: categoriaId.value,
    conta: conta.value,
    parcelas: props.movimentacao?.parcelas ?? 1,
    recorrente: recorrente.value,
    mesesRecorrencia: recorrente.value ? Number(mesesRecorrencia.value) : 1,
  }

  try {
    if (props.movimentacao) {
      await atualizarMutation.mutateAsync({ id: props.movimentacao.id, dados })
      toast.success('Movimentação atualizada.')
    } else {
      await criarMutation.mutateAsync(dados)
      toast.success(tipo.value === 'Despesa' ? 'Despesa salva.' : 'Receita salva.')
    }

    aberto.value = false
  } catch {
    toast.error('Não foi possível salvar a movimentação. Tente novamente.')
  }
}
</script>

<template>
  <Dialog v-model:open="aberto">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ modoEdicao ? 'Editar movimentação' : tipo === 'Despesa' ? 'Nova despesa' : 'Nova receita' }}</DialogTitle>
      </DialogHeader>

      <form class="flex flex-col gap-4" novalidate @submit.prevent="salvar">
        <Tabs v-model="tipo" class="w-full">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="Despesa">Despesa</TabsTrigger>
            <TabsTrigger value="Receita">Receita</TabsTrigger>
          </TabsList>
        </Tabs>

        <div class="flex flex-col gap-1.5">
          <Label for="valor">Valor *</Label>
          <Input
            id="valor"
            v-model="valor"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            required
            :aria-invalid="!!erros.valor || undefined"
            aria-describedby="valor-erro"
          />
          <FieldError id="valor-erro" :mensagem="erros.valor" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="categoria">Categoria *</Label>
          <NativeSelect
            id="categoria"
            v-model="categoriaId"
            class="w-full"
            required
            :aria-invalid="!!erros.categoria || undefined"
            aria-describedby="categoria-erro"
          >
            <NativeSelectOption value="" disabled>Selecionar categoria</NativeSelectOption>
            <NativeSelectOption v-for="categoria in categoriasDoTipo" :key="categoria.id" :value="categoria.id">
              {{ categoria.nome }}
            </NativeSelectOption>
          </NativeSelect>
          <FieldError id="categoria-erro" :mensagem="erros.categoria" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="conta">Conta / Cartão *</Label>
          <NativeSelect
            id="conta"
            v-model="conta"
            class="w-full"
            required
            :aria-invalid="!!erros.conta || undefined"
            aria-describedby="conta-erro"
          >
            <NativeSelectOption value="" disabled>Selecionar conta</NativeSelectOption>
            <NativeSelectOption v-for="opcaoConta in contasDisponiveis" :key="opcaoConta" :value="opcaoConta">
              {{ opcaoConta }}
            </NativeSelectOption>
          </NativeSelect>
          <FieldError id="conta-erro" :mensagem="erros.conta" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="data">Data *</Label>
          <Input
            id="data"
            v-model="data"
            type="date"
            required
            :aria-invalid="!!erros.data || undefined"
            aria-describedby="data-erro"
          />
          <FieldError id="data-erro" :mensagem="erros.data" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="descricao">Descrição *</Label>
          <Input
            id="descricao"
            v-model="descricao"
            maxlength="200"
            :placeholder="tipo === 'Despesa' ? 'Ex: Supermercado' : 'Ex: Salário'"
            required
            :aria-invalid="!!erros.descricao || undefined"
            aria-describedby="descricao-erro"
          />
          <FieldError id="descricao-erro" :mensagem="erros.descricao" />
        </div>

        <label for="recorrente" class="flex items-center justify-between">
          <span class="text-sm">{{ tipo === 'Despesa' ? 'Despesa recorrente' : 'Receita recorrente' }}</span>
          <Switch id="recorrente" v-model="recorrente" />
        </label>

        <div v-if="recorrente" class="flex flex-col gap-1.5">
          <Label for="meses-recorrencia">Repetir por quantos meses? *</Label>
          <Input
            id="meses-recorrencia"
            v-model="mesesRecorrencia"
            type="number"
            min="2"
            :max="MAXIMO_MESES_RECORRENCIA"
            step="1"
            required
            :aria-invalid="!!erros.mesesRecorrencia || undefined"
            aria-describedby="meses-recorrencia-erro"
          />
          <FieldError id="meses-recorrencia-erro" :mensagem="erros.mesesRecorrencia" />
          <p class="text-xs text-muted-foreground">
            Lançado todo mês no mesmo dia, a partir da data escolhida.
          </p>
        </div>

        <DialogFooter>
          <Button type="submit" class="w-full" :disabled="salvando">
            {{ tipo === 'Despesa' ? 'Salvar despesa' : 'Salvar receita' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
