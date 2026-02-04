'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, AlertCircle, Loader2, Mail, ArrowLeft } from 'lucide-react'
import { api } from '@/lib/api'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Doğrulama bağlantısı bulunamadı.')
      return
    }

    const verifyEmail = async () => {
      try {
        const result = await api.verifyEmail(token)
        setStatus('success')
        setMessage(result.message)
        
        // 3 saniye sonra login sayfasına yönlendir
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } catch (error: any) {
        setStatus('error')
        setMessage(error.message || 'E-posta doğrulanamadı. Lütfen tekrar deneyin.')
      }
    }

    verifyEmail()
  }, [token, router])

  const handleResendEmail = async () => {
    if (!email) {
      setMessage('Lütfen e-posta adresinizi girin.')
      return
    }

    setResendLoading(true)
    try {
      const result = await api.resendVerificationEmail(email)
      setMessage(result.message)
      setStatus('success')
    } catch (error: any) {
      setMessage(error.message || 'E-posta gönderilemedi. Lütfen tekrar deneyin.')
      setStatus('error')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Ana Sayfaya Dön</span>
        </Link>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {status === 'loading' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center"
              >
                <Loader2 className="w-8 h-8 text-white" />
              </motion.div>
            )}
            {status === 'success' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center"
              >
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center"
              >
                <AlertCircle className="w-8 h-8 text-red-400" />
              </motion.div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            {status === 'loading' && 'E-postanız Doğrulanıyor...'}
            {status === 'success' && 'E-postanız Doğrulandı! ✓'}
            {status === 'error' && 'Doğrulama Başarısız'}
          </h1>

          {/* Message */}
          <p className={`text-center mb-6 ${
            status === 'success' ? 'text-emerald-400' : 
            status === 'error' ? 'text-red-400' : 
            'text-gray-400'
          }`}>
            {message}
          </p>

          {/* Resend Form (Error State) */}
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 mb-6"
            >
              <div>
                <label className="text-sm text-gray-400 mb-2 block">E-posta Adresiniz</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
              </div>

              <motion.button
                onClick={handleResendEmail}
                disabled={resendLoading}
                whileHover={{ scale: resendLoading ? 1 : 1.01 }}
                whileTap={{ scale: resendLoading ? 1 : 0.99 }}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-medium text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  'Doğrulama E-postasını Yeniden Gönder'
                )}
              </motion.button>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {status === 'success' && (
              <>
                <motion.button
                  onClick={() => router.push('/login')}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-medium text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow"
                >
                  Giriş Yap
                </motion.button>
                <motion.button
                  onClick={() => router.push('/')}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex-1 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl font-medium text-white hover:border-violet-500/30 transition-colors"
                >
                  Ana Sayfa
                </motion.button>
              </>
            )}
            {status === 'error' && !email && (
              <Link
                href="/login"
                className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-medium text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow text-center"
              >
                Giriş Sayfasına Dön
              </Link>
            )}
          </div>

          {/* Info Box */}
          {status === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
            >
              <p className="text-sm text-blue-400">
                💡 Doğrulama işlemi tamamlanıyor. Lütfen bekleyin...
              </p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
            >
              <p className="text-sm text-emerald-400">
                ✓ Hesabınız başarıyla etkinleştirildi. Giriş yapabilirsiniz.
              </p>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
            >
              <p className="text-sm text-red-400">
                ⚠️ Doğrulama bağlantısının süresi dolmuş olabilir. Lütfen yeni bir doğrulama e-postası isteyin.
              </p>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Sorun yaşıyor musunuz?{' '}
          <Link href="/support" className="text-violet-400 hover:text-violet-300 font-medium">
            Destek Alın
          </Link>
        </p>
      </motion.div>
    </main>
  )
}
