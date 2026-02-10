import { IconsNav } from '@/shared/assets/nav'

/**
 * Representasi item navigasi pada Header.
 * @property icon - Harus merupakan key yang valid dari object IconsNav.
 */
export interface TNavItem {
  name: string
  link: string
  icon: keyof typeof IconsNav
}

/**
 * Props untuk komponen Header.
 */
export interface THeaderProps {
  brandName: string
  logoUrl?: string
  menuItems: TNavItem[]
}