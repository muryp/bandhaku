import type { TMurypRouteConfig, TMurypRoutes } from '@muryp/router-dom/types'
import addScript from './scripts/add.ts'
import { AddPages } from './pages/add'
import { TransactionHistoryPage } from './pages/home/index.ts'

export const AddRouter: Omit<TMurypRoutes, '@404'> | TMurypRouteConfig = {
  'component': TransactionHistoryPage,
  'title': 'List Transaction',
  '/add': {
    component: AddPages,
    title: 'Add Transaction',
  },
  '/put': {
    // component: AddPages,
    title: 'Add Transaction',
    script: addScript,
  },
}