import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="flex min-h-[calc(100dvh-var(--site-header-height,0px))] w-full items-start bg-black text-white">
      <div className="mx-auto w-full max-w-5xl px-6 pt-8 pb-14 text-center sm:pt-10">
        <p className="text-xs font-semibold tracking-[0.2em] text-white uppercase">Error 404</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-6xl">
          This page took a personal day.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-white sm:text-lg">
          Whatever you were looking for has left the chat. Probably to grab coffee.
        </p>
        <p className="mt-8">
          <Link
            to="/"
            className="inline-flex border border-white px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white hover:text-black"
          >
            Back to About
          </Link>
        </p>
      </div>
    </section>
  )
}
