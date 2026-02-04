import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/profile', '/tickets'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
