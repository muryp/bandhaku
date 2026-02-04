export type TAlertType = 'error' | 'warning' | 'info' | 'ask' | 'success'

export interface TAlertOptions {
  title: string
  message: string
  type: TAlertType
  onConfirm?: () => void
  onCancel?: () => void
}
