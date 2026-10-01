<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { isAxiosError } from 'axios'
import { toast } from 'vue-sonner'
import { Trash2 } from '@lucide/vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FieldError } from '@/components/ui/field-error'
import { campoObrigatorio, useValidacaoFormulario } from '@/mixins/useValidacaoFormulario'
import type { Categoria, TipoTransacao } from '@/api/categorias.api'
import {
  useCriarCategoriaMutation,
  useAtualizarCategoriaMutation,
  useRemoverCategoriaMutation,
} from '@/mixins/useCategorias'
import { NOMES_ICONES_CATEGORIA, iconeCategoria } from '@/utils/iconesCategoria'
import { CORES_PRESET } from '@/utils/coresPreset'

const props = defineProps<{
  tipo: TipoTransacao
  categoria?: Categoria | null
}>()

const aberto = defineModel<boolean>('open', { required: true })

const criarMutation = useCriarCategoriaMutation()
const atualizarMutation = useAtualizarCategoriaMutation()
const removerMutation = useRemoverCategoriaMutation()

const tipo = ref<TipoTransacao>(props.tipo)
const nome = ref('')
const icone = ref('tag')
const cor = ref(CORES_PRESET[0]!)

const modoEdicao = computed(() => !!props.categoria)
const salvando = computed(() => criarMutation.isPending.value || atualizarMutation.isPending.value)

const { erros, validar, resetar } = useValidacaoFormulario(() => ({
  nome: !nome.value.trim() && campoObrigatorio('Nome'),
  icone: !icone.value && campoObrigatorio('Ícone'),
  cor: !cor.value && campoObrigatorio('Cor'),
}))

watch(aberto, (estaAberto) => {
  if (!estaAberto) return

  resetar()

  tipo.value = props.categoria?.tipo ?? props.tipo
  nome.value = props.categoria?.nome ?? ''
  icone.value = props.categoria?.icone ?? 'tag'
  cor.value = props.categoria?.cor ?? CORES_PRESET[0]!
})

function mensagemDoErro(erro: unknown, padrao: string): string {
  if (isAxiosError(erro) && erro.response?.status === 400) {
    const erros = erro.response.data?.erros as Record<string, string[]> | undefined
    const primeira = erros && Object.values(erros).flat()[0]
    if (primeira) return primeira
  }

  return padrao
}

async function salvar() {
  if (!validar()) return

  const dados = { nome: nome.value.trim(), icone: icone.value, cor: cor.value }

  try {
    if (props.categoria) {
      await atualizarMutation.mutateAsync({ id: props.categoria.id, dados })
      toast.success('Categoria atualizada.')
    } else {
      await criarMutation.mutateAsync({ ...dados, tipo: tipo.value })
      toast.success('Categoria criada.')
    }

    aberto.value = false
  } catch (erro) {
    toast.error(mensagemDoErro(erro, 'Não foi possível salvar a categoria. Tente novamente.'))
  }
}

async function excluir() {
  if (!props.categoria) return

  try {
    await removerMutation.mutateAsync(props.categoria.id)
    toast.success('Categoria excluída.')
    aberto.value = false
  } catch (erro) {
    toast.error(mensagemDoErro(erro, 'Não foi possível excluir a categoria. Tente novamente.'))
  }
}
</script>

<template>
  <Dialog v-model:open="aberto">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ modoEdicao ? 'Editar categoria' : 'Nova categoria' }}</DialogTitle>
      </DialogHeader>

      <form class="flex flex-col gap-4" novalidate @submit.prevent="salvar">
        <Tabs v-model="tipo" class="w-full">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="Despesa" :disabled="modoEdicao">Despesa</TabsTrigger>
            <TabsTrigger value="Receita" :disabled="modoEdicao">Receita</TabsTrigger>
          </TabsList>
        </Tabs>

        <div class="flex flex-col gap-1.5">
          <Label for="categoria-nome">Nome *</Label>
          <Input
            id="categoria-nome"
            v-model="nome"
            maxlength="100"
            placeholder="Ex: Mercado"
            required
            :aria-invalid="!!erros.nome || undefined"
            aria-describedby="categoria-nome-erro"
          />
          <FieldError id="categoria-nome-erro" :mensagem="erros.nome" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label>Ícone *</Label>
          <div class="grid grid-cols-8 gap-2">
            <button
              v-for="nomeIcone in NOMES_ICONES_CATEGORIA"
              :key="nomeIcone"
              type="button"
              :aria-label="nomeIcone"
              :aria-pressed="icone === nomeIcone"
              class="flex aspect-square items-center justify-center rounded-lg border transition-colors hover:bg-muted"
              :class="icone === nomeIcone ? 'border-transparent' : 'text-muted-foreground'"
              :style="icone === nomeIcone ? { backgroundColor: `${cor}1A`, color: cor, borderColor: cor } : undefined"
              @click="icone = nomeIcone"
            >
              <component :is="iconeCategoria(nomeIcone)" class="size-4" />
            </button>
          </div>
          <FieldError :mensagem="erros.icone" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label>Cor *</Label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="opcaoCor in CORES_PRESET"
              :key="opcaoCor"
              type="button"
              :aria-label="opcaoCor"
              :aria-pressed="cor === opcaoCor"
              class="size-8 rounded-full ring-offset-2 ring-offset-background transition-shadow"
              :class="{ 'ring-2': cor === opcaoCor }"
              :style="{ backgroundColor: opcaoCor, '--tw-ring-color': opcaoCor }"
              @click="cor = opcaoCor"
            />
          </div>
          <FieldError :mensagem="erros.cor" />
        </div>

        <DialogFooter class="flex-col sm:flex-col">
          <Button type="submit" class="w-full" :disabled="salvando">Salvar categoria</Button>
          <Button
            v-if="modoEdicao"
            type="button"
            variant="destructive"
            class="w-full"
            :disabled="removerMutation.isPending.value"
            @click="excluir"
          >
            <Trash2 />
            Excluir categoria
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
