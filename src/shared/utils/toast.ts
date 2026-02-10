import { executeScripts } from '@/shared/utils/addScript'
import type { TToastOptions } from '../components/Toast/types'
import { Toast } from '../components/Toast'

export const toast = {
  /**
   * Mengambil atau membuat container tunggal untuk menampung semua toast.
   * Menggunakan pointer-events-none agar tidak menghalangi UI lain.
   */
  _getContainer(type: string): HTMLElement {
    let container = document.getElementById(`toast-stack-container-${type}`)
    const position = type === 'ask' ? 'bottom-6' : 'top-6'
    if (!container) {
      container = document.createElement('div')
      container.id = `toast-stack-container-${type}`
      // Styling: Fixed di pojok, flex-col agar menumpuk rapi ke bawah
      container.className = `fixed ${position} right-4 left-4
      sm:left-auto sm:w-[400px] z-[200] flex flex-col
      gap-3 pointer-events-none`
      document.body.appendChild(container)
    }

    return container
  },

  show(options: TToastOptions) {
    const container = this._getContainer(options.type)
    const alertHtml = Toast(options)

    /**
     * Gunakan 'beforeend' agar toast baru muncul di paling bawah stack.
     * Jika Senior ingin yang terbaru di paling atas, gunakan 'afterbegin'.
     */
    container.insertAdjacentHTML('beforeend', alertHtml)

    // Lifecycle Bandhaku: Jalankan script event listener milik Toast
    executeScripts()
  },

  // --- Shortcut Methods ---

  info(title: string, message: string, duration = 3000) {
    this.show({ type: 'info', title, message, duration })
  },

  success(title: string, message: string, duration = 3000) {
    this.show({ type: 'success', title, message, duration })
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
