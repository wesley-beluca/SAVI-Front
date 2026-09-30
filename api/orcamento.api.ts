import { httpClient } from './httpClient'

export interface Orcamento {
  mes: number
  ano: number
  rendaPrevista: number
  limitePlanejado: number
  utilizado: number
  disponivel: number
}

export interface DadosOrcamento {
  mes: number
  ano: number
  rendaPrevista: number
  limitePlanejado: number
}

export const orcamentoApi = {
  async obter(mes: number, ano: number) {
    const { data } = await httpClient.get<Orcamento>('/api/orcamento', { params: { mes, ano } })
    return data
  },

  async definir(dados: DadosOrcamento) {
    const { data } = await httpClient.put<Orcamento>('/api/orcamento', dados)
    return data
  },
}
