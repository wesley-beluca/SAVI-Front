import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

/** Mapa campo -> mensagem de erro; valores falsy indicam campo válido. */
type RegrasValidacao = Record<string, string | false | null | undefined>

/**
 * Valida os campos de um formulário e informa ao usuário o que está faltando.
 * Os erros só aparecem após a primeira tentativa de envio e passam a ser
 * reavaliados em tempo real, sumindo conforme o usuário corrige os campos.
 */
export function useValidacaoFormulario(regras: () => RegrasValidacao) {
  const tentouEnviar = ref(false)

  const errosAtuais = computed(() => {
    const resultado: Record<string, string> = {}
    for (const [campo, mensagem] of Object.entries(regras())) {
      if (mensagem) resultado[campo] = mensagem
    }
    return resultado
  })

  const erros = computed<Record<string, string>>(() => (tentouEnviar.value ? errosAtuais.value : {}))

  function validar(): boolean {
    tentouEnviar.value = true

    const mensagens = Object.values(errosAtuais.value)
    if (mensagens.length === 0) return true

    toast.error(
      mensagens.length === 1 ? 'Não foi possível continuar: 1 campo precisa de atenção.' : `Não foi possível continuar: ${mensagens.length} campos precisam de atenção.`,
      { description: mensagens.join(' ') },
    )
    return false
  }

  function resetar() {
    tentouEnviar.value = false
  }

  return { erros, validar, resetar }
}

export function campoObrigatorio(rotulo: string): string {
  return `O campo "${rotulo}" é obrigatório.`
}
