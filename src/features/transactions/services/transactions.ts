import { db, type ITransaction } from '../db'

//TODO: ADD SYNC STATUS UNTUK TAHU UDAH SYNC DENGAN BACKEND ATAU BELUM
//TODO: MEMISAHKAN DB secara manual. misalnya data terlalu banyak.
export interface IFilterOptions {
  sortByDate?: 'asc' | 'desc'
  fromDate?: Date
  toDate?: Date
  tagsId?: string[]
  walletsId?: string
  type?: 'income' | 'outcome'
  clientId?: string
  minAmount?: number
  maxAmount?: number
}

/**
 * Mendapatkan transaksi dengan filter mendalam dan pagination
 */
//TODO: REFACTOR
export const getTransactions = async (params: IFilterOptions) => {
  let query = db.transactions.orderBy('transactionDate')

  // Balikkan urutan jika newest
  if (params.sortByDate === 'desc') {
    query = query.reverse()
  }

  // Filter menggunakan Collection (Dexie filtering)
  return await query
    .toArray()
}
/**
 * Create Transaction (Offline-ready)
 */
export const createTransaction = async (
  data: Omit<ITransaction, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>,
) => {
  const now = new Date()
  const newTrx: ITransaction = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    // syncStatus: 'pending',
  }
  return await db.transactions.add(newTrx)
}

export const putTransaction = async (data: ITransaction) => {
  const now = new Date()
  await db.transactionsHistory.add(data)
  return await db.transactions.put({
    ...data,
    updatedAt: now,
  })
}
