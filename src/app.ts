import './main.css'
import router from './router'
import { Header } from '@/shared/components/Header'
import { darkBtn } from '@/utils/darkBtn'
import { staticId } from './shared/utils/id'

// add header navigation
const app = document.getElementById('app')
const elemenBaru = document.createElement('div')
elemenBaru.innerHTML = Header
app!.before(elemenBaru)
darkBtn()

// add router
router()
staticId()