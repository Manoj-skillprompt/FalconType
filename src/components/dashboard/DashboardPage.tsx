import { SEO } from '@/components/seo/SEO'
import { JsonLd } from '@/components/seo/JsonLd'
import { websiteJsonLd, breadcrumbJsonLd } from '@/lib/structuredData'
import { Dashboard } from '@/components/dashboard/Dashboard'

export function DashboardPage() {
  return (
    <>
      <SEO />
      <JsonLd
        data={[
          websiteJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', url: 'https://falcontype.com/' },
            { name: 'Dashboard', url: 'https://falcontype.com/dashboard' },
          ]),
        ]}
      />

      <section aria-label="Dashboard">
        <h1 className="sr-only">Your Typing Dashboard</h1>
        <Dashboard />
      </section>
    </>
  )
}
