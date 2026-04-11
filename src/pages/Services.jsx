import { useId, useState } from "react";
import { Link } from 'react-router-dom'
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
          <div className="text-base text-slate-700 mb-4 px-7">{children}</div>
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
          <h2>Custom Website</h2>
          <div className="flex flex-col lg:flex-row mt-10 gap-8">
            <ul className="w-full lg:w-2/5">
              <ServiceAccordionItem title="A-Z Services">
                <p>
                  No matter your level of technical expertise, I can help every step of the way to bring your website to life!
                </p>
              </ServiceAccordionItem>            
              <ServiceAccordionItem title="Free Fixed Cost Estimate">
                <ul className="list-disc pl-6 space-y-2">
                  <li><Link to="/contact"  >Book a discovery call</Link> to discuss your vision</li>
                  <li>We will define a project scope and sitemap</li>
                  <li>An accurate and detailed fixed cost estimate will be provided at no charge</li>
                </ul>
              </ServiceAccordionItem>
              <ServiceAccordionItem title="Design">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Tailored to your branding</li>
                  <li>Built with user experience and accessibility in mind</li>
                  <li>Mobile first approach</li>
                  <li>Developer friendly</li>
                  <li>Built using <strong>Figma</strong></li>
                </ul>
              </ServiceAccordionItem>
              <ServiceAccordionItem title="Custom Frontend">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Unconstrained by prebuilt templates or themes, present your brand how <strong>you</strong> want people to see it</li>
                  <li>Hand coded from the ground up</li>
                  <li>See your design translated and fully functional</li>
                </ul>
              </ServiceAccordionItem>
              <ServiceAccordionItem title="Control Your Own Content">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Integrated with a Content Management System</li>
                  <li>Update content yourself with a custom page builder</li>
                  <li><strong>WordPress, Statamic,</strong> or <strong>Craft CMS</strong></li>
                </ul>
              </ServiceAccordionItem>
              <ServiceAccordionItem title="Managed Hosting">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Hands off and hassle free</li>
                  <li>Tailored to your specific web traffic needs</li>
                  <li>Plugin, security, and CMS updates all provided within the hosting budget</li>
                </ul>
              </ServiceAccordionItem>                             
            </ul>
            <div className="w-full lg:w-3/5">
              <ServicesSlider images={customWebsite} />
            </div>
          </div>
        </div>
        <div>
          <h2>AI Powered Chatbot</h2>
          <div className="flex flex-col lg:flex-row mt-10 gap-8">
            <ul className="w-full lg:w-2/5">
              <ServiceAccordionItem title="A-Z Services">
                <p>
                  From inception to launch, I can take care of every step of the process to bringing your website to life.
                  All you need to bring is the ideas!
                </p>
              </ServiceAccordionItem>            
              <ServiceAccordionItem title="Free Fixed Cost Estimate">
                <ul className="list-disc pl-6 space-y-2">
                  <li><Link to="/contact"  >Book a discovery call</Link> to discuss your vision</li>
                  <li>We will define a project scope and sitemap</li>
                  <li>An accurate and detailed fixed cost estimate will be provided at no charge</li>
                </ul>
              </ServiceAccordionItem>
              <ServiceAccordionItem title="Design">


              </ServiceAccordionItem>
              <ServiceAccordionItem title="Custom Frontend">
                <p>Hand coded from the ground up</p>


              </ServiceAccordionItem>
              <ServiceAccordionItem title="Control Your Own Content">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Integrated with a Content Management System (CMS)</li>
                  <li>Update content with a custom page builder</li>
                  <li><strong>WordPress, Statamic, or Craft CMS</strong></li>
                </ul>
              </ServiceAccordionItem>
              <ServiceAccordionItem title="Managed Hosting">
                <p>We will book a discovery call and then I will give an accurate fixed cost estimate</p>
              </ServiceAccordionItem>                             
            </ul>
            <div className="w-full lg:w-3/5">
              <ServicesSlider images={customWebsite} />
            </div>
          </div>
        </div>                  
      </div>          

    </section>
  )
}
