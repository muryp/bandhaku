import { DateFilter } from '@/shared/components/Input/DatePicker'

export const TransactionHistoryPage = () => {
  return DateFilter({
    onChange: (val) => {
      alert(`from : ${val.from} to: ${val.to}`)
    },
  })
}
