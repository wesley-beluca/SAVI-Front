<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { env } from '@/utils/env'
import { inicializarGoogleIdentity } from '@/utils/googleIdentity'
import { useAuth } from '@/mixins/useAuth'

const emit = defineEmits<{ erro: [mensagem: string] }>()

const container = ref<HTMLElement | null>(null)
const { entrarComGoogle } = useAuth()

onMounted(async () => {
  if (!env.googleClientId || !container.value) {
    return
  }

  await inicializarGoogleIdentity({
    clientId: env.googleClientId,
    container: container.value,
    aoReceberCredencial: async (idToken) => {
      const sucesso = await entrarComGoogle(idToken)
      if (!sucesso) {
        emit('erro', 'Não foi possível entrar com o Google. Tente novamente.')
      }
    },
  })
})
</script>

<template>
  <div ref="container" class="flex justify-center" />
</template>
