// SEO Prerender Script
// Runs AFTER `vite build` to generate per-route HTML files with full SEO content
// Each route gets its own index.html with meta tags, OG tags, JSON-LD, and static content
// Real users still get the SPA takeover — the static HTML is replaced by React on hydration

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

import { routes, getCanonical, SITE_URL, SITE_NAME } from './seo-config.mjs'
import { routeGenerators } from './route-html-generators.mjs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT = resolve(ROOT, 'dist')

// Read translations from i18n.tsx (parse the JS object)
function getTranslations() {
  const content = readFileSync(resolve(ROOT, 'src/app/i18n.tsx'), 'utf-8')
  const enMatch = content.match(/en:\s*\{([\s\S]*?)\n  \},?\n  zh:/)
  if (!enMatch) {
    console.warn('Could not parse en translations from i18n.tsx')
    return {}
  }
  const lines = enMatch[1].split('\n')
  const translations = {}
  for (const line of lines) {
    const kvMatch = line.match(/^\s+(\w+):\s*"(.*)",?$/)
    if (kvMatch) {
      translations[kvMatch[1]] = kvMatch[2]
    }
  }
  return translations
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Build the <head> additions for a specific route
function buildMetaTags(route) {
  const canonical = getCanonical(route.path)
  const tags = []

  // Title
  tags.push(`<title>${esc(route.title)}</title>`)

  // Description
  tags.push(`<meta name="description" content="${esc(route.description)}" />`)

  // Canonical
  tags.push(`<link rel="canonical" href="${canonical}" />`)

  // Open Graph
  tags.push(`<meta property="og:type" content="website" />`)
  tags.push(`<meta property="og:url" content="${canonical}" />`)
  tags.push(`<meta property="og:title" content="${esc(route.title)}" />`)
  tags.push(`<meta property="og:description" content="${esc(route.description)}" />`)
  tags.push(`<meta property="og:image" content="${route.ogImage}" />`)
  tags.push(`<meta property="og:site_name" content="${esc(SITE_NAME)}" />`)

  // Twitter Card
  tags.push(`<meta name="twitter:card" content="summary_large_image" />`)
  tags.push(`<meta name="twitter:title" content="${esc(route.title)}" />`)
  tags.push(`<meta name="twitter:description" content="${esc(route.description)}" />`)
  tags.push(`<meta name="twitter:image" content="${route.ogImage}" />`)

  // JSON-LD structured data
  if (route.jsonLd) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(route.jsonLd)}</script>`)
  }

  return tags.join('\n    ')
}

function main() {
  console.log('=== SEO Prerender ===\n')

  // Check that vite build output exists
  const viteIndexHtml = resolve(OUT, 'index.html')
  if (!existsSync(viteIndexHtml)) {
    console.error('Error: dist/index.html not found. Run `vite build` first.')
    process.exit(1)
  }

  // Read the Vite-built index.html as base template
  let template = readFileSync(viteIndexHtml, 'utf-8')
  console.log('Using Vite-built index.html as base template')

  const t = getTranslations()
  console.log('Loaded translations:', Object.keys(t).length, 'keys\n')

  // Generate each route
  for (const route of routes) {
    const generator = routeGenerators[route.path]
    if (!generator) {
      console.warn(`  ⚠ No generator for ${route.path}, skipping`)
      continue
    }

    // Generate static HTML content
    const bodyHtml = generator(t)

    // Build meta tags for this route
    const metaTags = buildMetaTags(route)

    // Start from the base template
    let html = template

    // Remove existing title, meta description, canonical, OG/Twitter tags, and JSON-LD
    // These will be re-injected with route-specific values
    html = html.replace(/<title>[^<]*<\/title>/g, '')
    html = html.replace(/<meta\s+name="description"[^>]*\/?>/gi, '')
    html = html.replace(/<link\s+rel="canonical"[^>]*\/?>/gi, '')
    html = html.replace(/<meta\s+(?:property="og:|name="twitter:)[^>]*\/?>/gi, '')
    html = html.replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi, '')

    // Clean up blank lines left by removed tags
    html = html.replace(/\n\s*\n\s*\n/g, '\n\n')

    // Inject meta tags before </head>
    html = html.replace('</head>', `    ${metaTags}\n  </head>`)

    // Inject static HTML content into #root
    html = html.replace('<div id="root"></div>', `<div id="root" data-ssr="true">${bodyHtml}</div>`)

    // Add SSR flag
    html = html.replace('</body>', `<script>window.__SSR__=true</script></body>`)

    // Determine output path
    let outPath
    if (route.path === '/') {
      outPath = viteIndexHtml // overwrite dist/index.html for the home page
    } else {
      const dir = resolve(OUT, route.path.slice(1)) // remove leading /
      mkdirSync(dir, { recursive: true })
      outPath = resolve(dir, 'index.html')
    }

    writeFileSync(outPath, html, 'utf-8')
    console.log(`  ✓ ${route.path} → ${outPath} (${(html.length / 1024).toFixed(1)} KB)`)
  }

  console.log('\n=== Prerender complete ===')
}

main()
