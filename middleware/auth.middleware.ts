import type { NavigationGuardWithThis } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'

export const authMiddleware: NavigationGuardWithThis<undefined> = (to) => {
  const authStore = useAuthStore()
  const rotaPublica = to.meta.publica === true

  if (!rotaPublica && !authStore.estaAutenticado) {
    return { name: 'login' }
  }

  if (rotaPublica && authStore.estaAutenticado) {
    return { name: 'inicio' }
  }

  return true
}
