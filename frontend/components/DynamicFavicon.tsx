'use client'

import { useEffect, useState } from 'react'
import { useSite } from '@/lib/site-context'
import Head from 'next/head'

export default function DynamicFavicon() {
  const { settings, getImageUrl } = useSite()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    if (settings.siteFavicon) {
      const faviconUrl = getImageUrl(settings.siteFavicon)
      
      // Sadece href'i güncelle, element oluşturma/silme yapma
      let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      if (link) {
        link.href = faviconUrl
      } else {
        link = document.createElement('link')
        link.rel = 'icon'
        link.href = faviconUrl
        document.head.appendChild(link)
      }
    }
  }, [settings.siteFavicon, getImageUrl, mounted])

  return null
}
