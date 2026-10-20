// Carregado pelo service worker gerado pelo vite-plugin-pwa (workbox.importScripts no vite.config.ts).
// Ao tocar na notificação de contas a pagar, foca o app se já estiver aberto ou abre uma nova janela.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const url = new URL(event.notification.data?.url ?? '/', self.location.origin).href

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((janelas) => {
      const janela = janelas.find((cliente) => cliente.url.startsWith(self.location.origin))
      if (!janela) return self.clients.openWindow(url)

      return janela.focus().then((focada) => focada.navigate(url).catch(() => focada))
    }),
  )
})
