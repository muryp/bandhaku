import { Header } from '../components/header/headers'
import { darkBtn } from '../utils/darkBtn'
import '../main.css'

const app = document.getElementById('app')
app!.innerHTML += Header
app!.innerHTML += html`<b>hello world</b>`

// script
darkBtn()
