import { readFile } from 'node:fs/promises'
import path from 'node:path'

const dist = path.resolve('dist')
const routes = ['index.html', 'menu/index.html', 'domande-frequenti/index.html', 'contatti/index.html', 'privacy-policy/index.html', '404.html']
const fail = (message) => { throw new Error(`Structured data check: ${message}`) }
const strip = (html) => html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')

function inspectValue(value, trail = 'root') {
  if (value === null || value === undefined) fail(`${trail} contains null or undefined`)
  if (typeof value === 'string' && value.trim() === '') fail(`${trail} contains an empty string`)
  if (Array.isArray(value)) {
    if (!value.length) fail(`${trail} contains an empty array`)
    value.forEach((item, index) => inspectValue(item, `${trail}[${index}]`))
  } else if (typeof value === 'object') {
    if (!Object.keys(value).length) fail(`${trail} contains an empty object`)
    for (const [key, item] of Object.entries(value)) {
      if (['url', 'image', 'logo', 'hasMenu', 'item', '@id'].includes(key) && typeof item === 'string' && !item.startsWith('https://')) fail(`${trail}.${key} is not an absolute HTTPS URL`)
      inspectValue(item, `${trail}.${key}`)
    }
  }
}

for (const file of routes) {
  const html = await readFile(path.join(dist, file), 'utf8')
  const visible = strip(html)
  const matches = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)]
  if (matches.length !== 1) fail(`${file} must contain exactly one JSON-LD block`)
  const data = JSON.parse(matches[0][1])
  inspectValue(data, file)
  const serialized = JSON.stringify(data)
  for (const forbidden of ['aggregateRating', 'review', 'openingHoursSpecification', 'priceRange', 'geo', 'hasMap']) if (serialized.includes(`"${forbidden}"`)) fail(`${file} contains unverified ${forbidden}`)
  if (serialized.includes('"menu":')) fail(`${file} uses obsolete menu instead of hasMenu`)
  for (const node of data['@graph']) {
    if (typeof node.description === 'string' && !visible.includes(node.description)) fail(`${file} structured description is not visible verbatim`)
    if (node['@type'] === 'FAQPage') {
      for (const question of node.mainEntity) {
        if (!visible.includes(question.name) || !visible.includes(question.acceptedAnswer.text)) fail(`${file} FAQ markup differs from visible content`)
      }
    }
    if (node['@type'] === 'Menu') {
      for (const section of node.hasMenuSection) {
        if (!visible.includes(section.name)) fail(`${file} MenuSection is not visible`)
        for (const item of section.hasMenuItem) {
          if (!visible.includes(item.name) || !visible.includes(item.description)) fail(`${file} MenuItem differs from visible content`)
          if ('offers' in item) fail(`${file} exposes an Offer without a verified price`)
        }
      }
    }
    if (node['@type'] === 'Restaurant') {
      if (!visible.includes(node.description)) fail(`${file} Restaurant description is not visible`)
      if (!node.hasMenu || !node.acceptsReservations) fail(`${file} Restaurant lacks verified menu/reservation links`)
    }
  }
}

console.log(`Structured data check passed: ${routes.length} prerendered documents validated.`)
