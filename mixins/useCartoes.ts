import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { cartoesApi, type DadosCartao } from '@/api/cartoes.api'

export function useCartoesQuery() {
  return useQuery({
    queryKey: ['cartoes'],
    queryFn: cartoesApi.listar,
  })
}

function useInvalidarCartoes() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['cartoes'] })
}

export function useCriarCartaoMutation() {
  const invalidar = useInvalidarCartoes()

  return useMutation({
    mutationFn: (dados: DadosCartao) => cartoesApi.criar(dados),
    onSuccess: invalidar,
  })
}

export function useAtualizarCartaoMutation() {
  const invalidar = useInvalidarCartoes()

  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: DadosCartao }) => cartoesApi.atualizar(id, dados),
    onSuccess: invalidar,
  })
}

export function useRemoverCartaoMutation() {
  const invalidar = useInvalidarCartoes()

  return useMutation({
    mutationFn: (id: string) => cartoesApi.remover(id),
    onSuccess: invalidar,
  })
}
