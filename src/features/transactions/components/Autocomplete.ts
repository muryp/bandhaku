import { $id } from '@/utils/id'
import { addScript } from '@/utils/addScript'
import './style.css'

export const Autocomplete = (
  label: string,
  placeholder: string,
  suggestions: string[],
  initialValues: string[] = [],
) => {
  const [inputId, inputAction] = $id()
  const [listId, listAction] = $id()
  const [chipsId, chipsAction] = $id()

  addScript(() => {
    let selectedItems = [...initialValues]

    inputAction((inputEl: HTMLInputElement) => {
      listAction((listEl: HTMLElement) => {
        chipsAction((chipsEl: HTMLElement) => {
          const renderChips = () => {
            chipsEl.innerHTML = selectedItems
              .map(
                (item) => html`
                  <div class="chip">
                    <span>${item}</span>
                    <input
                      type="hidden"
                      name="${label.toLowerCase()}[]"
                      value="${item}" />
                    <button
                      type="button"
                      class="remove-chip"
                      data-val="${item}">
                      &times;
                    </button>
                  </div>
                `,
              )
              .join('')

            chipsEl.querySelectorAll('.remove-chip').forEach((btn) => {
              btn.onclick = (e) => {
                e.preventDefault()
                const val = (e.currentTarget as HTMLElement).getAttribute(
                  'data-val',
                )
                selectedItems = selectedItems.filter((i) => i !== val)
                renderChips()
              }
            })
          }

          // Fungsi pencarian/tampilan daftar
          const showSuggestions = () => {
            const val = inputEl.value.toLowerCase()
            listEl.innerHTML = ''

            // Filter: sembunyikan yang sudah terpilih
            const filtered = suggestions.filter(
              (s) =>
                s.toLowerCase().includes(val) && !selectedItems.includes(s),
            )

            if (filtered.length === 0) {
              listEl.style.display = 'none'
              return
            }

            listEl.style.display = 'block'
            filtered.forEach((s) => {
              const item = document.createElement('div')
              item.className = 'suggestion-item'
              item.textContent = s
              item.onclick = (e) => {
                e.stopPropagation() // Mencegah focus/click event input terpicu
                selectedItems.push(s)
                inputEl.value = ''
                listEl.style.display = 'none'
                renderChips()
              }
              listEl.appendChild(item)
            })
          }

          // Trigger saat mengetik
          inputEl.oninput = showSuggestions

          // Trigger saat fokus/klik (Menampilkan semua jika input kosong)
          inputEl.onfocus = showSuggestions
          inputEl.onclick = (e) => {
            e.stopPropagation()
            showSuggestions()
          }

          // Menutup list saat klik di luar
          window.onclick = () => {
            listEl.style.display = 'none'
          }

          renderChips()
        })
      })
    })
  })

  return html`
    <div class="form-group" style="position: relative;">
      <label>${label}</label>
      <div ${chipsId} class="chips-wrapper"></div>
      <div class="selection-display-container">
        <input
          type="text"
          ${inputId}
          class="selection-input-field"
          placeholder="${placeholder}"
          autocomplete="off" />
      </div>
      <div
        ${listId}
        class="suggestion-dropdown-list"
        style="display: none;"></div>
    </div>
  `
}
