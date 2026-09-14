import { dinero, add, subtract, toDecimal, type Dinero } from 'dinero.js'
import * as currencies from '@dinero.js/currencies'

// 1. Tipe Data
interface Transaction {
  amount: number // Angka desimal dari user (misal: 50.5)
  type: 'income' | 'outcome'
}

interface CurrencyInfo {
  code: string
  name: string
  exponent: number
}

/**
 * 2. Mendapatkan List Semua Mata Uang untuk Dropdown UI
 */
export const getCurrencyList = (): CurrencyInfo[] => {
  return Object.values(currencies).map((curr: any) => ({
    code: curr.code,
    name: curr.asset,
    exponent: curr.exponent,
  }))
}

/**
 * 3. Konversi Input User ke Integer (untuk disimpan ke Database)
 * Contoh: User input 50.5 USD -> Return 5050
 */
export const toDatabaseInt = (
  amount: number,
  currencyCode: keyof typeof currencies,
): number => {
  const currency = currencies[currencyCode] as any
  const factor = Math.pow(10, currency.exponent)
  return Math.round(amount * factor)
}

/**
 * 4. Menghitung Total Saldo dari Array
 * Mengembalikan objek berisi nominal string dan nama mata uangnya
 */
export function calculateFinance(
  transactions: Transaction[],
  currencyCode: keyof typeof currencies,
) {
  const currency = currencies[currencyCode] as any
  const factor = Math.pow(10, currency.exponent)

  // Inisialisasi saldo awal
  let balance = dinero({ amount: 0, currency })

  transactions.forEach((tx) => {
    const amountInMinorUnit = Math.round(tx.amount * factor)
    const moneyObject = dinero({ amount: amountInMinorUnit, currency })

    balance =
      tx.type === 'income'
        ? add(balance, moneyObject)
        : subtract(balance, moneyObject)
  })

  return {
    formatted: toDecimal(balance), // "45.50"
    currencyName: currency.asset, // "United States Dollar"
    currencyCode: currency.code, // "USD"
    rawInteger: balance.toJSON().amount, // 4550 (untuk kebutuhan lain)
  }
}

// --- CONTOH PENGGUNAAN ---

const myHistory: Transaction[] = [
  { amount: 100.5, type: 'income' },
  { amount: 20, type: 'outcome' },
]

// A. Mendapatkan list untuk Select Option
const options = getCurrencyList()

// B. Menghitung total
const result = calculateFinance(myHistory, 'USD')
console.log(
  `Saldo: ${result.formatted} ${result.currencyCode} (${result.currencyName})`,
)
// Output: "Saldo: 80.50 USD (United States Dollar)"

// C. Simpan ke Database (misal mau simpan satu transaksi saja)
const valToSave = toDatabaseInt(100.5, 'USD')
console.log(valToSave) // 1050