import { $id } from '@/shared/utils/id'
import { addScript } from '@/shared/utils/addScript'
import { Button } from '@/shared/components/Btn'
import { iconAlert } from '@/shared/assets/alert'
import { COLOR_TOKENS, type TColorKey } from '@/shared/consts/theme'
import type { TToastOptions } from './types'

export const Toast = (options: TToastOptions) => {
  const [containerId, containerAction] = $id()
  let handleDestroy = () => {}

  const typeMap: Record<string, TColorKey> = {
    error: 'danger',
    warning: 'warning',
    info: 'info',
    success: 'success',
    ask: 'second',
  }

  const activeColor = typeMap[options.type] || 'neutral'
  const c = COLOR_TOKENS[activeColor]
  const Icons = iconAlert[options.type] || iconAlert.info

  addScript(() => {
    containerAction((el: HTMLElement) => {
      handleDestroy = () => {
        el.classList.add('opacity-0', 'translate-x-8', 'scale-95')
        el.addEventListener('transitionend', () => el.remove(), { once: true })
      }

      if (options.duration && options.type !== 'ask') {
        const timer = setTimeout(() => handleDestroy(), options.duration)
        el.addEventListener('remove', () => clearTimeout(timer), { once: true })
      }

      if (options.type !== 'ask') el.onclick = () => handleDestroy()
    })
  })

  // --- FRAGMENTS ---
  const CloseBtn =
    options.type !== 'ask'
      ? html`<div
          class="shrink-0  w-5 h-10 text-error
    flex items-center justify-center">
          ${iconAlert.error}
        </div>`
      : ''

  const ActionButtons =
    options.type === 'ask'
      ? html` <div
          class="flex items-center justify-end gap-2 mt-4 pt-3 border-t ${c.border}">
          ${Button({
    label: 'Batal',
    variant: 'ghost',
    size: 'sm',
    onClick: (_, e) => {
      e.stopPropagation()
      options.onCancel?.()
      handleDestroy()
    },
  })}
          ${Button({
    label: 'Ya, Lanjutkan',
    variant: 'filled',
    color: 'second',
    size: 'sm',
    onClick: (_, e) => {
      e.stopPropagation()
      options.onConfirm?.()
      handleDestroy()
    },
  })}
        </div>`
      : ''

  // HAPUS "fixed", ganti jadi relative/width-full untuk stacking
  const containerClass = `
    w-full max-w-[400px] pointer-events-auto
    flex flex-col p-4 bg-base-300 shadow-2xl rounded-xl
    transition-all duration-300 transform animate-in fade-in slide-in-from-right-5
    border-l-4 ${c.border}
  `.trim()

  return html`
    <div ${containerId} class="${containerClass}">
      <div class="flex items-start gap-4">
        <div
          class="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${c.bg} ${c.content} bg-opacity-20">
          <span class="w-6 h-6">${Icons}</span>
        </div>
        <div class="flex-1 pt-0.5">
          <h4 class="text-sm font-bold ${c.text} leading-tight">
            ${options.title}
          </h4>
          <p class="text-[11px] text-base-content/70 mt-1 leading-relaxed">
            ${options.message}
          </p>
          ${ActionButtons}
        </div>
        ${CloseBtn}
      </div>
    </div>
  `
}