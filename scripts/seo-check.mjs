import { access, readFile } from 'node:fs/promises'
import path from 'node:path'

const dist = path.resolve('dist')
const fail = (message) => { throw new Error(`SEO check: ${message}`) }
const read = (file) => readFile(path.join(dist, file), 'utf8')
const stripTags = (html) => html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim()
const attr = (html, tagPattern, name) => {
  const tag = html.match(tagPattern)?.[0]
  return tag?.match(new RegExp(`${name}=["']([^"']+)["']`, 'i'))?.[1]
}
const meta = (html, key, property = false) => attr(html, new RegExp(`<meta\\s+[^>]*${property ? 'property' : 'name'}=["']${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`, 'i'), 'content')
const canonicalOf = (html) => attr(html, /<link\s+[^>]*rel=["']canonical["'][^>]*>/i, 'href')
const outputFor = (pathname) => pathname === '/' ? 'index.html' : `${pathname.replace(/^\//, '')}index.html`

const sitemap = await read('sitemap.xml')
const robots = await read('robots.txt')
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
if (urls.length !== 5) fail(`expected 5 public URLs in sitemap, found ${urls.length}`)
if (!robots.includes('User-agent: OAI-SearchBot\nAllow: /')) fail('OAI-SearchBot is not explicitly allowed')
if (!robots.includes('User-agent: GPTBot\nDisallow: /')) fail('GPTBot training policy is missing')
if (!robots.includes(`Sitemap: ${new URL(urls[0]).origin}/sitemap.xml`)) fail('robots sitemap URL is inconsistent')

const titles = new Set()
const descriptions = new Set()
const routeFiles = new Map()
for (const url of urls) {
  const parsed = new URL(url)
  if (parsed.protocol !== 'https:' || parsed.search || parsed.hash) fail(`invalid sitemap URL ${url}`)
  if (parsed.pathname !== '/' && !parsed.pathname.endsWith('/')) fail(`sitemap URL lacks trailing slash: ${url}`)
  const output = outputFor(parsed.pathname)
  const html = await read(output)
  routeFiles.set(parsed.pathname, output)
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim()
  const description = meta(html, 'description')
  if (!title || !description) fail(`${parsed.pathname} lacks title or description`)
  if (titles.has(title) || descriptions.has(description)) fail(`${parsed.pathname} does not have unique metadata`)
  titles.add(title); descriptions.add(description)
  if (canonicalOf(html) !== url) fail(`${parsed.pathname} canonical differs from sitemap URL`)
  if (meta(html, 'robots') !== 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1') fail(`${parsed.pathname} robots directive is incomplete`)
  for (const key of ['og:title', 'og:description', 'og:url', 'og:image']) if (!meta(html, key, true)) fail(`${parsed.pathname} lacks ${key}`)
  for (const key of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) if (!meta(html, key)) fail(`${parsed.pathname} lacks ${key}`)
  const h1s = [...html.matchAll(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/gi)]
  if (h1s.length !== 1 || !stripTags(h1s[0][1])) fail(`${parsed.pathname} must have exactly one non-empty H1`)
  const main = html.match(/<main(?:\s[^>]*)?>([\s\S]*?)<\/main>/i)?.[1]
  if (!main || stripTags(main).length < 250) fail(`${parsed.pathname} prerendered main content is too short`)
  for (const image of html.match(/<img\s[^>]*>/gi) || []) {
    const alt = attr(image, /<img\s[^>]*>/i, 'alt')
    if (alt === undefined || !alt.trim()) fail(`${parsed.pathname} contains an image without useful alt text`)
  }
  for (const script of html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)) JSON.parse(script[1])
  for (const anchor of html.match(/<a\s[^>]*target=["']_blank["'][^>]*>/gi) || []) {
    const rel = attr(anchor, /<a\s[^>]*>/i, 'rel') || ''
    if (!rel.includes('noopener') || !rel.includes('noreferrer')) fail(`${parsed.pathname} has an unsafe external link`)
  }
}

const notFound = await read('404.html')
if (meta(notFound, 'robots') !== 'noindex,follow') fail('404 page must be noindex,follow')
if ((notFound.match(/<h1(?:\s|>)/g) || []).length !== 1) fail('404 page must have one H1')

const home = await read('index.html')
const restaurantGraph = JSON.parse(home.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i)[1])['@graph'].find((node) => node['@type'] === 'Restaurant')
if (!restaurantGraph) fail('homepage Restaurant graph is missing')
const homeText = stripTags(home)
const phoneDigits = restaurantGraph.telephone.replace(/\D/g, '')
if (!homeText.replace(/\D/g, '').includes(phoneDigits.replace(/^39/, ''))) fail('visible phone differs from Restaurant JSON-LD')
for (const [key, value] of Object.entries(restaurantGraph.address)) if (typeof value === 'string' && !['@type', 'addressCountry'].includes(key) && !homeText.includes(value)) fail(`visible address lacks ${value}`)
if (!homeText.includes(restaurantGraph.description)) fail('Restaurant description is not visible verbatim')

for (const [pathname, file] of routeFiles) {
  const html = await read(file)
  for (const match of html.matchAll(/<a\s+[^>]*href=["']([^"']+)["']/gi)) {
    const href = match[1]
    if (!href.startsWith('/') || href.startsWith('//')) continue
    const target = href.split('#')[0].split('?')[0] || pathname
    if (target === '/') continue
    if (target.endsWith('/')) await access(path.join(dist, target.replace(/^\//, ''), 'index.html')).catch(() => fail(`broken internal link ${href} on ${pathname}`))
    else await access(path.join(dist, target.replace(/^\//, ''))).catch(() => fail(`broken internal link ${href} on ${pathname}`))
  }
}

const combined = [sitemap, robots, notFound, ...await Promise.all([...routeFiles.values()].map(read))].join('\n')
for (const pattern of [/%SITE_URL%/i, /localhost/i, /da confermare/i, /\bTODO\b/i, /\bplaceholder\b/i, /orari in aggiornamento/i]) if (pattern.test(combined)) fail(`forbidden production text ${pattern}`)
console.log(`SEO check passed: ${urls.length} indexable routes, unique metadata, valid links and coherent NAP.`)
