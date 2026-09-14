// types/transaction.types.ts

/**
 * Tipe transaksi. Strict union biar ga ada typo.
 * Pakai const assertion buat runtime validation kalo perlu.
 */
export type TransactionType = 'income' | 'expense' | 'transfer';

/**
 * Status sinkronisasi untuk offline-first.
 * 'local': baru dibuat/diubah di client, belum di-push
 * 'pending': sedang dalam proses push ke server
 * 'synced': sudah sama dengan server
 * 'conflict': versi server beda, butuh resolve manual
 */
export type SyncStatus = 'local' | 'pending' | 'synced' | 'conflict';

/**
 * Skema utama Transaction di IndexedDB.
 * Security: semua ID wajib UUID v4 dari client untuk cegah collision.
 * Performance: `amount` integer = `Math.round(rp * 100)` untuk hindari float error.
 * Performance: `date`, `updatedAt` pakai number unix ms biar index cepet.
 */
export interface Transaction {
  /** UUID v4. Primary key. Wajib dari client. */
  readonly id: string;
  readonly type: TransactionType;
  /** Simpan sebagai integer. Contoh: Rp10.500,50 = 1050050 */
  readonly amount: number;
  /** Index multiEntry, query by category[] cepet */
  readonly category: string;
  readonly note?: string;
  readonly accountId: string;
  /** Unix timestamp ms. Buat sorting & range query */
  readonly date: number;
  /** Unix timestamp ms. Diisi pas create */
  readonly createdAt: number;
  /** Unix timestamp ms. Update tiap ada perubahan */
  readonly updatedAt: number;
  /** Soft delete. Kalo ada nilai = sudah dihapus. */
  readonly deletedAt?: number;
  readonly syncStatus: SyncStatus;
  /** ID device/browser. Buat debug + audit. Generate sekali simpan localStorage */
  readonly clientId: string;
  /** ID dari server setelah sync sukses. Jangan dipake buat relasi di client */
  readonly serverId?: string;
  /** Disimpan pas conflict. Jangan diakses langsung di UI normal */
  readonly _serverVersion?: Transaction;
}

/**
 * DTO buat create. Hilangin semua field yang di-generate sistem.
 * Immutability: readonly biar ga ketuker pas passing.
 */
export type CreateTransactionDTO = Readonly<
  Omit<
    Transaction,
    'id' | 'syncStatus' | 'createdAt' | 'updatedAt' | 'clientId' | 'serverId' | '_serverVersion' | 'deletedAt'
  >
>;

/**
 * DTO buat update. Semua optional kecuali updatedAt & syncStatus di-set di service.
 * updatedAt sengaja dihilangkan dari DTO biar ga bisa di-spoof dari UI.
 */
export type UpdateTransactionDTO = Readonly<
  Partial<
    Omit<
      Transaction,
      'id' | 'createdAt' | 'clientId' | 'serverId' | '_serverVersion' | 'syncStatus' | 'updatedAt'
    >
  >
>;

/**
 * Response dari server saat batch-sync.
 * Security: server wajib validasi semua field sebelum balikin sukses.
 */
export interface ServerTransactionResponse {
  /** ID client yang berhasil disimpan */
  success: string[];
  /** ID client yang conflict dengan data server terbaru */
  conflict: Array<{
    id: string;
    serverData: Transaction;
  }>;
  /** ID client yang gagal karena validasi/server error. Harus retry */
  error: string[];
  /** Unix ms dari jam server. Buat setLastSyncTime */
  serverTime: number;
}