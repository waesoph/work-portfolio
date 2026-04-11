import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/work', label: 'WORK' },
  { to: '/contact', label: 'CONTACT' },
  { to: '/about', label: 'ABOUT' },
]

function getLetterOutlineStyle(isActive) {
  if (isActive) {
    return {
      color: '#ffffff',
      WebkitTextStroke: '2px #000000',
    }
  }

  return {
    color: '#000000',
    WebkitTextStroke: '2px #ffffff',
  }
}

export default function Header({ onNavItemSelect = null, isContactRoute = false }) {
  return (
    <header className={`relative z-[120] bg-black ${isContactRoute ? 'contact-split-header' : ''}`}>
      <div data-header-bar="true" className="relative z-10 mx-auto w-full px-3 py-3 sm:px-6 sm:py-5 lg:px-10 lg:py-7">
        <nav aria-label="Primary navigation" className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={(event) => {
                if (typeof onNavItemSelect === 'function') {
                  onNavItemSelect({ event, to: item.to, label: item.label })
                }
              }}
              className="site-display-font flex min-h-[60px] items-center justify-center px-2 py-3 text-center text-[clamp(1.25rem,5.1vw,7rem)] font-bold leading-none tracking-tight transition-transform duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-[88px] sm:px-3 sm:py-4 lg:min-h-[148px] lg:px-6 lg:py-6"
              style={({ isActive }) =>
                getLetterOutlineStyle(isActive)
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
