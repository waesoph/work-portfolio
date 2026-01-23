import headshotImg from '../assets/images/headshot.jpg'
import bannerImg from '../assets/images/banner.webp'
import { languages } from '../assets/images/languages'
import ClientSlider from '../components/clientSlider';
import { Link } from 'react-router-dom'
import Slider from "react-slick";

export default function Home() {

  return (
    <div>
      <section className="flex flex-col gap-6 w-full py-12 lg:py-25 text-center relative bg-center" style={{ backgroundImage: `url(${bannerImg})` }}>
        <div class="absolute bg-black/70 inset-0 w-full h-full z-0"></div>
        <div class="flex flex-col z-2">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-8xl text-white">
            Will Aesoph
          </h1>
          <p className="text-4xl font-semibold tracking-tight sm:text-8xl text-white">Professional Web Developer</p>
          <Link className="text-semibold text-xl sm:text-2xl border border-white rounded-2xl w-fit py-4 px-8 mx-auto mt-10" to="/contact" >Contact</Link>
        </div>
      </section>

      <section className="container section">
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          <div class="flex flex-col ">
            <p className="text-left text-lg lg:text-2xl leading-[2.5]">
              I am a Canadian web developer from British Columbia, with years of experience building websites for clients of all sizes.
              I specialize in bringing your vision to life, with a focus on the frontend user experience, to drive more traffic to your website and generate leads.
            </p>
            <Link to="/services" className="text-semibold text-xl sm:text-2xl border border-white rounded-2xl w-fit py-4 px-8 mt-10">Services</Link>
          </div>
          <img src={headshotImg} alt="Headshot of Will Aesoph" className="rounded-full w-1/3 h-auto" />
        </div>
      </section>
      

      <section>
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
    </div>
  )
}
