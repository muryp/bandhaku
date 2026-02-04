import type { TMurypRoutes } from '@muryp/router-dom/types'
import addScript from './scripts/add.ts'
import { AddPages } from './pages/add'

export const AddRouter: Omit<TMurypRoutes, '@404'> = {
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