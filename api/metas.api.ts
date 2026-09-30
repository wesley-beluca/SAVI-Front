import { httpClient } from './httpClient'

export interface Meta {
  id: string
  nome: string
  icone: string
  cor: string
  valorAtual: number
  valorAlvo: number
}

export interface DadosMeta {
  nome: string
  icone: string
  cor: string
  valorAtual: number
  valorAlvo: number
}

export const metasApi = {
  async listar() {
    const { data } = await httpClient.get<Meta[]>('/api/metas')
    return data
  },

  async criar(dados: DadosMeta) {
    const { data } = await httpClient.post<Meta>('/api/metas', dados)
    return data
  },

  async atualizar(id: string, dados: DadosMeta) {
    const { data } = await httpClient.put<Meta>(`/api/metas/${id}`, { id, ...dados })
    return data
  },

  async remover(id: string) {
    await httpClient.delete(`/api/metas/${id}`)
  },
}
