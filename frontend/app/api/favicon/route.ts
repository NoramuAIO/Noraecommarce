import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
    const res = await fetch(`${API_URL}/settings/public`, { next: { revalidate: 60 } })
    
    if (res.ok) {
      const data = await res.json()
      if (data.siteFavicon) {
        const API_BASE = API_URL.replace('/api', '')
        const faviconUrl = data.siteFavicon.startsWith('/') 
          ? `${API_BASE}${data.siteFavicon}` 
          : data.siteFavicon
        
        // Favicon'a redirect yap
        return NextResponse.redirect(faviconUrl)
      }
    }
  } catch (error) {
    console.error('Favicon fetch error:', error)
  }
  
  // Varsayılan boş favicon (1x1 transparent PNG)
  const emptyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64')
  
  return new NextResponse(emptyPng, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
