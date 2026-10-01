import { httpClient } from './httpClient'

export interface Conta {
  id: string
  nome: string
  banco: string
  saldo: number
}

export interface DadosConta {
  nome: string
  banco: string
  saldo: number
}

export const contasApi = {
  async listar() {
    const { data } = await httpClient.get<Conta[]>('/api/contas')
    return data
  },

  async criar(dados: DadosConta) {
    const { data } = await httpClient.post<Conta>('/api/contas', dados)
    return data
  },

  async atualizar(id: string, dados: DadosConta) {
    const { data } = await httpClient.put<Conta>(`/api/contas/${id}`, { id, ...dados })
    return data
  },

  async remover(id: string) {
    await httpClient.delete(`/api/contas/${id}`)
  },
}
