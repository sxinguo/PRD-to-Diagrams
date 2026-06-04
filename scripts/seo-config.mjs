// SEO configuration for each prerendered route
// Single source of truth for meta tags, OG tags, and JSON-LD structured data

const SITE_URL = 'https://www.prdchart.art'
const SITE_NAME = 'PRD Chart'
const OG_IMAGE = `${SITE_URL}/showcase/sequence-1.png`

export const routes = [
  {
    path: '/',
    title: 'PRD Chart - AI Mermaid Chart & Diagram Generator from PRD',
    description: 'Generate mermaid charts and diagrams from your PRD instantly. AI-powered mermaid sequence diagrams, flowcharts, and user journey maps. Built for product managers.',
    ogImage: OG_IMAGE,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'PRD Chart',
      url: SITE_URL,
      description: 'AI-powered PRD to mermaid chart and diagram converter. Generate mermaid sequence diagrams, flowcharts, and user journey maps from product requirements.',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  },
  {
    path: '/pricing',
    title: 'PRD Chart Pricing - Mermaid Chart & Diagram Plans',
    description: 'Choose the right plan for your mermaid chart and diagram needs. Free credits on signup, affordable packs for teams and professionals.',
    ogImage: OG_IMAGE,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'PRD Chart Credits',
      description: 'AI-powered diagram generation credits',
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: '0',
        highPrice: '29.99',
        priceCurrency: 'USD',
        offerCount: '3',
      },
    },
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy - PRD Chart',
    description: 'Learn how PRD Chart collects, uses, and protects your data. Read our full privacy policy.',
    ogImage: OG_IMAGE,
  },
  {
    path: '/refund-policy',
    title: 'Refund Policy - PRD Chart',
    description: 'Review PRD Chart refund and dispute resolution policy for subscription and credit purchases.',
    ogImage: OG_IMAGE,
  },
]

export function getCanonical(path) {
  return `${SITE_URL}${path === '/' ? '/' : path}`
}

export { SITE_URL, SITE_NAME, OG_IMAGE }
