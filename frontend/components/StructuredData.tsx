'use client'

import { useSite } from '@/lib/site-context'

interface OrganizationData {
  name: string
  url: string
  logo?: string
  description?: string
  email?: string
  sameAs?: string[]
}

interface ProductData {
  name: string
  description: string
  image?: string
  price: number
  currency?: string
  availability?: 'InStock' | 'OutOfStock'
  url: string
}

interface ArticleData {
  title: string
  description: string
  image?: string
  datePublished: string
  dateModified?: string
  author: string
  url: string
}

export function OrganizationSchema() {
  const { settings, getImageUrl } = useSite()
  
  const data: OrganizationData = {
    name: settings.siteName || 'Noramu',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    logo: settings.siteLogo ? getImageUrl(settings.siteLogo) : undefined,
    description: settings.siteDescription,
    email: settings.contactEmail,
    sameAs: settings.discordLink ? [settings.discordLink] : [],
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
    email: data.email,
    sameAs: data.sameAs,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebsiteSchema() {
  const { settings } = useSite()
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.siteName || 'Noramu',
    url: baseUrl,
    description: settings.siteDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ProductSchema({ product }: { product: ProductData }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'TRY',
      availability: product.availability === 'OutOfStock' 
        ? 'https://schema.org/OutOfStock' 
        : 'https://schema.org/InStock',
      url: product.url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ArticleSchema({ article }: { article: ArticleData }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
