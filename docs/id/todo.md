Siap. Karena modular + TS + no class + Dexie function style, kita pecah jadi file-file kecil. Fokus: pure function, explicit types, testable.

*1. Setup Types & DB - Fondasi*

*`types/transaction.types.ts`*
Todo per type:
1. [ ] `type TransactionType = 'income' | 'expense' | 'transfer'`
2. [ ] `type SyncStatus = 'local' | 'pending' | 'synced' | 'conflict'`
3. [ ] `interface Transaction` - semua field wajib + optional. `amount` pake `number` integer. `date: number`
4. [ ] `type CreateTransactionDTO = Omit<Transaction, 'id'|'syncStatus'|'createdAt'|'updatedAt'|'clientId'|'serverId'>`
5. [ ] `type UpdateTransactionDTO = Partial<Omit<Transaction, 'id'|'createdAt'|'clientId'|'serverId'>>`
6. [ ] `interface ServerTransactionResponse` - bentuk data dari API buat sync

*`db/dexie.ts`*
Todo:
1. [ ] `export const db = new Dexie('KasDB')`
2. [ ] `db.version(1).stores({ transactions: '&id, type, date, accountId, syncStatus, updatedAt, *category' })`
3. [ ] `export type DB = typeof db`
4. [ ] `export const transactionsTable = db.table<Transaction>('transactions')` - biar ga `db.transactions` magic string

*2. Utils - Helper kecil, pure function*

*`utils/id.ts`*
1. [ ] `export const generateId = (): string => crypto.randomUUID()`

*`utils/device.ts`*
1. [ ] `export const getDeviceId = (): string` - ambil dari localStorage, kalo ga ada generate simpen

*`utils/time.ts`*
1. [ ] `export const now = (): number => Date.now()`

*3. Repository Layer - Yang ngomong langsung ke Dexie*

Tugasnya cuma CRUD ke IndexedDB. Ga ada logic bisnis. 1 file 1 function.

*`repositories/transaction.repo.ts`*
1. [ ] `export const add = (tx: Transaction): Promise<string>` - `transactionsTable.add(tx)`
2. [ ] `export const update = (id: string, patch: Partial<Transaction>): Promise<number>` - `transactionsTable.update(id, patch)`
3. [ ] `export const getById = (id: string): Promise<Transaction | undefined>` - `transactionsTable.get(id)`
4. [ ] `export const getAll = (): Promise<Transaction[]>` - `transactionsTable.toArray()`
5. [ ] `export const getUnsynced = (): Promise<Transaction[]>` - `transactionsTable.where('syncStatus').anyOf('local').toArray()`
6. [ ] `export const bulkPut = (txs: Transaction[]): Promise<string[]>` - `transactionsTable.bulkPut(txs)`
7. [ ] `export const getByDateRange = (start: number, end: number): Promise<Transaction[]>` - `transactionsTable.where('date').between(start, end).toArray()`
8. [ ] `export const softDelete = (id: string): Promise<number>` - `update(id, { deletedAt: now(), syncStatus: 'local' })`

*4. Service Layer - Logic bisnis*

Gabungin repo + utils. Ini yang dipanggil UI.

*`services/transaction.service.ts`*
1. [ ] `export const createTransaction = async (dto: CreateTransactionDTO): Promise<Transaction>`
   Todo: generate id, set `syncStatus: 'local'`, `createdAt: now()`, `updatedAt: now()`, `clientId: getDeviceId()`, `deletedAt: undefined`. Panggil `add()`. Return data lengkap. Jangan await sync.

2. [ ] `export const updateTransaction = async (id: string, dto: UpdateTransactionDTO): Promise<void>`
   Todo: `updatedAt: now()`, `syncStatus: 'local'`. Kalo `deletedAt` ada di dto, tetep set local. Panggil `update()`.

3. [ ] `export const removeTransaction = async (id: string): Promise<void>`
   Todo: Panggil `softDelete(id)`. Ini cuma wrapper biar nama enak.

4. [ ] `export const listTransactions = async (filter?: { accountId?: string, startDate?: number, endDate?: number }): Promise<Transaction[]>`
   Todo: Kalo ada filter pake `getByDateRange` + `.filter()`. Kalo ga ada `getAll()`. Exclude `deletedAt != undefined`. Sort by `date desc`.

