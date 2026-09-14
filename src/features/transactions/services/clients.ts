import { db, type IClient } from '../db'

/**
 * Menambah Client baru
 */
export const createClient = async (
  data: Omit<IClient, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<string> => {
  const id = crypto.randomUUID()
  const now = new Date()

  const record: IClient = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  }

  await db.clients.add(record)
  return id
}

/**
 * Mengambil semua client
 */
export const getAllClients = async (): Promise<IClient[]> => {
  return await db.clients.orderBy('name').toArray()
}

/**
 * Menghapus client
 */
export const deleteClient = async (id: string): Promise<void> => {
  await db.clients.delete(id)
}
