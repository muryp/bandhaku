import { Button } from '@/shared/components/Btn'
import { Input } from '@/shared/components/Input'
import { Dropdown } from '@/shared/components/Dropdown'
import { Autocomplete } from '@/shared/components/AutoComplete'
import { FormWrapper } from '@/shared/components/Card/FormWrapper'
import type { Transaction } from '@/feat/transactions/types'

interface TransactionFormProps {
  initialData?: Transaction
  mode: 'add' | 'edit'
  onSave: (data: Transaction) => void
  isLoading?: boolean
}

// TODO: DEFAULT DATA PERBAIKI, YANG BERHUBUNGAN DENGAN AUTOCOMPLETE
// TODO: GET CURRENTCY LIST FROM UTILS
// TODO: AMBIL DB UNTUK TAGS, CLIENTS, WALLET LIST
export const TransactionForm = ({
  initialData,
  mode,
  onSave,
  isLoading = false,
}: TransactionFormProps) => {
  // 1. Local State Object (The "Source of Truth")
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

  // 2. Define Components with onChange listeners
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
    placeholder: 'Cari client...',
    initialValues: Data.client
      ? [{ label: Data.client, value: Data.client }]
      : [],
    suggestions: [{ label: 'Budi', value: 'Budi' }],
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
    onChange: (val) => {
      Data.amount = Number(val)
    },
  })

  const CurrencyDropdown = Dropdown({
    label: 'Mata Uang',
    options: [
      { label: 'IDR', value: 'IDR' },
      { label: 'USD', value: 'USD' },
    ],
    value: Data.currency,
    onChange: (val) => {
      Data.currency = val
    },
  })

  const TagsAuto = Autocomplete({
    label: 'Tags',
    initialValues: Data.tags
      ? Data.tags.split(',').map((t) => ({ label: t, value: t }))
      : [],
    suggestions: [{ label: 'Bisnis', value: 'Bisnis' }],
    onChange: (vals) => {
      Data.tags = vals.map((v) => v.value).join(',')
    },
  })

  const WalletInput = Autocomplete({
    label: 'Wallet',
    initialValues: [Data.wallet],
    suggestions: ['BCA', 'GOPAY'],
    required: true,
    onChange: (val) => {
      Data.wallet = val[0].value
    },
  })

  const RefInput = Input({
    label: 'Referensi',
    value: Data.ref,
    onChange: (val) => {
      Data.ref = val
    },
  })

  const DescInput = Input({
    label: 'Deskripsi',
    type: 'textarea',
    value: Data.desc,
    rows: 3,
    onChange: (val) => {
      Data.desc = val
    },
  })

  const SubmitBtn = Button({
    label: mode === 'add' ? 'Simpan Transaksi' : 'Perbarui Transaksi',
    variant: 'filled',
    color: 'main',
    type: 'submit',
    isLoading,
  })

  // 3. Template Injection
  const content = html`
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      ${DateInput} ${TypeDropdown}
      <div class="md:col-span-2">${ClientAuto}</div>
      ${AmountInput} ${CurrencyDropdown}
      <div class="md:col-span-2">${TagsAuto}</div>
      ${WalletInput} ${RefInput}
      <div class="md:col-span-2">${DescInput}</div>
    </div>
  `

  return FormWrapper({
    title: mode === 'add' ? 'Tambah Transaksi Baru' : 'Edit Transaksi',
    content,
    footer: html`<div class="flex justify-end">${SubmitBtn}</div>`,
    isLoading,
    onSubmit: () => {
      // Direct access to the updated 'Data' object
      console.log('Submitting updated Data object:', Data)
      onSave(Data)
    },
  })
}
export const AddTransactionPage = () => {
  const handleSave = async (data: Transaction) => {
    console.log('Architect-approved payload:', data)
    alert(JSON.stringify(data))
    // Perform API call
  }

  const FormSection = TransactionForm({
    mode: 'add',
    onSave: handleSave,
  })

  return html`
    <div class="min-h-screen bg-base-200 p-4 md:p-8">
      <div class="max-w-4xl mx-auto">
        <header class="mb-6">
          <h1 class="text-2xl font-bold text-base-content">
            Manajemen Keuangan
          </h1>
          <p class="text-base-content/70">
            Tambah catatan utang atau piutang baru
          </p>
        </header>

        <div id="form-container">${FormSection}</div>
      </div>
    </div>
  `
}
