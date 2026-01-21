export const darkBtn = () => {
  const toggleBtn = document.getElementById('dark-mode-toggle')

  toggleBtn!.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode')

    // Opsional: Simpan ke LocalStorage
    const isDark = document.body.classList.contains('dark-mode')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  })

  // Load tema saat halaman dibuka
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode')
  }
}
