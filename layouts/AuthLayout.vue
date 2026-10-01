<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import authHero from '@/static/brand/auth-hero.png'
import logoHero from '@/static/brand/logo-hero.jpg'

defineProps<{
  titulo: string
}>()
</script>

<template>
  <div class="relative flex min-h-dvh overflow-hidden">
    <!-- Celular: imagem como fundo atrás do form -->
    <img
      :src="authHero"
      alt=""
      class="absolute inset-0 -z-10 h-full w-full object-cover lg:hidden"
    />

    <!-- Notebook/PC: imagem como painel à esquerda -->
    <div class="relative hidden overflow-hidden lg:block lg:w-1/2">
      <img :src="logoHero" alt="" class="absolute inset-0 h-full w-full object-cover" />
    </div>

    <div class="flex flex-1 items-center justify-center p-4 lg:bg-background">
      <Card class="w-full max-w-sm">
        <CardHeader>
          <CardTitle class="text-xl">{{ titulo }}</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <slot />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
