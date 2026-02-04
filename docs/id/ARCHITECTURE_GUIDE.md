
<!-- TODO: TIDAK PAKAI REPO, TAPI GANTI DB UNTUK DEXIE (setup saja) -->
<!-- TODO: DB DAN API PAKAI EXPORT KHUSUS AGAR TIDAK PERLU TRY CATCH ERROR -->

# Panduan Struktur & Aturan Kode — Feature-Based Architecture

Dokumen ini adalah pedoman resmi pengembangan proyek. Tujuannya agar implementasi konsisten, mudah diuji, dan mudah dipelihara.

## Konsep Utama

1. **Feature First**
   Unit utama adalah folder `features/<feature>`. Semua artefak (page, component, service, repo, dsb.) hidup di dalamnya.
   `shared/` hanya pengecualian jika kode benar-benar generik dan lintas feature.

2. **Separation of Concerns**

   - **db** = akses data offline/indexdb.
   - **api** = akses data online/fetch.
   - **Service** = logika bisnis.
   - **Page** = hanya return/export html string dan dom, yang berisi pages/per url. dan juga style css.
   - **Component** = bagian dari pages yang dipisah.
   - **router** = setup router untuk domain

> [!WARNING]
> Seluruh folder lengkap ini hanya dibuat jika memang kompleks/membutuhkan saja. Baca benar panduannya agar tidak salah.

## Struktur Folder Minimal

```txt
src/
├── features/
│ └── dashboard/ => dashboard bisa diubah sesuai nama fitur
│   ├── pages/ => berisi kumpulan pages/single pages
│   │   └── Home/ => (optional): berisi file untuk pages tertentu
│   │       ├── index.ts => berisi function yang return html string/variable string html
│   │       ├── types.ts => berisi types
│   │       └── style.css => (opstional) : berisi style kusus untuk pages tertentu
│   ├── components/ => (optional) : berisi sekumpulan components/parts html dari pages/component lain
│   │   └── Form/ => berisi file untuk component tertentu
│   │       ├── index.ts
│   │       └── style.css
│   ├── services.ts => orkestrasi db dan api(jika sudah ada), dan melakukan bisnis logic.
│   ├── db.ts => berisi setup indexdb dan function untuk melakukan CRUD
│   ├── api.ts => berisi fetch dan penanganan error untuk api.
│   ├── types.ts => shared types
│   ├── style.css => shared style
│   ├── utils/ => folder utils/helper function/function yang hanya menerima args dan mengembalikan sesuatu tanpa menyentuh/memanggil db/dom/api browser
│   └── router.ts => mendefinisikan router
├── shared/
│   ├── components/ => shared components/global compoments
│   ├── utils/ => shared utils
│   ├── types/ => shared types
│   ├── config/ => berisi configurasi/variable global
│   ├── layouts.ts => core layouts
│   └── assets/ => berisi gambar/svg
└── app/
    ├── app.ts
    ├── router.ts
    └── style.css
```
