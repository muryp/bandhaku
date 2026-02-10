import { $id } from '@/shared/utils/id'
import { addScript } from '@/shared/utils/addScript'
import type { TButtonProps, TLinkProps } from './types'
import { COLOR_TOKENS, type TColorKey } from '@/shared/consts/theme'

/**
 * Mapping Tailwind v4 Classes berdasarkan Design System Token.
 */
const getButtonStyles = (props: TButtonProps | TLinkProps) => {
  const {
    variant = 'filled',
    color = 'main',
    size = 'md',
    radius = 'md',
    width = 'compact',
    className = '',
  } = props

  // 1. Definisikan Token Warna secara Statis (Agar terbaca Tailwind Scanner)
  const c = COLOR_TOKENS[color as TColorKey] || COLOR_TOKENS.neutral

  // 2. Mapping Variant menggunakan Token yang sudah didefinisikan
  const variantStyles: Record<string, string> = {
    filled: `${c.bg} ${c.content} ${c.border} border hover:brightness-110`,
    outline: `bg-transparent border-2 ${c.border} ${c.text} hover:${c.bg} hover:${c.content}`,
    ghost: `bg-transparent ${c.text}`,
    text: `bg-transparent ${c.text} hover:underline`,
    link: `bg-transparent ${c.text} underline-offset-4 hover:underline`,
  }

  const sizeStyles = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
    xl: 'h-14 px-8 text-lg',
  }

  const radiusStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    rounded: 'rounded-full',
  }

  const widthStyles = {
    fit: 'w-fit',
    full: 'w-full',
    compact: 'min-w-[120px]',
  }

  return [
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50 decoration-none no-underline cursor-pointer',
    c.ring, // Tambahkan ring fokus dari token
    variantStyles[variant],
    sizeStyles[size],
    radiusStyles[radius],
    widthStyles[width],
    (props as any).isLoading ? 'relative !text-transparent shadow-none' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}
export const Button = (props: TButtonProps) => {
  const {
    label,
    type = 'button',
    isDisabled = false,
    isLoading = false,
    onClick,
  } = props
  const [idTag, action] =
    onClick && !isDisabled && !isLoading ? $id() : ['', null]

  const FullClass = getButtonStyles(props)
  const LoaderTemplate = isLoading
    ? '<span class="absolute inset-0 flex items-center justify-center"><span class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span></span>'
    : ''

  if (action) {
    addScript(() => {
      action((el: HTMLButtonElement) => {
        el.addEventListener('click', (e) => onClick!(el, e))
      })
    })
  }

  return html`
    <button
      ${idTag}
      type="${type}"
      class="${FullClass}"
      ${isDisabled || isLoading ? 'disabled' : ''}>
      ${LoaderTemplate}
      <span class="truncate">${label}</span>
    </button>
  `
}

export const Link = (props: TLinkProps) => {
  const { label, href, target = '_self', isDisabled = false, onClick } = props
  const [idTag, action] = onClick && !isDisabled ? $id() : ['', null]

  const FullClass = getButtonStyles({ ...props, width: props.width || 'fit' })

  if (action) {
    addScript(() => {
      action((el: HTMLAnchorElement) => {
        el.addEventListener('click', (e) => onClick!(el, e))
      })
    })
  }

  return html`
    <a
      ${idTag}
      href="${isDisabled ? 'javascript:void(0)' : href}"
      target="${target}"
      class="${FullClass}">
      <span class="truncate">${label}</span>
    </a>
  `
}