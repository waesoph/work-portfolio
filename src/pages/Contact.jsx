import { useState } from 'react'

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
    } catch (error) {
      setStatus({
        state: 'error',
        message: 'An unexpected error occurred. Please try again.',
      })
    }
  }

  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col gap-6 px-6 py-16">
      <header className="space-y-2 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Contact
        </h1>
        <p className="text-slate-300">
          Ready to collaborate or want to say hello? Drop a note and I&apos;ll get
          back to you soon.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg"
      >
        <div className="space-y-2 text-left">
          <label className="block text-sm font-semibold text-slate-200" htmlFor="name">
            Name
          </label>
          <input
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2 text-left">
          <label className="block text-sm font-semibold text-slate-200" htmlFor="email">
            Email
          </label>
          <input
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2 text-left">
          <label
            className="block text-sm font-semibold text-slate-200"
            htmlFor="message"
          >
            Message
          </label>
          <textarea
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            id="message"
            name="message"
            rows="5"
            required
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={status.state === 'submitting'}
          className="w-full rounded-lg bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
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
    </section>
  )
}
