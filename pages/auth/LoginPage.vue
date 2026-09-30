<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Separator } from '@/components/ui/separator'
import AuthLayout from '@/layouts/AuthLayout.vue'
import EntrarComEmailForm from '@/components/auth/EntrarComEmailForm.vue'
import EntrarComGoogleButton from '@/components/auth/EntrarComGoogleButton.vue'
</script>

<template>
  <AuthLayout titulo="Entrar no SAVi">
    <EntrarComEmailForm />

    <div class="flex items-center gap-3">
      <Separator class="flex-1" />
      <span class="text-xs text-muted-foreground">ou</span>
      <Separator class="flex-1" />
    </div>

    <EntrarComGoogleButton />

    <p class="text-center text-sm text-muted-foreground">
      Não tem conta?
      <RouterLink
        :to="{ name: 'registro' }"
        class="font-medium text-primary underline-offset-4 hover:underline"
      >
        Criar conta
      </RouterLink>
    </p>
  </AuthLayout>
</template>
