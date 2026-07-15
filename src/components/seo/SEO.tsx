import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { getPageSEO, siteConfig, getOgImageUrl } from '@/lib/seoConfig'

interface SEOProps {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: string
  keywords?: string[]
  noindex?: boolean
}

export function SEO({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  keywords,
  noindex,
}: SEOProps = {}) {
  const location = useLocation()
  const pageSEO = getPageSEO(location.pathname)

  const finalTitle = title || pageSEO.title || siteConfig.title
  const finalDescription = description || pageSEO.description || siteConfig.description
  const finalCanonical = canonical || pageSEO.canonical || siteConfig.url
  const finalOgImage = ogImage || getOgImageUrl(location.pathname)
  const finalKeywords = keywords || pageSEO.keywords || siteConfig.keywords
  const finalNoindex = noindex ?? pageSEO.noindex ?? false

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={finalCanonical} />

      {finalNoindex && <meta name="robots" content="noindex, nofollow" />}
      {!finalNoindex && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />}

      <meta name="keywords" content={finalKeywords.join(', ')} />
      <meta name="author" content="FalconType Contributors" />
      <meta name="language" content="en" />
      <meta name="theme-color" content="#1e1e2e" />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalOgImage} />
      {siteConfig.twitterHandle && (
        <meta name="twitter:site" content={siteConfig.twitterHandle} />
      )}

      {/* Additional SEO meta */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="UTF-8" />
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <link rel="alternate" hrefLang="en" href={finalCanonical} />
      <link rel="alternate" hrefLang="x-default" href={finalCanonical} />

      {/* Preconnect to external origins */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  )
}
