import { $id } from '@/utils/id'
import { addScript } from '@/utils/addScript'
import type { TAlertOptions } from '@/shared/types/alert'
import './style.css'
import { iconAlert } from '@/shared/assets/alert'

interface TExtendedAlertOptions extends TAlertOptions {
  duration?: number // dalam milidetik
}

//TODO: ICONS INFO AND CHECKN IF ERROR
export const Alert = (options: TExtendedAlertOptions) => {
  const [containerId, containerAction] = $id()

  const config = {
    error: { icon: iconAlert.error, color: '#ef4444' },
    warning: { icon: iconAlert.warning, color: '#f59e0b' },
    info: { icon: iconAlert.success, color: '#3b82f6' },
    success: { icon: iconAlert.success, color: '#3b82f6' },
    ask: { icon: iconAlert.question, color: '#10b981' },
  }[options.type]

  addScript(() => {
    containerAction((el) => {
      const destroy = () => {
        el.classList.add('slide-out')
        el.addEventListener('animationend', () => el.remove())
      }

      if (options.duration && options.type !== 'ask') {
        setTimeout(destroy, options.duration)
      }

      el.addEventListener('click', destroy) // Klik di mana saja untuk hapus (feel mobile)
    })
  })

  return html`
    <div ${containerId} class="mobile-notification ${options.type}">
      <div class="notif-icon">${config.icon}</div>
      <div class="notif-body">
        <div class="notif-title">${options.title}</div>
        <div class="notif-message">${options.message}</div>
      </div>
      <div class="notif-handle"></div>
    </div>
  `
}
