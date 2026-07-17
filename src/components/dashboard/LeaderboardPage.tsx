import { SEO } from '@/components/seo/SEO'
import { JsonLd } from '@/components/seo/JsonLd'
import { websiteJsonLd, breadcrumbJsonLd } from '@/lib/structuredData'
import { Leaderboard } from '@/components/dashboard/Leaderboard'

export function LeaderboardPage() {
  return (
    <>
      <SEO />
      <JsonLd
        data={[
          websiteJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', url: 'https://falcontype.com/' },
            { name: 'Leaderboard', url: 'https://falcontype.com/leaderboard' },
          ]),
        ]}
      />

      <section aria-label="Leaderboard">
        <h1 className="sr-only">falconType Leaderboard</h1>
        <Leaderboard />
      </section>
    </>
  )
}
