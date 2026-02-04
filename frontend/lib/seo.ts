import { Metadata } from 'next'

// SEO Config - .env dosyasından okunur
export const seoConfig = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Noramu',
  siteDescription: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Premium Minecraft Pluginleri',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  siteKeywords: process.env.NEXT_PUBLIC_SITE_KEYWORDS?.split(',') || ['minecraft', 'plugin'],
  
  // Open Graph
  ogImage: process.env.NEXT_PUBLIC_OG_IMAGE || '/og-image.jpg',
  
  // Twitter
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '',
  
  // Verification
  googleVerification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
  bingVerification: process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
  yandexVerification: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '',
}

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: string
  noIndex?: boolean
}

export function generateSEO(props: SEOProps = {}): Metadata {
  const title = props.title 
    ? `${props.title} | ${seoConfig.siteName}`
    : seoConfig.siteName
  
  const description = props.description || seoConfig.siteDescription
  const image = props.image || seoConfig.ogImage
  const url = props.url || seoConfig.siteUrl
  const keywords = props.keywords || seoConfig.siteKeywords

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: seoConfig.siteName }],
    creator: seoConfig.siteName,
    publisher: seoConfig.siteName,
    robots: props.noIndex ? 'noindex, nofollow' : 'index, follow',
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: (props.type as any) || 'website',
      locale: 'tr_TR',
      url,
      title,
      description,
      siteName: seoConfig.siteName,
      images: [
        {
          url: image.startsWith('http') ? image : `${seoConfig.siteUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.startsWith('http') ? image : `${seoConfig.siteUrl}${image}`],
      creator: seoConfig.twitterHandle,
      site: seoConfig.twitterHandle,
    },
  }
}

// Ürün için SEO
export function generateProductSEO(product: {
  name: string
  description: string
  image?: string
  price: number
  slug: string
}): Metadata {
  return generateSEO({
    title: product.name,
    description: product.description?.substring(0, 160),
    image: product.image,
    url: `${seoConfig.siteUrl}/products/${product.slug}`,
    type: 'product',
  })
}

// Blog için SEO
export function generateBlogSEO(post: {
  title: string
  excerpt?: string
  image?: string
  slug: string
}): Metadata {
  return generateSEO({
    title: post.title,
    description: post.excerpt?.substring(0, 160),
    image: post.image,
    url: `${seoConfig.siteUrl}/blog/${post.slug}`,
    type: 'article',
  })
}
