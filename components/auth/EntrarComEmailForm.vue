<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/mixins/useAuth'

const email = ref('')
const senha = ref('')

const { carregando, erro, entrar } = useAuth()

function aoSubmeter() {
  entrar({ email: email.value, senha: senha.value })
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="aoSubmeter">
    <div class="flex flex-col gap-1.5">
      <Label for="email">Email</Label>
      <Input id="email" v-model="email" type="email" autocomplete="email" required />
    </div>

    <div class="flex flex-col gap-1.5">
      <Label for="senha">Senha</Label>
      <Input id="senha" v-model="senha" type="password" autocomplete="current-password" required />
    </div>

    <p v-if="erro" class="text-sm text-destructive">{{ erro }}</p>

    <Button type="submit" :disabled="carregando">
      {{ carregando ? 'Entrando...' : 'Entrar' }}
    </Button>
  </form>
</template>
