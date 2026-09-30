import { httpClient } from './httpClient'
import type { TipoTransacao } from './categorias.api'

export interface Transacao {
  id: string
  descricao: string
  valor: number
  data: string
  tipo: TipoTransacao
  recorrente: boolean
  conta: string
  parcelas: number
  /** Data da primeira ocorrência; `data` é a data da ocorrência no mês consultado. */
  dataInicio: string
  mesesRecorrencia: number
  /** Número da ocorrência (1-based) dentro da recorrência. */
  ocorrencia: number
  categoriaId: string
  categoriaNome: string
  categoriaIcone: string
  categoriaCor: string
}

export interface DadosTransacao {
  descricao: string
  valor: number
  data: string
  tipo: TipoTransacao
  recorrente: boolean
  conta: string
  parcelas: number
  mesesRecorrencia: number
  categoriaId: string
}

export interface PontoEvolucaoMensal {
  ano: number
  mes: number
  receitas: number
  despesas: number
}

export const transacoesApi = {
  async listar(mes: number, ano: number) {
    const { data } = await httpClient.get<Transacao[]>('/api/transacoes', { params: { mes, ano } })
    return data
  },

  async obterEvolucaoMensal(meses = 12) {
    const { data } = await httpClient.get<PontoEvolucaoMensal[]>('/api/transacoes/evolucao-mensal', {
      params: { meses },
    })
    return data
  },

  async criar(dados: DadosTransacao) {
    const { data } = await httpClient.post<Transacao>('/api/transacoes', dados)
    return data
  },

  async atualizar(id: string, dados: DadosTransacao) {
    const { data } = await httpClient.put<Transacao>(`/api/transacoes/${id}`, { id, ...dados })
    return data
  },

  async remover(id: string) {
    await httpClient.delete(`/api/transacoes/${id}`)
  },
}
