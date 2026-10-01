const scriptsCarregados = new Set<string>()

function carregarScript(src: string): Promise<void> {
  if (scriptsCarregados.has(src)) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => {
      scriptsCarregados.add(src)
      resolve()
    }
    script.onerror = () => reject(new Error(`Falha ao carregar script: ${src}`))
    document.head.appendChild(script)
  })
}

interface OpcoesGoogleIdentity {
  clientId: string
  container: HTMLElement
  aoReceberCredencial: (idToken: string) => void
}

export async function inicializarGoogleIdentity(opcoes: OpcoesGoogleIdentity) {
  await carregarScript('https://accounts.google.com/gsi/client')

  window.google?.accounts.id.initialize({
    client_id: opcoes.clientId,
    callback: (response) => opcoes.aoReceberCredencial(response.credential),
  })

  window.google?.accounts.id.renderButton(opcoes.container, {
    theme: 'outline',
    size: 'large',
    width: 320,
  })
}
