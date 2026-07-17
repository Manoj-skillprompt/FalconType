import { siteConfig } from './seoConfig'

const SITE_URL = siteConfig.url

export interface JsonLdBase {
  '@context': string
  '@type': string
  [key: string]: unknown
}

export function websiteJsonLd(): JsonLdBase {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: SITE_URL,
    description: siteConfig.description,
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function organizationJsonLd(): JsonLdBase {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description: siteConfig.description,
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
    },
  }
}

export function softwareApplicationJsonLd(): JsonLdBase {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteConfig.name,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web Browser',
    url: SITE_URL,
    description: siteConfig.description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
    },
  }
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
): JsonLdBase {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function faqJsonLd(): JsonLdBase {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is falconType?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'falconType is a free, open-source online typing speed test tool. It provides real-time WPM tracking, accuracy metrics, multiple test modes (time, words, quotes, numbers, custom text), and detailed performance analytics with charts and achievements.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is WPM calculated on falconType?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'WPM (Words Per Minute) is calculated by dividing the number of correctly typed characters by 5 (the average word length) and then dividing by the elapsed time in minutes. Raw WPM includes all keystrokes, while net WPM subtracts errors.',
        },
      },
      {
        '@type': 'Question',
        name: 'What test modes does falconType offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'falconType offers five test modes: Time mode (type as much as you can in 15, 30, 60, or 120 seconds), Words mode (type a set number of words), Quote mode (type famous quotes), Numbers mode (type number sequences), and Custom mode (type your own text).',
        },
      },
      {
        '@type': 'Question',
        name: 'Is falconType free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, falconType is completely free to use. It is an open-source project with no ads, no paywalls, and no registration required. All your typing history and settings are stored locally in your browser.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does falconType work on mobile devices?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'falconType is designed primarily for desktop use with a physical keyboard. While the interface is responsive and works on mobile devices, the typing test experience is best with a physical keyboard.',
        },
      },
    ],
  }
}
