import { db, type ITag } from '../db'

//TODO: CHECKS TAGS
/**
 * Membuat Tag baru
 */
export const createTag = async (
  data: Omit<ITag, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<string> => {
  const id = crypto.randomUUID()
  const now = new Date()

  const record: ITag = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  }

  await db.tags.add(record)
  return id
}

/**
 * Mengambil semua tag
 */
export const getAllTags = async (): Promise<ITag[]> => {
  return await db.tags.toArray()
}

/**
 * Update informasi tag
 */
export const updateTag = async (
  id: string,
  updates: Partial<Omit<ITag, 'id' | 'createdAt'>>,
): Promise<number> => {
  return await db.tags.update(id, {
    ...updates,
    updatedAt: new Date(),
  })
}

/**
 * Menghapus tag
 */
export const deleteTag = async (id: string): Promise<void> => {
  await db.tags.delete(id)
}

/**
 * Mencari tag berdasarkan nama (case-insensitive)
 */
export const findTagsByName = async (name: string): Promise<ITag[]> => {
  return await db.tags.where('name').startsWithIgnoreCase(name).toArray()
}