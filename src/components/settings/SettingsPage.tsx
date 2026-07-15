import { SEO } from '@/components/seo/SEO'
import { JsonLd } from '@/components/seo/JsonLd'
import { websiteJsonLd, breadcrumbJsonLd } from '@/lib/structuredData'

export function SettingsPage() {
  return (
    <>
      <SEO />
      <JsonLd
        data={[
          websiteJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', url: 'https://falcontype.com/' },
            { name: 'Settings', url: 'https://falcontype.com/settings' },
          ]),
        ]}
      />

      <section aria-label="Settings" className="w-full max-w-[900px] mx-auto px-4 py-6">
        <h1 className="text-lg font-semibold mb-4">Settings</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Access settings from the header <kbd className="px-1.5 py-0.5 text-xs font-mono rounded bg-[var(--bg-card)] border border-[var(--border)]">Settings</kbd> button.
        </p>
      </section>
    </>
  )
}
