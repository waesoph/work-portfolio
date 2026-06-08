import { FEATURED_CASE_STUDY_ROUTES } from '../data/caseStudies.js'

export const SITE_NAME = 'Will Aesoph'
export const SITE_URL = 'https://aesoph.ca'
export const SITE_LOCALE = 'en_CA'
export const SITE_LANGUAGE = 'en-CA'
export const DEFAULT_OG_IMAGE_PATH = '/og-cover.jpg'
export const CONTACT_EMAIL = 'willaesoph@gmail.com'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/will-aesoph'
export const GITHUB_URL = 'https://github.com/waesoph'
export const SERVICE_AREAS = [
  { type: 'City', name: 'Victoria' },
  { type: 'AdministrativeArea', name: 'British Columbia' },
  { type: 'Country', name: 'Canada' },
]

export const SITE_SUMMARY =
  'Will Aesoph is a freelance web developer who helps businesses build custom websites, improve technical SEO, and create stronger lead-focused web systems.'

export const PRIMARY_SERVICES = [
  'Custom website design and development',
  'Website rebuilds and migration projects',
  'Technical SEO audits and on-page improvements',
  'Performance optimization and accessibility',
  'Analytics, lead generation, and web strategy',
]

const DEFAULT_KEYWORDS = [
  'Will Aesoph',
  'freelance web developer',
  'custom website developer',
  'custom websites',
  'technical SEO',
  'website rebuild',
  'web development portfolio',
  'remote web developer',
  'web developer victoria bc',
  'Victoria BC web developer',
  'freelance web developer victoria',
  'British Columbia web developer',
]

const ROUTE_METADATA = {
  '/': {
    title: 'Custom Websites and Technical SEO | Will Aesoph',
    description:
      'Freelance web developer building custom websites, improving technical SEO, and creating lead-focused web systems for businesses locally and remotely.',
    keywords: [...DEFAULT_KEYWORDS, 'technical seo consultant', 'hire web developer'],
    canonicalPath: '/',
    ogType: 'website',
    schemaType: 'WebPage',
    breadcrumb: [{ name: 'Home', path: '/' }],
  },
  '/about': {
    title: 'About Will Aesoph | Freelance Web Developer',
    description:
      'Learn about Will Aesoph, a freelance web developer focused on custom websites, technical SEO, and practical digital strategy for growing teams.',
    keywords: [...DEFAULT_KEYWORDS, 'about will aesoph', 'freelance website developer'],
    canonicalPath: '/about',
    ogType: 'website',
    schemaType: 'AboutPage',
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
    ],
  },
  '/work': {
    title: 'Web Development Portfolio | Will Aesoph',
    description:
      'Explore custom website builds, rebuilds, technical SEO work, and scalable content systems from Will Aesoph.',
    keywords: [...DEFAULT_KEYWORDS, 'case study', 'website case studies'],
    canonicalPath: '/work',
    ogType: 'website',
    schemaType: 'CollectionPage',
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Work', path: '/work' },
    ],
  },
  '/services': {
    title: 'Web Development Portfolio | Will Aesoph',
    description:
      'Explore custom website builds, rebuilds, technical SEO work, and scalable content systems from Will Aesoph.',
    keywords: [...DEFAULT_KEYWORDS, 'case study', 'website case studies'],
    canonicalPath: '/work',
    ogType: 'website',
    schemaType: 'CollectionPage',
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Work', path: '/work' },
    ],
  },
  '/contact': {
    title: 'Contact Will Aesoph | Custom Websites and Technical SEO',
    description:
      'Contact Will Aesoph for custom website development, technical SEO, performance improvements, and lead-focused digital strategy.',
    keywords: [...DEFAULT_KEYWORDS, 'contact web developer', 'hire web developer'],
    canonicalPath: '/contact',
    ogType: 'website',
    schemaType: 'ContactPage',
    breadcrumb: [
      { name: 'Home', path: '/' },
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
      schemaType: 'WebPage',
      breadcrumb: [
        { name: 'Home', path: '/' },
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
  breadcrumb: [{ name: 'Home', path: '/' }],
}

export const INDEXABLE_PAGES = [
  {
    path: '/',
    changefreq: 'weekly',
    priority: '1.0',
    description: ROUTE_METADATA['/'].description,
  },
  {
    path: '/about',
    changefreq: 'monthly',
    priority: '0.8',
    description: ROUTE_METADATA['/about'].description,
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

export const STATIC_HTML_PATHS = Array.from(
  new Set(['/', '/about', ...INDEXABLE_PAGES.map((page) => page.path)]),
)

export const STATIC_REDIRECTS = [{ from: '/services', to: '/work' }]

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
