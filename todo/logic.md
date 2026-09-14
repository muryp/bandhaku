pastikan :
- gunakan db transaction agar jika satu gagal, terjadi rollback
- gunakan lastUpdate untuk tahu apakah sudah diupdate atau belum
- yang terakhir menulis itu yang menang
- gunakan soft delete

- user menyimpan data :
  - menyimpan di indexdb
  - sambil kirim ke server jika ada server
  - jika berhasil api mengembalikan time yang akan disimpan di kedua sisi server dan client untuk tahu kapan terakhir sync
  - jika gagal, bisa try lagi(saat online jika gagal karena internet), dan status tetap pending
- setelah berhasil/gagal :
  - muncul popup
  - form direset jika itu create
  - jika update, tidak melakukan apa apa

untuk penyimpanan :
sisi client
- jika offline/data belum terkirim, taruh ke table notsync (hanya id saja)
- jika client online, maka data akan dicoba dikirim di latar belakang
- atau jika user klick tombol sync
sisi server
- jika mendapatkan data baru :
  - taruh tambahkan data
  - update count
  - wajib gunakan db transaction
- jika update :
  - count kurangi db lama `count-dataTransaction`
  - lalu update data tersebut sambil update count `dataYangSudahDikurangi+updateData`
  - return :
    -