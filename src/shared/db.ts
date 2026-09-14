import Dexie, { type Table } from 'dexie'

export interface ITransaction {
  id: string
  transactionDate: Date
  createdAt: Date
  updatedAt: Date
  description: string
  amount: number
  walletId: string
  type: 'income' | 'outcome'
  tagsId: string[]
  clientsId: string[]
  syncStatus: 'synced' | 'pending' // Untuk kebutuhan API nantinya
}

export interface IWallet {
  id: string
  name: string
  description: string
  icons: string
  currency: string
  createdAt: Date
  updatedAt: Date
}

export interface ITag {
  id: string
  name: string
  description: string
  icons: string
  createdAt: Date
  updatedAt: Date
}

export interface IClient {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

// Inisialisasi Database Classless
export const db = new Dexie('FinanceDB') as Dexie & {
  transactions: Table<ITransaction>
  wallets: Table<IWallet>
  tags: Table<ITag>
  clients: Table<IClient>
}

db.version(1).stores({
  // Indexing kolom yang akan sering diproses/difilter
  transactions:
    'id, transactionDate, walletId, type, amount, *tagsId, *clientsId',
  wallets: 'id, name, currency',
  tags: 'id, name',
  clients: 'id, name',
})
