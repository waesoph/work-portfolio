import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import Close from '../assets/icons/close.svg?react'
import Hamburger from '../assets/icons/hamburger-menu.svg?react'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/work', label: 'Work' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen((open) => !open)
  const closeMenu = () => setIsMenuOpen(false)

  const linkBaseClasses =
    'block rounded-md px-4 py-2 text-sm font-semibold transition-colors'

  const renderLinks = (onNavigate) =>
    navItems.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        onClick={onNavigate}
        className={({ isActive }) =>
          `${linkBaseClasses} ${
            isActive
              ? 'bg-indigo-500/20 text-indigo-300'
              : 'text-slate-300 hover:text-white'
          }`
        }
      >
        {item.label}
      </NavLink>
    ))

  return (
    <header className="border-b-2 border-slate-200/70 bg-slate-950/90 backdrop-blur sticky top-0 z-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-lg font-semibold uppercase tracking-widest text-white"
          onClick={closeMenu}
        >
          Will Aesoph
        </Link>

        <nav className="hidden items-center gap-2 md:flex">{renderLinks()}</nav>

        <Link
            to="will-aesoph-resume.pdf"
            className="hidden rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-700 hover:bg-slate-900 md:inline-block"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
        </Link>

        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex items-center text-sm font-semibold text-slate-200 transition hover:border-slate-700 hover:bg-slate-900 md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? <Close /> : <Hamburger />}
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`md:hidden overflow-hidden border-t border-slate-900/70 bg-slate-950 transition-all duration-300 ${
          isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col px-6 py-2">{renderLinks(closeMenu)}</nav>
      </div>
    </header>
  )
}
