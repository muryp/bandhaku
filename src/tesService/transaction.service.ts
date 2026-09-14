// services/transaction.service.ts
import type {
  CreateTransactionDTO,
  Transaction,
  UpdateTransactionDTO,
} from './transactions.types'
import { add, update, getByDateRange, softDelete } from './transaction.repo'
import { generateId } from './utils/id'
import { getDeviceId } from './utils/device'
import { now } from './utils/time'
import { transactionsTable } from './db'

/**
 * Buat transaksi baru. Offline-first.
 * Performance: 1x UUID + 1x getDeviceId async + 1x add = ~3-5ms.
 * Security: DTO sudah di-omit field sistem. amount wajib integer cent.
 * Side-effect: TIDAK auto sync. Panggil queueSync() di UI/orchestrator.
 * @throws Error jika generateId/getDeviceId gagal
 */
export const createTransaction = async (
  dto: CreateTransactionDTO,
): Promise<Transaction> => {
  const id = generateId()
  const clientId = await getDeviceId()
  const timestamp = now()

  const tx: Transaction = {
    ...dto,
    id,
    clientId,
    syncStatus: 'local',
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: undefined,
    serverId: undefined,
    _serverVersion: undefined,
  }

  await add(tx)
  return tx
}

/**
 * Update transaksi. Selalu override updatedAt & syncStatus.
 * Security: UpdateTransactionDTO sudah exclude id/createdAt/clientId/serverId.
 * Performance: 1x update O(log n). Tidak ada diff check, biar simpel.
 */
export const updateTransaction = async (
  id: string,
  dto: UpdateTransactionDTO,
): Promise<void> => {
  await update(id, {
    ...dto,
    updatedAt: now(),
    syncStatus: 'local',
  })
}

/**
 * Soft delete. Wrapper doang biar nama API enak.
 * Security: Hard delete tidak pernah diexpose. Audit trail terjaga.
 */
export const removeTransaction = async (id: string): Promise<void> => {
  await softDelete(id)
}

/**
 * List transaksi dengan filter. Exclude deleted.
 * Performance: Pakai index 'date' kalau ada range. Limit wajib buat hindari OOM.
 * @param filter.startDate inclusive, endDate exclusive. Default sort date desc.
 * @param filter.limit default 100 biar aman. UI harus paging.
 */
export const listTransactions = async (filter?: {
  accountId?: string
  category?: string
  startDate?: number
  endDate?: number
  limit?: number
  includeDeleted?: boolean
}): Promise<Transaction[]> => {
  const limit = filter?.limit ?? 100
  let collection = transactionsTable.orderBy('date').reverse()

  if (filter?.startDate !== undefined && filter?.endDate !== undefined) {
    collection = transactionsTable
      .where('date')
      .between(filter.startDate, filter.endDate, true, false)
      .reverse()
  }

  // Chain filter di memory. Index 'accountId' & 'category' ada tapi
  // Dexie ga bisa .where() 2x. Jadi and() aja.
  if (filter?.accountId) {
    collection = collection.and((tx) => tx.accountId === filter.accountId)
  }

  if (filter?.category) {
    collection = collection.and((tx) => tx.category === filter.category)
  }

  collection = collection.limit(limit)
  const result = await collection.toArray()

  return filter?.includeDeleted
    ? result
    : result.filter((tx) => tx.deletedAt === undefined)
}

/**
 * Hitung saldo account. Income +, Expense -, Transfer 0.
 * Performance: Index 'accountId' kepake. O(k) k=jumlah tx di account.
 * Security: amount integer cent. Transfer harus 2 row terpisah.
 * @returns integer cent. Bagi 100 di UI buat display.
 */
export const getTransactionBalance = async (
  accountId: string,
): Promise<number> => {
  const txs = await transactionsTable
    .where('accountId')
    .equals(accountId)
    .filter((tx) => tx.deletedAt === undefined)
    .toArray()

  return txs.reduce((acc, tx) => {
    if (tx.type === 'income') return acc + tx.amount
    if (tx.type === 'expense') return acc - tx.amount
    return acc // transfer = 0, caller harus bikin 2 row
  }, 0)
}

/**
 * Get total per kategori buat chart. Exclude deleted.
 * Performance: Full scan by date range. Pakai di background worker kalau data gede.
 */
export const getCategorySummary = async (
  startDate: number,
  endDate: number,
): Promise<Record<string, number>> => {
  const txs = await getByDateRange(startDate, endDate)
  const summary: Record<string, number> = {}

  for (const tx of txs) {
    if (tx.deletedAt !== undefined) continue
    if (tx.type === 'transfer') continue

    const sign = tx.type === 'income' ? 1 : -1
    summary[tx.category] = (summary[tx.category] ?? 0) + tx.amount * sign
  }

  return summary
}