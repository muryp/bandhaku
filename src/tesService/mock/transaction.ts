// mocks/transaction.mock.ts
import type { ServerTransactionResponse, Transaction } from '../transactions.types'
import { now } from '../utils/time'

type MockScenario = 'success' | 'conflict' | 'error' | 'timeout' | 'partial'
declare global {
  interface Window {
    __MOCK_SCENARIO: MockScenario
  }
}

window.__MOCK_SCENARIO = 'success'

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))
const fakeServerDB = new Map<string, Transaction>()

// Simpen tipe asli biar TS ga ngamuk
const originalFetch: typeof fetch = window.fetch.bind(window)

export const enableTransactionMock = () => {
  // FIX: param input: RequestInfo | URL, bukan RequestInfo doang
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    // Normalisasi input jadi string biar gampang .includes()
    const url = input instanceof URL ? input.href : input instanceof Request ? input.url : input
    const method = init?.method ?? (input instanceof Request ? input.method : 'GET')

    // 1. MOCK POST /api/v1/transactions/batch
    if (url.includes('/api/v1/transactions/batch') && method === 'POST') {
      const scenario = window.__MOCK_SCENARIO
      await delay(500)

      if (scenario === 'timeout') {
        await delay(31000)
      }

      if (scenario === 'error') {
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const body = JSON.parse(init?.body as string) as { transactions: Transaction[] }
      const txs = body.transactions

      const res: ServerTransactionResponse = {
        success: [],
        conflict: [],
        error: [],
        serverTime: now() + 1000,
      }

      for (const tx of txs) {
        if (scenario === 'conflict' && fakeServerDB.has(tx.id)) {
          const serverVersion = { ...fakeServerDB.get(tx.id)!, note: 'Edited by server' }
          res.conflict.push({ id: tx.id, serverData: serverVersion })
        } else if (scenario === 'partial' && tx.amount > 1000000) {
          res.error.push(tx.id)
        } else {
          res.success.push(tx.id)
          fakeServerDB.set(tx.id, { ...tx, serverId: `srv_${tx.id}`, syncStatus: 'synced' })
        }
      }

      return new Response(JSON.stringify(res), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 2. MOCK GET /api/v1/transactions/changes
    if (url.includes('/api/v1/transactions/changes') && method === 'GET') {
      await delay(300)
      const fullUrl = new URL(url, window.location.origin)
      const since = Number(fullUrl.searchParams.get('since')) || 0

      const changes = Array.from(fakeServerDB.values()).filter(t => t.updatedAt > since)

      return new Response(
        JSON.stringify({
          transactions: changes.slice(0, 10),
          serverTime: now() + 1000,
          hasMore: changes.length > 10,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // Fallback ke fetch asli
    return originalFetch(input as RequestInfo, init)
  }

  console.log(' Transaction API mock enabled. window.__MOCK_SCENARIO =', window.__MOCK_SCENARIO)
}