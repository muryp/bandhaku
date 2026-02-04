import { $id } from '@/shared/utils/id'
import { addScript } from '@/shared/utils/addScript'
import type { TAlertOptions } from '@/shared/types/alert'
import { iconAlert } from '@/shared/assets/alert'
import './style.css'

interface TExtendedAlertOptions extends TAlertOptions {
  duration?: number
  onConfirm?: () => void
  onCancel?: () => void
}

export const Alert = (options: TExtendedAlertOptions) => {
  const [containerId, containerAction] = $id()
  const [yesBtnId, yesBtnAction] = $id()
  const [noBtnId, noBtnAction] = $id()

  const config = {
    error: { icon: iconAlert.error, color: '#ef4444' },
    warning: { icon: iconAlert.warning, color: '#f59e0b' },
    info: { icon: iconAlert.success, color: '#3b82f6' },
    success: { icon: iconAlert.success, color: '#3b82f6' },
    ask: { icon: iconAlert.question, color: '#10b981' },
  }[options.type]

  // Logic Handling
  addScript(() => {
    containerAction((el) => {
      const destroy = () => {
        el.classList.add('slide-out')
        el.addEventListener('animationend', () => el.remove())
      }

      // Auto-destroy for non-interactive alerts
      if (options.duration && options.type !== 'ask') {
        setTimeout(destroy, options.duration)
      }

      // Interaction for 'ask' type
      if (options.type === 'ask') {
        yesBtnAction((btn) => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation()
            options.onConfirm?.()
            destroy()
          })
        })

        noBtnAction((btn) => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation()
            options.onCancel?.()
            destroy()
          })
        })
      }

      // Base click to dismiss
      el.addEventListener('click', destroy)
    })
  })

  // Template Fragments
  const actionButtons = html`
    <div class="notif-actions">
      <button ${noBtnId} class="btn-notif btn-no">Batal</button>
      <button ${yesBtnId} class="btn-notif btn-yes">Ya, Lanjutkan</button>
    </div>
  `

  return html`
    <div ${containerId} class="mobile-notification ${options.type}">
      <div class="notif-content">
        <div class="notif-icon">${config.icon}</div>
        <div class="notif-body">
          <div class="notif-title">${options.title}</div>
          <div class="notif-message">${options.message}</div>
        </div>
      </div>
      ${options.type === 'ask' ? actionButtons : ''}
      <div class="notif-handle"></div>
    </div>
  `
}
