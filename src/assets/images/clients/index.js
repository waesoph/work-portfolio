import avigilonLogo from './avigilon-logo.png';
import avigilonScreenshot from './avigilon-screenshot.jpg';
import bcPlaceLogo from './bc-place-logo.png';
import bcPlaceScreenshot from './bcplace-screenshot.jpg';
import chandosLogo from './chandos-logo.png';
import chandosScreenshot from './chandos-screenshot.jpg';
import exploreEdmontonLogo from './explore-edmonton-logo.png';
import eeScreenshot from './ee-screenshot.jpg';
import nestleLogo from './nestle-logo.png';
import athensLogo from './athens-creek-logo.png';
import athensTopScreenshot from './athens-creek-top.jpg';
import athensBottomScreenshot from './athens-creek-bottom.jpg';
import athensThirdScreenshot from './athens-creek-3.jpg';
import dghLogo from './dgh-logo.png';
import dghScreenshot from './dgh-screenshot.jpg';
import duaneMurrinLogo from './duane-murrin-logo.webp';
import duaneMurrinScreenshot from './duane-murrin-screenshot.jpg';
import funtimesLogo from './funtimes-logo.svg';
import funtimesScreenshot from './funtimes-screenshot.jpg';
import mwnScreenshot from './mwn-screenshot.jpg';
import outpostLogo from './outpost-logo.svg';
import outpostScreenshot from './outpost-screenshot.jpg';
import parcLogo from './parc-logo.jpeg';
import parcCaseStudy1 from './parc-1.jpg';
import parcCaseStudy2 from './parc-2.png';
import parcCaseStudy3 from './parc-3.jpg';
import pelcoLogo from './pelco-logo.png';
import pelcoScreenshot from './pelco-screenshot.jpg';
import susanBilbeyLogo from './susan-bilbey-logo.svg';
import susanBilbeyScreenshot from './susan-bilbey-screenshot.jpg';
import vccLogo from './vcc-logo.jpg';
import vccCaseStudy1 from './vcc-1.jpg';
import vccCaseStudy2 from './vcc-2.jpg';
import vccCaseStudy3 from './vcc-3.jpg';
import corecareLogo from './corecare-logo.png';
import corecareScreenshot from './corecare-screenshot.jpg';
import rmhbcLogo from './rmhbc-logo.png';
import rmhbcScreenshot from './rmhbc-screenshot.jpg';


