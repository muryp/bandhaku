import type { TMurypRouteConfig, TMurypRoutes } from '@muryp/router-dom/types'
import { AddTransactionPage } from './pages/add'
import { toast } from '@/shared/utils/toast'
import { TransactionPage } from './pages/table'
import { MoneyCalculator } from './pages/calculator'
import { AppDashboard } from './pages/dashboard'
import { TransactionHistoryPage } from './pages/list'

export const AddRouter: Omit<TMurypRoutes, '@404'> | TMurypRouteConfig = {
  // 'component': TransactionHistoryPage,
  // 'component': TransactionPage,
  'component': MoneyCalculator({onChange:(val)=>console.log(val)}),
  // component:AppDashboard,
  'title': 'List Transaction',
  '/add': {
    component: AddTransactionPage,
    title: 'Add Transaction',
  },
  // '/put': {
  //   // component: AddPages,
  //   title: 'Add Transaction',
  //   script: addScript,
  // },
}