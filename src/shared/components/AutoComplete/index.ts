import { $id } from '@/utils/id'
import { addScript } from '@/utils/addScript'
import type { TAutocompleteProps, TAutocompleteOption } from './types'

export const Autocomplete = ({
  label,
  placeholder = '',
  suggestions,
  initialValues = [],
  name = 'autocomplete',
  required = false,
  error = '',
  onChange,
}: TAutocompleteProps) => {
  const [inputId, inputAction] = $id()
  const [listId, listAction] = $id()
  const [chipsId, chipsAction] = $id()

  // Helper normalisasi agar initialValues string dikonversi ke object
  const normalize = (
    item: string | TAutocompleteOption,
  ): TAutocompleteOption => {
    if (typeof item !== 'string') return item

    // Cari di suggestions dulu agar icon-nya dapet
    const found = suggestions.find(
      (s) => (typeof s === 'string' ? s : s.value) === item,
    )
    if (found && typeof found !== 'string') return found

    // Fallback untuk custom entry
    return {
      label: item,
      value: item,
      icon: '<svg class="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    }
  }

  addScript(() => {
    // State internal menggunakan object list
    let selectedObjects: TAutocompleteOption[] = initialValues.map(normalize)

    inputAction((inputEl: HTMLInputElement) => {
      listAction((listEl: HTMLElement) => {
        chipsAction((chipsEl: HTMLElement) => {
          const notifyChange = () => {
            if (onChange) onChange([...selectedObjects])
          }

          const renderChips = () => {
            const ChipsTemplate = selectedObjects
              .map((obj) => {
                const isCustom = !suggestions.some(
                  (s) => (typeof s === 'string' ? s : s.value) === obj.value,
                )
                const chipColor = isCustom
                  ? 'bg-accent text-accent-content'
                  : 'bg-secondary text-secondary-content'

                return html`
                  <div
                    class="flex items-center gap-1.5 px-2 py-1 rounded-md ${chipColor} text-sm animate-in zoom-in-95 font-medium">
                    <div class="flex-shrink-0">${obj.icon || ''}</div>
                    <span>${obj.label}</span>
                    <input
                      type="hidden"
                      name="${name}[]"
                      value="${obj.value}" />
                    <button
                      type="button"
                      class="remove-chip hover:scale-125 transition-transform ml-1"
                      data-val="${obj.value}">
                      &times;
                    </button>
                  </div>
                `
              })
              .join('')

            chipsEl.innerHTML = ChipsTemplate

            chipsEl.querySelectorAll('.remove-chip').forEach((btn) => {
              ;(btn as HTMLElement).onclick = (e) => {
                e.preventDefault()
                const val = (e.currentTarget as HTMLElement).getAttribute(
                  'data-val',
                )
                selectedObjects = selectedObjects.filter((o) => o.value !== val)
                renderChips()
                notifyChange()
              }
            })
          }

          const addItem = (item: string | TAutocompleteOption) => {
            const obj = normalize(item)
            if (!selectedObjects.some((o) => o.value === obj.value)) {
              selectedObjects.push(obj)
              inputEl.value = ''
              listEl.classList.add('hidden')
              renderChips()
              notifyChange()
            }
          }

          const showSuggestions = () => {
            const query = inputEl.value.toLowerCase()
            const filtered = suggestions.filter((s) => {
              const label = typeof s === 'string' ? s : s.label
              const val = typeof s === 'string' ? s : s.value
              return (
                label.toLowerCase().includes(query) &&
                !selectedObjects.some((o) => o.value === val)
              )
            })

            if (filtered.length === 0) {
              listEl.classList.add('hidden')
              return
            }

            const SuggestionsTemplate = filtered
              .map((s) => {
                const obj =
                  typeof s === 'string' ? { label: s, value: s, icon: '' } : s
                return html`
                  <div
                    class="suggestion-item px-4 py-2.5 cursor-pointer hover:bg-base-200 flex items-center gap-3 transition-colors border-b border-base-200 last:border-0"
                    data-idx="${suggestions.indexOf(s)}">
                    <div class="opacity-50">${obj.icon || ''}</div>
                    <div class="flex flex-col">
                      <span class="text-base-content text-sm font-medium"
                        >${obj.label}</span
                      >
                    </div>
                  </div>
                `
              })
              .join('')

            listEl.innerHTML = SuggestionsTemplate
            listEl.classList.remove('hidden')

            listEl.querySelectorAll('.suggestion-item').forEach((item) => {
              ;(item as HTMLElement).onclick = (e) => {
                e.stopPropagation()
                const idx = parseInt(
                  (item as HTMLElement).getAttribute('data-idx') || '0',
                )
                addItem(suggestions[idx])
              }
            })
          }

          inputEl.onkeydown = (e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              if (inputEl.value.trim()) addItem(inputEl.value.trim())
            }
          }

          inputEl.oninput = showSuggestions
          inputEl.onfocus = showSuggestions
          document.addEventListener('click', (e) => {
            if (!inputEl.contains(e.target as Node))
              listEl.classList.add('hidden')
          })

          renderChips()
        })
      })
    })
  })

  return html`
    <div class="w-full flex flex-col gap-1.5">
      <label
        class="text-sm font-bold text-base-content/60 ml-1 uppercase tracking-wider text-[10px]">
        ${label} ${required ? '<span class="text-error">*</span>' : ''}
      </label>
      <div class="relative group">
        <div
          class="flex flex-wrap gap-2 p-2.5 min-h-[52px] rounded-xl border bg-base-100
                    ${error
    ? 'border-error shadow-[0_0_0_1px_rgba(255,0,0,0.4)]'
    : 'border-base-300 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5'}
                    transition-all duration-300 shadow-sm">
          <div ${chipsId} class="flex flex-wrap gap-2"></div>
          <input
            ${inputId}
            type="text"
            placeholder="${placeholder}"
            autocomplete="off"
            class="flex-1 min-w-[160px] bg-transparent outline-none text-sm text-base-content placeholder:text-base-content/20" />
        </div>
        <div
          ${listId}
          class="hidden absolute z-[60] w-full mt-2 max-h-72 overflow-y-auto rounded-2xl bg-base-100 border border-base-300 shadow-2xl py-1 animate-in fade-in slide-in-from-top-2"></div>
      </div>
      ${error
    ? html`<span class="text-xs text-error font-semibold ml-1 animate-pulse"
            >${error}</span
          >`
    : ''}
    </div>
  `
}
