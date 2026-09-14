import { $id } from '@/utils/id'
import { addScript, executeScripts } from '@/utils/addScript'
import { toast } from '@/utils/toast'
import { TransactionTable } from '../components/Table'

export interface ITransaction {
  id: string
  transactionDate: Date
  createdAt: Date
  updatedAt: Date
  description: string
  amount: number
  walletId: string
  type: 'income' | 'outcome'
  tagsId: string[]
  clientsId: string[]
}

// Mock Data sesuai interface ITransaction
let transactions: ITransaction[] = Array.from({ length: 15 }, (_, i) => ({
  id: `TRX-${i + 1}`,
  transactionDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  description: `Pembelian keperluan kantor #${i + 1}`,
  amount: Math.floor(Math.random() * 1000000),
  walletId: 'main-wallet',
  type: i % 3 === 0 ? 'income' : 'outcome',
  tagsId: ['tag-1'],
  clientsId: ['client-1'],
}))

let visibleCount = 5

export const TransactionPage = () => {
  const [pageTag, pageAction] = $id()

  // Fungsi reload untuk update DOM dan re-binding script
  const reload = () => {
    pageAction((el) => {
      el.innerHTML = renderUI()
      // CRITICAL: Menjalankan ulang script lifecycle setelah render ulang content
      executeScripts()
    })
  }

  const renderUI = () => {
    const currentData = transactions.slice(0, visibleCount)
    const hasMore = visibleCount < transactions.length

    // Penggunaan PascalCase untuk component assignment sesuai standar
    const MainTable = TransactionTable({
      data: currentData,
      hasMore,
      onLoadMore: () => {
        visibleCount += 5
        reload()
      },
      onDelete: (id) => {
        toast.ask('Hapus Transaksi', `Apakah Anda yakin ingin menghapus ${id}?`, () => {
          transactions = transactions.filter((t) => t.id !== id)
          toast.success('Transaksi berhasil dihapus')
          reload()
        })
      },
      onBulkDelete: (ids) => {
        toast.ask(
          'Hapus Massal',
          `Hapus ${ids.length} transaksi terpilih?`,
          () => {
            transactions = transactions.filter((t) => !ids.includes(t.id))
            toast.success('Penghapusan massal berhasil')
            reload()
          },
        )
      },
    })

    return html`
      <div class="max-w-6xl mx-auto space-y-6">
        <div class="flex justify-between items-end">
          <div>
            <h1 class="text-3xl font-black text-base-content tracking-tight">
              Transactions
            </h1>
            <p class="text-base-content/60 text-sm">
              Monitoring and manage your cash flow
            </p>
          </div>
          </div>

        <div class="bg-base-200/50 rounded-2xl p-1">
           ${MainTable}
        </div>
      </div>
    `
  }

  // Registrasi logic awal
  addScript(() => {
    pageAction((el) => {
      console.log('TransactionPage Initialized')
    })
  })

  // Return awal dengan pageTag untuk identifikasi ID Helper
  return html`
    <div ${pageTag} class="p-8 bg-base-100 min-h-screen">
      ${renderUI()}
    </div>
  `
}