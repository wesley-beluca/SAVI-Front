import type { Transacao } from '@/api/transacoes.api'
import { dataIsoLocal } from './formatters'

export type StatusPagamento = 'paga' | 'pendente' | 'vencida'

export const ESTILO_STATUS: Record<StatusPagamento, { rotulo: string; texto: string; ponto: string }> = {
  pendente: { rotulo: 'A pagar', texto: 'text-muted-foreground', ponto: 'bg-warning' },
  vencida: { rotulo: 'Vencida', texto: 'text-destructive', ponto: 'bg-destructive' },
  paga: { rotulo: 'Paga', texto: 'text-success', ponto: 'bg-success' },
}

/** Situação de pagamento de uma despesa. Receitas não têm controle de pagamento (retorna `null`). */
export function statusPagamento(
  transacao: Pick<Transacao, 'tipo' | 'pago' | 'data'>,
  hojeIso = dataIsoLocal(),
): StatusPagamento | null {
  if (transacao.tipo !== 'Despesa') return null
  if (transacao.pago) return 'paga'
  return transacao.data < hojeIso ? 'vencida' : 'pendente'
}

/** Ex.: "vence hoje", "vence em 3 dias", "venceu ontem". */
export function descreverVencimento(dataIso: string, hojeIso = dataIsoLocal()): string {
  // Ambas as datas são interpretadas como meia-noite UTC, então a diferença é sempre um número inteiro de dias.
  const dias = Math.round((Date.parse(dataIso) - Date.parse(hojeIso)) / 86_400_000)

  if (dias === 0) return 'vence hoje'
  if (dias === 1) return 'vence amanhã'
  if (dias > 1) return `vence em ${dias} dias`
  if (dias === -1) return 'venceu ontem'
  return `venceu há ${-dias} dias`
}
