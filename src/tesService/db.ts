// db/dexie.ts
import Dexie, { type Table } from 'dexie'
import type { Transaction } from './transactions.types'

/**
 * Key-value store untuk metadata app: deviceId, lastSyncTime, dll
 * Security: Jangan simpen token/sensitif di sini tanpa encrypt
 */
export interface MetaKV {
  key: string
  value: string | number
}

export const db = new Dexie('KasDB')

db.version(1).stores({
  transactions: '&id, type, date, accountId, syncStatus, updatedAt, *category, deletedAt',
  meta: '&key', // table baru buat KV
})

export type DB = typeof db
export const transactionsTable: Table<Transaction, string> = db.table('transactions')
export const metaTable: Table<MetaKV, string> = db.table('meta')