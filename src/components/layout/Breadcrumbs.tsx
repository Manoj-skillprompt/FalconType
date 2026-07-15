import { Link, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  name: string
  url: string
}

const ROUTE_NAMES: Record<string, string> = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/leaderboard': 'Leaderboard',
  '/settings': 'Settings',
}

export function Breadcrumbs() {
  const location = useLocation()

  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    if (location.pathname === '/') return []

    const items: BreadcrumbItem[] = [
      { name: 'Home', url: '/' },
    ]

    const segments = location.pathname.split('/').filter(Boolean)
    let currentPath = ''

    for (const segment of segments) {
      currentPath += `/${segment}`
      const name = ROUTE_NAMES[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1)
      items.push({ name, url: currentPath })
    }

    return items
  }, [location.pathname])

  if (breadcrumbs.length === 0) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className="w-full max-w-[1100px] mx-auto px-4 py-2"
    >
      <ol className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <li key={item.url} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight size={12} className="opacity-40" aria-hidden="true" />
              )}
              {isLast ? (
                <span aria-current="page" className="text-[var(--text-primary)] font-medium">
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.url}
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
