import { useCallback, useEffect, useRef, useState } from 'react'
import Header from './components/header.jsx'
import Footer from './components/footer.jsx'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Work from './pages/Work.jsx'
import Contact from './pages/Contact.jsx'

const PAGE_REVEAL_DELAY_MS = 160
const PAGE_FADE_IN_MS = 420
const CONTACT_ROUTE_PATH = '/contact'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const transitionTimersRef = useRef([])
  const [contentPhase, setContentPhase] = useState('visible')
  const [contactTransitionRunId, setContactTransitionRunId] = useState(0)

  const clearTransitionTimers = useCallback(() => {
    transitionTimersRef.current.forEach((timerId) => window.clearTimeout(timerId))
    transitionTimersRef.current = []
  }, [])

  useEffect(() => () => clearTransitionTimers(), [clearTransitionTimers])

  const handleNavItemSelect = useCallback(
    ({ event, to }) => {
      if (!to || to === location.pathname) {
        return
      }

      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button === 1
      ) {
        return
      }

      event.preventDefault()

      if (prefersReducedMotion()) {
        navigate(to)
        return
      }

      clearTransitionTimers()
      const isContactRouteTarget = to === CONTACT_ROUTE_PATH

      setContentPhase('hidden')

      navigate(to)

      if (isContactRouteTarget) {
        setContactTransitionRunId((prev) => prev + 1)

        const contactRevealTimer = window.setTimeout(() => {
          setContentPhase('visible')
        }, 40)

        transitionTimersRef.current = [contactRevealTimer]
        return
      }

      const startRevealTimer = window.setTimeout(() => {
        setContentPhase('revealing')
      }, PAGE_REVEAL_DELAY_MS)

      const settleTimer = window.setTimeout(() => {
        setContentPhase('visible')
      }, PAGE_REVEAL_DELAY_MS + PAGE_FADE_IN_MS + 20)

      transitionTimersRef.current = [startRevealTimer, settleTimer]
    },
    [clearTransitionTimers, location.pathname, navigate],
  )

  return (
    <>
      <div className="flex min-h-screen flex-col bg-black">
        <a
          href="#page-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-sky-300 focus:px-4 focus:py-2 focus:font-semibold focus:text-slate-950"
        >
          Skip to main content
        </a>
        <Header
          onNavItemSelect={handleNavItemSelect}
          isContactRoute={location.pathname === CONTACT_ROUTE_PATH}
        />
        {location.pathname === CONTACT_ROUTE_PATH ? (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-[110] hidden lg:block"
            >
              <div key={`contact-transition-mask-${contactTransitionRunId}`} className="absolute inset-0">
                <div className="contact-left-mask absolute inset-y-0 left-0 bg-black" />
              </div>
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-[130] hidden lg:block"
            >
              <div key={`contact-transition-line-${contactTransitionRunId}`} className="absolute inset-0">
                <div className="contact-split-line absolute bottom-0 left-1/2 w-px -translate-x-1/2 bg-white" />
              </div>
            </div>
          </>
        ) : null}
        <main id="main-content" className="flex flex-1 flex-col">
          <div
            className={`flex flex-1 flex-col ${
              contentPhase === 'hidden'
                ? 'pointer-events-none opacity-0 transition-none'
                : contentPhase === 'revealing'
                  ? 'opacity-100 transition-opacity duration-[420ms] ease-out'
                  : 'opacity-100 transition-none'
            }`}
          >
            <div id="page-content" tabIndex="-1" className="flex-1 focus:outline-none">
              <Routes>
                <Route path="/" element={<Navigate to="/about" replace />} />
                <Route path="/about" element={<Home />} />
                <Route path="/services" element={<Navigate to="/work" replace />} />
                <Route path="/work" element={<Work />} />
                <Route path="/work/:slug" element={<Work />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App
