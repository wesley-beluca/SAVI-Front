import type { Usuario } from '@/api/auth.api'

const CHAVE_STORAGE = 'savi.auth'

interface AuthPersistido {
  token: string
  usuario: Usuario
}

export const tokenStorage = {
  ler(): AuthPersistido | null {
    try {
      const bruto = localStorage.getItem(CHAVE_STORAGE)
      return bruto ? (JSON.parse(bruto) as AuthPersistido) : null
    } catch {
      return null
    }
  },

  salvar(valor: AuthPersistido | null) {
    try {
      if (valor) {
        localStorage.setItem(CHAVE_STORAGE, JSON.stringify(valor))
      } else {
        localStorage.removeItem(CHAVE_STORAGE)
      }
    } catch {
      // localStorage indisponível (modo privado/embedded webview) — segue só em memória.
    }
  },
}
