import headshotImg from '../assets/images/headshot.jpg'
import { clients } from '../assets/images/clients'
import { languages } from '../assets/images/languages'
import Slider from "react-slick";

export default function Home() {

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]    
  };

  return (
    <section className="flex flex-col gap-6 container section text-center">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Welcome to my work portfolio
      </h1>
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
        <p className="text-left text-lg lg:text-2xl leading-[2.5]">
          I am a Canadian web developer from British Columbia, with years of experience building websites for clients of all sizes.
          I specialize in bringing your vision to life, with a focus on the frontend user experience, to drive more traffic to your website and generate leads.
        </p>
        <img src={headshotImg} alt="Headshot of Will Aesoph" className="rounded-full w-1/3 h-auto" />
      </div>


    <div>
      <h2 className="text-2xl lg:text-4xl font-semibold mb-8 lg:mb-12">Brands I've Worked With</h2>
      <Slider {...settings}>
        {clients.map((client) => (
          <div key={client.name} className="relative bg-slate-400 group h-50">
            <div className="flex flex-col items-center justify-center w-full h-full">
              <img src={client.logo} alt={`${client.name} logo`} className="max-w-1/2 max-h-1/2" />
              <h3>{client.name}</h3>
            </div>
            <div className="absolute left-0 -top-full group-hover:top-0 h-1/2 duration-300 w-full bg-black/70 p-6 text-left ">
              <h4>Work Done:</h4>
              <ul className="opacity-0 group-hover:opacity-100 !duration-400 group-hover:delay-400">
                {client.work.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="p-6 absolute left-0 -bottom-full group-hover:bottom-0 h-1/2 duration-300 w-full bg-black/70 flex justify-between">
              {client.url ? (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={client.url}
                  className="h-auto flex justify-center items-center rounded-2xl py-4 px-8 bg-amber-50 text-black opacity-0 group-hover:opacity-100 !duration-400 group-hover:delay-400"
                >
                  Visit {client.name}
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </Slider>      
    </div>

    <div>
      <h2 className="text-2xl lg:text-4xl font-semibold mb-8 lg:mb-12">My Skills</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
        {languages.map((language) => (
          <div key={language.name} className="flex flex-col items-center gap-3">
            <img src={language.logo} alt={`${language.name} logo`} className="h-16 w-auto" />
            <span className="text-sm">{language.name}</span>
          </div>
        ))}
      </div>
    </div>

    </section>
  )
}
