// utils/time.ts
/**
 * Unix timestamp ms. Single source of truth waktu client.
 * Performance: Date.now() = 1 VM call. No object alloc.
 * Security: Client time tidak dipercaya. Server tetap validasi LWW pakai updatedAt.
 */
export const now = (): number => Date.now()

/**
 * Range hari ini di timezone lokal.
 * Performance: Jangan panggil di dalam loop render. Memoize di caller.
 */
export const getTodayRange = (): { start: number; end: number } => {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  return { start: start.getTime(), end: end.getTime() }
}

/**
 * Key konsisten buat simpan lastSyncTime di metaTable
 */
export const LAST_SYNC_TIME_KEY = 'lastSyncTime' as const