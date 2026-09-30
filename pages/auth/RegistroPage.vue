<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import RegistrarForm from '@/components/auth/RegistrarForm.vue'
</script>

<template>
  <AuthLayout titulo="Criar conta no SAVi">
    <RegistrarForm />

    <p class="text-center text-sm text-muted-foreground">
      Já tem conta?
      <RouterLink
        :to="{ name: 'login' }"
        class="font-medium text-primary underline-offset-4 hover:underline"
      >
        Entrar
      </RouterLink>
    </p>
  </AuthLayout>
</template>
