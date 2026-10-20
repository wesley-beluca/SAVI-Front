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
  /** Se esta ocorrência já foi paga (só despesas). Apenas despesas pagas descontam do saldo. */
  pago: boolean
  /** Data/hora (UTC) em que a ocorrência foi marcada como paga. */
  pagoEm: string | null
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

export interface DadosNovaTransacao extends DadosTransacao {
  /** Marca a primeira ocorrência da despesa como já paga. */
  pago: boolean
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

  /** Ocorrências de despesas não pagas com vencimento entre `de` e `ate` (YYYY-MM-DD, inclusivos). */
  async listarPendentes(de: string, ate: string) {
    const { data } = await httpClient.get<Transacao[]>('/api/transacoes/pendentes', { params: { de, ate } })
    return data
  },

  async criar(dados: DadosNovaTransacao) {
    const { data } = await httpClient.post<Transacao>('/api/transacoes', dados)
    return data
  },

  async marcarComoPaga(id: string, ocorrencia: number) {
    const { data } = await httpClient.post<Transacao>(`/api/transacoes/${id}/ocorrencias/${ocorrencia}/pagamento`)
    return data
  },

  async desmarcarPagamento(id: string, ocorrencia: number) {
    const { data } = await httpClient.delete<Transacao>(`/api/transacoes/${id}/ocorrencias/${ocorrencia}/pagamento`)
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
