import { Button } from '@/shared/components/Btn'
import { Input } from '@/shared/components/Input'
import { Dropdown } from '@/shared/components/Dropdown'
import { Autocomplete } from '@/shared/components/AutoComplete'
import { FormWrapper } from '@/shared/components/Card/FormWrapper'
import { $id } from '@/utils/id'
import { addScript } from '@/utils/addScript'

export const TransactionHistoryPage = () => {
  // 1. Setup Table Selection Logic
  const [selectId, selectAction] = $id()

  addScript((el) => {
    selectAction(el).on('change', (e) => {
      const target = e.target as HTMLInputElement
      console.log(`Transaction ${target.value} selected: ${target.checked}`)
    })
  })

  // 2. Components Definitions
  const FilterDate = Input({
    label: 'Date Range',
    type: 'date',
    placeholder: 'YYYY-MM-DD to YYYY-MM-DD',
    onChange: (val) => console.log('Date:', val),
  })

  const FilterClient = Dropdown({
    label: 'Client',
    options: [
      { label: 'All Clients', value: 'all' },
      { label: 'Internal', value: 'internal' },
      { label: 'External Vendor', value: 'vendor' },
    ],
    onChange: (val) => console.log('Client:', val),
  })

  const FilterWallet = Dropdown({
    label: 'Wallet',
    options: [
      { label: 'Main Savings', value: 'main' },
      { label: 'Business Petty', value: 'petty' },
    ],
    onChange: (val) => console.log('Wallet:', val),
  })

  const FilterTags = Autocomplete({
    label: 'Tags',
    name: 'tags',
    suggestions: [
      { label: 'Food', value: 'food' },
      { label: 'Salary', value: 'salary' },
      { label: 'Cloud-Hosting', value: 'hosting' },
    ],
    onChange: (vals) => console.log('Tags selected:', vals),
  })

  const DeleteSelectedBtn = Button({
    label: 'Delete Selected',
    color: 'error',
    variant: 'neutral',
    size: 'sm',
    onClick: () => confirm('Delete all selected transactions?'),
  })

  const FilterContent = html`
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      ${FilterDate}
      ${FilterClient}
      ${FilterWallet}
      ${FilterTags}
    </div>
  `

  // 3. Table UI Structure
  // In a real scenario, this would be mapped from data
  const TableRows = [1, 2, 3].map(item => html`
    <tr class="border-b border-base-300 hover:bg-base-200 transition-colors">
      <td class="p-4">
        <input type="checkbox" ${selectId} value="${item}" class="checkbox checkbox-primary" />
      </td>
      <td class="p-4 font-mono text-sm text-base-content">2026-02-11</td>
      <td class="p-4 text-base-content">Google Cloud Platform</td>
      <td class="p-4"><span class="badge badge-neutral text-xs">Infrastructure</span></td>
      <td class="p-4 font-bold text-error">-$120.00</td>
      <td class="p-4 text-right space-x-2">
        ${Button({
    label: 'Edit',
    size: 'sm',
    variant: 'ghost',
    color: 'info',
    onClick: () => console.log('Edit', item),
  })}
        ${Button({
    label: 'Delete',
    size: 'sm',
    variant: 'ghost',
    color: 'error',
    onClick: () => console.log('Delete', item),
  })}
      </td>
    </tr>
  `).join('')

  return html`
    <div class="p-6 space-y-6 bg-base-100 min-h-screen">
      <header class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-base-content">Transaction History</h1>
          <p class="text-base-content/70 text-sm">Monitor and manage your financial logs</p>
        </div>
        ${DeleteSelectedBtn}
      </header>

      ${FormWrapper({
    title: 'Filters',
    content: FilterContent,
    onSubmit: (e) => {
      e.preventDefault()
      console.log('Filters Applied')
    },
    footer: Button({ label: 'Apply Filters', type: 'submit', color: 'primary', width: 'full' }),
  })}

      <div class="overflow-x-auto rounded-box border border-base-300">
        <table class="table w-full bg-base-100">
          <thead class="bg-base-200 text-base-content">
            <tr>
              <th class="w-10"></th>
              <th class="p-4 text-left">Date</th>
              <th class="p-4 text-left">Client/Entity</th>
              <th class="p-4 text-left">Tags</th>
              <th class="p-4 text-left">Amount</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${TableRows}
          </tbody>
        </table>
      </div>
    </div>
  `
}