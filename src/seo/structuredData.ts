import { faqItems } from '../data/faq'
import { menuSections } from '../data/menu'
import { absoluteUrl, media, restaurant } from '../data/restaurant'
import type { RouteDefinition } from './routes'

type JsonValue = string | number | boolean | JsonObject | JsonValue[]
type JsonObject = { [key: string]: JsonValue | undefined }

function compact(value: JsonValue | undefined): JsonValue | undefined {
  if (Array.isArray(value)) {
    const items = value.map(compact).filter((item): item is JsonValue => item !== undefined)
    return items.length ? items : undefined
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([key, item]) => [key, compact(item)] as const)
      .filter((entry): entry is readonly [string, JsonValue] => entry[1] !== undefined && entry[1] !== '')
    return entries.length ? Object.fromEntries(entries) as JsonObject : undefined
  }
  return value === '' ? undefined : value
}

const websiteId = absoluteUrl('/#website')
const restaurantId = absoluteUrl('/#restaurant')

function websiteNode(): JsonObject {
  return {
    '@type': 'WebSite', '@id': websiteId, url: absoluteUrl('/'), name: restaurant.name,
    description: restaurant.shortDescription, inLanguage: 'it-IT',
  }
}

function restaurantNode(): JsonObject {
  return {
    '@type': 'Restaurant', '@id': restaurantId, name: restaurant.name, url: absoluteUrl('/'),
    description: restaurant.description, telephone: restaurant.phoneE164,
    image: [absoluteUrl('/exterior-night.webp'), absoluteUrl('/interior-dining-room.webp')],
    logo: absoluteUrl(media.logo),
    address: { '@type': 'PostalAddress', ...restaurant.address },
    servesCuisine: restaurant.cuisines,
    acceptsReservations: restaurant.acceptsReservations,
    hasMenu: absoluteUrl('/menu/'),
    sameAs: [restaurant.tripadvisorUrl],
  }
}

function webPageNode(route: RouteDefinition): JsonObject {
  return {
    '@type': 'WebPage', '@id': absoluteUrl(`${route.path}#webpage`), url: absoluteUrl(route.path),
    name: route.title, description: route.description, isPartOf: { '@id': websiteId },
    about: { '@id': restaurantId }, inLanguage: 'it-IT',
  }
}

function breadcrumbNode(route: RouteDefinition): JsonObject {
  const labels: Record<string, string> = {
    '/menu/': 'Menu', '/domande-frequenti/': 'Domande frequenti',
    '/contatti/': 'Contatti', '/privacy-policy/': 'Privacy policy',
  }
  return {
    '@type': 'BreadcrumbList', '@id': absoluteUrl(`${route.path}#breadcrumb`),
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: labels[route.path], item: absoluteUrl(route.path) },
    ],
  }
}

function faqNode(route: RouteDefinition): JsonObject {
  return {
    '@type': 'FAQPage', '@id': absoluteUrl(`${route.path}#faq`),
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question', name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

function menuNode(): JsonObject {
  return {
    '@type': 'Menu', '@id': absoluteUrl('/menu/#menu'), name: 'Menu Golden Italy',
    url: absoluteUrl('/menu/'), inLanguage: 'it-IT', provider: { '@id': restaurantId },
    hasMenuSection: menuSections.map((section) => ({
      '@type': 'MenuSection', name: section.name,
      hasMenuItem: section.items.map((item) => ({
        '@type': 'MenuItem', name: item.name, description: item.description, image: absoluteUrl(item.image),
        offers: item.price === undefined ? undefined : {
          '@type': 'Offer', price: item.price, priceCurrency: 'EUR', availability: 'https://schema.org/InStock',
        },
      })),
    })),
  }
}

export function structuredDataForRoute(route: RouteDefinition) {
  const graph: JsonObject[] = [websiteNode(), webPageNode(route)]
  if (route.path === '/') graph.push(restaurantNode(), faqNode(route))
  if (route.path !== '/' && route.index) graph.push(breadcrumbNode(route))
  if (route.path === '/menu/') graph.push(menuNode())
  if (route.path === '/domande-frequenti/') graph.push(faqNode(route))
  return compact({ '@context': 'https://schema.org', '@graph': graph }) as JsonObject
}

export function serializeStructuredData(data: JsonObject) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