5. [ ] `export const getTransactionBalance = async (accountId: string): Promise<number>`
   Todo: Ambil semua tx by accountId, filter `deletedAt`, reduce: income +, expense -. Return integer.

*`services/sync.service.ts`*
1. [ ] `export const markAsPending = async (ids: string[]): Promise<void>` - `bulkPut` set `syncStatus: 'pending'`
2. [ ] `export const markAsSynced = async (ids: string[], serverMap: Record<string, string>): Promise<void>` - set `syncStatus: 'synced'`, `serverId: serverMap[id]`
3. [ ] `export const markAsConflict = async (id: string, serverData: Transaction): Promise<void>` - set `syncStatus: 'conflict'`, simpen `_serverVersion: serverData`
4. [ ] `export const getLastSyncTime = (): number` - ambil dari localStorage
5. [ ] `export const setLastSyncTime = (time: number): void` - simpen ke localStorage

*5. API Layer - Ngomong ke server*

*`api/transaction.api.ts`*
1. [ ] `export const batchSync = async (txs: Transaction[]): Promise<{ success: string[], conflict: Array<{id: string, serverData: Transaction}>, error: string[] }>`
   Todo: `fetch('/api/transactions/batch', {method: 'POST', body: JSON.stringify(txs)})`. Handle timeout 30s.

2. [ ] `export const fetchServerChanges = async (since: number): Promise<Transaction[]>`
   Todo: `GET /api/transactions?since=${since}`. Return array.

*6. Sync Orchestrator - Otak sync*

*`sync/syncManager.ts`*
1. [ ] `export const queueSync = debounce(() => { if(navigator.onLine) syncTransactions() }, 2000)` - pake `lodash.debounce`
2. [ ] `export const syncTransactions = async (): Promise<void>`
   Todo:
   - 1. `const localTxs = await getUnsynced()`. Kalo kosong, return
   - 2. `await markAsPending(localTxs.map(t => t.id))` biar ga ke-sync 2x
   - 3. `const res = await batchSync(localTxs)`
   - 4. `await markAsSynced(res.success, serverIdMap)`
   - 5. Loop `res.conflict` → `markAsConflict`
   - 6. `res.error` dibalikin ke `local` biar retry
   - 7. `const newServerTxs = await fetchServerChanges(getLastSyncTime())`
   - 8. `await bulkPut(newServerTxs.map(t => ({...t, syncStatus: 'synced'})))`
   - 9. `setLastSyncTime(now())`

3. [ ] `export const initSyncListener = (): void`
   Todo: `window.addEventListener('online', queueSync)`. Register background sync di service worker.

*7. Hooks untuk React - Biar UI reactive*

*`hooks/useTransactions.ts`*
1. [ ] `export const useTransactions = (filter?) => useLiveQuery(() => listTransactions(filter), [filter])` - pake `dexie-react-hooks`
2. [ ] `export const useUnsyncedCount = () => useLiveQuery(() => transactionsTable.where('syncStatus').anyOf('local','conflict').count())`

*8. Testing Todo*

*`services/transaction.service.test.ts`*
1. [ ] `test createTransaction should set syncStatus local`
2. [ ] `test updateTransaction should update updatedAt`
3. [ ] `test removeTransaction should soft delete`
4. [ ] `test getBalance should exclude deleted`

*Aturan Import - Biar modular beneran*

1. `repositories` cuma boleh import `db/dexie` + `types`
2. `services` boleh import `repositories` + `utils` + `types`
3. `api` cuma boleh import `types`
4. `syncManager` boleh import `services` + `repositories` + `api`
5. UI/Hooks cuma boleh import `services` + `hooks`

Ga ada circular dependency. Ga ada class. Semua function. TS bakal auto-complete.

*Langkah ngerjain:*
Mulai dari `types` → `db` → `repo` → `service` → `useLiveQuery` di UI. Baru terakhir `sync`. Biar lu bisa demo input offline dulu.

Mau gue contohin 1 file lengkap, misalnya `transaction.service.ts` full code?