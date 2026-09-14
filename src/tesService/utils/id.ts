// utils/id.ts
/**
 * Generate UUID v4 RFC4122.
 * Performance: crypto.randomUUID() native, 0 allocation.
 * Security: CSPRNG. Tidak predictable. Cocok untuk PK transaksi.
 * SSR Safe: throw kalo ga ada crypto. Jangan panggil di server.
 */
export const generateId = (): string => {
  if (typeof crypto === 'undefined' || !('randomUUID' in crypto)) {
    throw new Error(
      'crypto.randomUUID is not available. This must run in a secure browser context.',
    )
  }
  return crypto.randomUUID()
}