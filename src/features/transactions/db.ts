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
}

export interface IWallet {
  id: string
  name: string
  description: string
  icons: string
  createdAt: Date
  updatedAt: Date
  currency: string
}

export interface ITag {
  id: string
  name: string
  description: string
  icons: string
  createdAt: Date
  updatedAt: Date
}

// Menambahkan interface IClient yang tertinggal
export interface IClient {
  id: string
  name: string
  email?: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

// Inisialisasi Database dengan 4 Tabel
export const db = new Dexie('FinanceDB') as Dexie & {
  transactions: Table<ITransaction>
  transactionsHistory: Table<ITransaction>
  wallets: Table<IWallet>
  tags: Table<ITag>
  clients: Table<IClient> // Tambahkan ini
}
db.version(1).stores({
  transactions: 'id, transactionDate, walletId, type, *tagsId, *clientsId, amount',
  transactionsHistory: 'id, transactionDate, walletId, type, *tagsId, *clientsId, amount',
  wallets: 'id, name',
  tags: 'id, name',
  clients: 'id, name',
})