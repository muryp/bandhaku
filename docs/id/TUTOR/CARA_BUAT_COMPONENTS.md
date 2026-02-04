# 📖 Developer Docs: UI Component Utilities

Dokumentasi ini berfokus pada cara membangun komponen interaktif menggunakan sistem ID dan Script Manager yang terintegrasi dengan Vite dan Router.

## 🛠️ Modul Utama

### 1. `$id` (@/utils/id)

Menghasilkan ID unik dan fungsi `action` untuk manipulasi DOM.

- **`action`**: Menjalankan callback untuk **setiap** elemen yang memiliki `data-id` tersebut. Jika elemen ada 5, callback dijalankan 5 kali (selalu menerima elemen tunggal).

### 2. `addScript` (@/utils/addScript)

Mendaftarkan fungsi yang akan dieksekusi **setelah** elemen dirender ke layar. Developer cukup memanggilnya tanpa perlu memikirkan kapan eksekusi atau pembersihannya.

## 🏗️ Pola Penulisan Komponen

Gunakan tag `html` sebelum backtick (`html`...``) untuk mendapatkan fitur _syntax highlighting_ di editor. Tag ini akan dihapus secara otomatis saat proses _build_.

### 1. Komponen Statis / Shared (Global)

Jika komponen tidak memiliki logika unik per pemanggilan, letakkan `$id` dan `addScript` di **luar fungsi** agar efisien (hanya dibuat satu kali).

```typescript
import { $id } from '@/utils/id'
import { addScript } from '@/utils/addScript'

const [id, action] = $id()

// Didaftarkan sekali, berlaku untuk semua instance komponen ini
addScript(() => {
  action((el) => {
    el.onclick = () => console.log('Action pada elemen:', el)
  })
})

export const MyButton = (label: string) => html`
  <button ${id}>${label}</button>
`
```

### 2. Komponen Fungsional (Instance-Specific)

Jika logika komponen bergantung pada argumen atau harus berbeda setiap kali dipanggil, letakkan `$id` di dalam fungsi.

```typescript
export const Counter = (start: number) => {
  const [id, action] = $id()

  addScript(() => {
    let count = start
    action((el) => {
      el.onclick = () => {
        count++
        el.textContent = `Hitungan: ${count}`
      }
    })
  })

  return html`<button ${id}>Hitungan: ${start}</button>`
}
```

## 🔄 Alur Kerja Sistem (Internal)

Meskipun developer hanya fokus pada penulisan script, berikut adalah gambaran bagaimana sistem bekerja di balik layar:

1. **Router Initialization**: Router secara otomatis menjalankan `resetId()` dan `resetScripts()` setiap kali navigasi terjadi.
2. **Rendering**: Komponen dipanggil dan mengembalikan string HTML.
3. **Injection**: String HTML dimasukkan ke dalam DOM.
4. **Execution**: Setelah render selesai, `executeScripts()` dipanggil. Di sinilah `action` mencari elemen berdasarkan `data-id` dan mengeksekusi logika yang kamu tulis.

## 📝 Ringkasan untuk Developer

- **Syntax Highlighting**: Selalu gunakan `html` sebelum backtick: `html`<div></div>``.
- **Gunakan `data-id**`: Selalu pasangkan atribut `data-id="${id}"` pada elemen yang ingin dimanipulasi.
- **Tanpa Loop Manual**: Fungsi `action` sudah melakukan loop otomatis jika ID digunakan di banyak tempat.
- **Fokus pada Logika**: Kamu tidak perlu memanggil `executeScripts` atau mereset apapun. Cukup `addScript` dan selesai.