import { Helmet } from 'react-helmet-async'
import type { JsonLdBase } from '@/lib/structuredData'

interface JsonLdProps {
  data: JsonLdBase | JsonLdBase[]
}

export function JsonLd({ data }: JsonLdProps) {
  const items = Array.isArray(data) ? data : [data]

  return (
    <Helmet>
      {items.map((item, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </Helmet>
  )
}
