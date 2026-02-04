import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import LiveChat from '@/components/LiveChat'
import DynamicFavicon from '@/components/DynamicFavicon'
import PopupModal from '@/components/PopupModal'

const inter = Inter({ subsets: ['latin'] })

// SEO - .env dosyasından okunur
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Noramu'
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Premium Minecraft Pluginleri'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const siteKeywords = process.env.NEXT_PUBLIC_SITE_KEYWORDS?.split(',') || ['minecraft', 'plugin']
const ogImage = process.env.NEXT_PUBLIC_OG_IMAGE || '/og-image.jpg'
const twitterHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE || ''

export const metadata: Metadata = {
  title: {
    default: `${siteName} - Minecraft Plugin Mağazası`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: siteKeywords,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  metadataBase: new URL(siteUrl),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/api/favicon',
    apple: '/api/favicon',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: siteName,
    title: `${siteName} - Minecraft Plugin Mağazası`,
    description: siteDescription,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - Minecraft Plugin Mağazası`,
    description: siteDescription,
    images: [ogImage],
    creator: twitterHandle,
    site: twitterHandle,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
      'yandex-verification': process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '',
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#8b5cf6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Providers>
          <DynamicFavicon />
          {children}
          <LiveChat />
          <PopupModal />
        </Providers>
      </body>
    </html>
  )
}
