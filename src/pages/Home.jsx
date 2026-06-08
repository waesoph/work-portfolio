import { Link } from 'react-router-dom'
import headshot from '../assets/images/headshot.jpg'
import { FEATURED_CASE_STUDY_ROUTES } from '../data/caseStudies.js'
import { PRIMARY_SERVICES } from '../seo/siteMetadata.js'

const SERVICE_DETAILS = [
  {
    title: PRIMARY_SERVICES[0],
    copy: 'From structure and layout to implementation, launch, and iteration.',
  },
  {
    title: PRIMARY_SERVICES[1],
    copy: 'Rebuilds that preserve what works while cleaning up the pieces that slow you down.',
  },
  {
    title: PRIMARY_SERVICES[2],
    copy: 'Practical audits and fixes for metadata, headings, internal links, crawlability, and content gaps.',
  },
  {
    title: PRIMARY_SERVICES[3],
    copy: 'Quicker loading, stronger accessibility basics, and improved user experience.',
  },
  {
    title: PRIMARY_SERVICES[4],
    copy: 'Measurement and digital planning that connect the website to business goals.',
  },
]

const TESTIMONIAL_PARAGRAPHS = [
  'We’ve had the pleasure of working with Will for several years, and he has been an invaluable partner in maintaining and improving our website. Will is consistently reliable, timely, and highly efficient in everything he does. He takes a proactive approach to his work, identifying and resolving potential issues before they ever become a problem.',
  'One of Will’s greatest strengths is his attention to detail and commitment to keeping our website running smoothly. He ensures that everything on the backend is constantly updated and functioning at its best, giving us complete confidence in the stability and performance of our site.',
  'Equally impressive is his ability to consistently meet deadlines or respond quickly to urgent requests. No matter the scope of the project, Will delivers high-quality work on time. We truly value his professionalism, expertise, and dedication, and we would highly recommend him to any organization looking for a dependable and skilled website developer.',
]

const featuredCaseStudies = FEATURED_CASE_STUDY_ROUTES.slice(0, 4)

