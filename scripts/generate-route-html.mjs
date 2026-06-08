import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  DEFAULT_OG_IMAGE_PATH,
  PRIMARY_SERVICES,
  SITE_LANGUAGE,
  SITE_LOCALE,
  SITE_NAME,
  STATIC_HTML_PATHS,
  getCanonicalUrl,
  getRouteMetadata,
} from '../src/seo/siteMetadata.js'
import { buildStructuredDataGraph } from '../src/seo/structuredData.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')

const DEFAULT_ROBOTS_CONTENT =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
const NO_INDEX_ROBOTS_CONTENT = 'noindex, nofollow, noarchive'

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/"/g, '&quot;')
}

function replaceOnce(html, pattern, replacement, label) {
  if (!pattern.test(html)) {
    throw new Error(`Could not update ${label}`)
  }

  return html.replace(pattern, replacement)
}

function getPageHeading(routePath, pageMetadata) {
  if (routePath === '/') {
    return 'Custom Websites and Technical SEO'
  }

  if (routePath === '/about') {
    return 'About Will Aesoph'
  }

  if (routePath === '/work') {
    return 'Web Development Portfolio'
  }

  if (routePath === '/contact') {
    return 'Contact Will Aesoph'
  }

  if (pageMetadata.caseStudyName) {
    return pageMetadata.caseStudyName
  }

  return SITE_NAME
}

function buildNoscriptMarkup(routePath, pageMetadata) {
  const heading = getPageHeading(routePath, pageMetadata)
  const servicesList = PRIMARY_SERVICES.map(
    (service) => `<li>${escapeHtml(service)}</li>`,
  ).join('')

  const extraParagraph =
    routePath === '/'
      ? '<p>Will Aesoph builds custom websites, improves technical SEO, and helps businesses turn their website into a stronger lead channel.</p>'
      : '<p>This page is part of Will Aesoph’s web development portfolio and business site.</p>'

  return `    <noscript>
      <main>
        <h1>${escapeHtml(heading)}</h1>
        <p>${escapeHtml(pageMetadata.description)}</p>
${extraParagraph}
        <ul>${servicesList}</ul>
        <p><a href="https://aesoph.ca/">Home</a></p>
        <p><a href="https://aesoph.ca/about">About</a></p>
        <p><a href="https://aesoph.ca/work">Work</a></p>
        <p><a href="https://aesoph.ca/contact">Contact</a></p>
      </main>
    </noscript>`
}

function buildStructuredDataMarkup(pageMetadata, canonicalUrl) {
  return `<script id="site-jsonld" type="application/ld+json">
${JSON.stringify(
  {
    '@context': 'https://schema.org',
    '@graph': buildStructuredDataGraph(pageMetadata, canonicalUrl),
  },
  null,
  2,
)}
    </script>`
}

