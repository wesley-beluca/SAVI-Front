import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { unref, type MaybeRef } from 'vue'
import { orcamentoApi, type DadosOrcamento } from '@/api/orcamento.api'

export function useOrcamentoQuery(mes: MaybeRef<number>, ano: MaybeRef<number>) {
  return useQuery({
    queryKey: ['orcamento', mes, ano],
    queryFn: () => orcamentoApi.obter(unref(mes), unref(ano)),
  })
}

export function useDefinirOrcamentoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dados: DadosOrcamento) => orcamentoApi.definir(dados),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orcamento'] }),
  })
}
