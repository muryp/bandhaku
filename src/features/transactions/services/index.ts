import { db, type IWallet, type ITag } from '../db'

// WALLET FUNCTIONS
export const getAllWallets = () => db.wallets.toArray()

export const createWallet = async (
  data: Omit<IWallet, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  const now = new Date()
  return await db.wallets.add({
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  })
}

// TAG FUNCTIONS
export const getAllTags = () => db.tags.toArray()

export const createTag = async (
  data: Omit<ITag, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  const now = new Date()
  return await db.tags.add({
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  })
}