export default function Home() {
  return (
    <div className="bg-stone-100 text-slate-950">
      <section className="relative overflow-hidden bg-black text-white">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-white/60" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1.15fr)_22rem] lg:px-10 lg:py-20">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase !text-sky-200">
                Independent Web Developer
              </p>
              <h1 className="max-w-4xl text-5xl font-semibold leading-none text-white sm:text-6xl lg:text-7xl">
                I build custom websites that pull their weight.
              </h1>
              <p className="max-w-3xl text-lg leading-relaxed !text-slate-100 sm:text-xl">
                Helping teams launch faster websites, clean up technical SEO
                problems, and build a stronger lead channel.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="border border-white bg-white px-5 py-3 text-sm font-semibold uppercase text-slate-950 hover:bg-transparent hover:text-white"
              >
                Start a project
              </Link>
              <Link
                to="/work"
                className="border border-white/45 px-5 py-3 text-sm font-semibold uppercase text-white hover:border-white hover:bg-white hover:text-slate-950"
              >
                See recent work
              </Link>
              <Link
                to="/about"
                className="border border-transparent px-5 py-3 text-sm font-semibold uppercase text-sky-300 hover:text-white"
              >
                More About Me
              </Link>
            </div>

          </div>

          <aside className="self-start border border-white/15 bg-white/5 p-5">
            <div className="relative aspect-[16/9] overflow-hidden border border-white/15 sm:aspect-[5/3] lg:aspect-[4/3]">
              <img
                src={headshot}
                alt="Portrait of Will Aesoph"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-5 pt-16 pb-4">
                <p className="text-lg font-semibold uppercase !text-sky-200">
                  Will Aesoph
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <p className="text-base leading-relaxed !text-slate-100">
                Freelance web developer focused on custom builds, technical SEO,
                and durable website systems for growing teams.
              </p>
              <p className="text-base leading-relaxed !text-slate-200">
                Remote-friendly, deadline-conscious, and comfortable working as
                either the full build partner or an extension of an existing team.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1fr)] lg:items-end">
            <div className="border-l-4 border-slate-950 pl-5">
              <p className="text-sm font-semibold uppercase text-sky-700">
                Services
              </p>
              <h2 className="mt-3 text-4xl font-semibold text-slate-950">
                What I can help with
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {SERVICE_DETAILS.map((service, index) => (
              <article
                key={service.title}
                className="group min-h-[168px] border border-slate-200 bg-stone-50 p-3 lg:p-5 transition-colors duration-300 hover:border-slate-950 hover:bg-slate-950"
              >
                <p className="text-sm font-bold text-sky-700 transition-colors duration-300 group-hover:!text-sky-200">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-2 lg:mt-5 text-xl font-semibold leading-snug text-slate-950 transition-colors duration-300 group-hover:text-sky-200">
                  {service.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-slate-700 transition-colors duration-300 group-hover:!text-white">
                  {service.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-stone-100">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,1fr)] lg:px-10 lg:py-16">
          <div>
            <p className="text-sm font-semibold uppercase text-sky-700">
              Testimonial
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-slate-950">
              Trusted Long Term
            </h2>
          </div>

          <figure className="border-l-4 border-sky-600 pl-6">
            <blockquote className="space-y-5 text-lg leading-relaxed text-slate-900 sm:text-xl">
              {TESTIMONIAL_PARAGRAPHS.map((paragraph) => (
                <p key={paragraph} className="text-slate-900">
                  {paragraph}
                </p>
              ))}
            </blockquote>
            <figcaption className="mt-8 border-t border-slate-200 pt-5">
              <p className="font-semibold text-slate-950">
                Lauren MacKinnon
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Marketing Manager, PARC Retirement Living
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="border-t border-black bg-black text-white">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase !text-sky-200">
                Work
              </p>
              <h2 className="mt-3 text-4xl font-semibold text-white">
                Recent case studies
              </h2>
              <p className="mt-4 text-lg leading-relaxed !text-slate-100">
                A few examples of website work involving launches, rebuilds, and
                scalable content systems.
              </p>
            </div>
            <Link
              to="/work#case-studies"
              className="text-sm font-semibold uppercase text-sky-300 hover:text-white"
            >
              View all work
            </Link>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {featuredCaseStudies.map((caseStudy) => (
              <article
                key={caseStudy.slug}
                className="group border border-white/15 bg-white/5 p-6 transition-colors duration-300 hover:border-white/40 hover:bg-white/10"
              >
                <p className="text-sm font-semibold uppercase !text-sky-200">
                  Case Study
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white">
                  {caseStudy.name}
                </h3>
                <p className="mt-4 text-base leading-relaxed !text-slate-100">
                  {caseStudy.hoverSummary ?? caseStudy.llmSummary}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              to="/work#case-studies"
              className="inline-flex border border-sky-300 px-6 py-3 text-sm font-semibold uppercase text-sky-300 hover:bg-sky-300 hover:text-slate-950"
            >
              View Case Studies
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase text-sky-700">
              Prefer Face to Face?
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-slate-950">
              I am based in Victoria, British Columbia, and happy to meet in person when the work calls for it.
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-700">
              I work with businesses globally, but I am happy to travel within
              Vancouver Island and the Lower Mainland to help clients with their
              website and digital needs. I take real pride in helping local
              businesses grow their online presence with practical, reliable web
              work.
            </p>
          </div>
        </div>
      </section>      

      <section className="border-t border-slate-200 bg-stone-100">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
          <div className="mx-auto max-w-4xl border border-slate-200 bg-white px-6 py-10 text-center sm:px-10">
            <p className="text-sm font-semibold uppercase text-sky-700">
              Next Step
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-slate-950">
              Need a website build, rebuild, or technical SEO cleanup?
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-slate-700">
              Tell me what is broken, what is missing, or what the business
              needs to accomplish. I can help with the build itself, the SEO
              work around it, or both.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex border border-slate-950 bg-slate-950 px-5 py-3 text-sm font-semibold uppercase text-white hover:bg-white hover:text-slate-950"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
