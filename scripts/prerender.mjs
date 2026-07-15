import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const dist = resolve(root, 'dist')
const templatePath = resolve(dist, 'index.html')
const serverEntry = resolve(root, 'dist-ssr', 'entry-server.js')
const template = await readFile(templatePath, 'utf8')
const { render, getPageData, getBuildData } = await import(pathToFileURL(serverEntry).href)
const build = getBuildData()

function escapeAttribute(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function createHead(page) {
  const h = page.head
  const imageAlt = 'L’ingresso illuminato di Golden Italy a Lido di Ostia'
  const preload = page.route.path === '/'
    ? '<link rel="preload" href="/golden-italy-poster.webp" as="image" type="image/webp" fetchpriority="high" imagesrcset="/golden-italy-poster-mobile.webp 720w, /golden-italy-poster.webp 1264w" imagesizes="100vw" />'
    : ''
  return [
    `<title>${escapeAttribute(h.title)}</title>`,
    `<meta name="description" content="${escapeAttribute(h.description)}" />`,
    `<meta name="robots" content="${escapeAttribute(h.robots)}" />`,
    `<link rel="canonical" href="${escapeAttribute(h.canonical)}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="it_IT" />',
    `<meta property="og:site_name" content="${escapeAttribute(h.siteName)}" />`,
    `<meta property="og:title" content="${escapeAttribute(h.title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(h.description)}" />`,
    `<meta property="og:url" content="${escapeAttribute(h.canonical)}" />`,
    `<meta property="og:image" content="${escapeAttribute(h.socialImage)}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta property="og:image:type" content="image/jpeg" />',
    `<meta property="og:image:alt" content="${imageAlt}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeAttribute(h.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttribute(h.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttribute(h.socialImage)}" />`,
    `<meta name="twitter:image:alt" content="${imageAlt}" />`,
    preload,
    `<script type="application/ld+json">${page.structuredData}</script>`,
  ].filter(Boolean).join('\n    ')
}

if (!template.includes('<!--seo-head-->') || !template.includes('<!--app-html-->')) {
  throw new Error('Prerender failed: template markers were not found in dist/index.html')
}

for (const route of build.routes) {
  const page = getPageData(route.path)
  const appHtml = render(route.path)
  const h1Count = (appHtml.match(/<h1(?:\s|>)/g) || []).length
  if (!page.head.title || !page.head.description || !page.head.canonical || h1Count !== 1) {
    throw new Error(`Prerender failed for ${route.path}: title, description, canonical and exactly one H1 are required.`)
  }
  const html = template.replace('<!--seo-head-->', createHead(page)).replace('<!--app-html-->', appHtml)
  const output = resolve(dist, route.output)
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, html, 'utf8')
}

const lastmod = process.env.SEO_LASTMOD || new Date().toISOString().slice(0, 10)
if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) throw new Error('SEO_LASTMOD must use YYYY-MM-DD.')
const sitemapUrls = build.routes.filter((route) => route.index).map((route) => `  <url>\n    <loc>${build.site.canonicalUrl}${route.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`).join('\n')
await writeFile(resolve(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`, 'utf8')

const robots = `User-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: Googlebot\nAllow: /\n\nUser-agent: Bingbot\nAllow: /\n\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: *\nAllow: /\n\nSitemap: ${build.site.canonicalUrl}/sitemap.xml\n`
await writeFile(resolve(dist, 'robots.txt'), robots, 'utf8')

const manifest = {
  name: `${build.site.name} — Lido di Ostia`,
  short_name: build.site.name,
  description: build.site.description,
  start_url: '/',
  display: 'standalone',
  background_color: '#1e1814',
  theme_color: '#1e1814',
  icons: [
    { src: '/icons/golden-italy-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icons/golden-italy-512x512.png', sizes: '512x512', type: 'image/png' },
  ],
}
await writeFile(resolve(dist, 'site.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

const generatedText = await Promise.all(build.routes.map((route) => readFile(resolve(dist, route.output), 'utf8')))
generatedText.push(await readFile(resolve(dist, 'sitemap.xml'), 'utf8'), await readFile(resolve(dist, 'robots.txt'), 'utf8'))
const forbidden = [/%SITE_URL%/i, /localhost/i, /da confermare/i, /\bTODO\b/i, /\bplaceholder\b/i, /orari in aggiornamento/i]
for (const pattern of forbidden) {
  if (generatedText.some((text) => pattern.test(text))) throw new Error(`Production output contains forbidden text: ${pattern}`)
}

await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true })
