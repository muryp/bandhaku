// repositories/transaction.repo.ts
import { transactionsTable } from './db'
import type { Transaction } from './transactions.types'
import { now } from './utils/time'

/**
 * Tambah 1 transaksi ke IndexedDB.
 * Performance: add = O(log n) + write. Paling cepat untuk insert.
 * Security: Validasi `tx.id` wajib UUID dari caller. Jangan generate di sini.
 * @throws Dexie.ConstraintError jika id duplikat
 */
export const add = (tx: Transaction): Promise<string> => {
  return transactionsTable.add(tx)
}

/**
 * Update partial field berdasarkan id.
 * Performance: update = O(log n). Hanya field yang di-patch yang ditulis disk.
 * Security: Jangan izinkan patch `id` atau `createdAt` dari luar. Filter di service.
 * @returns 1 jika sukses update, 0 jika id tidak ketemu
 */
export const update = (
  id: string,
  patch: Partial<Transaction>,
): Promise<number> => {
  return transactionsTable.update(id, patch)
}

/**
 * Ambil 1 transaksi by PK.
 * Performance: get by PK = O(1) average. Index '&id' sudah ada.
 * @returns undefined jika tidak ketemu, bukan throw
 */
export const getById = (id: string): Promise<Transaction | undefined> => {
  return transactionsTable.get(id)
}

/**
 * Ambil semua transaksi. Hati-hati OOM.
 * Performance: toArray = full table scan O(n). Jangan pakai kalau data >10k row.
 * Untuk UI pakai .limit() + .offset() di service, bukan di repo.
 */
export const getAll = (): Promise<Transaction[]> => {
  return transactionsTable.toArray()
}

/**
 * Ambil transaksi yang belum sync ke server.
 * Performance: where('syncStatus').anyOf('local') pake index 'syncStatus'. Cepat.
 * Dipakai syncManager buat batch push.
 */
export const getUnsynced = (): Promise<Transaction[]> => {
  // anyOf bisa ['local', 'conflict'] kalau mau, tapi sesuai todo cuma 'local'
  return transactionsTable.where('syncStatus').anyOf('local').toArray()
}

/**
 * Upsert banyak data sekaligus. Dipakai pas pull dari server.
 * Performance: bulkPut = 1 transaction, jauh lebih cepat dari loop add().
 * Security: Dexie akan replace jika id sama. Pastikan data dari server trusted.
 * @returns array of keys yang di-insert/update
 */
export const bulkPut = (txs: Transaction[]): Promise<string> => {
  return transactionsTable.bulkPut(txs)
}

/**
 * Ambil transaksi berdasarkan range tanggal.
 * Performance: where('date').between pakai index 'date'. O(log n + k) k=hasil.
 * Param `end` exclusive di Dexie. Kalau mau inclusive, +1 ms di caller.
 */
export const getByDateRange = (
  start: number,
  end: number,
): Promise<Transaction[]> => {
  return transactionsTable
    .where('date')
    .between(start, end, true, false)
    .toArray()
}

/**
 * Soft delete: set deletedAt + tandai local biar ke-sync.
 * Security: Tidak pernah hard delete. Biar audit trail + sync delete ke server.
 * Performance: 1x update. Jangan lupa filter deletedAt di query lain.
 * @returns 1 jika sukses, 0 jika id tidak ada
 */
export const softDelete = (id: string): Promise<number> => {
  return update(id, { deletedAt: now(), syncStatus: 'local' })
}
