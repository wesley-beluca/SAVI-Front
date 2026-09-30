<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import EvolucaoVisaoGeral from '@/components/evolucao/EvolucaoVisaoGeral.vue'
import EvolucaoCategorias from '@/components/evolucao/EvolucaoCategorias.vue'
import EvolucaoComparativo from '@/components/evolucao/EvolucaoComparativo.vue'

const abaAtiva = ref('visao-geral')
</script>

<template>
  <Tabs v-model="abaAtiva" class="flex-col">
    <div class="sticky top-0 z-10 bg-background/95 px-4 pt-4 backdrop-blur">
      <div class="mx-auto max-w-lg">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="visao-geral">Visão geral</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
        </TabsList>
      </div>
    </div>

    <TabsContent value="visao-geral">
      <EvolucaoVisaoGeral @ver-categorias="abaAtiva = 'categorias'" />
    </TabsContent>
    <TabsContent value="categorias">
      <EvolucaoCategorias />
    </TabsContent>
    <TabsContent value="comparativo">
      <EvolucaoComparativo />
    </TabsContent>
  </Tabs>
</template>
