import type { TCommonUIProps } from '@/shared/types/theme'

export type TInputType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'textarea'
  | 'tel'
  | 'date'

export interface TInputProps extends Omit<TCommonUIProps, 'variant'> {
  disabled?: boolean
  label?: string
  type?: TInputType
  placeholder?: string
  value?: string
  name?: string
  rows?: number
  required?: boolean
  error?: string
  onChange?: (
    value: string,
    el: HTMLInputElement | HTMLTextAreaElement,
    e: Event,
  ) => void
}
