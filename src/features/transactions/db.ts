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
