import { absoluteUrl, media, restaurant } from '../data/restaurant'

export type RouteDefinition = {
  path: string
  output: string
  title: string
  description: string
  h1: string
  index: boolean
}

export const publicRoutes: RouteDefinition[] = [
  {
    path: '/', output: 'index.html', index: true,
    title: 'Golden Italy | Ristorante di pesce e pizzeria a Ostia',
    description: restaurant.description,
    h1: 'Una tavola accesa nel cuore di Ostia.',
  },
  {
    path: '/menu/', output: 'menu/index.html', index: true,
    title: 'Menu Golden Italy | Pesce, cucina italiana e pizza a Ostia',
    description: 'Consulta il menu testuale di Golden Italy a Ostia: un’anteprima dei piatti di mare e della cucina italiana, con informazioni chiare e accessibili.',
    h1: 'Menu Golden Italy: pesce, cucina italiana e pizza a Ostia',
  },
  {
    path: '/domande-frequenti/', output: 'domande-frequenti/index.html', index: true,
    title: 'Domande frequenti | Golden Italy Ostia',
    description: 'Dove si trova Golden Italy, come prenotare, quali piatti propone e dove consultare il menu: risposte utili per organizzare la visita a Ostia.',
    h1: 'Domande frequenti su Golden Italy a Ostia',
  },
  {
    path: '/contatti/', output: 'contatti/index.html', index: true,
    title: 'Contatti e indicazioni | Golden Italy Ostia',
    description: `Contatta Golden Italy a Ostia, chiama il ${restaurant.phoneDisplay} per prenotare e trova le indicazioni per ${restaurant.address.streetAddress}.`,
    h1: 'Contatti e indicazioni per Golden Italy a Ostia',
  },
  {
    path: '/privacy-policy/', output: 'privacy-policy/index.html', index: true,
    title: 'Privacy policy | Golden Italy',
    description: 'Informazioni sul trattamento dei dati durante la navigazione del sito Golden Italy e sui collegamenti verso servizi esterni.',
    h1: 'Privacy policy del sito Golden Italy',
  },
]

export const notFoundRoute: RouteDefinition = {
  path: '/404.html', output: '404.html', index: false,
  title: 'Pagina non trovata | Golden Italy',
  description: 'La pagina richiesta non è disponibile. Torna al sito Golden Italy o consulta menu, domande frequenti e contatti.',
  h1: 'Questa pagina non è a tavola.',
}

export const allRoutes = [...publicRoutes, notFoundRoute]

export function normalizePathname(pathname: string) {
  if (pathname === '/404.html') return pathname
  const clean = pathname.split('?')[0].split('#')[0]
  return clean === '/' ? '/' : `/${clean.replace(/^\/+|\/+$/g, '')}/`
}

export function getRoute(pathname: string) {
  const normalized = normalizePathname(pathname)
  return allRoutes.find((route) => route.path === normalized) ?? notFoundRoute
}

export function routeHead(route: RouteDefinition) {
  const canonical = route.index ? absoluteUrl(route.path) : absoluteUrl('/404.html')
  return {
    ...route,
    canonical,
    robots: route.index ? 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' : 'noindex,follow',
    socialImage: absoluteUrl(media.socialImage),
    siteName: restaurant.name,
  }
}
