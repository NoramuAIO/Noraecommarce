import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${BASE_URL}/free`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/support`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ]

  // Ürünleri çek
  let productPages: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${API_URL}/products`, { next: { revalidate: 3600 } })
    if (res.ok) {
      const products = await res.json()
      productPages = products.map((product: any) => ({
        url: `${BASE_URL}/products/${product.slug || product.id}`,
        lastModified: new Date(product.updatedAt || product.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Sitemap: Ürünler yüklenemedi')
  }

  // Blog yazılarını çek
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${API_URL}/blog`, { next: { revalidate: 3600 } })
    if (res.ok) {
      const posts = await res.json()
      blogPages = posts.map((post: any) => ({
        url: `${BASE_URL}/blog/${post.slug || post.id}`,
        lastModified: new Date(post.updatedAt || post.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.error('Sitemap: Blog yazıları yüklenemedi')
  }

  return [...staticPages, ...productPages, ...blogPages]
}
