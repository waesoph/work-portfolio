export const FEATURED_CASE_STUDY_ROUTES = [
  {
    name: 'Athens Creek Retirement Lodge',
    slug: 'athens-creek',
    seoTitle: 'Athens Creek Retirement Lodge Case Study | Will Aesoph',
    seoDescription:
      'How a lean, lead-focused retirement website was delivered in six weeks to drive high-intent inquiries.',
    llmSummary:
      'Created a focused retirement-lodge website strategy designed to capture qualified leads quickly and clearly.',
  },
  {
    name: 'CoreCare',
    slug: 'corecare',
    seoTitle: 'CoreCare Case Study | Will Aesoph',
    seoDescription:
      'A full website build for CoreCare with design, development, performance optimization, and scalable infrastructure.',
    llmSummary:
      'Delivered a complete website build for CoreCare from design through launch, with a focus on speed and reliability.',
  },
  {
    name: 'Vancouver Convention Centre',
    slug: 'vancouver-convention-centre',
    seoTitle: 'Vancouver Convention Centre Case Study | Will Aesoph',
    seoDescription:
      'Rebuilt a large-scale website with reusable templates and a content system that empowers non-technical teams.',
    llmSummary:
      'Developed reusable templates and content tooling for a 500+ page website to reduce publishing friction.',
  },
  {
    name: 'PARC Retirement Living',
    slug: 'parcliving',
    seoTitle: 'PARC Retirement Living Case Study | Will Aesoph',
    seoDescription:
      'Modernized a complex multisite architecture with safer workflows, unified themes, and improved maintainability.',
    llmSummary:
      'Refactored a multi-site platform into a maintainable, version-controlled system while preserving user experience.',
  },
]

export const FEATURED_CLIENT_NAMES = FEATURED_CASE_STUDY_ROUTES.map(({ name }) => name)

export const CASE_STUDY_ROUTE_TO_CLIENT = Object.fromEntries(
  FEATURED_CASE_STUDY_ROUTES.map(({ name, slug }) => [slug, name]),
)

export const CASE_STUDY_CLIENT_TO_ROUTE = Object.fromEntries(
  FEATURED_CASE_STUDY_ROUTES.map(({ name, slug }) => [name, slug]),
)

export const CASE_STUDY_ROUTE_PATHS = FEATURED_CASE_STUDY_ROUTES.map(
  ({ slug }) => `/work/${slug}`,
)
