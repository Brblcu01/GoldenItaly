export type RestaurantData = {
  name: string
  canonicalUrl: string
  description: string
  shortDescription: string
  phoneDisplay: string
  phoneE164: string
  address: {
    streetAddress: string
    postalCode: string
    addressLocality: string
    addressRegion: string
    addressCountry: string
  }
  geo?: {
    latitude: number
    longitude: number
  }
  cuisines: string[]
  priceRange?: string
  averageSpendText?: string
  acceptsReservations: boolean
  menuUrl?: string
  googleBusinessUrl?: string
  tripadvisorUrl: string
  instagramUrl?: string
  facebookUrl?: string
  openingHours?: Array<{
    days: string[]
    opens: string
    closes: string
  }>
  paymentMethods?: string[]
  amenities?: string[]
}

const configuredSiteUrl = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, '')
const canonicalUrl = configuredSiteUrl || (import.meta.env.DEV ? 'http://localhost:5173' : '')

export const restaurantDescription =
  'Golden Italy è un ristorante di pesce e pizzeria nel centro di Lido di Ostia, con cucina italiana, primi di mare e piatti pensati per la convivialità.'

export const restaurant: RestaurantData = {
  name: 'Golden Italy',
  canonicalUrl,
  description: restaurantDescription,
  shortDescription: 'Ristorante di pesce e pizzeria a Ostia centro, con cucina italiana e sapori di mare.',
  phoneDisplay: '06 562 4002',
  phoneE164: '+39065624002',
  address: {
    streetAddress: 'Corso Regina Maria Pia 24',
    postalCode: '00122',
    addressLocality: 'Lido di Ostia',
    addressRegion: 'RM',
    addressCountry: 'IT',
  },
  cuisines: ['Cucina italiana', 'Cucina romana', 'Pesce', 'Pizza', 'Cucina mediterranea'],
  acceptsReservations: true,
  menuUrl: `${canonicalUrl}/menu/`,
  tripadvisorUrl:
    'https://www.tripadvisor.com/Restaurant_Review-g799531-d2347605-Reviews-Golden_Italy-Lido_di_Ostia_Province_of_Rome_Lazio.html',
}

export const restaurantAddress = [
  restaurant.address.streetAddress,
  `${restaurant.address.postalCode} ${restaurant.address.addressLocality} ${restaurant.address.addressRegion}`,
].join(', ')

export const restaurantLinks = {
  phone: `tel:${restaurant.phoneE164}`,
  directions:
    'https://www.google.com/maps/dir/?api=1&destination=Golden+Italy%2C+Corso+Regina+Maria+Pia+24%2C+00122+Lido+di+Ostia+RM',
} as const

export const media = {
  heroVideo: '/golden-italy-hero.mp4',
  heroMobileVideo: '/golden-italy-hero-mobile.mp4',
  heroPoster: '/golden-italy-poster.webp',
  heroPosterMobile: '/golden-italy-poster-mobile.webp',
  visitVideo: '/golden-italy-visit.mp4',
  visitPoster: '/golden-italy-visit-poster.webp',
  socialImage: '/golden-italy-social.jpg',
  logo: '/icons/golden-italy-512x512.png',
} as const

export const interiors = {
  exterior: { src: '/exterior-night.webp', small: '/exterior-night-800.webp', width: 1672, height: 941 },
  diningRoom: { src: '/interior-dining-room.webp', small: '/interior-dining-room-800.webp', width: 1448, height: 1086 },
  serviceCounter: { src: '/interior-service-counter.webp', small: '/interior-service-counter-800.webp', width: 1448, height: 1086 },
  tableRitual: { src: '/table-ritual.webp', small: '/table-ritual-800.webp', width: 1672, height: 941 },
} as const

export function absoluteUrl(pathname: string) {
  return `${restaurant.canonicalUrl}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}
