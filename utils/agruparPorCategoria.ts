import type { TipoTransacao } from '@/api/categorias.api'
import type { Transacao } from '@/api/transacoes.api'

export interface CategoriaResumo {
  categoriaId: string
  nome: string
  icone: string
  cor: string
  valor: number
  percentual: number
}

export function agruparPorCategoria(transacoes: Transacao[], tipo: TipoTransacao): CategoriaResumo[] {
  const doTipo = transacoes.filter((transacao) => transacao.tipo === tipo)
  const total = doTipo.reduce((soma, transacao) => soma + transacao.valor, 0)

  const mapa = new Map<string, CategoriaResumo>()
  for (const transacao of doTipo) {
    const existente = mapa.get(transacao.categoriaId)
    if (existente) {
      existente.valor += transacao.valor
      continue
    }

    mapa.set(transacao.categoriaId, {
      categoriaId: transacao.categoriaId,
      nome: transacao.categoriaNome,
      icone: transacao.categoriaIcone,
      cor: transacao.categoriaCor,
      valor: transacao.valor,
      percentual: 0,
    })
  }

  const resumos = [...mapa.values()].sort((a, b) => b.valor - a.valor)

  for (const resumo of resumos) {
    resumo.percentual = total > 0 ? Math.round((resumo.valor / total) * 100) : 0
  }

  return resumos
}
