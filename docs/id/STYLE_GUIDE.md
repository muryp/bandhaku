
# Style Guide – Bandhaku

## Konvensi Penamaan (Naming)

### **Boolean / Flag**

- **`isXxx`** → menandai status atau kondisi (true/false).

  - **Contoh state:** `[isLogin, setLogin]`, `[isLoading, setLoading]` (setter tidak perlu ulang `is`)
  - **Kapan digunakan:** mengecek kondisi untuk UI, fitur, atau decision logic.

- **`hasXxx`** → menandai kepemilikan atau hak akses.

  - Contoh: `hasPermission`, `hasUnreadMessages`
  - Digunakan sebelum aksi sensitif atau untuk menampilkan opsi tertentu.

- **`canXxx`** → menandai kemampuan melakukan aksi.

  - Contoh: `canEditProfile`, `canDeleteTransaction`
  - Digunakan untuk mengontrol tombol/aksi di UI.

### **Array / List**

- Bentuk plural → menandai kumpulan item.

  - Contoh: `users`, `transactions`, `messages`
  - Kapan: iterasi, mapping, filter, render tabel atau list UI.

### **State**

- **Format:** `[camelCase, setCamelCase]`

  - Boolean: `[isXxx, setXxx]`
  - Array / Object: `[xxxList, setXxxList]`

- Contoh:

  - Boolean: `[isLogin, setLogin]`, `[isModalOpen, setModalOpen]`
  - Array: `[users, setUsers]`, `[transactions, setTransactions]`
  - Object: `[currentUser, setCurrentUser]`, `[formData, setFormData]`

- **Kapan digunakan:** menyimpan dan mengontrol state local component atau feature.

### **Function / Method**

- **Pola kata kerja:**

  - `fetchXxx` → mengambil data
  - `createXxx` → membuat entitas
  - `updateXxx` → memperbarui data
  - `deleteXxx` → menghapus data
  - `handleXxx` → aksi/event handler yang mengorkestrasi service atau logic

- **Contoh:** `fetchUserData`, `updateTransaction`, `deleteMessage`, `handleSubmit`
- **Kapan digunakan:** dipanggil dari UI, hook, controller, atau service sesuai aksi.

### **Utils / Helper**

- Format: `camelCase` → verb+object jika melakukan aksi, noun jika getter/mapper
- Contoh: `formatDate`, `validateUserForm`, `calculateTotalPrice`
- **Kapan digunakan:** transformasi data, validasi, perhitungan, ekstraksi data kompleks.

### **Type & Interface**

- **Type:** `T` + PascalCase → mendefinisikan shape / entity

  - Contoh: `TUser`, `TTransaction`, `TMessage`

- **Interface:** PascalCase → kontrak data / type-check lintas layer

  - Contoh: `UserData`, `TransactionDetail`, `AuthContext`

- **Kapan digunakan:** args/return function, state store, typing API response.

#### **Ringkasan Pola**

1. **Boolean state:** `[isXxx, setXxx]`, jangan `[isXxx, setIsXxx]`.
2. **Array / object state:** `[xxxList, setXxxList]` atau `[currentUser, setCurrentUser]`.
3. **Function / Method:** kata kerja sesuai aksi (`fetch/update/create/delete/handle`).
4. **Hook custom:** selalu diawali `use` (`useXxx`).
5. **Store:** action/setter `camelCase`.
6. **Factory / Mock / Utils:** camelCase deskriptif.
7. **Type / Interface:** T + PascalCase untuk type, PascalCase untuk interface.

## Import & Path

- Gunakan absolute imports dengan alias `@/` (disarankan di `tsconfig`/`vite`): `@/shared/...` atau `@/features/...`.
- Hindari relative import panjang `../../../` kecuali untuk file yang benar-benar lokal.
- Untuk shared components: `import { Button } from '@/shared/components/Button';`

## Styling

- Gunakan **variables** untuk mayoritas styling.
- untuk **variables** spesifik component/pages tertentu taruh di file terkait, jangan taruh di `app/style.css`
- Jika util helper untuk class composition diperlukan, buat `shared/utils/classNames.ts`.
- Di file Astro gunakan atribut `class` (sesuai catatan sebelumnya).

## Routing

- Mount aplikasi SPA melalui satu entry: `app.ts`.
- jangan biarkan `app/router.ts` gemuk, taruh config router di masing-masing features

## Control Flow & Style Coding

- Prefer **early return** daripada nested `if`.
- Gunakan intermediate variables untuk readability.
- Hindari nested ternary; pakai ternary hanya untuk ekspresi pendek.
- Gunakan object mapping daripada `switch` bila memungkinkan
- Hindari “magic” (fungsi/konstanta tanpa nama jelas). Nama variabel dan fungsi harus self-documenting.