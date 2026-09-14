
/**
 * List Mata Uang Populer untuk Dropdown
 * Kita ambil dari standar ISO 4217
 */
export const CURRENCY_LIST = [
  'IDR', 'USD', 'SGD', 'EUR', 'JPY', 'GBP', 'AUD', 'MYR'
] as const

export type TCurrency = typeof CURRENCY_LIST[number]

/**
 * Memformat angka ke dalam string mata uang yang cantik
 * Contoh: 1500000 -> "Rp 1.500.000"
 */
export const formatMoney = (amount: number, currency: string = 'IDR'): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Helper untuk konversi mentah ke format finansial (opsional)
 * Jika butuh kalkulasi kompleks, gunakan library dinero
 */
export const toMinorUnits = (amount: number, precision: number = 2) => {
  return Math.round(amount * Math.pow(10, precision))
}