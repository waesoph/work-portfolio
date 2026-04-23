import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  CONTACT_EMAIL,
  DEFAULT_OG_IMAGE_PATH,
  GITHUB_URL,
  LINKEDIN_URL,
  SITE_LANGUAGE,
  SITE_LOCALE,
  SITE_NAME,
  SITE_SUMMARY,
  SITE_URL,
  getCanonicalUrl,
  getRouteMetadata,
  normalizePath,
} from '../seo/siteMetadata.js'

const JSON_LD_SCRIPT_ID = 'site-jsonld'
const DEFAULT_ROBOTS_CONTENT = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
const NO_INDEX_ROBOTS_CONTENT = 'noindex, nofollow, noarchive'

function buildAttributeSelector(tagName, attributes) {
  const selectors = Object.entries(attributes).map(([attribute, value]) => {
    const escapedValue = String(value).replace(/"/g, '\\"')
    return `[${attribute}="${escapedValue}"]`
  })

  return `${tagName}${selectors.join('')}`
}

function upsertMetaTag(key, attributes, content) {
  if (typeof document === 'undefined') {
    return
  }

  let metaTag = document.head.querySelector(`meta[data-seo-meta="${key}"]`)
  if (!metaTag) {
    const selector = buildAttributeSelector('meta', attributes)
    metaTag = document.head.querySelector(selector)
    if (metaTag) {
      metaTag.setAttribute('data-seo-meta', key)
    }
  }

  if (!metaTag) {
    metaTag = document.createElement('meta')
    metaTag.setAttribute('data-seo-meta', key)
    document.head.appendChild(metaTag)
  }

  Object.entries(attributes).forEach(([attribute, value]) => {
    metaTag.setAttribute(attribute, value)
  })
  metaTag.setAttribute('content', content)
}

function upsertLinkTag(key, attributes) {
  if (typeof document === 'undefined') {
    return
  }

  let linkTag = document.head.querySelector(`link[data-seo-link="${key}"]`)
  if (!linkTag) {
    const selector = buildAttributeSelector('link', {
      rel: attributes.rel,
      ...(attributes.hreflang ? { hreflang: attributes.hreflang } : {}),
    })
    linkTag = document.head.querySelector(selector)
    if (linkTag) {
      linkTag.setAttribute('data-seo-link', key)
    }
  }

  if (!linkTag) {
    linkTag = document.createElement('link')
    linkTag.setAttribute('data-seo-link', key)
    document.head.appendChild(linkTag)
  }

  Object.entries(attributes).forEach(([attribute, value]) => {
    linkTag.setAttribute(attribute, value)
  })
}

function upsertStructuredData(graph) {
  if (typeof document === 'undefined') {
    return
  }

  let scriptTag = document.getElementById(JSON_LD_SCRIPT_ID)
  if (!scriptTag) {
    scriptTag = document.createElement('script')
    scriptTag.id = JSON_LD_SCRIPT_ID
    scriptTag.type = 'application/ld+json'
    document.head.appendChild(scriptTag)
  }

  scriptTag.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph,
  })
}

function buildBreadcrumbSchema(breadcrumbItems) {
  if (!Array.isArray(breadcrumbItems) || breadcrumbItems.length === 0) {
    return null
  }

  return {
    '@type': 'BreadcrumbList',
    '@id': `${SITE_URL}/#breadcrumb`,
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  }
}

