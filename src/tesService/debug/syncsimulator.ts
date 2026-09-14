// debug/syncSimulator.ts
import {
  createTransaction,
  listTransactions,
  updateTransaction,
} from '../transaction.service'
import { getUnsynced } from '../transaction.repo'
import { syncTransactions } from '../syncManager'
import type { CreateTransactionDTO } from '../transactions.types'
import { now } from '../utils/time'

const log = (step: string, data?: any) => {
  console.log(
    `%c[SIM] ${step}`,
    'color: #22c55e; font-weight: bold',
    data ?? '',
  )
}

const dumpDB = async (label: string) => {
  const all = await listTransactions({ limit: 1000, includeDeleted: true })
  const unsynced = await getUnsynced()
  console.table(
    all.map((t) => ({
      id: t.id.slice(0, 8),
      type: t.type,
      amount: `${t.amount / 100}`, // display rupiah
      category: t.category,
      syncStatus: t.syncStatus,
      deleted: !!t.deletedAt,
      hasServerId: !!t.serverId,
      hasConflict: !!t._serverVersion,
    })),
  )
  log(label, { total: all.length, unsynced: unsynced.length })
}

/**
 * Skenario 1: Sukses full flow
 * amount: 5000000 = Rp50.000,00
 */
export const simulateSuccessFlow = async () => {
  console.clear()
  log('START: SUKSES')
  window.__MOCK_SCENARIO = 'success'

  await dumpDB('1. DB awal')

  const dto: CreateTransactionDTO = {
    type: 'expense',
    amount: 5000000, // Rp50.000,00
    date: now(),
    accountId: 'acc_cash',
    category: 'makan',
    note: 'Test sukses',
  }

  log('2. createTransaction', dto)
  const tx = await createTransaction(dto)
  await dumpDB('3. Setelah create: syncStatus=local, serverId=undefined')

  log('4. syncTransactions()...')
  await syncTransactions()
  await dumpDB('5. Setelah sync: syncStatus=synced, serverId=srv_xxx')

  log('END: SUKSES')
}

/**
 * Skenario 2: Server 500
 */
export const simulateErrorFlow = async () => {
  console.clear()
  log('START: ERROR 500')
  window.__MOCK_SCENARIO = 'error'

  const dto: CreateTransactionDTO = {
    type: 'income',
    amount: 10000000, // Rp100.000,00
    date: now(),
    accountId: 'acc_bank',
    category: 'gaji',
    note: 'Test error',
  }

  log('1. createTransaction', dto)
  await createTransaction(dto)
  await dumpDB('2. Setelah create: local')

  log('3. syncTransactions expect 500...')
  try {
    await syncTransactions()
  } catch (e) {
    log('4. Error ketangkap', e)
  }
  await dumpDB('5. Setelah gagal: HARUS balik local, bukan pending')

  log('END: ERROR')
}

/**
 * Skenario 3: Conflict LWW
 */
export const simulateConflictFlow = async () => {
  console.clear()
  log('START: CONFLICT')
  window.__MOCK_SCENARIO = 'success'

  const dto: CreateTransactionDTO = {
    type: 'expense',
    amount: 7500000, // Rp75.000,00
    date: now(),
    accountId: 'acc_cash',
    category: 'transport',
    note: 'Versi client v1',
  }

  log('1. Create + sync pertama biar ada di server')
  const tx = await createTransaction(dto)
  await syncTransactions()
  await dumpDB('2. Setelah sync1: synced')

  window.__MOCK_SCENARIO = 'conflict'
  log('3. Update local terus sync lagi. Server udah diedit')
  await updateTransaction(tx.id, { note: 'Versi client v2', amount: 8000000 })
  await syncTransactions()
  await dumpDB('4. Setelah conflict: syncStatus=conflict, _serverVersion ada')

  log('END: CONFLICT')
}

/**
 * Skenario 4: Timeout 30s
 */
export const simulateTimeoutFlow = async () => {
  console.clear()
  log('START: TIMEOUT')
  window.__MOCK_SCENARIO = 'timeout'

  await createTransaction({
    type: 'expense',
    amount: 1000000, // Rp10.000,00
    date: now(),
    accountId: 'acc_cash',
    category: 'jajan',
    note: 'Test timeout',
  })
  await dumpDB('1. Created: local')

  log('2. Sync... tunggu 30s')
  const start = performance.now()
  try {
    await syncTransactions()
  } catch (e) {
    const dur = ((performance.now() - start) / 1000).toFixed(1)
    log('3. Timeout ketangkap', { duration: `${dur}s`, error: e })
  }
  await dumpDB('4. Setelah timeout: HARUS balik local')

  log('END: TIMEOUT')
}

/**
 * Skenario 5: Partial error. amount > 1jt = gagal
 */
export const simulatePartialFlow = async () => {
  console.clear()
  log('START: PARTIAL')
  window.__MOCK_SCENARIO = 'partial'

  log('1. Buat 2 tx: 1 kecil, 1 gede')
  await createTransaction({
    type: 'expense',
    amount: 500000, // Rp5.000,00 - sukses
    date: now(),
    accountId: 'acc_cash',
    category: 'kopi',
    note: 'Kecil',
  })
  await createTransaction({
    type: 'expense',
    amount: 150000000, // Rp1.500.000,00 - gagal validasi mock
    date: now(),
    accountId: 'acc_cash',
    category: 'laptop',
    note: 'Gede',
  })
  await dumpDB('2. Setelah create: 2 local')

  log('3. Sync partial...')
  await syncTransactions()
  await dumpDB('4. Setelah sync: 1 synced, 1 tetap local')

  log('END: PARTIAL')
}

if (typeof window !== 'undefined') {
  ;(window as any).sim = {
    success: simulateSuccessFlow,
    error: simulateErrorFlow,
    conflict: simulateConflictFlow,
    timeout: simulateTimeoutFlow,
    partial: simulatePartialFlow,
    dump: dumpDB,
  }
}