export const clients = [
  {
    name: 'PARC Retirement Living',
    logo: parcLogo,
    screenshot: parcCaseStudy1,
    url: 'https://parcliving.ca',
    work: ['website-rewrite', 'landing-pages', 'chatbot', 'backend', 'hosting', 'accessibility', 'site-optimization'],
    caseStudy: {
      phrase: 'Streamlined',
      copy: [],
      sections: [
        {
          heading: 'Streamlined',
          image: parcCaseStudy1,
          copy: [
            'Don’t fix what isn’t broken. But also make sure it won’t break.',
            'PARC Retirement Living’s website was doing its job well. It looked good, worked well, and consistently brought in new leads. From the outside, there was no obvious reason to change it.',
            'The real issue was the systems underneath. PARC’s web presence was built as a multisite, with one base website and eight residence sites. Each of the nine sites was running its own separate code and theme. Therefore, any change that affected the full network had to be repeated nine times, which made updates slow, expensive, and easy to mess up.',
            'On top of that, there was no version control or proper deployment workflow. Changes were being made by directly editing files on the server, which can be dangerous and easily lead to mistakes.',
            'Nothing felt broken to the user, but behind the scenes the setup was difficult to maintain and getting more expensive.',
          ],
        },
        {
          heading: 'Rewritten, Not Rebuilt',
          image: parcCaseStudy2,
          copy: [
            'The answer was not to start over. It was to rebuild the same experience in a smarter way.',
            'I recreated the multisite so that to a repeat visitor, almost nothing would feel different. Behind the scenes, everything was improved.',
            'An upgraded server made it faster.',
            'Implementing version control gave us a recorded history of changes.',
            'A proper deployment process reduced mistakes.',
            'Modern coding languages ensure the website will have a long life.',
            'Most importantly, the nine themes were consolidated into one cohesive WordPress theme. This improved consistency, and vastly reduced the cost and effort required to make changes in the future.',
          ],
        },
        {
          heading: 'The Cherry on Top',
          image: parcCaseStudy3,
          copy: [
            'The updated website wasn’t exactly the same, it came with one major upgrade — an AI powered chatbot capable of answering visitors’ most frequently asked questions. The chatbot bases its answers on a bank of questions which PARC is able to update as they see fit. It is able to calculate whether the question being asked is close to an answer it has, and provide correct information every time. If it doesn’t have the answer, it helpfully directs the user to PARC’s contact page.',
            'More recently, I have developed a full dashboard of analytics for PARC to use. It helps them in knowing what people are asking about, how often, and how often it’s being successfully answered by the chatbot. This provides useful data for them to inform future marketing campaigns and changes to their digital materials.',
          ],
        },
      ],
      images: [
        { id: 'parc-1', at: 0, src: parcCaseStudy1 },
        { id: 'parc-2', at: 0.34, src: parcCaseStudy2 },
        { id: 'parc-3', at: 0.67, src: parcCaseStudy3 },
      ],
    },
  },
  {
    name: 'Vancouver Convention Centre',
    logo: vccLogo,
    screenshot: vccCaseStudy1,
    url: 'https://vancouverconventioncentre.com',
    work: ['landing-pages', 'backend', 'website-rewrite', 'accessibility', 'site-optimization', 'page-builder'],
    caseStudy: {
      phrase: 'Control Your Content',
      copy: [],
      inlineLinks: [
        {
          text: 'events calendar',
          url: 'https://www.vancouverconventioncentre.com/events',
        },
        {
          text: 'LOT185 cafe',
          url: 'https://www.vancouverconventioncentre.com/lot-185',
        },
      ],
      sections: [
        {
          heading: 'Control Your Content',
          image: vccCaseStudy1,
          copy: [
            'Ever wonder how a team manages a website with over 500 pages of content?',
            'For the rebuild of the Vancouver Convention Centre\'s website, I audited the design and developed a library of reusable templates. Using this library I brought the design to life by manually coding it from the ground up.',
          ],
        },
        {
          heading: '90% Rules, 10% Exceptions',
          image: vccCaseStudy2,
          copy: [
            'My approach was to create one cohesive page builder that is able to manage 90% of the website\'s content, and create custom solutions in the few places that are more bespoke.',
            'The result was a dashboard in Statamic CMS which contains 2 layouts and 10 page templates. A comprehensive page builder, which is compatible with every template, houses 12 singletons and 36 components to be used across 90% of the 500+ pages on the website.',
            'In a few places, such as the events calendar and the LOT185 cafe, a more tailored approach was required — the exceptions to the rule. Individual templates were created in these cases to meet the complex design requirements. However, Vancouver Convention Centre is still in full control of every piece of content that appears.',
          ],
        },
        {
          heading: 'Empowering The Client',
          image: vccCaseStudy3,
          copy: [
            'No more developer budget wasted on content changes.',
            'No more time wasted waiting for tasks to be completed.',
            'My philosophy is to provide my clients with a powerful and comprehensive tool to manage their website’s content. This saves tens of thousands of dollars in the long run, and provides them with a sense of ownership over their business.',
          ],
        },
      ],
    },
  },
  {
    name: 'CoreCare',
    logo: corecareLogo,
    screenshot: corecareScreenshot,
    url: 'https://corecare.ai',
    work: ['full-website', 'design', 'page-builder', 'backend', 'hosting', 'site-optimization'],
    caseStudy: {
      phrase: 'A - Z',
      copy: ['Case study under construction.'],
      images: [{ id: 'hero', at: 0, src: corecareScreenshot }],
    },
  },  
  {
    name: 'Explore Edmonton',
    logo: exploreEdmontonLogo,
    screenshot: eeScreenshot,
    url: 'https://exploreedmonton.com',
    work: ['landing-pages', 'accessibility', 'page-builder'],
  },
  {
    name: 'BC Place',
    logo: bcPlaceLogo,
    screenshot: bcPlaceScreenshot,
    url: 'https://bcplace.com',
    work: ['landing-pages'],
  },
  {
    name: 'Nestlé Canada',
    logo: nestleLogo,
    screenshot: mwnScreenshot,
    url: 'https://madewithnestle.ca',
    work: ['landing-pages', 'backend'],
  },
  {
    name: 'Athens Creek Retirement Lodge',
    logo: athensLogo,
    screenshot: athensTopScreenshot,
    url: 'https://athenscreek.ca/',
    work: ['full-website', 'design', 'leads', 'page-builder', 'hosting', 'backend'],
    caseStudy: {
      phrase: 'Simple Leads',
      copy: [],
      sections: [
        {
          heading: 'Simple Leads',
          image: athensTopScreenshot,
          copy: [
            'A simple solution which has led to hundreds of inquiries from potential leads since launch.',
            'Athens Creek Retirement Lodge came to us with a clear objective, to create a dedicated website for their business. Since 2020, finding information about Athens Creek was only possible through an online directory. However, the project needed to be completed on a limited budget, a short timeline, and with no design direction. The goal was to create the simplest possible website while still making it an effective source of inquiries.',
          ],
        },
        {
          heading: 'Focused Approach',
          image: athensBottomScreenshot,
          copy: [
            'The strategy was intentionally straightforward.',
            '1. Capture web traffic with copy and a structure that will perform well on search engines.',
            '2. Place a single contact form at the bottom of every page, supported by calls to action that guide users directly to it.',
            '3. Watch the leads roll in.',
            'The approach was designed to reduce friction and make it as easy as possible for prospective residents and their families to get in touch.',
          ],
        },
        {
          heading: 'Lean By Design',
          image: athensThirdScreenshot,
          copy: 'With no design system and no budget for custom creative, the project focused on clarity, structure, and usability. The client provided the written copy, and the work centered on shaping that content into a clean, functional website that delivered essential information without unnecessary complexity. Five pages to prioritize essential information only. From the initial discovery call to website launch, the project was completed in six weeks.',
        },
      ],
    },
  },
  {
    name: 'Avigilon',
    logo: avigilonLogo,
    screenshot: avigilonScreenshot,
    url: 'https://avigilon.com',
    work: ['frontend'],
  },
  {
    name: 'Pelco',
    logo: pelcoLogo,
    screenshot: pelcoScreenshot,
    url: 'https://pelco.com',
    work: ['frontend'],
  },
    {
    name: 'Susan Bilbey Design',
    logo: susanBilbeyLogo,
    screenshot: susanBilbeyScreenshot,
    url: 'https://www.susanbilbeydesign.com/',
    work: ['full-website', 'page-builder'],
  }, 
    {
    name: 'Chandos Construction',
    logo: chandosLogo,
    screenshot: chandosScreenshot,
    url: 'https://www.chandos.com/',
    work: ['frontend'],
  }, 
    {
    name: "Don't Go Hungry",
    logo: dghLogo,
    screenshot: dghScreenshot,
    url: 'https://dontgohungry.ca/',
    work: ['site-optimization', 'page-builder', 'design', 'backend'],
  }, 
  {
    name: 'Fun Times',
    logo: funtimesLogo,
    screenshot: funtimesScreenshot,
    url: 'https://getfuntimes.com/',
    work: ['frontend'],
  },
  {
    name: 'Outpost Travel Rental',
    logo: outpostLogo,
    screenshot: outpostScreenshot,
    url: 'https://outposttravelrental.com/',
    work: ['backend', 'leads'],
  },
  {
    name: 'Ronald McDonald House BC & Yukon',
    logo: rmhbcLogo,
    screenshot: rmhbcScreenshot,
    url: 'https://ronaldmcdonaldhousebcy.ca/',
    work: ['frontend'],
  },
  {
    name: 'Duane Murrin',
    logo: duaneMurrinLogo,
    screenshot: duaneMurrinScreenshot,
    url: 'https://www.duanemurrin.com/',
    work: ['frontend'],
  }        
];
