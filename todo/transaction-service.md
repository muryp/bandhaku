Paham, maksud Anda **TODO** sebagai daftar tugas pekerjaan (checklist) yang harus saya selesaikan untuk membangun sistem tersebut, bukan mengubah aplikasinya menjadi aplikasi Todo.

Jadi, semacam **Roadmap** atau **Action Plan** untuk mengimplementasikan sistem _Immutable IDB_ dengan _Sharding_ dan _Load More_.

Berikut adalah daftar tugas (**TODO List**) yang harus dikerjakan secara berurutan:

---

### 🟢 Tahap 1: Fondasi Database (db.ts)

- [ ] **Setup `idb` library**: Install dan konfigurasi wrapper IndexedDB.
- [ ] **Dynamic Store Generator**: Buat fungsi yang bisa mengecek dan membuat _object store_ baru secara otomatis dengan format `tx_YYYY_MM`.
- [ ] **Indexing**: Pastikan setiap store memiliki index pada `transactionId` (untuk grouping) dan `transactionDate`/`createdAt` (untuk sorting).
- [ ] **Metadata Tracker**: (Opsional) Buat satu store khusus untuk mencatat daftar store bulan apa saja yang sudah tercipta agar _looping_ lebih cepat.
- [ ] arrange amount
-

### 🟡 Tahap 2: Operasi Immutable (service.ts)

- [ ] **Fungsi `Create**`: Logika untuk menyimpan data pertama kali dengan `id`baru dan`transactionId` baru.
- [ ] **Fungsi `Update` (The Immutable Way)**: Buat fungsi yang tidak menggunakan `.put()`, melainkan `.add()` data baru namun tetap membawa `transactionId` yang lama.
- [ ] **Fungsi `Soft Delete**`: Buat fungsi yang menambah record baru dengan flag `isDeleted: true`.
- [ ] **Fungsi `GetById**`: Logika untuk mencari semua versi dari satu `transactionId` dan mengambil yang paling baru.

### 🟠 Tahap 3: Paginasi & Search (The "Last Match" Logic)

- [ ] **Pagination State**: Buat objek atau class property untuk menyimpan `lastStoreIndex` dan `lastSeenId`.
- [ ] **Store Shifting Logic**: Buat fungsi yang bisa berpindah dari satu store bulan ke bulan sebelumnya jika data di bulan berjalan sudah habis.
- [ ] **Latest Version Filter**: Implementasikan logika `Set()` atau `Map()` di dalam cursor untuk memastikan hanya versi terbaru dari setiap transaksi yang muncul di hasil pencarian.
- [ ] **Search Filters**: Tambahkan pengecekan manual di dalam cursor untuk filter `tags`, `clients`, `wallets`, dan `types`.

### 🔴 Tahap 4: Optimasi & UI Integration

- [ ] **Reset Mechanism**: Buat fungsi untuk mereset semua state paginasi setiap kali user mengganti kata kunci pencarian atau filter.
- [ ] **Loading State Handling**: Pastikan UI tahu kapan data sedang diambil dan kapan data benar-benar sudah habis (`hasMore = false`).
- [ ] **Error Handling**: Tangani kasus jika database diblokir atau versi IDB tidak cocok.

---

**Bagaimana menurut Anda? Apakah ada bagian dari checklist ini yang ingin saya jelaskan lebih detail atau langsung saya buatkan kodenya (misalnya bagian Shifting Logic)?**
