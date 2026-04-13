import { useState } from 'react'

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M4.98 3.5A2.49 2.49 0 0 1 2.5 6 2.5 2.5 0 1 1 4.98 3.5zM.5 8H4.5V23H.5zM7.5 8H11.3v2h.1c.53-1 1.83-2.1 3.78-2.1 4.04 0 4.78 2.66 4.78 6.12V23h-4v-7.98c0-1.9-.03-4.34-2.65-4.34-2.65 0-3.06 2.07-3.06 4.2V23h-4z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12.18a11.5 11.5 0 0 0 7.86 10.93c.57.1.77-.25.77-.55v-2.13c-3.2.71-3.88-1.58-3.88-1.58-.52-1.36-1.28-1.72-1.28-1.72-1.05-.74.08-.73.08-.73 1.16.08 1.77 1.22 1.77 1.22 1.03 1.8 2.7 1.28 3.36.98.1-.77.4-1.28.72-1.57-2.55-.3-5.24-1.3-5.24-5.79 0-1.28.45-2.33 1.2-3.15-.12-.3-.52-1.52.12-3.17 0 0 .98-.32 3.2 1.2a10.9 10.9 0 0 1 5.84 0c2.22-1.52 3.2-1.2 3.2-1.2.64 1.65.24 2.88.12 3.17.75.82 1.2 1.87 1.2 3.15 0 4.5-2.69 5.49-5.25 5.79.41.36.77 1.07.77 2.17v3.2c0 .3.2.66.78.55A11.5 11.5 0 0 0 23.5 12.18 11.5 11.5 0 0 0 12 .5z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M2 5h20v14H2zm2 2v.2L12 12l8-4.8V7zm16 10V9.5l-8 4.8-8-4.8V17z" />
    </svg>
  )
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ state: 'submitting', message: 'Sending your message…' })

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '1c661ff9-3f59-4a67-b28c-531c3b8396a8',
          ...formData,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setFormData({ name: '', email: '', message: '' })
        setStatus({ state: 'success', message: 'Message sent successfully!' })
      } else {
        setStatus({
          state: 'error',
          message: 'Failed to send message. Please try again.',
        })
      }
    } catch {
      setStatus({
        state: 'error',
        message: 'An unexpected error occurred. Please try again.',
      })
    }
  }

  const contactItems = [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/will-aesoph',
      ariaLabel: 'Visit LinkedIn profile',
      icon: <LinkedInIcon />,
    },
    {
      label: 'GitHub',
      href: 'https://github.com/waesoph',
      ariaLabel: 'Visit GitHub profile',
      icon: <GitHubIcon />,
    },
    {
      label: 'Email',
      href: 'mailto:willaesoph@gmail.com',
      ariaLabel: 'Send email to willaesoph@gmail.com',
      icon: <MailIcon />,
    },
  ]

  return (
    <section className="relative w-full overflow-hidden bg-black" id="contact">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-white px-6 py-14 sm:px-10 lg:px-14 lg:py-20 lg:pb-100">
          <div className="contact-left-content mx-auto w-full max-w-2xl">
            <div className="mb-10 text-left">
              <h2 className="mt-6 text-4xl font-bold tracking-[0.14em] text-slate-950 uppercase sm:text-5xl">
                Ready to collaborate?
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-2 text-left">
                <label className="block text-sm font-semibold uppercase tracking-widest text-slate-900" htmlFor="name">
                  Name
                </label>
                <input
                  className="w-full border-b border-l border-slate-900 bg-transparent px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="block text-sm font-semibold uppercase tracking-widest text-slate-900" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full border-b border-l border-slate-900 bg-transparent px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="block text-sm font-semibold uppercase tracking-widest text-slate-900" htmlFor="message">
                  Message
                </label>
                <textarea
                  className="w-full border-b border-l border-slate-900 bg-transparent px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
                  id="message"
                  name="message"
                  rows="6"
                  placeholder="Tell me about your project..."
                  required
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={status.state === 'submitting'}
                className="w-full cursor-pointer bg-black px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status.state === 'submitting' ? 'Sending…' : 'Send Message'}
              </button>

              {status.state !== 'idle' && (
                <p
                  className={`text-sm ${
                    status.state === 'success' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </div>

        <aside className="bg-black px-6 py-14 sm:px-10 lg:px-14 lg:py-20 lg:pb-100">
          <div className="contact-right-content mx-auto w-full max-w-2xl text-left">
            <h2 className="mt-6 text-4xl font-bold tracking-[0.14em] text-white uppercase sm:text-5xl">
              Find Me Here
            </h2>
            <div className="mt-14 space-y-8">
              {contactItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                  aria-label={item.ariaLabel}
                  className="contact-info-link group flex items-center gap-4 px-4 py-4 text-white"
                >
                  <span aria-hidden="true" className="contact-info-link-fill" />
                  <span aria-hidden="true" className="contact-info-link-border-bottom" />
                  <span aria-hidden="true" className="contact-info-link-border-left" />

                  <span className="relative z-10 inline-flex h-11 w-11 items-center justify-center border border-white/80 text-white transition-colors duration-[650ms] group-hover:border-black/80 group-hover:text-black">
                    {item.icon}
                  </span>
                  <span className="relative z-10 text-2xl font-semibold text-white transition-colors duration-[650ms] group-hover:text-black">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>

    </section>
  )
}
