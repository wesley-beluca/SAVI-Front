import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { AuthResult, Usuario } from '@/api/auth.api'
import { tokenStorage } from '@/utils/tokenStorage'

export const useAuthStore = defineStore('auth', () => {
  const persistido = tokenStorage.ler()

  const token = ref<string | null>(persistido?.token ?? null)
  const usuario = ref<Usuario | null>(persistido?.usuario ?? null)

  const estaAutenticado = computed(() => token.value !== null)

  function definirSessao(resultado: AuthResult) {
    token.value = resultado.token
    usuario.value = resultado.usuario
    tokenStorage.salvar({ token: resultado.token, usuario: resultado.usuario })
  }

  function sair() {
    token.value = null
    usuario.value = null
    tokenStorage.salvar(null)
  }

  // TODO: persistir no backend quando existir endpoint de atualização de perfil.
  function atualizarUsuario(dados: Partial<Usuario>) {
    if (!usuario.value) return
    usuario.value = { ...usuario.value, ...dados }
    if (token.value) tokenStorage.salvar({ token: token.value, usuario: usuario.value })
  }

  return { token, usuario, estaAutenticado, definirSessao, sair, atualizarUsuario }
})
