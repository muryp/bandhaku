export type TToastType = 'error' | 'warning' | 'info' | 'ask' | 'success'

export interface TToastOptions {
  title: string
  message: string
  type: TToastType
  onConfirm?: () => void
  onCancel?: () => void
  duration?: number
}