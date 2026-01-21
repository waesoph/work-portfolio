import headshotImg from '../assets/images/headshot.jpg'
import { languages } from '../assets/images/languages'
import ClientSlider from '../components/clientSlider';
import Slider from "react-slick";

export default function Home() {

  return (
    <section className="flex flex-col gap-6 container section text-center">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Will Aesoph - Web Developer
      </h1>
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
        <p className="text-left text-lg lg:text-2xl leading-[2.5]">
          I am a Canadian web developer from British Columbia, with years of experience building websites for clients of all sizes.
          I specialize in bringing your vision to life, with a focus on the frontend user experience, to drive more traffic to your website and generate leads.
        </p>
        <img src={headshotImg} alt="Headshot of Will Aesoph" className="rounded-full w-1/3 h-auto" />
      </div>

    <div className="section">
      <h2 className="text-2xl lg:text-4xl font-semibold mb-8 lg:mb-12">Brands I've Worked With</h2>
      <ClientSlider />     
    </div>

    <div className="section">
      <h2 className="text-2xl lg:text-4xl font-semibold mb-8 lg:mb-12">My Skills</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
        {languages.map((language) => (
          <div key={language.name} className="flex flex-col items-center gap-3">
            <img src={language.logo} alt={`${language.name} logo`} className="h-16 w-auto" />
            <span className="text-sm font-semibold">{language.name}</span>
          </div>
        ))}
      </div>
    </div>

    </section>
  )
}
