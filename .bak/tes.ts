import type { ITransaction } from './features/transactions/db'
// import { seedDatabase } from './features/transactions/seed'
import {
  getTransactions,
  type IFilterOptions,
} from './features/transactions/services/transactions'

// State untuk pagination
let currentOffset = 0
const LIMIT = 10
let allTransactions: ITransaction[] = []
// await seedDatabase()
export async function loadPage(isNewFilter = false) {
  const Options: IFilterOptions = {
    // dateFrom: new Date('2024-01-01'),
    // dateTo: new Date(),
    // type: 'outcome',
    tagsId: ['t3'],
    // tagsId: ['tag-id-1'], // opsional
  }
  if (isNewFilter) {
    currentOffset = 0
    allTransactions = await getTransactions(Options)
  }

  const data = []
  let count = 0
  for (let i = 0; currentOffset < allTransactions.length; i++) {
    if (count == LIMIT) {
      currentOffset = currentOffset + i
      break
    }
    const tx = allTransactions[currentOffset + i]

    // Filter Date Range
    if (Options.fromDate && tx.transactionDate < Options.fromDate) continue
    if (Options.toDate && tx.transactionDate > Options.toDate) continue

    // Filter Wallet & Type
    if (Options.walletsId && tx.walletId !== Options.walletsId) continue
    if (Options.type && tx.type !== Options.type) continue

    // Filter Client (Mengecek di dalam array clientsId)
    if (Options.clientId && !tx.clientsId.includes(Options.clientId)) continue

    // Filter Tags (Mengecek irisannya)
    if (Options.tagsId && Options.tagsId.length > 0) {
      const hasTag = Options.tagsId.some((t) => tx.tagsId.includes(t))
      if (!hasTag) continue
    }

    // Filter Amount Range
    if (Options.minAmount !== undefined && tx.amount < Options.minAmount)
      continue
    if (Options.maxAmount !== undefined && tx.amount > Options.maxAmount)
      continue

    count++
    data.push(tx)
  }

  console.log(data)
  console.log(allTransactions.length)
  return data
}
