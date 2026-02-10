import { Button, Link } from '@/shared/components/Btn'
import { IconsNav } from '@/shared/assets/nav'
import type { THeaderProps } from './types'
import { addScript } from '@/shared/utils/addScript'

export const Header = ({ brandName, logoUrl, menuItems }: THeaderProps) => {
  // 1. Brand Fragment (Naming CamelCase)
  const BrandLogo = logoUrl
    ? `<img src="${logoUrl}" class="h-8 w-auto object-contain" alt="Logo" />`
    : ''
  const BrandTemplate = `
    <div class="flex items-center gap-3">
      ${BrandLogo}
      <span class="text-xl font-bold text-base-content tracking-tight">${brandName}</span>
    </div>
  `

  // 2. Nav Items Fragment (Logic dipisah dari Template)
  // Sesuai aturan: Eksekusi fungsi di ${...} WAJIB ditaruh di variabel fragmen
  const NavLinks = menuItems
    .map((item) => {
      const ItemLabel = `
      <span class="flex flex-col md:flex-row items-center gap-1 md:gap-2">
        <span class="w-6 h-6 md:w-5 md:h-5 flex items-center justify-center">${IconsNav[item.icon]}</span>
        <span class="text-[10px] md:text-sm font-medium">${item.name}</span>
      </span>
    `

      return `
      <li class="flex-1 md:flex-none">
        ${Link({
    href: item.link,
    label: ItemLabel,
    variant: 'ghost',
    color: 'neutral',
    width: 'full',
    radius: 'lg',
    className: 'transition-all duration-300',
  })}
      </li>
    `
    })
    .join('')

  // 3. Theme Toggle Logic
  // 1. Ambil state dari storage
  const savedTheme = localStorage.getItem('THEME_CACHE') || 'light'
  const isDark = savedTheme === 'dark'

  // 2. Gunakan addScript untuk sinkronisasi DOM saat render pertama kali
  // Ini mencegah UI 'flicker' atau tidak sinkron dengan storage
  addScript(() => {
    document.documentElement.setAttribute('data-theme', savedTheme)
  })

  const ThemeBtnTemplate = Button({
    // Label harus sesuai dengan state awal di storage
    label: isDark ? IconsNav.sun : IconsNav.moon,
    variant: 'ghost',
    color: 'neutral', // Pakai neutral agar tidak mencolok di header
    radius: 'rounded',
    className: 'active:scale-95',
    onClick: (el) => {
      // Logic Toggle
      const currentMode = document.documentElement.getAttribute('data-theme')
      const newTheme = currentMode === 'dark' ? 'light' : 'dark'

      // Sinkronisasi ke DOM dan Storage
      document.documentElement.setAttribute('data-theme', newTheme)
      localStorage.setItem('THEME_CACHE', newTheme)

      // Update icon secara reaktif
      el.innerHTML = newTheme === 'dark' ? IconsNav.sun : IconsNav.moon
    },
  })

  // --- Final Output ---
  return html`
    <header
      class="sticky top-0 z-[100] w-full bg-base-100/80 backdrop-blur-md border-b border-base-300">
      <div
        class="container mx-auto px-4 h-16 flex items-center justify-between">
        ${BrandTemplate}

        <div class="flex items-center gap-2">
          <nav class="hidden md:block">
            <ul class="flex items-center gap-1">
              ${NavLinks}
            </ul>
          </nav>

          <div class="hidden md:block h-6 w-[1px] bg-base-300 mx-2"></div>

          ${ThemeBtnTemplate}
        </div>
      </div>
    </header>

    <nav
      class="md:hidden fixed bottom-0 left-0 right-0 z-[99] bg-base-100 border-t border-base-300 px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <ul class="flex items-center justify-around h-16">
        ${NavLinks}
      </ul>
    </nav>
  `
}
