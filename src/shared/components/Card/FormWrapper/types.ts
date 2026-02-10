import type { TCommonUIProps } from '@/shared/types/theme'

export interface TFormWrapperProps extends TCommonUIProps {
  title?: string
  description?: string
  content: string // Fragmen HTML dari input-input
  footer?: string // Fragmen HTML untuk tombol (Button/Link)
  onSubmit?: (e: SubmitEvent, form: HTMLFormElement) => void
  isLoading?: boolean
}