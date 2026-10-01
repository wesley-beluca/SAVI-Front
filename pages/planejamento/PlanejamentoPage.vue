<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PlanejamentoOrcamento from '@/components/planejamento/PlanejamentoOrcamento.vue'
import PlanejamentoMetas from '@/components/planejamento/PlanejamentoMetas.vue'
import PlanejamentoContas from '@/components/planejamento/PlanejamentoContas.vue'

const route = useRoute()
const router = useRouter()

const abaAtiva = ref('orcamento')

watch(
  () => route.query.aba,
  (aba) => {
    if (!aba) return
    abaAtiva.value = aba as string
    router.replace({ query: {} })
  },
  { immediate: true },
)
</script>

<template>
  <Tabs v-model="abaAtiva" class="flex-col">
    <div class="sticky top-0 z-10 bg-background/95 px-4 pt-4 backdrop-blur">
      <div class="mx-auto max-w-lg">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="orcamento">Orçamento</TabsTrigger>
          <TabsTrigger value="metas">Metas</TabsTrigger>
          <TabsTrigger value="contas">Contas</TabsTrigger>
        </TabsList>
      </div>
    </div>

    <TabsContent value="orcamento">
      <PlanejamentoOrcamento />
    </TabsContent>
    <TabsContent value="metas">
      <PlanejamentoMetas />
    </TabsContent>
    <TabsContent value="contas">
      <PlanejamentoContas />
    </TabsContent>
  </Tabs>
</template>
