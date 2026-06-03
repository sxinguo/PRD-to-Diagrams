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
    path: '/faq',
    title: 'PRD Chart FAQ - Mermaid Chart & Diagram Generator Questions',
    description: 'Answers to common questions about PRD Chart: mermaid diagram types, credits, export formats, accuracy, and more.',
    ogImage: OG_IMAGE,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What types of diagrams are supported?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'PRD Chart supports three major diagram types: Mermaid Sequence Diagrams (user-system interaction flows), Mermaid Flowcharts (business process visualization), and Mermaid User Journey Maps (customer experience mapping).',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I generate a diagram?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Simply describe your requirement in the input box on the homepage, select your preferred diagram type, then click 'Start Generating'. Our AI will analyze your PRD text and generate professional Mermaid code instantly.",
          },
        },
        {
          '@type': 'Question',
          name: 'How many credits does one generation cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Each diagram generation costs 3 credits. You can preview the generated diagram and export it in PNG or SVG format.',
          },
        },
        {
          '@type': 'Question',
          name: 'What PRD formats are supported?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We support plain text, Markdown format, and structured PRD documents. Simply paste your PRD text or upload a .txt file to get started.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I export diagrams in other formats?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, you can export your generated diagrams as PNG files.',
          },
        },
        {
          '@type': 'Question',
          name: 'How accurate are the generated diagrams?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our AI is built with neural precision to extract user-system interactions, business processes, and customer journeys from your PRD. The diagrams are production-ready and suitable for professional documentation.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do credits expire?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No, all purchased credits never expire. Pay as you go with no subscription required.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is there a free trial?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, you get 12 free credits upon registration. Plus, if you use the service daily, you\'ll receive 3 bonus credits every day.',
          },
        },
      ],
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
