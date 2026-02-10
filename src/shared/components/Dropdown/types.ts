export type TDropdownSize = 'sm' | 'md' | 'lg'
export type TDropdownWidth = 'fit' | 'full' | 'compact'

export interface TOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface TDropdownProps {
  label?: string
  options: TOption[]
  value?: string | number
  placeholder?: string
  size?: TDropdownSize
  width?: TDropdownWidth
  disabled?: boolean
  required?: boolean
  error?: string
  className?: string
  onChange?: (value: string, el: HTMLSelectElement, e: Event) => void
}