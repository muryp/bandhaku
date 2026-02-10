import { $id } from '@/shared/utils/id'
import { addScript } from '@/shared/utils/addScript'
import type { TInputProps } from './types'

const getInputStyles = (props: TInputProps) => {
  const {
    size = 'md',
    radius = 'md',
    width = 'full',
    error,
    className = '',
  } = props

  const base = `
    w-full bg-base-100 text-base-content
    border-1 transition-all duration-200 outline-none
    shadow-sm hover:shadow-md
    disabled:bg-base-200 disabled:cursor-not-allowed disabled:shadow-none
    appearance-none
  `

  const stateClasses = error
    ? 'border-error shadow-error/10 focus:ring-4 focus:ring-error/20'
    : 'border-base-300 hover:border-base-400 focus:border-primary focus:ring-4 focus:ring-primary/15'

  const sizeStyles = {
    sm: 'h-9 px-3 text-xs',
    md: 'h-11 px-4 text-sm',
    lg: 'h-13 px-5 text-base',
    xl: 'h-15 px-6 text-lg',
  }

  const radiusStyles = {
    none: 'rounded-none',
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    rounded: 'rounded-full',
  }

  const widthStyles = {
    fit: 'w-fit',
    full: 'w-full',
    compact: 'max-w-[280px]',
  }

  return [
    base,
    stateClasses,
    sizeStyles[size],
    radiusStyles[radius || 'md'],
    widthStyles[width],
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

export const Input = (props: TInputProps) => {
  const {
    label,
    type = 'text',
    placeholder = '',
    value = '',
    name = '',
    rows = 3,
    disabled = false,
    required = false,
    error = '',
    onChange,
  } = props

  const [idTag, action] = onChange ? $id() : ['', null]

  // 1. Script Lifecycle: Register event listener
  if (onChange && action) {
    addScript(() => {
      action<HTMLInputElement | HTMLTextAreaElement>((el) => {
        // 'input' event covers text, textarea, and date picker changes
        el.addEventListener('input', (e) => onChange(el.value, el, e))
      })
    })
  }

  const FieldClass = getInputStyles(props)

  const LabelTemplate = label
    ? `<label class="block text-sm font-medium text-base-content/70 mb-1.5 ml-1">
        ${label}${required ? '<span class="text-error ml-1">*</span>' : ''}
      </label>`
    : ''

  const ErrorTemplate = error
    ? `<span class="block mt-1.5 ml-1 text-xs text-error font-medium animate-in fade-in slide-in-from-top-1">${error}</span>`
    : ''

  // 2. Fragment Templates
  let InputElement = ''

  if (type === 'textarea') {
    InputElement = `
      <textarea
        ${idTag}
        name="${name}"
        class="${FieldClass} py-2 min-h-[80px]"
        placeholder="${placeholder}"
        rows="${rows}"
        ${disabled ? 'disabled' : ''}>${value}</textarea>`
  } else {
    // Supports text, number, email, password, url, and now DATE
    InputElement = `
      <input
        ${idTag}
        type="${type}"
        name="${name}"
        class="${FieldClass} ${type === 'date' ? 'uppercase' : ''}"
        placeholder="${placeholder}"
        value="${value}"
        autocomplete="off"
        ${disabled ? 'disabled' : ''}
        ${required ? 'required' : ''} />`
  }

  // 3. Final Layout Output
  return `
    <div class="flex flex-col ${props.width === 'fit' ? 'w-fit' : 'w-full'} mb-4">
      ${LabelTemplate}
      <div class="relative flex items-center w-full">
        ${InputElement}
      </div>
      ${ErrorTemplate}
    </div>
  `
}