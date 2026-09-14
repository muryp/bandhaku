import { Button } from '@/shared/components/Btn'
import { Input } from '@/shared/components/Input'
import { Dropdown } from '@/shared/components/Dropdown'
import { Autocomplete } from '@/shared/components/AutoComplete'
import { FormWrapper } from '@/shared/components/Card/FormWrapper'
import { CURRENCY_LIST } from '@/shared/utils/currency' // Assumption: list exists here
import type { Transaction } from '@/feat/transactions/types'

interface TransactionFormProps {
  initialData?: Transaction
  mode: 'add' | 'edit'
  onSave: (data: Transaction) => void
  isLoading?: boolean
}

/**
 * TransactionForm Component
 * Mengikuti arsitektur Template Injection & Local State Persistence
 */
export const TransactionForm = ({
  initialData,
  mode,
  onSave,
  isLoading = false,
}: TransactionFormProps) => {
  // 1. Local State Object (The "Source of Truth")
  // Sinkronisasi data awal untuk Autocomplete Chips
  const Data: Transaction = {
    date: initialData?.date || new Date().toISOString().split('T')[0],
    type: initialData?.type || 'piutang',
    client: initialData?.client || '',
    amount: initialData?.amount || 0,
    currency: initialData?.currency || 'IDR',
    tags: initialData?.tags || '',
    wallet: initialData?.wallet || '',
    ref: initialData?.ref || '',
    desc: initialData?.desc || '',
  }

  // 2. Define Components
  const DateInput = Input({
    label: 'Tanggal',
    type: 'date',
    value: Data.date,
    required: true,
    onChange: (val) => {
      Data.date = val
    },
  })

  const TypeDropdown = Dropdown({
    label: 'Tipe Transaksi',
    options: [
      { label: 'Piutang (Receivable)', value: 'piutang' },
      { label: 'Utang (Payable)', value: 'utang' },
    ],
    value: Data.type,
    required: true,
    onChange: (val) => {
      Data.type = val as 'piutang' | 'utang'
    },
  })

  const ClientAuto = Autocomplete({
    label: 'Client',
    placeholder: 'Cari atau tulis nama client...',
    // UI Architect Note: Autocomplete initialValues expects TAutocomp[]
    initialValues: Data.client
      ? [{ label: Data.client, value: Data.client }]
      : [],
    suggestions: [
      { label: 'Budi Arifin', value: 'Budi Arifin' },
      { label: 'Siti Aminah', value: 'Siti Aminah' },
    ],
    required: true,
    onChange: (vals) => {
      Data.client = vals[0]?.value || ''
    },
  })

  const AmountInput = Input({
    label: 'Nominal',
    type: 'number',
    value: Data.amount.toString(),
    required: true,
    className: 'font-mono',
    onChange: (val) => {
      Data.amount = Number(val)
    },
  })

  const CurrencyDropdown = Dropdown({
    label: 'Mata Uang',
    options: CURRENCY_LIST.map((c) => ({ label: c, value: c })),
    value: Data.currency,
    onChange: (val) => {
      Data.currency = val
    },
  })

  const TagsAuto = Autocomplete({
    label: 'Tags',
    placeholder: 'Kategori transaksi...',
    initialValues: Data.tags
      ? Data.tags
        .split(',')
        .filter(Boolean)
        .map((t) => ({ label: t, value: t }))
      : [],
    suggestions: [
      { label: 'Bisnis', value: 'Bisnis' },
      { label: 'Pribadi', value: 'Pribadi' },
      { label: 'Operasional', value: 'Operasional' },
    ],
    onChange: (vals) => {
      Data.tags = vals.map((v) => v.value).join(',')
    },
  })

  const WalletAuto = Autocomplete({
    label: 'Dompet / Akun',
    placeholder: 'Pilih sumber dana...',
    initialValues: Data.wallet
      ? [{ label: Data.wallet, value: Data.wallet }]
      : [],
    suggestions: [
      { label: 'BCA Main', value: 'BCA Main' },
      { label: 'Mandiri Business', value: 'Mandiri Business' },
      { label: 'GOPAY', value: 'GOPAY' },
    ],
    required: true,
    onChange: (vals) => {
      Data.wallet = vals[0]?.value || ''
    },
  })

  const RefInput = Input({
    label: 'No. Referensi',
    placeholder: 'Contoh: INV/2024/001',
    value: Data.ref,
    onChange: (val) => {
      Data.ref = val
    },
  })

  const DescInput = Input({
    label: 'Deskripsi',
    type: 'textarea',
    value: Data.desc,
    placeholder: 'Catatan tambahan...',
    rows: 3,
    onChange: (val) => {
      Data.desc = val
    },
  })

  const SubmitBtn = Button({
    label: mode === 'add' ? 'Simpan Transaksi' : 'Perbarui Transaksi',
    variant: 'filled',
    color: 'primary', // Menggunakan Semantic Brand Color
    type: 'submit',
    width: 'full',
    isLoading,
  })

  // 3. Layout Composition
  const content = html`
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      <div class="flex flex-col gap-4">
        ${DateInput} ${TypeDropdown} ${ClientAuto}
      </div>
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-3 gap-2">
          <div class="col-span-2">${AmountInput}</div>
          <div>${CurrencyDropdown}</div>
        </div>
        ${WalletAuto} ${RefInput}
      </div>
      <div class="md:col-span-2">${TagsAuto}</div>
      <div class="md:col-span-2">${DescInput}</div>
    </div>
  `

  return FormWrapper({
    title: mode === 'add' ? 'Tambah Transaksi Baru' : 'Edit Transaksi',
    description:
      'Pastikan data yang dimasukkan sudah sesuai dengan bukti transaksi.',
    content,
    footer: html`<div class="flex justify-end w-full md:w-auto">
      ${SubmitBtn}
    </div>`,
    isLoading,
    onSubmit: (e) => {
      onSave(Data)
    },
  })
}

/**
 * Page Level Component
 */
export const AddTransactionPage = () => {
  const handleSave = async (data: Transaction) => {
    // API Call logic here
    console.log('Architect-approved payload:', data)
  }

  const FormSection = TransactionForm({
    mode: 'add',
    onSave: handleSave,
  })

  return html`
    <div class="min-h-screen bg-base-200 p-4 md:p-8">
      <div class="max-w-4xl mx-auto">
        <header class="mb-8">
          <h1 class="text-3xl font-bold text-base-content tracking-tight">
            Manajemen Keuangan
          </h1>
          <p class="text-base-content/60 mt-2">
            Catat transaksi masuk dan keluar untuk memantau arus kas Anda.
          </p>
        </header>

        <div
          id="form-container"
          class="animate-in fade-in slide-in-from-bottom-4 duration-500">
          ${FormSection}
        </div>
      </div>
    </div>
  `
}
