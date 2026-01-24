import { useId, useState } from "react";
import ServicesSlider from "../components/servicesSlider";
import Chevron from '../assets/icons/chevron-right.svg?react'
import { customWebsite } from "../assets/images/services/customWebsite";

function ServiceAccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <li className="space-y-2">
      <button
        type="button"
        className="w-full text-left font-medium flex items-center space-x-2 cursor-pointer group"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span
          className={`inline-block transition-transform duration-300 group-hover:translate-x-1 ${open ? "rotate-90" : ""}`}
        >
          <Chevron />
        </span>        
        <span className="text-lg font-semibold">{title}</span>
      </button>
      <div
        id={contentId}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="text-base text-slate-700 mb-4 px-8">{children}</p>
        </div>
      </div>
    </li>
  );
}

export default function Services() {
  return (
    <section className="container section">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl mb-12">
        Services
      </h1>
      <div className="flex flex-col space-y-8 lg:space-y-12">
        <div>
          <h2>Fully Custom Website</h2>
          <div className="flex flex-col lg:flex-row mt-10 gap-8">
            <ul className="w-full lg:w-2/5">
              <ServiceAccordionItem title="A-Z Services">
                From inception to launch, I can take care of every step of the process to bringing your website to life.
                All you need to bring is the ideas!
              </ServiceAccordionItem>            
              <ServiceAccordionItem title="Free Fixed Cost Estimate">
                We will book a discovery call and discuss your vision. 
              </ServiceAccordionItem>
              <ServiceAccordionItem title="Design">
                I will provide you a mobile-first design, tailored to the experience of modern internet users.
                Depending on your preference, I am also happy to collaborate with a web designer of your choosing.
              </ServiceAccordionItem>
              <ServiceAccordionItem title="Custom Frontend">
                We will book a discovery call and then I will give an accurate fixed cost estimate
              </ServiceAccordionItem>
              <ServiceAccordionItem title="Control Your Own Content">
                My goal is to build you a website which ultimately you are in control of. All of the websites I build are integrated with a
                Content Management System (CMS), and come with a fully custom page builder so that you are able to update the content of your site
                without needing a developer. I specialize in websites built with <strong>WordPress, Statamic, or Craft CMS.</strong>
              </ServiceAccordionItem>
              <ServiceAccordionItem title="Managed Hosting">
                We will book a discovery call and then I will give an accurate fixed cost estimate
              </ServiceAccordionItem>                             
            </ul>
            <div className="w-full lg:w-3/5">
              <ServicesSlider images={customWebsite} />
            </div>
          </div>
        </div>
        <div>
          <h2>Fully Custom Website</h2>
          <div className="flex flex-col lg:flex-row mt-10">
            <ul className="w-full lg:w-1/2">
              <ServiceAccordionItem title="Fixed Cost Estimate">
                We will book a discovery call and then I will give an accurate fixed cost estimate
              </ServiceAccordionItem>
            </ul>
            <div className="w-full lg:w-1/2">
              <ServicesSlider images={customWebsite} />
            </div>
          </div>
        </div>                   
      </div>          

    </section>
  )
}
