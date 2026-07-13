import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const output = path.join(root, 'artifacts')
await mkdir(output, { recursive: true })

const browser = await chromium.launch({ headless: true })
const issues = []

async function inspect(name, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
  page.on('console', (message) => {
    if (message.type() === 'error') issues.push(`${name} console: ${message.text()}`)
  })
  page.on('pageerror', (error) => issues.push(`${name} page: ${error.message}`))
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' })

  const video = page.locator('video')
  await video.waitFor({ state: 'visible' })
  await page.waitForTimeout(1600)
  await video.evaluate((element) => {
    element.currentTime = Math.min(2, element.duration || 2)
    element.pause()
  })
  await page.waitForTimeout(500)

  if (name === 'desktop') {
    const cleanFrame = await video.evaluate((element) => {
      const canvas = document.createElement('canvas')
      canvas.width = element.videoWidth
      canvas.height = element.videoHeight
      canvas.getContext('2d')?.drawImage(element, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL('image/jpeg', .9)
    })
    await writeFile(path.join(output, 'hero-frame-check.jpg'), Buffer.from(cleanFrame.split(',')[1], 'base64'))
  }

  const metrics = await page.evaluate(() => ({
    title: document.title,
    width: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
    sections: document.querySelectorAll('main section').length,
    heroHeight: Math.round(document.querySelector('.hero')?.getBoundingClientRect().height || 0),
    bodyText: document.body.innerText.length,
  }))
  if (metrics.width > metrics.viewport + 1) issues.push(`${name} horizontal overflow: ${metrics.width}px > ${metrics.viewport}px`)
  if (metrics.sections < 6) issues.push(`${name} missing sections: ${metrics.sections}`)
  if (metrics.heroHeight < viewport.height * .9) issues.push(`${name} hero too short: ${metrics.heroHeight}px`)

  await page.screenshot({ path: path.join(output, `${name}.png`), fullPage: true })
  await page.locator('.welcome-gallery').scrollIntoViewIfNeeded()
  await page.waitForTimeout(2200)
  await page.screenshot({ path: path.join(output, `${name}-welcome-gallery.png`), fullPage: false })
  await page.locator('.room').scrollIntoViewIfNeeded()
  await page.waitForTimeout(1600)
  await page.screenshot({ path: path.join(output, `${name}-interior-room.png`), fullPage: false })
  await page.locator('#tavola').scrollIntoViewIfNeeded()
  await page.waitForTimeout(2000)
  await page.screenshot({ path: path.join(output, `${name}-table-zone.png`), fullPage: false })
  await page.locator('#piatti').scrollIntoViewIfNeeded()
  await page.waitForTimeout(1500)
  await page.screenshot({ path: path.join(output, `${name}-dishes.png`), fullPage: false })
  await page.locator('.visit-panel').scrollIntoViewIfNeeded()
  await page.waitForTimeout(1700)
  await page.screenshot({ path: path.join(output, `${name}-visit.png`), fullPage: false })
  await page.locator('footer').scrollIntoViewIfNeeded()
  await page.waitForTimeout(1600)
  await page.screenshot({ path: path.join(output, `${name}-footer.png`), fullPage: false })
  await page.close()
  return metrics
}

const desktop = await inspect('desktop', { width: 1440, height: 1000 })
const mobile = await inspect('mobile', { width: 390, height: 844 })
await browser.close()

console.log(JSON.stringify({ desktop, mobile, issues }, null, 2))
if (issues.length) process.exitCode = 1
