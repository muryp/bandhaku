import './styles.css'
import { staticId } from './shared/utils/id'
import { Header } from '@/shared/components/Nav'
import router from './router'
import { NavData } from './shared/consts/navList'

// add header navigation
const app = document.getElementById('app')
const elemenBaru = document.createElement('div')

export const AppHeader = Header({
  brandName: 'Bandhaku',
  // logoUrl: '/vite.svg',
  menuItems: NavData,
})
elemenBaru.innerHTML = AppHeader
app!.before(elemenBaru)
router()

staticId()