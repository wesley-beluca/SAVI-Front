import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { contasApi, type DadosConta } from '@/api/contas.api'

export function useContasQuery() {
  return useQuery({
    queryKey: ['contas'],
    queryFn: contasApi.listar,
  })
}

function useInvalidarContas() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['contas'] })
}

export function useCriarContaMutation() {
  const invalidar = useInvalidarContas()

  return useMutation({
    mutationFn: (dados: DadosConta) => contasApi.criar(dados),
    onSuccess: invalidar,
  })
}

export function useAtualizarContaMutation() {
  const invalidar = useInvalidarContas()

  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: DadosConta }) => contasApi.atualizar(id, dados),
    onSuccess: invalidar,
  })
}

export function useRemoverContaMutation() {
  const invalidar = useInvalidarContas()

  return useMutation({
    mutationFn: (id: string) => contasApi.remover(id),
    onSuccess: invalidar,
  })
}
