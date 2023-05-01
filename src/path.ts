import { type RouteData } from 'astro'

/**
 * Extracts HTML paths from Astro routes
 */
export function extractPaths (routes: RouteData[]): string[] {
  const paths = []
  for (const route of routes) {
    if (route.distURL?.pathname.endsWith('.html')) {
      paths.push(route.distURL.pathname)
    }
  }
  return paths
}
