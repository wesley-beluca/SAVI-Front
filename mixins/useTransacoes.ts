import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { unref, type MaybeRef } from 'vue'
import { transacoesApi, type DadosNovaTransacao, type DadosTransacao, type Transacao } from '@/api/transacoes.api'

export function useTransacoesQuery(mes: MaybeRef<number>, ano: MaybeRef<number>) {
  return useQuery({
    queryKey: ['transacoes', mes, ano],
    queryFn: () => transacoesApi.listar(unref(mes), unref(ano)),
  })
}

export function useEvolucaoMensalQuery(meses: MaybeRef<number> = 12) {
  return useQuery({
    queryKey: ['evolucao-mensal', meses],
    queryFn: () => transacoesApi.obterEvolucaoMensal(unref(meses)),
  })
}

function useInvalidarTransacoes() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: ['transacoes'] })
    queryClient.invalidateQueries({ queryKey: ['evolucao-mensal'] })
    queryClient.invalidateQueries({ queryKey: ['orcamento'] })
    queryClient.invalidateQueries({ queryKey: ['contas'] })
    queryClient.invalidateQueries({ queryKey: ['cartoes'] })
  }
}

export function useCriarTransacaoMutation() {
  const invalidar = useInvalidarTransacoes()

  return useMutation({
    mutationFn: (dados: DadosNovaTransacao) => transacoesApi.criar(dados),
    onSuccess: invalidar,
  })
}

export function useAtualizarTransacaoMutation() {
  const invalidar = useInvalidarTransacoes()

  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: DadosTransacao }) => transacoesApi.atualizar(id, dados),
    onSuccess: invalidar,
  })
}

export function useDefinirPagamentoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ transacao, pago }: { transacao: Pick<Transacao, 'id' | 'ocorrencia'>; pago: boolean }) =>
      pago
        ? transacoesApi.marcarComoPaga(transacao.id, transacao.ocorrencia)
        : transacoesApi.desmarcarPagamento(transacao.id, transacao.ocorrencia),
    // Aguarda o refetch para o botão não "piscar" no estado antigo. Orçamento e evolução contam
    // todas as despesas (pagas ou não), então mudam apenas a lista de transações e os saldos.
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['transacoes'] }),
        queryClient.invalidateQueries({ queryKey: ['contas'] }),
        queryClient.invalidateQueries({ queryKey: ['cartoes'] }),
      ]),
  })
}

export function useRemoverTransacaoMutation() {
  const invalidar = useInvalidarTransacoes()

  return useMutation({
    mutationFn: (id: string) => transacoesApi.remover(id),
    onSuccess: invalidar,
  })
}
