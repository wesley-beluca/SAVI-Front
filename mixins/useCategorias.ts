import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { categoriasApi, type DadosAtualizacaoCategoria, type DadosCategoria } from '@/api/categorias.api'

export function useCategoriasQuery() {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: categoriasApi.listar,
  })
}

function useInvalidarCategorias() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ['categorias'] })
    // Movimentações exibem nome, ícone e cor da categoria.
    queryClient.invalidateQueries({ queryKey: ['transacoes'] })
  }
}

export function useCriarCategoriaMutation() {
  const invalidar = useInvalidarCategorias()

  return useMutation({
    mutationFn: (dados: DadosCategoria) => categoriasApi.criar(dados),
    onSuccess: invalidar,
  })
}

export function useAtualizarCategoriaMutation() {
  const invalidar = useInvalidarCategorias()

  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: DadosAtualizacaoCategoria }) => categoriasApi.atualizar(id, dados),
    onSuccess: invalidar,
  })
}

export function useRemoverCategoriaMutation() {
  const invalidar = useInvalidarCategorias()

  return useMutation({
    mutationFn: (id: string) => categoriasApi.remover(id),
    onSuccess: invalidar,
  })
}
