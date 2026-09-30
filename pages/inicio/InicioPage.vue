<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import InicioVisaoGeral from '@/components/dashboard/InicioVisaoGeral.vue'
import InicioInsights from '@/components/dashboard/InicioInsights.vue'
import InicioCalendario from '@/components/dashboard/InicioCalendario.vue'
</script>

<template>
  <div class="mx-auto max-w-lg">
    <Tabs default-value="visao-geral" class="flex-col">
      <div class="sticky top-0 z-10 bg-background/95 px-4 pt-4 backdrop-blur">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="visao-geral">Visão geral</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="calendario">Calendário</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="visao-geral">
        <InicioVisaoGeral />
      </TabsContent>
      <TabsContent value="insights">
        <InicioInsights />
      </TabsContent>
      <TabsContent value="calendario">
        <InicioCalendario />
      </TabsContent>
    </Tabs>
  </div>
</template>
