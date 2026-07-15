import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const dist = path.resolve('dist')
const routes = ['/', '/menu/', '/domande-frequenti/', '/contatti/', '/privacy-policy/']
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4', '.xml': 'application/xml', '.txt': 'text/plain' }

async function resolveRequest(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0])
  const candidate = clean === '/' ? path.join(dist, 'index.html') : clean.endsWith('/') ? path.join(dist, clean, 'index.html') : path.join(dist, clean)
  const safe = path.resolve(candidate)
  if (!safe.startsWith(dist)) return null
  try { if ((await stat(safe)).isFile()) return safe } catch { return null }
  return null
}

const server = createServer(async (request, response) => {
  const requested = await resolveRequest(request.url || '/')
  const isExplicit404 = (request.url || '').split('?')[0] === '/404.html'
  const file = requested || path.join(dist, '404.html')
  response.statusCode = requested && !isExplicit404 ? 200 : 404
  response.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream')
  response.end(await readFile(file))
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const address = server.address()
const origin = `http://127.0.0.1:${address.port}`
const browser = await chromium.launch({ headless: true })
const issues = []

async function botCheck(label, userAgent) {
  const context = await browser.newContext({ userAgent, javaScriptEnabled: false })
  for (const route of routes) {
    const page = await context.newPage()
    const response = await page.goto(`${origin}${route}`, { waitUntil: 'domcontentloaded' })
    const text = await page.locator('main').innerText()
    if (response?.status() !== 200) issues.push(`${label} received ${response?.status()} for ${route}`)
    if (text.trim().length < 250) issues.push(`${label} received insufficient HTML for ${route}`)
    if (await page.locator('h1').count() !== 1) issues.push(`${label} received invalid H1 count for ${route}`)
    await page.close()
  }
  await context.close()
}

await botCheck('normal-no-js', 'Mozilla/5.0 (compatible; GoldenItalyQA/1.0)')
await botCheck('Googlebot', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')
await botCheck('Bingbot', 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)')
await botCheck('OAI-SearchBot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot')

async function visualCheck(label, viewport) {
  const context = await browser.newContext({ viewport })
  for (const route of routes) {
    const page = await context.newPage()
    page.on('console', (message) => { if (message.type() === 'error') issues.push(`${label} console ${route}: ${message.text()}`) })
    page.on('pageerror', (error) => issues.push(`${label} page ${route}: ${error.message}`))
    const response = await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' })
    if (response?.status() !== 200) issues.push(`${label} received ${response?.status()} for ${route}`)
    const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: window.innerWidth, text: document.querySelector('main')?.textContent?.trim().length || 0 }))
    if (dimensions.width > dimensions.viewport + 1) issues.push(`${label} horizontal overflow ${route}: ${dimensions.width} > ${dimensions.viewport}`)
    if (dimensions.text < 250) issues.push(`${label} hydrated content too short for ${route}`)
    await page.close()
  }
  await context.close()
}

await visualCheck('desktop', { width: 1440, height: 1000 })
await visualCheck('mobile', { width: 390, height: 844 })

const performanceContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
const home = await performanceContext.newPage()
const initialRequests = []
home.on('request', (request) => { if (request.url().includes('golden-italy-visit.mp4')) initialRequests.push(request.url()) })
await home.goto(origin, { waitUntil: 'domcontentloaded' })
await home.waitForTimeout(1200)
if (initialRequests.length) issues.push('secondary visit video downloaded during initial load')
const heroPlayback = await home.locator('.hero-film').evaluate((video) => ({ paused: video.paused, currentTime: video.currentTime, readyState: video.readyState }))
if (heroPlayback.paused || heroPlayback.currentTime <= 0 || heroPlayback.readyState < 2) issues.push(`hero video did not autoplay: ${JSON.stringify(heroPlayback)}`)
await performanceContext.close()

const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
const reducedPage = await reducedContext.newPage()
await reducedPage.goto(origin, { waitUntil: 'networkidle' })
if (await reducedPage.locator('.scroll-cue').isVisible()) issues.push('scroll animation remains visible with prefers-reduced-motion enabled')
await reducedContext.close()

const statusContext = await browser.newContext()
const statusPage = await statusContext.newPage()
if ((await statusPage.goto(`${origin}/404.html`))?.status() !== 404) issues.push('/404.html did not return status 404')
if ((await statusPage.goto(`${origin}/pagina-inesistente/`))?.status() !== 404) issues.push('unknown route did not return status 404')
if (await statusPage.locator('h1').count() !== 1) issues.push('404 response does not contain one H1')
await statusContext.close()

await browser.close()
await new Promise((resolve) => server.close(resolve))

if (issues.length) {
  console.error(JSON.stringify(issues, null, 2))
  process.exitCode = 1
} else {
  console.log(`Prerender check passed: ${routes.length} routes, four user agents, desktop/mobile, reduced motion and real 404 behavior.`)
}
