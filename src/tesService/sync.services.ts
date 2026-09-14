// services/sync.service.ts
import { metaTable, transactionsTable } from './db'
import type { Transaction } from './transactions.types'
import { LAST_SYNC_TIME_KEY } from './utils/time'

const log = (step: string, data?: any) => {
  console.log(`%c[SYNC-SERVICE] ${step}`, 'color: #f59e0b; font-weight: bold', data ?? '')
}

/**
 * Tandai banyak transaksi sebagai 'pending' sebelum dikirim ke server.
 * Performance Dexie v4: bulkUpdate = 1 transaction, O(k).
 */
export const markAsPending = async (ids: string[]): Promise<void> => {
  log('markAsPending', { count: ids.length, ids: ids.map(i => i.slice(0, 8)) })
  const changes = { syncStatus: 'pending' as const }
  await transactionsTable.bulkUpdate(ids.map(id => ({ key: id, changes })))
  log('markAsPending DONE')
}

/**
 * Tandai sukses sync. Set serverId + syncStatus.
 */
export const markAsSynced = async (
  ids: string[],
  serverMap: Record<string, string>,
): Promise<void> => {
  log('markAsSynced', { count: ids.length, serverMap })
  await transactionsTable.bulkUpdate(
    ids.map(id => ({
      key: id,
      changes: {
        syncStatus: 'synced' as const,
        serverId: serverMap[id],
      },
    })),
  )
  log('markAsSynced DONE')
}

/**
 * Tandai conflict. Simpan versi server di _serverVersion.
 */
export const markAsConflict = async (id: string, serverData: Transaction): Promise<void> => {
  log('markAsConflict', { id: id.slice(0, 8), serverNote: serverData.note })
  await transactionsTable.update(id, {
    syncStatus: 'conflict',
    _serverVersion: serverData,
  })
  log('markAsConflict DONE')
}

export const getLastSyncTime = async (): Promise<number> => {
  const record = await metaTable.get(LAST_SYNC_TIME_KEY)
  const time = typeof record?.value === 'number' ? record.value : 0
  log('getLastSyncTime', { time, date: new Date(time).toISOString() })
  return time
}

export const setLastSyncTime = async (time: number): Promise<void> => {
  log('setLastSyncTime', { time, date: new Date(time).toISOString() })
  await metaTable.put({ key: LAST_SYNC_TIME_KEY, value: time })
}

/**
 * Helper buat retry. Balikin semua 'pending' jadi 'local' kalau gagal kirim.
 */
export const revertPendingToLocal = async (ids: string[]): Promise<void> => {
  log('revertPendingToLocal', { count: ids.length, ids: ids.map(i => i.slice(0, 8)) })
  await transactionsTable.bulkUpdate(
    ids.map(id => ({
      key: id,
      changes: { syncStatus: 'local' as const },
    })),
  )
  log('revertPendingToLocal DONE')
}