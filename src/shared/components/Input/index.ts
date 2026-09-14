import { $id } from '@/shared/utils/id'
import { addScript } from '@/shared/utils/addScript'
import type { TInputProps } from './types'

const getInputStyles = (props: TInputProps) => {
  const {
    size = 'md',
    radius = 'md',
    width = 'full',
    error,
    type,
    className = '',
  } = props

  if (type === 'checkbox') {
    const checkboxBase = 'peer appearance-none shrink-0 cursor-pointer border-1 border-base-300 bg-base-100 transition-all duration-200 checked:bg-primary checked:border-primary focus:ring-4 focus:ring-primary/15 disabled:bg-base-300'
    const checkboxSize = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7',
    }[size]
    const checkboxRadius = {
      none: 'rounded-none',
      sm: 'rounded-[2px]',
      md: 'rounded',
      lg: 'rounded-md',
      xl: 'rounded-lg',
      rounded: 'rounded-full',
    }[radius || 'md']

    return [checkboxBase, checkboxSize, checkboxRadius, className].join(' ')
  }

  const base = 'w-full bg-base-100 text-base-content border-1 transition-all duration-200 outline-none shadow-sm hover:shadow-md disabled:bg-base-200 disabled:cursor-not-allowed disabled:shadow-none appearance-none'
  const stateClasses = error
    ? 'border-error shadow-error/10 focus:ring-4 focus:ring-error/20'
    : 'border-base-300 hover:border-base-400 focus:border-primary focus:ring-4 focus:ring-primary/15'

  const sizeStyles = {
    sm: 'h-9 px-3 text-xs',
    md: 'h-11 px-4 text-sm',
    lg: 'h-13 px-5 text-base',
    xl: 'h-15 px-6 text-lg',
  }[size]
  const radiusStyles = {
    none: 'rounded-none',
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    rounded: 'rounded-full',
  }[radius || 'md']
  const widthStyles = {
    fit: 'w-fit',
    full: 'w-full',
    compact: 'max-w-[280px]',
  }[width]

  return [base, stateClasses, sizeStyles, radiusStyles, widthStyles, className]
    .filter(Boolean)
    .join(' ')
}

export const Input = (props: TInputProps) => {
  const {
    label,
    type = 'text',
    placeholder = '',
    value = '',
    isChecked = false,
    name = '',
    rows = 3,
    disabled = false,
    required = false,
    error = '',
    onChange,
  } = props

  // 1. Logic & ID Generation
  const [idTag, action] = onChange ? $id() : ['', null]

  if (onChange && action) {
    addScript(() => {
      action<HTMLInputElement | HTMLTextAreaElement>((el) => {
        const eventType = type === 'checkbox' ? 'change' : 'input'
        el.addEventListener(eventType, (e) => {
          const val =
            type === 'checkbox'
              ? (el as HTMLInputElement).checked.toString()
              : el.value
          onChange(val, el, e)
        })
      })
    })
  }

  // 2. Predefined Variables for Template
  const FieldClass = getInputStyles(props)
  const IsDisabled = disabled ? 'disabled' : ''
  const IsRequired = required ? 'required' : ''
  const IsChecked = isChecked ? 'checked' : ''
  const ContainerWidth = props.width === 'fit' ? 'w-fit' : 'w-full'

  const RequiredIndicator = required
    ? html`<span class="text-error ml-1">*</span>`
    : ''

  const ErrorMessage = error
    ? html`<span
        class="block mt-1.5 ml-1 text-xs text-error font-medium animate-in fade-in slide-in-from-top-1"
        >${error}</span
      >`
    : ''

  const CheckboxIcon = html`
    <div
      class="absolute inset-0 flex items-center justify-center pointer-events-none text-primary-content opacity-0 peer-checked:opacity-100 transition-opacity">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-3/4 h-3/4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
  `

  const LabelContent = label
    ? html`<span
        class="text-sm font-medium text-base-content/80 group-hover:text-base-content transition-colors"
        >${label}${RequiredIndicator}</span
      >`
    : ''

  const InputLabel = label
    ? html`<label
        class="block text-sm font-medium text-base-content/70 mb-1.5 ml-1"
        >${label}${RequiredIndicator}</label
      >`
    : ''

  // 3. Elements Definitions
  const TextareaElement = html`
    <textarea
      ${idTag}
      name="${name}"
      class="${FieldClass} py-2 min-h-[80px]"
      placeholder="${placeholder}"
      rows="${rows}"
      ${IsDisabled}>
${value}</textarea
    >
  `

  const StandardInputElement = html`
    <input
      ${idTag}
      type="${type}"
      name="${name}"
      class="${FieldClass}"
      placeholder="${placeholder}"
      value="${value}"
      autocomplete="off"
      ${IsDisabled}
      ${IsRequired} />
  `

  const CheckboxInputElement = html`
    <input
      ${idTag}
      type="checkbox"
      name="${name}"
      value="${value}"
      class="${FieldClass}"
      ${IsChecked}
      ${IsDisabled}
      ${IsRequired} />
  `

  // 4. Final Templates
  const CheckboxTemplate = html`
    <div class="flex flex-col mb-4">
      <label class="inline-flex items-center cursor-pointer gap-2.5 group">
        <div class="relative flex items-center justify-center">
          ${CheckboxInputElement} ${CheckboxIcon}
        </div>
        ${LabelContent}
      </label>
      ${ErrorMessage}
    </div>
  `

  const FieldElement =
    type === 'textarea' ? TextareaElement : StandardInputElement

  const MainTemplate = html`
    <div class="flex flex-col ${ContainerWidth} mb-4">
      ${InputLabel}
      <div class="relative flex items-center w-full">${FieldElement}</div>
      ${ErrorMessage}
    </div>
  `

  return type === 'checkbox' ? CheckboxTemplate : MainTemplate
}
