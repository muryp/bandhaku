import type { TCommonUIProps } from '@/shared/types/theme'

export interface TButtonProps extends TCommonUIProps {
  label: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: (el: HTMLButtonElement, e: MouseEvent) => void
}

export interface TLinkProps extends TCommonUIProps {
  label: string
  href: string
  target?: '_blank' | '_self'
  onClick?: (el: HTMLAnchorElement, e: MouseEvent) => void
}
