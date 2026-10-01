import { computed, readonly, ref } from 'vue'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export type Plataforma = 'ios' | 'android' | 'desktop'

const CHAVE_APRESENTACAO_VISTA = 'savi:apresentacao-vista'

const eventoInstalacao = ref<BeforeInstallPromptEvent | null>(null)
const instalado = ref(false)

function detectarPlataforma(): Plataforma {
  const userAgent = navigator.userAgent
  const ehIpadComoMac = /Macintosh/.test(userAgent) && navigator.maxTouchPoints > 1

  if (/iPhone|iPad|iPod/i.test(userAgent) || ehIpadComoMac) return 'ios'
  if (/Android/i.test(userAgent)) return 'android'
  return 'desktop'
}

export function estaRodandoComoApp(): boolean {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true
  return iosStandalone || window.matchMedia('(display-mode: standalone)').matches
}

export function apresentacaoJaVista(): boolean {
  try {
    return localStorage.getItem(CHAVE_APRESENTACAO_VISTA) === '1'
  } catch {
    return false
  }
}

export function marcarApresentacaoVista() {
  try {
    localStorage.setItem(CHAVE_APRESENTACAO_VISTA, '1')
  } catch {
    // Armazenamento indisponível (ex.: aba anônima): a apresentação volta a aparecer, sem prejuízo.
  }
}

/** Deve ser chamado na inicialização do app: o navegador dispara `beforeinstallprompt` antes das telas montarem. */
export function registrarEventosInstalacao() {
  window.addEventListener('beforeinstallprompt', (evento) => {
    evento.preventDefault()
    eventoInstalacao.value = evento as BeforeInstallPromptEvent
  })

  window.addEventListener('appinstalled', () => {
    instalado.value = true
    eventoInstalacao.value = null
  })
}

export function useInstalacaoPwa() {
  const plataforma = detectarPlataforma()
  const podeInstalarDireto = computed(() => eventoInstalacao.value !== null)

  /** Abre o prompt nativo de instalação. Retorna `true` se o usuário aceitou. */
  async function instalar(): Promise<boolean> {
    const evento = eventoInstalacao.value
    if (!evento) return false

    await evento.prompt()
    const { outcome } = await evento.userChoice
    eventoInstalacao.value = null
    return outcome === 'accepted'
  }

  return { plataforma, podeInstalarDireto, instalado: readonly(instalado), instalar }
}
