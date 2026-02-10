/**
 * === THEME TYPES: BANDHAKU DESIGN SYSTEM ===
 * Source of truth untuk semua token visual aplikasi.
 */

/**
 * Visual Style: Menentukan 'bobot' komponen secara visual.
 */
export type TVariant =
  | 'filled' // Background solid + Border
  | 'outline' // Border saja + Background transparan
  | 'ghost' // Background muncul hanya saat hover/active
  | 'text' // Hanya teks yang diwarnai, tanpa box
  | 'link' // Seperti anchor tag (ada underline saat hover)

/**
 * Color Intent: Warna fungsional yang mereferensikan context logic.
 */
export type TColor =
  | 'main' // Primary Action (Brand)
  | 'second' // Secondary Action (Neutral/Slate)
  | 'info' // Informasi/Status Biru
  | 'success' // Sukses/Status Hijau
  | 'warning' // Peringatan/Status Kuning
  | 'danger' // Error/Status Merah
  | 'neutral' // Greyscale/Disabled context

/**
 * Size System: Skala ukuran komponen.
 */
export type TSize = 'sm' | 'md' | 'lg' | 'xl'

/**
 * Radius System: Sistem lengkungan sudut.
 */
export type TRadius =
  | 'none' // 0px
  | 'sm' // 4px
  | 'md' // 8px (Default)
  | 'lg' // 12px
  | 'xl' // 16px
  | 'rounded' // 9999px (Pill shape)

/**
 * Width Policy: Kebijakan lebar elemen.
 */
export type TWidth =
  | 'fit' // Sesuai konten (max-content)
  | 'full' // Melebar 100% parent
  | 'compact' // Lebar standar minimal (e.g., 120px)

/**
 * Spacing/Gap System: Digunakan untuk Stack atau Grid.
 */
export type TGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Theme Context: Mendukung Dark Mode.
 */
export type TThemeMode = 'light' | 'dark'

/**
 * Common UI Props:
 * Interface dasar yang bisa di-extend oleh semua komponen UI (Button, Input, Card).
 */
export interface TCommonUIProps {
  variant?: TVariant
  color?: TColor
  size?: TSize
  radius?: TRadius
  width?: TWidth
  isDisabled?: boolean
  isLoading?: boolean // Tambahan untuk state loading pada button/input
  className?: string
}
