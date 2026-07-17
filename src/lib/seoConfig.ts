const SITE_URL = 'https://falcontype.com'
const SITE_NAME = 'falconType'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

export interface PageSEO {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogType?: string
  keywords?: string[]
  noindex?: boolean
  breadcrumbs?: { name: string; url: string }[]
}

export const siteConfig = {
  name: SITE_NAME,
  url: SITE_URL,
  title: 'falconType — Free Online Typing Speed Test',
  description:
    'Improve your typing speed with falconType. Free, open-source typing test with real-time WPM tracking, multiple themes, custom text, and detailed performance analytics.',
  ogImage: DEFAULT_IMAGE,
  twitterHandle: '@falcontype',
  keywords: [
    'typing test',
    'typing speed',
    'wpm test',
    'words per minute',
    'typing practice',
    'keyboard test',
    'typing tutor',
    'free typing test',
    'online typing',
    'speed typing',
  ],
}

export const pages: Record<string, PageSEO> = {
  '/': {
    title: 'falconType — Free Online Typing Speed Test',
    description:
      'Test your typing speed with falconType. Real-time WPM tracking, accuracy metrics, multiple test modes, and detailed performance charts. Free and open-source.',
    canonical: SITE_URL,
    keywords: [
      'typing test',
      'wpm test',
      'speed test',
      'typing practice',
      'words per minute',
    ],
    breadcrumbs: [{ name: 'Home', url: SITE_URL }],
  },
  '/dashboard': {
    title: 'Dashboard — falconType Typing Stats & Progress',
    description:
      'Track your typing progress with detailed analytics. View WPM trends, accuracy history, activity heatmap, personal bests, and unlock achievements.',
    canonical: `${SITE_URL}/dashboard`,
    keywords: [
      'typing stats',
      'wpm progress',
      'typing dashboard',
      'typing analytics',
    ],
    breadcrumbs: [
      { name: 'Home', url: SITE_URL },
      { name: 'Dashboard', url: `${SITE_URL}/dashboard` },
    ],
  },
  '/leaderboard': {
    title: 'Leaderboard — falconType Top Typists',
    description:
      'See the top typists on falconType. Compare your WPM and accuracy against global, weekly, monthly, and all-time leaderboard rankings.',
    canonical: `${SITE_URL}/leaderboard`,
    keywords: [
      'typing leaderboard',
      'fastest typists',
      'typing rankings',
      'wpm leaderboard',
    ],
    breadcrumbs: [
      { name: 'Home', url: SITE_URL },
      { name: 'Leaderboard', url: `${SITE_URL}/leaderboard` },
    ],
  },
  '/settings': {
    title: 'Settings — falconType Typing Preferences',
    description:
      'Customize your falconType experience. Choose themes, fonts, caret styles, adjust typing modes, sound settings, and appearance preferences.',
    canonical: `${SITE_URL}/settings`,
    noindex: true,
    breadcrumbs: [
      { name: 'Home', url: SITE_URL },
      { name: 'Settings', url: `${SITE_URL}/settings` },
    ],
  },
}

export function getPageSEO(pathname: string): PageSEO {
  const path = pathname === '/' ? '/' : pathname.replace(/\/$/, '')
  return (
    pages[path] || {
      title: `${SITE_NAME} — Typing Test`,
      description: siteConfig.description,
      canonical: `${SITE_URL}${path}`,
    }
  )
}

export function getOgImageUrl(pathname: string): string {
  return `${SITE_URL}/og-image.png`
}
