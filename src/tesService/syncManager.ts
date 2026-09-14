// sync/syncManager.ts
import { getUnsynced, bulkPut } from './transaction.repo'
import {
  markAsPending,
  markAsSynced,
  markAsConflict,
  getLastSyncTime,
  setLastSyncTime,
  revertPendingToLocal,
} from './sync.services'
import { batchSync, fetchServerChanges } from './transactions.api'

const log = (step: string, data?: any) => {
  console.log(
    `%c[SYNC-MANAGER] ${step}`,
    'color: #8b5cf6; font-weight: bold',
    data ?? '',
  )
}

let isSyncing = false
let debounceTimer: number | null = null

/**
 * Queue sync dengan debounce 2 detik.
 */
export const queueSync = (): void => {
  log('queueSync called')
  if (debounceTimer) window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    if (navigator.onLine) {
      log('debounce done, trigger syncTransactions')
      syncTransactions().catch((e) => log('syncTransactions error', e))
    } else {
      log('offline, skip sync')
    }
  }, 2000)
}

/**
 * Core sync: Push local -> Pull server.
 */
export const syncTransactions = async (): Promise<void> => {
  if (isSyncing) {
    log('SKIP: already syncing')
    return
  }
  if (!navigator.onLine) {
    log('SKIP: offline')
    return
  }

  isSyncing = true
  log('START syncTransactions')

  try {
    // 1. PUSH: kirim yang local
    const localTxs = await getUnsynced()
    log('getUnsynced', { count: localTxs.length })

    if (localTxs.length > 0) {
      const BATCH_SIZE = 50
      for (let i = 0; i < localTxs.length; i += BATCH_SIZE) {
        const batch = localTxs.slice(i, i + BATCH_SIZE)
        const ids = batch.map((t) => t.id)
        log('PUSH batch', { batch: i / BATCH_SIZE + 1, count: batch.length })

        try {
          await markAsPending(ids)
          log('batchSync request', { ids: ids.map((i) => i.slice(0, 8)) })
          const res = await batchSync(batch)
          log('batchSync response', res)

          if (res.success.length > 0) {
            // Asumsi BE balikin mapping { clientId: serverId }
            // Mock kita bikin serverId = `srv_${clientId}`
            const serverMap: Record<string, string> = {}
            res.success.forEach((id) => (serverMap[id] = `srv_${id}`))
            await markAsSynced(res.success, serverMap)
          }

          for (const c of res.conflict) {
            await markAsConflict(c.id, c.serverData)
          }

          if (res.error.length > 0) {
            await revertPendingToLocal(res.error)
          }

          await setLastSyncTime(res.serverTime)
        } catch (e) {
          log('PUSH batch FAILED', { ids, error: e })
          await revertPendingToLocal(ids)
          throw e
        }
      }
    } else {
      log('PUSH: no local data')
    }

    // 2. PULL: ambil perubahan dari server
    let since = await getLastSyncTime()
    let hasMore = true
    let page = 1

    while (hasMore) {
      log('PULL request', { since, page })
      const {
        transactions,
        serverTime,
        hasMore: more,
      } = await fetchServerChanges(since)
      log('PULL response', {
        count: transactions.length,
        serverTime,
        hasMore: more,
      })

      if (transactions.length > 0) {
        const syncedTxs = transactions.map((t) => ({
          ...t,
          syncStatus: 'synced' as const,
        }))
        await bulkPut(syncedTxs)
        log('PULL bulkPut DONE', { count: syncedTxs.length })
      }

      await setLastSyncTime(serverTime)
      since = serverTime
      hasMore = more
      page++
    }

    log('END syncTransactions SUCCESS')
  } catch (e) {
    log('END syncTransactions FAILED', e)
    throw e
  } finally {
    isSyncing = false
  }
}

export const initSyncListener = (): void => {
  log('initSyncListener')
  window.addEventListener('online', () => {
    log('event: online')
    queueSync()
  })
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      log('event: visible')
      queueSync()
    }
  })
}