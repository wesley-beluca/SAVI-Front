<script setup lang="ts">
import { computed } from 'vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Switch } from '@/components/ui/switch'
import { useCategoriasQuery } from '@/mixins/useCategorias'
import type { TipoTransacao } from '@/api/categorias.api'
import { useContasQuery } from '@/mixins/useContas'
import { useCartoesQuery } from '@/mixins/useCartoes'

const aberto = defineModel<boolean>('open', { required: true })
const tipo = defineModel<'Todas' | TipoTransacao>('tipo', { required: true })
const categoria = defineModel<string>('categoria', { required: true })
const conta = defineModel<string>('conta', { required: true })
const valorMinimo = defineModel<string>('valorMinimo', { required: true })
const valorMaximo = defineModel<string>('valorMaximo', { required: true })
const apenasRecorrentes = defineModel<boolean>('apenasRecorrentes', { required: true })
const apenasParcelamentos = defineModel<boolean>('apenasParcelamentos', { required: true })

const { data: categorias } = useCategoriasQuery()
const { data: contas } = useContasQuery()
const { data: cartoes } = useCartoesQuery()

const categoriasDisponiveis = computed(() =>
  (categorias.value ?? []).filter((item) => tipo.value === 'Todas' || item.tipo === tipo.value),
)

const contasDisponiveis = computed(() => [
  ...(contas.value ?? []).map((conta) => conta.nome),
  ...(cartoes.value ?? []).map((cartao) => `${cartao.nome} (Crédito)`),
])

function limpar() {
  tipo.value = 'Todas'
  categoria.value = ''
  conta.value = ''
  valorMinimo.value = ''
  valorMaximo.value = ''
  apenasRecorrentes.value = false
  apenasParcelamentos.value = false
}
</script>

<template>
  <Dialog v-model:open="aberto">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Filtros</DialogTitle>
      </DialogHeader>

      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <Label>Tipo</Label>
          <Tabs v-model="tipo" class="w-full">
            <TabsList class="grid w-full grid-cols-3">
              <TabsTrigger value="Todas">Todos</TabsTrigger>
              <TabsTrigger value="Receita">Receitas</TabsTrigger>
              <TabsTrigger value="Despesa">Despesas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="filtro-categoria">Categoria</Label>
          <NativeSelect id="filtro-categoria" v-model="categoria" class="w-full">
            <NativeSelectOption value="">Selecionar categoria</NativeSelectOption>
            <NativeSelectOption v-for="item in categoriasDisponiveis" :key="item.id" :value="item.nome">
              {{ item.nome }}
            </NativeSelectOption>
          </NativeSelect>
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="filtro-conta">Conta / Cartão</Label>
          <NativeSelect id="filtro-conta" v-model="conta" class="w-full">
            <NativeSelectOption value="">Selecionar conta</NativeSelectOption>
            <NativeSelectOption v-for="opcaoConta in contasDisponiveis" :key="opcaoConta" :value="opcaoConta">
              {{ opcaoConta }}
            </NativeSelectOption>
          </NativeSelect>
        </div>

        <div class="flex flex-col gap-1.5">
          <Label>Valor</Label>
          <div class="flex items-center gap-2">
            <Input v-model="valorMinimo" type="number" min="0" placeholder="Valor mínimo" />
            <Input v-model="valorMaximo" type="number" min="0" placeholder="Valor máximo" />
          </div>
        </div>

        <label for="filtro-recorrentes" class="flex items-center justify-between">
          <span class="text-sm">Apenas recorrentes</span>
          <Switch id="filtro-recorrentes" v-model="apenasRecorrentes" />
        </label>

        <label for="filtro-parcelamentos" class="flex items-center justify-between">
          <span class="text-sm">Apenas parcelamentos</span>
          <Switch id="filtro-parcelamentos" v-model="apenasParcelamentos" />
        </label>
      </div>

      <DialogFooter class="sm:flex-row sm:justify-between">
        <Button variant="ghost" @click="limpar">Limpar filtros</Button>
        <Button @click="aberto = false">Aplicar filtros</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
