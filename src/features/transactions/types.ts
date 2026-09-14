// interface TInfo {
//   name: string
//   img?: string
//   imgUrl?: string
//   description?: string
// }
// interface TWallet extends TInfo {
//   currency: string
// }
// type TTypeTransaction = 'piutang' | 'utang' | ''
// export interface Transaction {
//   id: string
//   date: string
//   type: TTypeTransaction
//   client?: TInfo[]
//   amount: number
//   currency: string
//   tags?: TInfo[]
//   wallet: TWallet[]
//   ref?: string
//   desc?: string
// }

// INFO: IDB
export interface ITransaction {
  id: string // atau ++id jika ingin auto-increment
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

export interface IWallet {
  id: string
  name: string
  description: string
  icons: string
  createdAt: Date
  updatedAt: Date
  currency: string
}

export interface ITag {
  id: string
  name: string
  description: string
  icons: string
  createdAt: Date
  updatedAt: Date
}