function buildPageHtml(templateHtml, routePath) {
  const pageMetadata = getRouteMetadata(routePath)
  const canonicalPath =
    typeof pageMetadata.canonicalPath === 'string'
      ? pageMetadata.canonicalPath
      : routePath
  const canonicalUrl = getCanonicalUrl(canonicalPath)
  const ogImageUrl = getCanonicalUrl(DEFAULT_OG_IMAGE_PATH)
  const robotsContent = pageMetadata.noIndex
    ? NO_INDEX_ROBOTS_CONTENT
    : DEFAULT_ROBOTS_CONTENT
  const keywordsContent = Array.isArray(pageMetadata.keywords)
    ? pageMetadata.keywords.join(', ')
    : ''

  let html = templateHtml

  html = replaceOnce(
    html,
    /<html lang="[^"]+">/,
    `<html lang="${escapeAttribute(SITE_LANGUAGE)}">`,
    'html lang',
  )
  html = replaceOnce(
    html,
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(pageMetadata.title)}</title>`,
    'title',
  )
  html = replaceOnce(
    html,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeAttribute(pageMetadata.description)}" />`,
    'description meta',
  )
  html = replaceOnce(
    html,
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/,
    `<meta name="robots" content="${escapeAttribute(robotsContent)}" />`,
    'robots meta',
  )
  html = replaceOnce(
    html,
    /<meta\s+name="author"\s+content="[^"]*"\s*\/?>/,
    `<meta name="author" content="${escapeAttribute(SITE_NAME)}" />`,
    'author meta',
  )
  html = replaceOnce(
    html,
    /<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/,
    `<meta name="keywords" content="${escapeAttribute(keywordsContent)}" />`,
    'keywords meta',
  )
  html = replaceOnce(
    html,
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:type" content="${escapeAttribute(pageMetadata.ogType || 'website')}" />`,
    'og type meta',
  )
  html = replaceOnce(
    html,
    /<meta\s+property="og:site_name"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:site_name" content="${escapeAttribute(SITE_NAME)}" />`,
    'og site name meta',
  )
  html = replaceOnce(
    html,
    /<meta\s+property="og:locale"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:locale" content="${escapeAttribute(SITE_LOCALE)}" />`,
    'og locale meta',
  )
  html = replaceOnce(
    html,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeAttribute(pageMetadata.title)}" />`,
    'og title meta',
  )
  html = replaceOnce(
    html,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeAttribute(pageMetadata.description)}" />`,
    'og description meta',
  )
  html = replaceOnce(
    html,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />`,
    'og url meta',
  )
  html = replaceOnce(
    html,
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:image" content="${escapeAttribute(ogImageUrl)}" />`,
    'og image meta',
  )
  html = replaceOnce(
    html,
    /<meta\s+name="twitter:card"\s+content="[^"]*"\s*\/?>/,
    '<meta name="twitter:card" content="summary_large_image" />',
    'twitter card meta',
  )
  html = replaceOnce(
    html,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${escapeAttribute(pageMetadata.title)}" />`,
    'twitter title meta',
  )
  html = replaceOnce(
    html,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${escapeAttribute(pageMetadata.description)}" />`,
    'twitter description meta',
  )
  html = replaceOnce(
    html,
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:image" content="${escapeAttribute(ogImageUrl)}" />`,
    'twitter image meta',
  )
  html = replaceOnce(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />`,
    'canonical link',
  )
  html = replaceOnce(
    html,
    /<link\s+rel="alternate"\s+hreflang="en-ca"\s+href="[^"]*"\s*\/?>/,
    `<link rel="alternate" hreflang="en-ca" href="${escapeAttribute(canonicalUrl)}" />`,
    'alternate en-ca link',
  )
  html = replaceOnce(
    html,
    /<link\s+rel="alternate"\s+hreflang="x-default"\s+href="[^"]*"\s*\/?>/,
    `<link rel="alternate" hreflang="x-default" href="${escapeAttribute(canonicalUrl)}" />`,
    'alternate x-default link',
  )
  html = replaceOnce(
    html,
    /<script id="site-jsonld" type="application\/ld\+json">[\s\S]*?<\/script>/,
    buildStructuredDataMarkup(pageMetadata, canonicalUrl),
    'structured data script',
  )
  html = replaceOnce(
    html,
    /<noscript>\s*<main>[\s\S]*?<\/main>\s*<\/noscript>/,
    buildNoscriptMarkup(routePath, pageMetadata),
    'noscript content',
  )

  return html
}

async function writeRouteFile(routePath, html) {
  const outputPath =
    routePath === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, routePath.slice(1), 'index.html')

  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, html, 'utf8')
}

async function main() {
  const templatePath = path.join(distDir, 'index.html')
  const templateHtml = await readFile(templatePath, 'utf8')

  for (const routePath of STATIC_HTML_PATHS) {
    await writeRouteFile(routePath, buildPageHtml(templateHtml, routePath))
  }

  console.log(
    `Generated ${STATIC_HTML_PATHS.length} static route HTML files.`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
