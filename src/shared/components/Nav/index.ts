import './style.css'
const NavList = [
  {
    name: 'home',
    link: '#',
  },
  {
    name: 'add',
    link: '#/transaction/add',
  },
  {
    name: 'Setting',
    link: '#/setting',
  },
]

const NAV = NavList.map(({ name, link }) => {
  return html` <li><a href="${link}" class="nav-link active">${name}</a></li> `
}).join('')

export const Nav = html`
  <nav class="main-nav">
    <ul class="nav-list">
      ${NAV}
    </ul>
  </nav>
`