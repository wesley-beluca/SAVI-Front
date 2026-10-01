import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { unref, type MaybeRef } from 'vue'
import { transacoesApi, type DadosTransacao } from '@/api/transacoes.api'

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
  }
}

export function useCriarTransacaoMutation() {
  const invalidar = useInvalidarTransacoes()

  return useMutation({
    mutationFn: (dados: DadosTransacao) => transacoesApi.criar(dados),
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

export function useRemoverTransacaoMutation() {
  const invalidar = useInvalidarTransacoes()

  return useMutation({
    mutationFn: (id: string) => transacoesApi.remover(id),
    onSuccess: invalidar,
  })
}
