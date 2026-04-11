import { Link } from 'react-router-dom'

export default function Home() {

  return (
    <div>

      <section className="container section">
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          <div className="flex flex-col ">
            <p className="text-center text-lg lg:text-2xl leading-[2.5]">
              I am a Canadian web developer from British Columbia, with years of experience building websites for clients of all sizes.
              I specialize in bringing your vision to life, with a focus on the frontend user experience, to drive more traffic to your website and generate leads.
            </p>
            <Link
              to="/work"
              className="text-semibold text-xl sm:text-2xl border border-slate-900 rounded-2xl w-fit py-4 px-8 mt-10 mx-auto text-slate-900 hover:bg-slate-100"
            >
              Work
            </Link>
          </div>
        </div>
      </section> 
    </div>
  )
}
