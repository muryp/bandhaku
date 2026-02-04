import { Alert } from '@/shared/components/Alert'
import { executeScripts } from '@/utils/addScript'
import type { TAlertOptions } from '@/shared/types/alert'

export const toast = {
  show(options: TAlertOptions & { duration?: number }) {
    // const container = this._getContainer()
    const alertHtml = Alert(options)

    // Gunakan afterbegin agar yang terbaru muncul di atas
    document.body.insertAdjacentHTML('afterbegin', alertHtml)

    // Lifecycle Bandhaku
    executeScripts()
  },

  // Shortcut methods
  info(title: string, message: string, duration = 3000) {
    this.show({ type: 'info', title, message, duration })
  },

  error(title: string, message: string, duration = 5000) {
    this.show({ type: 'error', title, message, duration })
  },

  warning(title: string, message: string, duration = 4000) {
    this.show({ type: 'warning', title, message, duration })
  },

  ask(
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
  ) {
    this.show({ type: 'ask', title, message, onConfirm, onCancel })
  },
}
