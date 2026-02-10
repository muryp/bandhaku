/**
 * BANDHAKU COLOR TOKENS
 * Source of truth untuk class warna Tailwind di seluruh komponen.
 */
export const COLOR_TOKENS = {
  main: {
    bg: 'bg-primary',
    text: 'text-primary-content',
    content: 'text-primary-content',
    border: 'border-primary',
    ring: 'focus:ring-primary/20',
    hoverBg: 'hover:bg-primary/10',
    hoverBrightness: 'hover:brightness-110',
  },
  second: {
    bg: 'bg-secondary',
    text: 'text-secondary',
    content: 'text-secondary-content',
    border: 'border-secondary',
    ring: 'focus:ring-secondary/20',
    hoverBg: 'hover:bg-secondary/10',
    hoverBrightness: 'hover:brightness-110',
  },
  neutral: {
    bg: 'bg-neutral',
    text: 'text-base-content',
    content: 'text-neutral-content',
    border: 'border-base-300',
    ring: 'focus:ring-base-content/10',
    hoverBg: 'hover:bg-base-200',
    hoverBrightness: 'hover:brightness-105',
  },
  danger: {
    bg: 'bg-error',
    text: 'text-error',
    content: 'text-error-content',
    border: 'border-error',
    ring: 'focus:ring-error/20',
    hoverBg: 'hover:bg-error/10',
    hoverBrightness: 'hover:brightness-110',
  },
  success: {
    bg: 'bg-success',
    text: 'text-success',
    content: 'text-success-content',
    border: 'border-success',
    ring: 'focus:ring-success/20',
    hoverBg: 'hover:bg-success/10',
    hoverBrightness: 'hover:brightness-110',
  },
  warning: {
    bg: 'bg-warning',
    text: 'text-warning',
    content: 'text-warning-content',
    border: 'border-warning',
    ring: 'focus:ring-warning/20',
    hoverBg: 'hover:bg-warning/10',
    hoverBrightness: 'hover:brightness-110',
  },
  info: {
    bg: 'bg-info',
    text: 'text-info',
    content: 'text-info-content',
    border: 'border-info',
    ring: 'focus:ring-info/20',
    hoverBg: 'hover:bg-info/10',
    hoverBrightness: 'hover:brightness-110',
  },
} as const

export type TColorKey = keyof typeof COLOR_TOKENS
