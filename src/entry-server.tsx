import { renderToString } from 'react-dom/server'
import App from './App'
import { getRoute, routeHead } from './seo/routes'
import { allRoutes } from './seo/routes'
import { serializeStructuredData, structuredDataForRoute } from './seo/structuredData'
import { restaurant } from './data/restaurant'

export function render(pathname: string) {
  return renderToString(<App pathname={pathname} />)
}

export function getPageData(pathname: string) {
  const route = getRoute(pathname)
  return {
    route,
    head: routeHead(route),
    structuredData: serializeStructuredData(structuredDataForRoute(route)),
  }
}

export function getBuildData() {
  return {
    routes: allRoutes,
    site: {
      name: restaurant.name,
      canonicalUrl: restaurant.canonicalUrl,
      description: restaurant.shortDescription,
    },
  }
}
