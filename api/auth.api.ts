import { httpClient } from './httpClient'

export interface Usuario {
  id: string
  email: string
  nome: string
}

export interface AuthResult {
  token: string
  expiraEmUtc: string
  usuario: Usuario
}

export const authApi = {
  async registrar(dados: { nome: string; email: string; senha: string }) {
    const { data } = await httpClient.post<AuthResult>('/api/auth/registrar', dados)
    return data
  },

  async entrar(dados: { email: string; senha: string }) {
    const { data } = await httpClient.post<AuthResult>('/api/auth/entrar', dados)
    return data
  },

  async entrarComGoogle(idToken: string) {
    const { data } = await httpClient.post<AuthResult>('/api/auth/google', { idToken })
    return data
  },

  async atualizarPerfil(dados: { nome: string; email: string }) {
    const { data } = await httpClient.put<AuthResult>('/api/auth/perfil', dados)
    return data
  },
}
