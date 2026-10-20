import { onMounted } from 'vue'
import { useEventListener, useIntervalFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { transacoesApi, type Transacao } from '@/api/transacoes.api'
import { dataIsoDaquiA, dataIsoLocal, formatarMoeda } from '@/utils/formatters'
import { descreverVencimento } from '@/utils/statusPagamento'

/** Quantos dias antes do vencimento uma conta não paga passa a ser lembrada. */
export const DIAS_ANTECEDENCIA_LEMBRETE = 3

/** Contas vencidas e ainda não pagas continuam sendo lembradas por até esse número de dias. */
const DIAS_LEMBRAR_VENCIDAS = 30

const INTERVALO_VERIFICACAO_MS = 60 * 60 * 1000

const CHAVE_PREFERENCIA = 'savi:lembretes-contas'
const CHAVE_AVISADAS = 'savi:lembretes-contas-avisadas'

export type PermissaoNotificacao = NotificationPermission | 'indisponivel'

export function lembretesAtivos(): boolean {
  try {
    return localStorage.getItem(CHAVE_PREFERENCIA) !== '0'
  } catch {
    return true
  }
}

export function definirLembretesAtivos(ativos: boolean) {
  try {
    localStorage.setItem(CHAVE_PREFERENCIA, ativos ? '1' : '0')
  } catch {
    // Armazenamento indisponível (ex.: aba anônima): a preferência volta ao padrão (ativo).
  }
}

/** No iOS a API só existe com o app instalado na tela de início (iOS 16.4+). */
export function permissaoNotificacoes(): PermissaoNotificacao {
  return 'Notification' in window ? Notification.permission : 'indisponivel'
}

/** Precisa ser chamado a partir de um gesto do usuário (clique), senão o navegador ignora o pedido. */
export async function solicitarPermissaoNotificacoes(): Promise<PermissaoNotificacao> {
  const atual = permissaoNotificacoes()
  if (atual !== 'default') return atual
  return Notification.requestPermission()
}

// Cada ocorrência é avisada no máximo uma vez por dia, mesmo que o app seja aberto várias vezes.
// Também fica em memória para funcionar quando o localStorage está bloqueado.
let avisadas: { dia: string; chaves: string[] } = lerAvisadas()

function lerAvisadas(): { dia: string; chaves: string[] } {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_AVISADAS) ?? '') ?? { dia: '', chaves: [] }
  } catch {
    return { dia: '', chaves: [] }
  }
}

function registrarAvisadas(dia: string, chaves: string[]) {
  avisadas = { dia, chaves }
  try {
    localStorage.setItem(CHAVE_AVISADAS, JSON.stringify(avisadas))
  } catch {
    // Sem armazenamento: o controle em memória evita repetir o aviso enquanto o app estiver aberto.
  }
}

function chaveOcorrencia(conta: Transacao) {
  return `${conta.id}:${conta.ocorrencia}`
}

function montarMensagem(contas: Transacao[], hojeIso: string) {
  const [primeira] = contas
  if (contas.length === 1 && primeira) {
    return {
      titulo: `${primeira.descricao} ${descreverVencimento(primeira.data, hojeIso)}`,
      corpo: `${formatarMoeda(primeira.valor)} · ${primeira.categoriaNome}`,
    }
  }

  const linhas = contas
    .slice(0, 3)
    .map((conta) => `${conta.descricao}: ${descreverVencimento(conta.data, hojeIso)} (${formatarMoeda(conta.valor)})`)
  if (contas.length > 3) linhas.push(`e mais ${contas.length - 3}`)

  return { titulo: `Você tem ${contas.length} contas para pagar`, corpo: linhas.join('\n') }
}

async function mostrarNotificacaoSistema(titulo: string, corpo: string, aoClicar: () => void) {
  if (permissaoNotificacoes() !== 'granted') return

  const opcoes: NotificationOptions = {
    body: corpo,
    icon: '/icons/icon-192.png',
    // A mesma tag substitui o aviso anterior em vez de empilhar notificações.
    tag: 'savi-contas-a-pagar',
    data: { url: '/inicio' },
  }

  try {
    // Com o PWA instalado o service worker exibe a notificação (obrigatório no Android) e trata o clique.
    const registro = await navigator.serviceWorker?.getRegistration()
    if (registro) {
      await registro.showNotification(titulo, opcoes)
      return
    }

    // Em dev não há service worker registrado.
    const notificacao = new Notification(titulo, opcoes)
    notificacao.onclick = () => {
      window.focus()
      aoClicar()
    }
  } catch {
    // Navegadores que não permitem `new Notification` fora do service worker: o aviso aparece na próxima abertura.
  }
}

/**
 * Lembra o usuário das despesas não pagas que vencem nos próximos dias (ou já venceram).
 * Verifica ao abrir o app, ao voltar para ele e de hora em hora enquanto estiver aberto:
 * com o app visível mostra um aviso na tela; em segundo plano, uma notificação do sistema (se permitido).
 *
 * Não há push do servidor: com o app totalmente fechado, o aviso aparece na próxima abertura.
 */
export function useLembretesContas() {
  const router = useRouter()

  function abrirInicio() {
    router.push({ name: 'inicio' })
  }

  async function verificar() {
    if (!lembretesAtivos()) return

    let contas: Transacao[]
    try {
      contas = await transacoesApi.listarPendentes(
        dataIsoDaquiA(-DIAS_LEMBRAR_VENCIDAS),
        dataIsoDaquiA(DIAS_ANTECEDENCIA_LEMBRETE),
      )
    } catch {
      return
    }

    const hojeIso = dataIsoLocal()
    const jaAvisadas = new Set(avisadas.dia === hojeIso ? avisadas.chaves : [])
    if (contas.every((conta) => jaAvisadas.has(chaveOcorrencia(conta)))) return

    registrarAvisadas(hojeIso, [...jaAvisadas, ...contas.map(chaveOcorrencia)])

    const { titulo, corpo } = montarMensagem(contas, hojeIso)

    if (document.visibilityState === 'visible') {
      toast.warning(titulo, {
        description: corpo,
        descriptionClass: 'whitespace-pre-line',
        duration: 10_000,
        action: { label: 'Ver', onClick: abrirInicio },
      })
    } else {
      await mostrarNotificacaoSistema(titulo, corpo, abrirInicio)
    }
  }

  onMounted(verificar)
  useEventListener(document, 'visibilitychange', () => {
    if (document.visibilityState === 'visible') verificar()
  })
  useIntervalFn(verificar, INTERVALO_VERIFICACAO_MS)
}
