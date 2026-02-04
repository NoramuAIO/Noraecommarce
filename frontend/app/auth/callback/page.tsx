'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setTokenFromOAuth } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (token) {
      // Token'ı kaydet ve kullanıcıyı yönlendir
      setTokenFromOAuth(token)
      router.push('/profile')
    } else {
      // Hata durumunda login sayfasına yönlendir
      router.push('/login?error=oauth_failed')
    }
  }, [searchParams, router, setTokenFromOAuth])

  return (
    <main className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-violet-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Giriş yapılıyor...</p>
      </div>
    </main>
  )
}
