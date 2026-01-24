import Header from './components/header.jsx'
import Footer from './components/footer.jsx'
import Hero from './components/hero.jsx'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import Work from './pages/Work.jsx'
import Contact from './pages/Contact.jsx'


function App() {

  return (
    <>
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        <Hero />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/work" element={<Work />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
    </>
  )
}

export default App