function buildSchemaGraph(pageMetadata, canonicalUrl) {
  const webSiteId = `${SITE_URL}/#website`
  const personId = `${SITE_URL}/#person`
  const businessId = `${SITE_URL}/#business`
  const webPageId = `${canonicalUrl}#webpage`

  const graph = [
    {
      '@type': 'WebSite',
      '@id': webSiteId,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      description: SITE_SUMMARY,
      inLanguage: SITE_LANGUAGE,
    },
    {
      '@type': 'Person',
      '@id': personId,
      name: SITE_NAME,
      jobTitle: 'Web Developer',
      url: `${SITE_URL}/`,
      sameAs: [LINKEDIN_URL, GITHUB_URL],
      email: CONTACT_EMAIL,
    },
    {
      '@type': 'ProfessionalService',
      '@id': businessId,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      email: CONTACT_EMAIL,
      sameAs: [LINKEDIN_URL, GITHUB_URL],
      areaServed: 'Worldwide',
      description: SITE_SUMMARY,
    },
    {
      '@type': pageMetadata.schemaType || 'WebPage',
      '@id': webPageId,
      url: canonicalUrl,
      name: pageMetadata.title,
      description: pageMetadata.description,
      inLanguage: SITE_LANGUAGE,
      isPartOf: { '@id': webSiteId },
      about: { '@id': businessId },
      mainEntity: { '@id': personId },
    },
  ]

  const breadcrumbSchema = buildBreadcrumbSchema(pageMetadata.breadcrumb)
  if (breadcrumbSchema) {
    graph.push(breadcrumbSchema)
  }

  if (pageMetadata.caseStudyName) {
    graph.push({
      '@type': 'Article',
      '@id': `${canonicalUrl}#article`,
      headline: pageMetadata.caseStudyName,
      description: pageMetadata.description,
      mainEntityOfPage: { '@id': webPageId },
      author: { '@id': personId },
      publisher: { '@id': businessId },
      inLanguage: SITE_LANGUAGE,
    })
  }

  return graph
}

export default function Seo() {
  const location = useLocation()

  useEffect(() => {
    const path = normalizePath(location.pathname)
    const pageMetadata = getRouteMetadata(path)
    const canonicalPath =
      typeof pageMetadata.canonicalPath === 'string'
        ? pageMetadata.canonicalPath
        : path
    const canonicalUrl = getCanonicalUrl(canonicalPath)
    const ogImageUrl = getCanonicalUrl(DEFAULT_OG_IMAGE_PATH)
    const robotsContent = pageMetadata.noIndex ? NO_INDEX_ROBOTS_CONTENT : DEFAULT_ROBOTS_CONTENT
    const keywordsContent = Array.isArray(pageMetadata.keywords)
      ? pageMetadata.keywords.join(', ')
      : ''

    document.title = pageMetadata.title
    document.documentElement.setAttribute('lang', 'en-CA')

    upsertMetaTag('description', { name: 'description' }, pageMetadata.description)
    upsertMetaTag('robots', { name: 'robots' }, robotsContent)
    upsertMetaTag('author', { name: 'author' }, SITE_NAME)
    upsertMetaTag('keywords', { name: 'keywords' }, keywordsContent)
    upsertMetaTag('theme-color', { name: 'theme-color' }, '#000000')

    upsertMetaTag('og:title', { property: 'og:title' }, pageMetadata.title)
    upsertMetaTag('og:description', { property: 'og:description' }, pageMetadata.description)
    upsertMetaTag('og:type', { property: 'og:type' }, pageMetadata.ogType || 'website')
    upsertMetaTag('og:url', { property: 'og:url' }, canonicalUrl)
    upsertMetaTag('og:image', { property: 'og:image' }, ogImageUrl)
    upsertMetaTag('og:site_name', { property: 'og:site_name' }, SITE_NAME)
    upsertMetaTag('og:locale', { property: 'og:locale' }, SITE_LOCALE)

    upsertMetaTag('twitter:card', { name: 'twitter:card' }, 'summary_large_image')
    upsertMetaTag('twitter:title', { name: 'twitter:title' }, pageMetadata.title)
    upsertMetaTag('twitter:description', { name: 'twitter:description' }, pageMetadata.description)
    upsertMetaTag('twitter:image', { name: 'twitter:image' }, ogImageUrl)

    upsertLinkTag('canonical', { rel: 'canonical', href: canonicalUrl })
    upsertLinkTag('alternate-en-ca', {
      rel: 'alternate',
      hreflang: 'en-ca',
      href: canonicalUrl,
    })
    upsertLinkTag('alternate-x-default', {
      rel: 'alternate',
      hreflang: 'x-default',
      href: canonicalUrl,
    })

    upsertStructuredData(buildSchemaGraph(pageMetadata, canonicalUrl))
  }, [location.pathname])

  return null
}
