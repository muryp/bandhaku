import './style.css'

export const Header = html`
<header class="main-header">
  <div class="logo">Brand<span>Logo</span></div>
  
  <nav class="main-nav">
    <ul class="nav-list">
      <li><a href="#" class="nav-link active">Home</a></li>
      <li><a href="#" class="nav-link">Search</a></li>
      <li><a href="#" class="nav-link">Profile</a></li>
      <li><a href="#" class="nav-link">Settings</a></li>
    </ul>
  </nav>

  <button id="dark-mode-toggle" class="theme-toggle">
    <img class="sun-icon" src="https://api.iconify.design/heroicons:sun-20-solid.svg?color=currentColor">
    <img class="moon-icon" src="https://api.iconify.design/heroicons:moon-20-solid.svg?color=currentColor">
  </button>
</header>
`
