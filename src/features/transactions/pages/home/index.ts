import './style.css'
import { $id } from '@/utils/id'
import { addScript } from '@/utils/addScript'
import { db } from '../../db'
import { FilterForm } from '../../components/FilterForm'
import { TableRow } from '../../components/TableRow'
import { toast } from '@/shared/utils/alert'
import { getDateRange } from '../../utils/sortByDate' // Pastikan helper ini mengembalikan {start, end}

export const TransactionHistoryPage = () => {
  const [tableBodyId, tableAction] = $id()
  const [formId, formAction] = $id()
  const [actionBarId, actionBarAction] = $id()
  const [countId, countAction] = $id()
  addScript(() => {
    let lastAppliedState = ''

    // 1. Ambil State Form Saat Ini
    const getFormState = (form: HTMLFormElement) => {
      const fd = new FormData(form)
      return JSON.stringify({
        clients: fd.getAll('client[]').sort(),
        tags: fd.getAll('tags[]').sort(),
        period: fd.get('period'),
        type: fd.get('type'),
        wallet: fd.get('wallet'),
        start: fd.get('start'),
        end: fd.get('end'),
      })
    }

    // 2. Update Status Tombol Apply & Popup Bulk
    const updateUIState = (form: HTMLFormElement) => {
      const btn = form.querySelector(
        'button[type="submit"]',
      ) as HTMLButtonElement
      if (btn) btn.disabled = getFormState(form) === lastAppliedState

      const checkedBoxes = document.querySelectorAll('.tx-check:checked')
      const count = checkedBoxes.length

      actionBarAction((bar) =>
        count > 0 ? bar.classList.add('show') : bar.classList.remove('show'),
      )
      countAction((el) => (el.textContent = `${count} item terpilih`))

      // Update status Master Checkbox (jika semua di-check manual, master ikut ke-check)
      const masterCheck = document.querySelector(
        '.select-all-check',
      ) as HTMLInputElement
      const allBoxes = document.querySelectorAll('.tx-check')
      if (masterCheck && allBoxes.length > 0) {
        masterCheck.checked = checkedBoxes.length === allBoxes.length
      }
    }

    // 3. Eksekusi Filter & Render
    const applyFilters = () => {
      formAction((form: HTMLFormElement) => {
        lastAppliedState = getFormState(form)
        updateUIState(form)

        const fd = new FormData(form)
        const period = fd.get('period') as string
        const { start, end } = getDateRange(
          period,
          fd.get('start') as string,
          fd.get('end') as string,
        )

        const filtered = db.transactions.filter((tx) => {
          let matchDate = true
          if (start && end) matchDate = tx.date >= start && tx.date <= end
          const matchClient =
            !fd.getAll('client[]').length ||
            fd.getAll('client[]').includes(tx.client)
          const matchTag =
            !fd.getAll('tags[]').length ||
            tx.tags.some((t) => (fd.getAll('tags[]') as string[]).includes(t))
          const matchType =
            fd.get('type') === 'all' || tx.type === fd.get('type')
          const matchWallet =
            fd.get('wallet') === 'all' || tx.wallet === fd.get('wallet')
          return (
            matchClient && matchTag && matchType && matchWallet && matchDate
          )
        })

        tableAction((tbody) => {
          const sorted = filtered.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          tbody.innerHTML =
            sorted.map((tx) => TableRow(tx)).join('') ||
            '<tr><td colspan="8" class="text-center-pad">Data tidak ditemukan.</td></tr>'

          // Reset Master Checkbox setiap render ulang
          const masterCheck = document.querySelector(
            '.select-all-check',
          ) as HTMLInputElement
          if (masterCheck) masterCheck.checked = false
          updateUIState(form)
        })
      })
    }

    // 4. Binding Events
    formAction((form) => {
      const periodSelect = form.querySelector(
        '#period-select',
      ) as HTMLSelectElement
      const customDateBox = form.querySelector(
        '#custom-date-inputs',
      ) as HTMLElement
      const startInput = form.querySelector(
        'input[name="start"]',
      ) as HTMLInputElement
      const endInput = form.querySelector(
        'input[name="end"]',
      ) as HTMLInputElement

      // --- LOGIC SELECT ALL (MASTER CHECKBOX) ---
      const masterCheck = form
        .closest('.history-container')
        ?.querySelector('.select-all-check') as HTMLInputElement
      if (masterCheck) {
        masterCheck.onchange = () => {
          const isChecked = masterCheck.checked
          document
            .querySelectorAll('.tx-check')
            .forEach((cb: HTMLInputElement) => {
              cb.checked = isChecked
            })
          updateUIState(form)
        }
      }

      const toggleCustomDate = () => {
        if (periodSelect && customDateBox) {
          const isCustom = periodSelect.value === 'custom'
          if (isCustom && startInput && endInput && !startInput.value) {
            const today = new Date().toISOString().split('T')[0]
            startInput.value = today
            endInput.value = today
          }
          customDateBox.style.setProperty(
            'display',
            isCustom ? 'flex' : 'none',
            'important',
          )
        }
      }

      if (periodSelect) {
        periodSelect.onchange = () => {
          toggleCustomDate()
          updateUIState(form)
        }
        toggleCustomDate()
      }

      form.oninput = () => updateUIState(form)

      const observer = new MutationObserver(() => updateUIState(form))
      form
        .querySelectorAll('.chips-wrapper')
        .forEach((w) => observer.observe(w, { childList: true, subtree: true }))

      form.onsubmit = (e) => {
        e.preventDefault()
        applyFilters()
      }
    })

    // 5. Click Delegation & Bulk Actions
    tableAction((tbody) => {
      tbody.onclick = (e) => {
        if ((e.target as HTMLElement).classList.contains('tx-check')) {
          formAction((form) => updateUIState(form))
        }
      }
    })

    actionBarAction((bar) => {
      bar.querySelector('.btn-delete-bulk')?.addEventListener('click', () => {
        const ids = Array.from(
          document.querySelectorAll('.tx-check:checked'),
        ).map((cb) => (cb as HTMLInputElement).value)
        toast.ask('Hapus Data', `Mau hapus ${ids.length} item?`, () => {
          console.log('Deleted IDs:', ids)
          applyFilters()
        })
      })
      bar.querySelector('.btn-cancel-bulk')?.addEventListener('click', () => {
        document
          .querySelectorAll('.tx-check')
          .forEach((cb: HTMLInputElement) => (cb.checked = false))
        formAction((form) => updateUIState(form))
      })
    })

    formAction((form) => {
      lastAppliedState = getFormState(form)
      applyFilters()
    })
  })
  return html`
    <div class="history-container">
      <h1 class="page-title">Transaction History</h1>
      ${FilterForm(formId)}
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width:40px;">
                <input type="checkbox" class="select-all-check" />
              </th>
              <th>Date</th>
              <th>Type</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Wallet</th>
              <th>Tags</th>
              <th style="text-align:right">Actions</th>
            </tr>
          </thead>
          <tbody ${tableBodyId}></tbody>
        </table>
      </div>
      <div ${actionBarId} class="bulk-action-bar">
        <div ${countId} class="selected-count">0 item terpilih</div>
        <button class="btn-delete-bulk">Hapus Terpilih</button>
        <button class="btn-cancel-bulk">Batal</button>
      </div>
    </div>
  `
}
