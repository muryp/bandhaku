import { $id } from '@/shared/utils/id'
import { addScript } from '@/shared/utils/addScript'
import type { TDropdownProps } from './types'

export const Dropdown = ({
  label,
  options,
  value = '',
  placeholder = 'Select option...',
  size = 'md',
  width = 'full',
  disabled = false,
  required = false,
  error = '',
  className = '',
  onChange,
}: TDropdownProps) => {
  // 1. Lifecycle & Event Handling
  const [idTag, action] = onChange ? $id() : ['', null]

  if (onChange && action) {
    addScript(() => {
      action<HTMLSelectElement>((el) => {
        el.addEventListener('change', (e) => onChange(el.value, el, e))
      })
    })
  }

  // 2. Fragments (CamelCase as per Style Guide)
  const RequiredIndicator = required ? '*' : ''

  const LabelTemplate = label
    ? html`<label class="block text-sm font-medium text-base-content mb-1.5"
        >${label}${RequiredIndicator}</label
      >`
    : ''

  const PlaceholderTemplate = placeholder
    ? html`<option value="" disabled ${!value ? 'selected' : ''}>
        ${placeholder}
      </option>`
    : ''

  // Mapping options tanpa nested html tag yang kompleks di dalam loop join
  const OptionsTemplate = options
    .map((opt) => {
      const isSelected = opt.value === value ? 'selected' : ''
      const isDisabled = opt.disabled ? 'disabled' : ''
      return html`<option value="${opt.value}" ${isSelected} ${isDisabled}>
        ${opt.label}
      </option>`
    })
    .join('')

  const ErrorTemplate = error
    ? html`<p class="mt-1.5 text-xs text-error font-medium">${error}</p>`
    : ''

  // 3. Styling Logic (Tailwind v4 Semantic Colors)
  const SizeClasses = {
    sm: 'h-8 text-xs px-2',
    md: 'h-10 text-sm px-3',
    lg: 'h-12 text-base px-4',
  }

  const WidthClasses = {
    fit: 'w-auto',
    full: 'w-full',
    compact: 'w-40',
  }

  const FieldBase =
    'appearance-none border rounded-lg transition-all focus:outline-hidden focus:ring-2'
  const ColorState = error
    ? 'border-error text-error-content focus:ring-error/20'
    : 'border-base-300 text-base-content focus:ring-primary/20 bg-base-100'

  const fieldClass = `${FieldBase} ${SizeClasses[size]} ${ColorState} w-full pr-10 cursor-pointer disabled:opacity-50`
  const containerClass =
    `relative inline-block ${WidthClasses[width]} ${className}`.trim()

  return html`
    <div class="${containerClass}">
      ${LabelTemplate}
      <div class="relative group">
        <select
          ${idTag}
          class="${fieldClass}"
          ${disabled ? 'disabled' : ''}
          ${required ? 'required' : ''}>
          ${PlaceholderTemplate} ${OptionsTemplate}
        </select>

        <div
          class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-base-content/50 group-focus-within:text-primary">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      ${ErrorTemplate}
    </div>
  `
}
