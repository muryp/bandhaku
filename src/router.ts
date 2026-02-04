import MurypRoutesDom from '@muryp/router-dom'
import { AddRouter } from './features/transactions/router'
import type { TMurypRoutes } from '@muryp/router-dom/types'
import { HomePages } from './bak/pages/home'
import addScript from './bak/pages/add/script'
import { executeScripts } from '@/utils/addScript'
import { resetId } from '@/utils/id'

// TODO: HAPUS TYPE MURYPT ROUTER SETELAH UPDTAE TYPE
const routes: TMurypRoutes = {
  '@404': {
    component: ({ url }) => `<h1>404 Not Found</h1><div>URL: ${url}</div>`,
    title: ({ url }) => `404 - ${url}`,
    script: ({ url }) => {
      console.log('404 script executed', url)
    },
  },
  '/example': {
    component: () => {
      return HomePages
    },
    script: () => {
      addScript()
    },
  },
  '/': {
    component: () => {
      return html`hrllo`
    },
    title: 'home',
  },
  '/transaction': AddRouter,
}

export default function router() {
  MurypRoutesDom({
    routes,
    settings: {
      id: 'app',
      isFirstRender: true,
      middleware: () => {
        resetId()
        return true
      },
      script: () => {
        executeScripts()
      },
    },
  })
}
