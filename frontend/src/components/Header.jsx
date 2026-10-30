import pepsiLogo from '../assets/images/home/pepsi-logo.png'
import './Header.css'

const NAV = [
  { id: 'home', label: 'HOME' },
  { id: 'how-it-works', label: 'HOW IT WORKS' },
  { id: 'tcs', label: "T&C's" },
]

export default function Header({ activeScreen, onNavigate }) {
  const handleClick = (id) => {
    if (id === 'tcs') return
    onNavigate(id)
  }

  return (
    <header className="header">
      <button
        type="button"
        className="header__logo-btn"
        onClick={() => onNavigate('home')}
        aria-label="Home"
      >
        <img src={pepsiLogo} alt="Pepsi" className="header__logo" />
      </button>

      <nav className="header__nav" aria-label="Primary">
        {NAV.map((item) => {
          const isActive =
            item.id === activeScreen ||
            (item.id === 'home' &&
              (activeScreen === 'form' ||
                activeScreen === 'loading' ||
                activeScreen === 'result'))

          return (
            <button
              key={item.id}
              type="button"
              className={`header__link${isActive ? ' is-active' : ''}`}
              onClick={() => handleClick(item.id)}
            >
              {item.label}
            </button>
          )
        })}
      </nav>
    </header>
  )
}
