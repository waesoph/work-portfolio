import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  CASE_STUDY_LLM_ENTRIES,
  CONTACT_EMAIL,
  GITHUB_URL,
  INDEXABLE_PAGES,
  LINKEDIN_URL,
  PRIMARY_SERVICES,
  SITE_NAME,
  SITE_SUMMARY,
  SITE_URL,
} from '../src/seo/siteMetadata.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const publicDir = path.join(projectRoot, 'public')

function normalizePath(routePath) {
  if (routePath === '/') {
    return '/'
  }

  return String(routePath || '/').startsWith('/')
    ? String(routePath).replace(/\/+$/, '')
    : `/${String(routePath).replace(/\/+$/, '')}`
}

function toAbsoluteUrl(routePath) {
  const normalizedPath = normalizePath(routePath)
  return normalizedPath === '/' ? `${SITE_URL}/` : `${SITE_URL}${normalizedPath}`
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function routeLabel(routePath) {
  if (routePath === '/') {
    return 'About'
  }

  if (routePath === '/work') {
    return 'Work'
  }

  if (routePath === '/contact') {
    return 'Contact'
  }

  const caseStudy = CASE_STUDY_LLM_ENTRIES.find((entry) => entry.path === routePath)
  if (caseStudy) {
    return `${caseStudy.name} Case Study`
  }

  return routePath
}

function buildSitemap(todayIsoDate) {
  const urlEntries = INDEXABLE_PAGES.map((page) => {
    const absoluteUrl = toAbsoluteUrl(page.path)
    const lastmod = page.lastmod || todayIsoDate

    return `  <url>
    <loc>${escapeXml(absoluteUrl)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>${escapeXml(page.changefreq || 'monthly')}</changefreq>
    <priority>${escapeXml(page.priority || '0.5')}</priority>
  </url>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`
}

async function readCnameHost() {
  try {
    const cnameRaw = await readFile(path.join(publicDir, 'CNAME'), 'utf8')
    return cnameRaw.trim()
  } catch {
    return ''
  }
}

function buildRobots(cnameHost) {
  const siteHost = (() => {
    if (cnameHost) {
      return cnameHost
    }

    try {
      return new URL(SITE_URL).hostname
    } catch {
      return ''
    }
  })()

  const hostLine = siteHost ? `Host: ${siteHost}\n` : ''
  return `User-agent: *
Allow: /
Disallow: /404.html

Sitemap: ${toAbsoluteUrl('/sitemap.xml')}
${hostLine}`
}

function buildLlms() {
  const corePages = INDEXABLE_PAGES.filter((page) =>
    ['/', '/work', '/contact'].includes(page.path),
  )

  const caseStudyLines = CASE_STUDY_LLM_ENTRIES.map((entry) => {
    const absoluteUrl = toAbsoluteUrl(entry.path)
    return `- [${entry.name}](${absoluteUrl}): ${entry.summary}`
  }).join('\n')

  const primaryPageLines = corePages
    .map((page) => `- [${routeLabel(page.path)}](${toAbsoluteUrl(page.path)}): ${page.description}`)
    .join('\n')

  return `# ${SITE_NAME}
> ${SITE_SUMMARY}

Website: ${SITE_URL}
Email: ${CONTACT_EMAIL}

## Primary Pages
${primaryPageLines}

## Featured Case Studies
${caseStudyLines}

## Services
${PRIMARY_SERVICES.map((service) => `- ${service}`).join('\n')}

## Profiles
- LinkedIn: ${LINKEDIN_URL}
- GitHub: ${GITHUB_URL}
`
}

function buildLlmsFull(todayIsoDate) {
  const corePages = INDEXABLE_PAGES.filter((page) =>
    ['/', '/work', '/contact'].includes(page.path),
  )

  const pageLines = corePages.map((page) => {
    const absoluteUrl = toAbsoluteUrl(page.path)
    return `- ${routeLabel(page.path)}: ${absoluteUrl}
  Summary: ${page.description}`
  }).join('\n')

  const caseStudyLines = CASE_STUDY_LLM_ENTRIES.map((entry) => {
    const absoluteUrl = toAbsoluteUrl(entry.path)
    return `- ${entry.name}
  URL: ${absoluteUrl}
  Summary: ${entry.summary}`
  }).join('\n')

  return `# ${SITE_NAME} - Full LLM Reference

Generated: ${todayIsoDate}
Canonical site URL: ${SITE_URL}

## Site Purpose
${SITE_SUMMARY}

## Service Areas
${PRIMARY_SERVICES.map((service) => `- ${service}`).join('\n')}

## Public Pages
${pageLines}

## Case Study Details
${caseStudyLines}

## Contact
- Email: ${CONTACT_EMAIL}
- LinkedIn: ${LINKEDIN_URL}
- GitHub: ${GITHUB_URL}
`
}

async function main() {
  await mkdir(publicDir, { recursive: true })

  const todayIsoDate = new Date().toISOString().slice(0, 10)
  const cnameHost = await readCnameHost()

  await Promise.all([
    writeFile(path.join(publicDir, 'sitemap.xml'), buildSitemap(todayIsoDate), 'utf8'),
    writeFile(path.join(publicDir, 'robots.txt'), buildRobots(cnameHost), 'utf8'),
    writeFile(path.join(publicDir, 'llms.txt'), buildLlms(), 'utf8'),
    writeFile(path.join(publicDir, 'llms-full.txt'), buildLlmsFull(todayIsoDate), 'utf8'),
  ])

  console.log('Generated sitemap.xml, robots.txt, llms.txt, and llms-full.txt')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
