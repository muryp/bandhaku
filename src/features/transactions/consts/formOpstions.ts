import type { TTransaction } from '@/shared/types/transaction'

export function initialValue (initialData?:TTransaction) {
  return {
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
}