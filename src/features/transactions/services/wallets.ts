import { db, type IWallet } from '../db'

/**
 * Membuat Wallet baru
 */
export const createWallet = async (
  data: Omit<IWallet, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<string> => {
  const id = crypto.randomUUID()
  const now = new Date()

  const record: IWallet = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  }

  await db.wallets.add(record)
  return id
}

/**
 * Mengambil semua daftar wallet
 */
export const getAllWallets = async (): Promise<IWallet[]> => {
  return await db.wallets.toArray()
}

/**
 * Update informasi wallet (nama, icon, deskripsi, dll)
 */
export const updateWallet = async (
  id: string,
  updates: Partial<Omit<IWallet, 'id' | 'createdAt'>>,
): Promise<number> => {
  return await db.wallets.update(id, {
    ...updates,
    updatedAt: new Date(),
  })
}

/**
 * Menghapus wallet
 */
export const deleteWallet = async (id: string): Promise<void> => {
  await db.wallets.delete(id)
}

/**
 * Mengambil detail satu wallet berdasarkan ID
 */
export const getWalletById = async (
  id: string,
): Promise<IWallet | undefined> => {
  return await db.wallets.get(id)
}
