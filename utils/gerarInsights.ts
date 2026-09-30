import type { Component } from 'vue'
import { AlertTriangle, CircleCheck, Info, TrendingDown, TrendingUp } from '@lucide/vue'
import type { Orcamento } from '@/api/orcamento.api'
import type { Transacao } from '@/api/transacoes.api'
import { agruparPorCategoria } from './agruparPorCategoria'
import { formatarMoeda, formatarNomeMes } from './formatters'

export interface Insight {
  id: string
  icone: Component
  cor: string
  texto: string
}

const CORES = {
  destructive: 'bg-destructive/15 text-destructive',
  warning: 'bg-warning/15 text-warning',
  success: 'bg-success/15 text-success',
  info: 'bg-info/15 text-info',
} as const

export function gerarInsights(
  transacoesAtual: Transacao[],
  transacoesAnterior: Transacao[],
  orcamento: Orcamento | undefined,
  hoje: Date,
): Insight[] {
  const insights: Insight[] = []

  const categoriaComMaiorAumento = encontrarCategoriaComMaiorAumento(transacoesAtual, transacoesAnterior)
  if (categoriaComMaiorAumento) {
    insights.push({
      id: 'categoria-aumento',
      icone: TrendingUp,
      cor: CORES.destructive,
      texto: `Seus gastos com ${categoriaComMaiorAumento.nome} aumentaram ${categoriaComMaiorAumento.percentual}% em relação ao mês passado.`,
    })
  }

  if (orcamento && orcamento.limitePlanejado > 0) {
    const percentualUtilizado = Math.round((orcamento.utilizado / orcamento.limitePlanejado) * 100)
    insights.push({
      id: 'orcamento-utilizado',
      icone: AlertTriangle,
      cor: percentualUtilizado >= 70 ? CORES.warning : CORES.info,
      texto: `Você já utilizou ${percentualUtilizado}% do seu orçamento do mês.`,
    })
  }

  const despesasAtual = somarPorTipo(transacoesAtual, 'Despesa')
  const despesasAnterior = somarPorTipo(transacoesAnterior, 'Despesa')
  const mesAnteriorNome = formatarNomeMes(mesAnterior(hoje)).toLowerCase()

  if (despesasAnterior > 0 && despesasAtual < despesasAnterior) {
    insights.push({
      id: 'economia',
      icone: CircleCheck,
      cor: CORES.success,
      texto: `Você economizou ${formatarMoeda(despesasAnterior - despesasAtual)} em relação a ${mesAnteriorNome}.`,
    })
  } else if (despesasAnterior > 0 && despesasAtual > despesasAnterior) {
    insights.push({
      id: 'aumento-gastos',
      icone: TrendingDown,
      cor: CORES.destructive,
      texto: `Seus gastos aumentaram ${formatarMoeda(despesasAtual - despesasAnterior)} em relação a ${mesAnteriorNome}.`,
    })
  }

  const contasProximas = transacoesAtual.filter((transacao) => {
    if (transacao.tipo !== 'Despesa') return false
    const data = new Date(`${transacao.data}T00:00:00`)
    const diffDias = Math.round((data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
    return diffDias >= 0 && diffDias <= 7
  })

  if (contasProximas.length > 0) {
    insights.push({
      id: 'contas-proximas',
      icone: Info,
      cor: CORES.info,
      texto: `Você tem ${contasProximas.length} conta${contasProximas.length > 1 ? 's' : ''} vencendo nos próximos 7 dias.`,
    })
  }

  return insights
}

function somarPorTipo(transacoes: Transacao[], tipo: 'Receita' | 'Despesa'): number {
  return transacoes.filter((transacao) => transacao.tipo === tipo).reduce((soma, t) => soma + t.valor, 0)
}

function mesAnterior(data: Date): number {
  const mes = data.getMonth()
  return mes === 0 ? 12 : mes
}

function encontrarCategoriaComMaiorAumento(atual: Transacao[], anterior: Transacao[]) {
  const gastosAtual = agruparPorCategoria(atual, 'Despesa')
  const gastosAnterior = agruparPorCategoria(anterior, 'Despesa')

  let melhor: { nome: string; percentual: number } | null = null

  for (const categoria of gastosAtual) {
    const anteriorDaCategoria = gastosAnterior.find((c) => c.categoriaId === categoria.categoriaId)
    if (!anteriorDaCategoria || anteriorDaCategoria.valor <= 0) continue

    const percentual = Math.round(((categoria.valor - anteriorDaCategoria.valor) / anteriorDaCategoria.valor) * 100)
    if (percentual > 0 && (!melhor || percentual > melhor.percentual)) {
      melhor = { nome: categoria.nome, percentual }
    }
  }

  return melhor
}
