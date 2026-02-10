import { $id } from '@/shared/utils/id'
import { addScript } from '@/shared/utils/addScript'
import type { TFormWrapperProps } from './types'

const getWrapperStyles = (props: TFormWrapperProps) => {
  const { radius = 'xl', className = '' } = props

  const radiusStyles = {
    none: 'rounded-none',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    rounded: 'rounded-[2rem]',
  }

  return [
    'relative overflow-hidden bg-base-100 border border-base-300 shadow-xl transition-all duration-300',
    radiusStyles[radius],
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

export const FormWrapper = (props: TFormWrapperProps) => {
  const {
    title,
    description,
    content,
    footer,
    onSubmit,
    isLoading = false,
  } = props

  const [idTag, action] = onSubmit ? $id() : ['', null]

  // 1. Script Lifecycle untuk Handling Submit
  if (onSubmit && action) {
    addScript(() => {
      action<HTMLFormElement>((form) => {
        form.onsubmit = (e) => {
          e.preventDefault()
          onSubmit(e, form)
        }
      })
    })
  }

  // 2. Fragments (Templating Rules)

  const HeaderTemplate = title
    ? `<div class="px-6 py-5 border-b border-base-200">
        <h2 class="text-xl font-bold text-base-content">${title}</h2>
        ${description ? `<p class="text-sm text-base-content/60 mt-1">${description}</p>` : ''}
      </div>`
    : ''

  const FooterTemplate = footer
    ? `<div class="px-6 py-4 bg-base-50/50 border-t border-base-200 flex items-center justify-end gap-3">
        ${footer}
      </div>`
    : ''

  // Overlay saat loading agar input tidak bisa diinteraksi
  const LoadingOverlay = isLoading
    ? `<div class="absolute inset-0 z-20 bg-base-100/60 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
        <div class="flex flex-col items-center gap-3">
          <span class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
          <span class="text-sm font-medium text-primary">Menyimpan data...</span>
        </div>
      </div>`
    : ''

  const FullClass = getWrapperStyles(props)

  // 3. Output dengan semantic <form> jika ada onSubmit
  return html`
    <div class="${FullClass}">
      ${LoadingOverlay}
      <form ${idTag} class="flex flex-col h-full">
        ${HeaderTemplate}
        <div class="p-6 flex-1 overflow-y-auto">${content}</div>
        ${FooterTemplate}
      </form>
    </div>
  `
}
