import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { metasApi, type DadosMeta } from '@/api/metas.api'

export function useMetasQuery() {
  return useQuery({
    queryKey: ['metas'],
    queryFn: metasApi.listar,
  })
}

function useInvalidarMetas() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['metas'] })
}

export function useCriarMetaMutation() {
  const invalidar = useInvalidarMetas()

  return useMutation({
    mutationFn: (dados: DadosMeta) => metasApi.criar(dados),
    onSuccess: invalidar,
  })
}

export function useAtualizarMetaMutation() {
  const invalidar = useInvalidarMetas()

  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: DadosMeta }) => metasApi.atualizar(id, dados),
    onSuccess: invalidar,
  })
}

export function useRemoverMetaMutation() {
  const invalidar = useInvalidarMetas()

  return useMutation({
    mutationFn: (id: string) => metasApi.remover(id),
    onSuccess: invalidar,
  })
}
