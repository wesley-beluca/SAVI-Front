<script setup lang="ts">
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FieldError } from '@/components/ui/field-error'
import { campoObrigatorio, useValidacaoFormulario } from '@/mixins/useValidacaoFormulario'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'

const aberto = defineModel<boolean>('open', { required: true })

const authStore = useAuthStore()
const nome = ref('')
const email = ref('')
const salvando = ref(false)

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const { erros, validar, resetar } = useValidacaoFormulario(() => ({
  nome: !nome.value.trim() && campoObrigatorio('Nome'),
  email: !email.value.trim()
    ? campoObrigatorio('E-mail')
    : !FORMATO_EMAIL.test(email.value.trim()) && 'Informe um e-mail válido (ex: nome@dominio.com).',
}))

watch(aberto, (estaAberto) => {
  if (!estaAberto) return

  resetar()
  nome.value = authStore.usuario?.nome ?? ''
  email.value = authStore.usuario?.email ?? ''
})

async function salvar() {
  if (!validar()) return

  salvando.value = true

  try {
    const resultado = await authApi.atualizarPerfil({ nome: nome.value.trim(), email: email.value.trim() })
    authStore.definirSessao(resultado)
    toast.success('Dados atualizados.')
    aberto.value = false
  } catch {
    toast.error('Não foi possível atualizar os dados. Verifique o e-mail informado.')
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <Dialog v-model:open="aberto">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Editar dados</DialogTitle>
      </DialogHeader>

      <form class="flex flex-col gap-4" novalidate @submit.prevent="salvar">
        <div class="flex flex-col gap-1.5">
          <Label for="perfil-nome">Nome *</Label>
          <Input
            id="perfil-nome"
            v-model="nome"
            maxlength="150"
            required
            :aria-invalid="!!erros.nome || undefined"
            aria-describedby="perfil-nome-erro"
          />
          <FieldError id="perfil-nome-erro" :mensagem="erros.nome" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="perfil-email">E-mail *</Label>
          <Input
            id="perfil-email"
            v-model="email"
            type="email"
            maxlength="256"
            required
            :aria-invalid="!!erros.email || undefined"
            aria-describedby="perfil-email-erro"
          />
          <FieldError id="perfil-email-erro" :mensagem="erros.email" />
        </div>

        <DialogFooter>
          <Button type="submit" class="w-full" :disabled="salvando">Salvar dados</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
