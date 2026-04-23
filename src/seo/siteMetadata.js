import { FEATURED_CASE_STUDY_ROUTES } from '../data/caseStudies.js'

export const SITE_NAME = 'Will Aesoph'
export const SITE_URL = 'https://aesoph.ca'
export const SITE_LOCALE = 'en_CA'
export const SITE_LANGUAGE = 'en-CA'
export const DEFAULT_OG_IMAGE_PATH = '/headshot.jpg'
export const CONTACT_EMAIL = 'willaesoph@gmail.com'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/will-aesoph'
export const GITHUB_URL = 'https://github.com/waesoph'

export const SITE_SUMMARY =
  'Will Aesoph is a Canadian web developer helping businesses with custom websites, technical SEO, and digital growth.'

export const PRIMARY_SERVICES = [
  'Custom website design and development',
  'Website rebuilds and migration projects',
  'On-page technical SEO improvements',
  'Performance optimization and accessibility',
  'Analytics, lead generation, and web strategy',
]

const DEFAULT_KEYWORDS = [
  'Will Aesoph',
  'web developer',
  'freelance web developer',
  'Canadian web developer',
  'British Columbia web developer',
  'website development',
  'technical SEO',
  'portfolio',
  'case studies',
]

const ROUTE_METADATA = {
  '/': {
    title: 'Will Aesoph | Web Developer in British Columbia',
    description:
      'Custom websites, web strategy, and technical SEO from Will Aesoph. View recent work and connect for new projects.',
    keywords: DEFAULT_KEYWORDS,
    canonicalPath: '/',
    ogType: 'website',
    schemaType: 'AboutPage',
    breadcrumb: [{ name: 'About', path: '/' }],
  },
  '/about': {
    title: 'Will Aesoph | Web Developer in British Columbia',
    description:
      'Custom websites, web strategy, and technical SEO from Will Aesoph. View recent work and connect for new projects.',
    keywords: DEFAULT_KEYWORDS,
    canonicalPath: '/',
    ogType: 'website',
    schemaType: 'AboutPage',
    breadcrumb: [{ name: 'About', path: '/' }],
  },
  '/work': {
    title: 'Portfolio & Case Studies | Will Aesoph',
    description:
      'Explore web development projects and case studies spanning website rebuilds, lead generation, and scalable content systems.',
    keywords: [...DEFAULT_KEYWORDS, 'web development portfolio', 'case study'],
    canonicalPath: '/work',
    ogType: 'website',
    schemaType: 'CollectionPage',
    breadcrumb: [
      { name: 'About', path: '/' },
      { name: 'Work', path: '/work' },
    ],
  },
  '/services': {
    title: 'Portfolio & Case Studies | Will Aesoph',
    description:
      'Explore web development projects and case studies spanning website rebuilds, lead generation, and scalable content systems.',
    keywords: [...DEFAULT_KEYWORDS, 'web development portfolio', 'case study'],
    canonicalPath: '/work',
    ogType: 'website',
    schemaType: 'CollectionPage',
    breadcrumb: [
      { name: 'About', path: '/' },
      { name: 'Work', path: '/work' },
    ],
  },
  '/contact': {
    title: 'Contact Will Aesoph | Web Development & SEO',
    description:
      'Start a project with Will Aesoph. Reach out for website development, technical SEO, and digital growth support.',
    keywords: [...DEFAULT_KEYWORDS, 'contact web developer', 'hire web developer'],
    canonicalPath: '/contact',
    ogType: 'website',
    schemaType: 'ContactPage',
    breadcrumb: [
      { name: 'About', path: '/' },
      { name: 'Contact', path: '/contact' },
    ],
  },
}

const CASE_STUDY_ROUTE_METADATA = Object.fromEntries(
  FEATURED_CASE_STUDY_ROUTES.map((caseStudy) => [
    `/work/${caseStudy.slug}`,
    {
      title: caseStudy.seoTitle,
      description: caseStudy.seoDescription,
      keywords: [
        ...DEFAULT_KEYWORDS,
        'web development case study',
        caseStudy.name,
      ],
      canonicalPath: `/work/${caseStudy.slug}`,
      ogType: 'article',
      schemaType: 'Article',
      breadcrumb: [
        { name: 'About', path: '/' },
        { name: 'Work', path: '/work' },
        { name: caseStudy.name, path: `/work/${caseStudy.slug}` },
      ],
      caseStudyName: caseStudy.name,
      llmSummary: caseStudy.llmSummary,
    },
  ]),
)

const NOT_FOUND_METADATA = {
  title: 'Page Not Found | Will Aesoph',
  description: 'The requested page could not be found.',
  keywords: DEFAULT_KEYWORDS,
  canonicalPath: null,
  ogType: 'website',
  schemaType: 'WebPage',
  noIndex: true,
  breadcrumb: [{ name: 'About', path: '/' }],
}

export const INDEXABLE_PAGES = [
  {
    path: '/',
    changefreq: 'weekly',
    priority: '1.0',
    description: ROUTE_METADATA['/'].description,
  },
  {
    path: '/work',
    changefreq: 'weekly',
    priority: '0.9',
    description: ROUTE_METADATA['/work'].description,
  },
  {
    path: '/contact',
    changefreq: 'monthly',
    priority: '0.8',
    description: ROUTE_METADATA['/contact'].description,
  },
  ...FEATURED_CASE_STUDY_ROUTES.map((caseStudy) => ({
    path: `/work/${caseStudy.slug}`,
    changefreq: 'monthly',
    priority: '0.7',
    description: caseStudy.seoDescription,
  })),
]

export const CASE_STUDY_LLM_ENTRIES = FEATURED_CASE_STUDY_ROUTES.map((caseStudy) => ({
  name: caseStudy.name,
  path: `/work/${caseStudy.slug}`,
  summary: caseStudy.llmSummary,
}))

export function normalizePath(pathname) {
  const rawPath = String(pathname || '/')

  if (!rawPath.startsWith('/')) {
    return `/${rawPath}`
  }

  return rawPath !== '/' ? rawPath.replace(/\/+$/, '') : rawPath
}

export function getCanonicalUrl(pathname) {
  const normalizedPath = normalizePath(pathname)
  return normalizedPath === '/' ? `${SITE_URL}/` : `${SITE_URL}${normalizedPath}`
}

export function getRouteMetadata(pathname) {
  const normalizedPath = normalizePath(pathname)

  if (ROUTE_METADATA[normalizedPath]) {
    return ROUTE_METADATA[normalizedPath]
  }

  if (CASE_STUDY_ROUTE_METADATA[normalizedPath]) {
    return CASE_STUDY_ROUTE_METADATA[normalizedPath]
  }

  return NOT_FOUND_METADATA
}
