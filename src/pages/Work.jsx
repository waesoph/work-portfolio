const projects = [
  {
    title: 'Project One',
    description:
      'A quick placeholder summary describing what the project accomplished and the stack used.',
  },
  {
    title: 'Project Two',
    description:
      'Another project highlight—replace this with real work once you are ready.',
  },
]

export default function Work() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-8 text-4xl font-semibold tracking-tight sm:text-5xl">
        Selected Work
      </h1>
      <div className="grid gap-6">
        {projects.map((project) => (
          <article
            key={project.title}
            className="rounded-lg border border-slate-800 bg-slate-900/40 p-6 shadow-sm transition hover:border-slate-700 hover:bg-slate-900/60"
          >
            <h2 className="text-2xl font-semibold text-slate-100">
              {project.title}
            </h2>
            <p className="mt-3 text-slate-300">{project.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
