import type { Plugin } from 'vite'
import { ElementHtml } from './Element'

export function devConsolePlugin(): Plugin {
  // const htmlPath = options.htmlPath || 'src/components/devConsole.html'

  return {
    name: 'dev-console-inject',
    apply: 'serve', // Cuma jalan di dev mode, ga di build
    transformIndexHtml(html) {
      try {
        const devConsoleHTML = ElementHtml

        return html.replace('<body>', `<body>${devConsoleHTML}`)
      } catch (err) {
        console.warn('[devConsolePlugin] Gagal inject:', err)
        return html
      }
    },
  }
}