import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const carregando = ref(false)
  const erro = ref<string | null>(null)

  async function entrar(credenciais: { email: string; senha: string }) {
    erro.value = null
    carregando.value = true

    try {
      const resultado = await authApi.entrar(credenciais)
      authStore.definirSessao(resultado)
      router.push({ name: 'inicio' })
    } catch {
      erro.value = 'Email ou senha inválidos.'
    } finally {
      carregando.value = false
    }
  }

  async function registrar(dados: { nome: string; email: string; senha: string }) {
    erro.value = null
    carregando.value = true

    try {
      const resultado = await authApi.registrar(dados)
      authStore.definirSessao(resultado)
      router.push({ name: 'inicio' })
    } catch {
      erro.value = 'Não foi possível criar a conta. Verifique os dados e tente novamente.'
    } finally {
      carregando.value = false
    }
  }

  async function entrarComGoogle(idToken: string): Promise<boolean> {
    try {
      const resultado = await authApi.entrarComGoogle(idToken)
      authStore.definirSessao(resultado)
      router.push({ name: 'inicio' })
      return true
    } catch {
      return false
    }
  }

  return { carregando, erro, entrar, registrar, entrarComGoogle }
}
