import { $id } from '@/shared/utils/id'
import './style.css'
import { addScript } from '@/shared/utils/addScript'
import { TransactionHeader } from '../../components/Form/TransactionHeader'
import { TransactionAmount } from '../../components/Form/TransactionAmount'
import { TransactionMeta } from '../../components/Form/TransactionMeta'
import type { Transaction } from '../../types'

// Bisa dipanggil tanpa argumen untuk ADD, atau dengan data untuk EDIT
export const TransactionFormPage = (initialData?: Transaction) => {
  const [formAttr, formAction] = $id() // formAttr berisi data-id="unique-id"
  const isEdit = !!initialData
  const title = isEdit ? 'Edit Transaction' : 'New Transaction'
  const buttonText = isEdit ? 'Update Changes' : 'Save Transaction'

  addScript(() => {
    formAction((formEl: HTMLFormElement) => {
      formEl.onsubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(formEl)

        // Ambil data dasar
        const data: any = Object.fromEntries(formData.entries())

        // Overwrite field yang seharusnya array
        data.client = formData.getAll('client[]')
        data.tags = formData.getAll('tags[]')

        console.log('🚀 Final Array Data:', data)
        // Hasilnya sekarang: client: ["Budi", "Siti"], tags: ["Urgent", "Invoice"]
      }
    })
  })
  return html`
    <div class="form-card">
      <h2>${title}</h2>
      <form ${formAttr}>
        ${TransactionHeader(initialData)} ${TransactionAmount(initialData)}
        ${TransactionMeta(initialData)}

        <button type="submit" class="btn-primary">${buttonText}</button>
      </form>
    </div>
  `
}
export const AddPages = TransactionFormPage()