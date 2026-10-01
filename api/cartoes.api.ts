import { httpClient } from './httpClient'

export interface Cartao {
  id: string
  nome: string
  banco: string
  faturaAtual: number
  diaFechamento: number
  diaVencimento: number
}

export interface DadosCartao {
  nome: string
  banco: string
  faturaAtual: number
  diaFechamento: number
  diaVencimento: number
}

export const cartoesApi = {
  async listar() {
    const { data } = await httpClient.get<Cartao[]>('/api/cartoes')
    return data
  },

  async criar(dados: DadosCartao) {
    const { data } = await httpClient.post<Cartao>('/api/cartoes', dados)
    return data
  },

  async atualizar(id: string, dados: DadosCartao) {
    const { data } = await httpClient.put<Cartao>(`/api/cartoes/${id}`, { id, ...dados })
    return data
  },

  async remover(id: string) {
    await httpClient.delete(`/api/cartoes/${id}`)
  },
}
