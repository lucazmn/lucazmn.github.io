import { useCallback, useEffect, useState } from 'react'

export const ROUTES = [
  '/',
  '/test',
  '/zwanzig-ab',
  '/zwanzig-ab/neu',
  '/zwanzig-ab/spiel',
  '/zwanzig-ab/stiche',
  '/zwanzig-ab/ende',
  '/zwanzig-ab/verlauf',
  '/zwanzig-ab/einstellungen',
  '/zwanzig-ab/bilanz',
] as const

export type Route = (typeof ROUTES)[number]

function readRoute(): Route {
  const hash = window.location.hash.slice(1)
  return ROUTES.includes(hash as Route) ? (hash as Route) : '/'
}

/**
 * Hash-basiertes Routing, weil GitHub Pages keine Rewrites kann und echte
 * Pfade beim Direktaufruf sonst mit 404 enden.
 */
export function useHashRoute() {
  const [route, setRoute] = useState<Route>(readRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = useCallback((next: Route) => {
    window.location.hash = next
  }, [])

  return { route, navigate }
}
