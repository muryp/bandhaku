// @/feat/transaction/TransactionTable.ts
import { Button } from '@/shared/components/Btn'
import { Input } from '@/shared/components/Input'
import { $id } from '@/utils/id'
import { addScript } from '@/utils/addScript'
import type { ITransaction } from './TransactionPage'

interface ITableProps {
  data: ITransaction[]
  hasMore: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onLoadMore: () => void
  onBulkDelete: (ids: string[]) => void
}

export const TransactionTable = ({
  data,
  hasMore,
  onEdit,
  onDelete,
  onLoadMore,
  onBulkDelete,
}: ITableProps) => {
  const [tableTag, tableAction] = $id()
  const [bulkTag, bulkAction] = $id()
  const SelectedItems: Record<string, boolean> = {}

  const syncBulkUI = () => {
    const selectedIds = Object.keys(SelectedItems).filter((id) => SelectedItems[id])
    bulkAction((el) => {
      if (selectedIds.length > 0) {
        el.classList.replace('hidden', 'flex')
        const label = el.querySelector('.count-label')
        if (label) label.textContent = `${selectedIds.length} transaksi terpilih`
        const btn = el.querySelector('button')
        if (btn) btn.onclick = () => onBulkDelete(selectedIds)
      } else {
        el.classList.replace('flex', 'hidden')
      }
    })
  }

  const rows = data
    .map((item) => {
      const isIncome = item.type === 'income'
      const amountColor = isIncome ? 'text-success' : 'text-error'

      // Render Tags sebagai Chips
      const tagChips = item.tagsId.map(tag =>
        `<span class="px-2 py-0.5 rounded-md bg-secondary/10 text-secondary text-[10px] font-bold uppercase border border-secondary/20">${tag}</span>`
      ).join('')

      // Render Clients
      const clientList = item.clientsId.map(client =>
        `<span class="text-xs text-base-content/70 flex items-center gap-1">
          <span class="w-1 h-1 rounded-full bg-accent"></span> ${client}
        </span>`
      ).join('')

      return html`
        <tr class="border-b border-base-300 hover:bg-base-200/50 transition-colors group">
          <td class="p-4 w-12">
            ${Input({
              type: 'checkbox',
              value: item.id,
              className: 'row-check',
              onChange: (_, el) => {
                SelectedItems[item.id] = (el as HTMLInputElement).checked
                syncBulkUI()
              },
            })}
          </td>
          <td class="p-4 min-w-[200px]">
            <div class="font-bold text-base-content group-hover:text-primary transition-colors">${item.description}</div>
            <div class="text-[10px] text-base-content/40 font-mono mt-0.5">${item.id}</div>
          </td>
          <td class="p-4 text-sm font-medium text-base-content/80">
            ${item.transactionDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
          </td>
          <td class="p-4">
            <div class="flex flex-wrap gap-1 max-w-[150px]">
              ${tagChips || '<span class="text-base-content/20 text-xs">-</span>'}
            </div>
          </td>
          <td class="p-4">
            <div class="flex flex-col gap-1">
              ${clientList || '<span class="text-base-content/20 text-xs">-</span>'}
            </div>
          </td>
          <td class="p-4">
             <div class="font-mono font-black text-lg ${amountColor}">
                ${isIncome ? '+' : '-'} ${item.amount.toLocaleString('id-ID')}
             </div>
             <div class="text-[10px] font-bold text-base-content/30 uppercase tracking-tighter italic">${item.walletId}</div>
          </td>
          <td class="p-4 text-right whitespace-nowrap">
            <div class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              ${Button({
                label: 'Edit',
                variant: 'ghost',
                color: 'primary',
                size: 'sm',
                onClick: () => onEdit(item.id),
              })}
              ${Button({
                label: 'Delete',
                variant: 'ghost',
                color: 'error',
                size: 'sm',
                onClick: () => onDelete(item.id),
              })}
            </div>
          </td>
        </tr>
      `
    })
    .join('')

  return html`
    <div class="space-y-4">
      <div
        ${bulkTag}
        class="hidden fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-base-100 border border-base-300 p-4 rounded-2xl shadow-2xl items-center gap-6 animate-in fade-in slide-in-from-bottom-4 border-t-4 border-t-error">
        <span class="count-label text-sm font-bold text-base-content">0 terpilih</span>
        ${Button({ label: 'Hapus Permanen', color: 'error', size: 'sm', radius: 'lg' })}
      </div>

      <div
        ${tableTag}
        class="overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all">
        <table class="w-full text-left border-spacing-0">
          <thead class="bg-base-200/50 text-base-content/60 text-[11px] uppercase tracking-widest font-black">
            <tr>
              <th class="p-4 w-12">
                ${Input({
                  type: 'checkbox',
                  onChange: (_, el) => {
                    const isChecked = (el as HTMLInputElement).checked
                    document.querySelectorAll<HTMLInputElement>('.row-check').forEach((i) => {
                      i.checked = isChecked
                      SelectedItems[i.value] = isChecked
                    })
                    syncBulkUI()
                  },
                })}
              </th>
              <th class="p-4">Keterangan</th>
              <th class="p-4">Tanggal</th>
              <th class="p-4">Tags</th>
              <th class="p-4">Clients</th>
              <th class="p-4">Nominal</th>
              <th class="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-base-300">
            ${rows || `<tr><td colspan="7" class="p-24 text-center text-base-content/20 font-medium">Data transaksi tidak ditemukan</td></tr>`}
          </tbody>
        </table>
      </div>

      ${hasMore ? `
        <div class="flex justify-center pt-6">
          ${Button({
            label: 'Tampilkan Lebih Banyak',
            variant: 'outline',
            color: 'neutral',
            size: 'md',
            width: 'wide',
            onClick: onLoadMore,
          })}
        </div>
      ` : ''}
    </div>
  `
}