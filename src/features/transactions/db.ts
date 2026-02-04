import type { TTransaction } from '@/shared/types/transaction'
// import { db } from '@/shared/db'
//
// // TypeScript akan komplain jika isi object tidak sesuai dengan interface di shared
// export const updateUser = async (id: string, name: string) => {
//   return db.put('users', {
//     id,
//     name,
//     email: 'user@example.com',
//     updatedAt: new Date().toISOString(),
//   })
// }
//
// export const fetchUser = async (id: string) => {
//   // 'user' di sini otomatis ter-typing sebagai objek User
//   const user = await db.get('users', id)
//   return user
// }
export const dummyClients = [
  'Budi Sudarsono',
  'Siti Aminah',
  'PT. Maju Mundur',
  'John Doe',
]
export const dummyTags = ['Invoice', 'Project A', 'Urgent', 'Monthly']

export const db = {
  clients: [
    'Andi Hermawan',
    'Budi Santoso',
    'Citra Lestari',
    'Deni Sumargo',
    'Global Tech',
  ],
  tags: ['Business', 'Personal', 'Urgent', 'Monthly', 'Food'],
  transactions: Array.from(
    { length: 40 },
    (_, i): TTransaction => ({
      id: i + 1,
      date: `2024-05-${String((i % 28) + 1).padStart(2, '0')}`,
      type: i % 2 === 0 ? 'piutang' : 'utang',
      client: [
        'Andi Hermawan',
        'Budi Santoso',
        'Citra Lestari',
        'Deni Sumargo',
      ][i % 4],
      amount: (i + 1) * 250000,
      wallet: i % 2 === 0 ? 'Cash' : 'Bank',
      tags: [['Business'], ['Personal', 'Urgent'], ['Monthly']][i % 3],
    }),
  ),
}
