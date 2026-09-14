// api/transaction.api.ts
import type {
  ServerTransactionResponse,
  Transaction,
} from './transactions.types'

const BASE_URL = '/api/v1' // ganti sesuai BE lu

/**
 * Push batch transaksi local ke server.
 * Security: Wajib kirim header Authorization + Idempotency-Key per batch.
 * Performance: Timeout 30s. Retry di orchestrator, bukan di sini.
 * @throws Error kalau network non-2xx
 */
export const batchSync = async (
  txs: Transaction[],
): Promise<ServerTransactionResponse> => {
  const res = await fetch(`${BASE_URL}/transactions/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Idempotency biar server ga double insert kalau retry
      'Idempotency-Key': crypto.randomUUID(),
    },
    body: JSON.stringify({ transactions: txs }),
    signal: AbortSignal.timeout(30000), // 30s timeout
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Sync failed: ${res.status} ${text}`)
  }

  return res.json()
}

/**
 * Pull perubahan dari server sejak lastSyncTime.
 * Security: Server wajib filter by userId dari token. Jangan trust client.
 * Performance: Server harus pagination. Klien loop sampai `hasMore=false`.
 */
export const fetchServerChanges = async (
  since: number,
): Promise<{
  transactions: Transaction[]
  serverTime: number
  hasMore: boolean
}> => {
  const url = new URL(
    `${BASE_URL}/transactions/changes`,
    window.location.origin,
  )
  url.searchParams.set('since', String(since))

  const res = await fetch(url, {
    method: 'GET',
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) throw new Error(`Fetch changes failed: ${res.status}`)
  return res.json()
}