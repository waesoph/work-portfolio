import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/work', label: 'WORK' },
  { to: '/contact', label: 'CONTACT' },
  { to: '/', label: 'ABOUT' },
]

function getLetterOutlineStyle(isActive) {
  const outlineColor = isActive ? '#000000' : '#ffffff'
  const textShadow = [
    `-1.25px 0 0 ${outlineColor}`,
    `1.25px 0 0 ${outlineColor}`,
    `0 -1.25px 0 ${outlineColor}`,
    `0 1.25px 0 ${outlineColor}`,
    `-1px -1px 0 ${outlineColor}`,
    `1px -1px 0 ${outlineColor}`,
    `-1px 1px 0 ${outlineColor}`,
    `1px 1px 0 ${outlineColor}`,
  ].join(', ')

  if (isActive) {
    return {
      color: '#ffffff',
      WebkitTextStroke: '0 transparent',
      textShadow,
    }
  }

  return {
    color: '#000000',
    WebkitTextStroke: '0 transparent',
    textShadow,
  }
}

export default function Header({ onNavItemSelect = null, isContactRoute = false }) {
  const headerRef = useRef(null)

  useEffect(() => {
    const headerElement = headerRef.current
    if (!headerElement || typeof window === 'undefined') {
      return undefined
    }

    const updateHeaderHeightVar = () => {
      const headerHeight = headerElement.offsetHeight
      document.documentElement.style.setProperty('--site-header-height', `${headerHeight}px`)
    }

    updateHeaderHeightVar()

    if (typeof window.ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateHeaderHeightVar)
      return () => {
        window.removeEventListener('resize', updateHeaderHeightVar)
      }
    }

    const resizeObserver = new window.ResizeObserver(updateHeaderHeightVar)
    resizeObserver.observe(headerElement)
    window.addEventListener('resize', updateHeaderHeightVar)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateHeaderHeightVar)
    }
  }, [])

  return (
    <header
      ref={headerRef}
      className={`relative z-[120] bg-black ${isContactRoute ? 'contact-split-header' : ''}`}
    >
      <div data-header-bar="true" className="relative z-10 mx-auto w-full px-3 py-3 sm:px-6 sm:py-5 lg:px-10 lg:py-7">
        <nav aria-label="Primary navigation" className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={(event) => {
                if (typeof onNavItemSelect === 'function') {
                  onNavItemSelect({ event, to: item.to, label: item.label })
                }
              }}
              className="site-nav-link flex min-h-[60px] items-center justify-center px-2 py-3 text-center text-[clamp(1.25rem,5.1vw,7rem)] font-bold leading-none tracking-tight transition-transform duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-[88px] sm:px-3 sm:py-4 lg:min-h-[148px] lg:px-6 lg:py-6"
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
