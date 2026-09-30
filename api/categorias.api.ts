import { httpClient } from './httpClient'

export type TipoTransacao = 'Receita' | 'Despesa'

export interface Categoria {
  id: string
  nome: string
  tipo: TipoTransacao
  icone: string
  cor: string
  customizada: boolean
}

export interface DadosCategoria {
  nome: string
  tipo: TipoTransacao
  icone: string
  cor: string
}

// O tipo não muda depois de criada: o backend não aceita alterá-lo.
export type DadosAtualizacaoCategoria = Omit<DadosCategoria, 'tipo'>

export const categoriasApi = {
  async listar() {
    const { data } = await httpClient.get<Categoria[]>('/api/categorias')
    return data
  },

  async criar(dados: DadosCategoria) {
    const { data } = await httpClient.post<Categoria>('/api/categorias', dados)
    return data
  },

  async atualizar(id: string, dados: DadosAtualizacaoCategoria) {
    const { data } = await httpClient.put<Categoria>(`/api/categorias/${id}`, { id, ...dados })
    return data
  },

  async remover(id: string) {
    await httpClient.delete(`/api/categorias/${id}`)
  },
}
