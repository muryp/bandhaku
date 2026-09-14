import { db } from './db'

const batchSize = 1000
const totalRecords = 1000000
export const seedDatabase = async () => {
  // 1. Bersihkan database lama (Opsional - Hati-hati!)
  await Promise.all([
    db.transactions.clear(),
    db.wallets.clear(),
    db.tags.clear(),
    db.clients.clear(),
  ])

  // 2. Buat Dummy Wallets
  const walletIds = ['w1', 'w2']
  await db.wallets.bulkAdd([
    {
      id: 'w1',
      name: 'Bank BCA',
      description: 'Tabungan Utama',
      icons: 'wallet',
      currency: 'IDR',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'w2',
      name: 'Crypto Wallet',
      description: 'Investasi',
      icons: 'currency-bitcoin',
      currency: 'USD',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])

  // 3. Buat Dummy Tags
  const tagIds = ['t1', 't2', 't3']
  await db.tags.bulkAdd([
    {
      id: 't1',
      name: 'Food',
      description: '',
      icons: 'coffee',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 't2',
      name: 'Salary',
      description: '',
      icons: 'trending-up',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 't3',
      name: 'Transport',
      description: '',
      icons: 'car',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])

  for (let i = 0; i < totalRecords; i += batchSize) {
    const dummyTransactions = Array.from({ length: batchSize }).map((_, i) => {
      const isIncome = Math.random() > 0.5
      const date = new Date()
      date.setDate(date.getDate() - i) // Mundur 1 hari setiap loop agar sorting terasa

      return {
        id: crypto.randomUUID(),
        transactionDate: date,
        createdAt: new Date(),
        updatedAt: new Date(),
        description: `Transaksi ke-${i + 1}`,
        amount: Math.floor(Math.random() * 100000) + 10000,
        walletId: walletIds[Math.floor(Math.random() * walletIds.length)],
        type: isIncome ? 'income' : ('outcome' as 'income' | 'outcome'),
        tagsId: [tagIds[Math.floor(Math.random() * tagIds.length)]],
        clientsId: [],
        syncStatus: 'synced' as 'synced' | 'pending',
      }
    })
    await db.transactions.bulkAdd(dummyTransactions)
    console.log(`Added ${i + batchSize} records`)
  }
}
