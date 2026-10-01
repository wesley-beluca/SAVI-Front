import type { NavigationGuardWithThis } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'
import { apresentacaoJaVista, estaRodandoComoApp } from '@/mixins/useInstalacaoPwa'

export const authMiddleware: NavigationGuardWithThis<undefined> = (to) => {
  const authStore = useAuthStore()
  const rotaPublica = to.meta.publica === true

  if (!rotaPublica && !authStore.estaAutenticado) {
    const mostrarApresentacao = !apresentacaoJaVista() && !estaRodandoComoApp()
    return { name: mostrarApresentacao ? 'apresentacao' : 'login' }
  }

  if (rotaPublica && authStore.estaAutenticado) {
    return { name: 'inicio' }
  }

  return true
}
