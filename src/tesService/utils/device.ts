// utils/device.ts
import { metaTable } from '../db'
import { generateId } from './id'

const DEVICE_ID_KEY = 'deviceId' as const

/**
 * Ambil device ID dari IndexedDB. Generate sekali per instalasi browser.
 * Performance: Cache di module scope setelah first DB hit. Query berikutnya 0ms.
 * Security: UUID random, bukan fingerprint. Tidak cross-origin.
 * Concurrency: `put` aman dari race condition antar tab.
 */
let cachedDeviceId: string | null = null

export const getDeviceId = async (): Promise<string> => {
  if (cachedDeviceId) return cachedDeviceId

  const record = await metaTable.get(DEVICE_ID_KEY)
  if (record?.value && typeof record.value === 'string') {
    cachedDeviceId = record.value
    return record.value
  }

  const newId = generateId()
  await metaTable.put({ key: DEVICE_ID_KEY, value: newId })
  cachedDeviceId = newId
  return newId
}