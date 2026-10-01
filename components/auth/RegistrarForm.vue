<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/mixins/useAuth'

const nome = ref('')
const email = ref('')
const senha = ref('')

const { carregando, erro, registrar } = useAuth()

function aoSubmeter() {
  registrar({ nome: nome.value, email: email.value, senha: senha.value })
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="aoSubmeter">
    <div class="flex flex-col gap-1.5">
      <Label for="nome">Nome</Label>
      <Input id="nome" v-model="nome" autocomplete="name" required />
    </div>

    <div class="flex flex-col gap-1.5">
      <Label for="email">Email</Label>
      <Input id="email" v-model="email" type="email" autocomplete="email" required />
    </div>

    <div class="flex flex-col gap-1.5">
      <Label for="senha">Senha</Label>
      <Input
        id="senha"
        v-model="senha"
        type="password"
        autocomplete="new-password"
        minlength="8"
        required
      />
    </div>

    <p v-if="erro" class="text-sm text-destructive">{{ erro }}</p>

    <Button type="submit" :disabled="carregando">
      {{ carregando ? 'Criando conta...' : 'Criar conta' }}
    </Button>
  </form>
</template>
