import {
  CONTACT_EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  PRIMARY_SERVICES,
  SERVICE_AREAS,
  SITE_LANGUAGE,
  SITE_NAME,
  SITE_SUMMARY,
  SITE_URL,
  getCanonicalUrl,
} from './siteMetadata.js'

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

function buildAreaServed() {
  return SERVICE_AREAS.map((area) => ({
    '@type': area.type,
    name: area.name,
  }))
}

export function buildStructuredDataGraph(pageMetadata, canonicalUrl) {
  const webSiteId = `${SITE_URL}/#website`
  const personId = `${SITE_URL}/#person`
  const businessId = `${SITE_URL}/#business`
  const webPageId = `${canonicalUrl}#webpage`
  const articleId = pageMetadata.caseStudyName ? `${canonicalUrl}#article` : null

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
      knowsAbout: PRIMARY_SERVICES,
    },
    {
      '@type': 'ProfessionalService',
      '@id': businessId,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      email: CONTACT_EMAIL,
      sameAs: [LINKEDIN_URL, GITHUB_URL],
      areaServed: buildAreaServed(),
      serviceType: PRIMARY_SERVICES,
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
      mainEntity: { '@id': articleId || personId },
    },
  ]

  const breadcrumbSchema = buildBreadcrumbSchema(pageMetadata.breadcrumb)
  if (breadcrumbSchema) {
    graph.push(breadcrumbSchema)
  }

  if (pageMetadata.caseStudyName) {
    graph.push({
      '@type': 'Article',
      '@id': articleId,
      headline: pageMetadata.caseStudyName,
      description: pageMetadata.description,
      mainEntityOfPage: { '@id': webPageId },
      author: { '@id': personId },
      publisher: { '@id': businessId },
      about: { '@id': businessId },
      inLanguage: SITE_LANGUAGE,
    })
  }

  return graph
}
