'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Lock, ArrowLeft, Loader2, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react'
import api from '@/lib/api'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setError('Geçersiz sıfırlama bağlantısı.')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.')
      return
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.')
      return
    }

    setLoading(true)

    try {
      await api.resetPassword(token!, password)
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          <Link href="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Giriş sayfasına dön
          </Link>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Şifre Güncellendi!</h2>
              <p className="text-gray-400 mb-4">
                Şifreniz başarıyla değiştirildi. Giriş sayfasına yönlendiriliyorsunuz...
              </p>
              <Loader2 className="w-5 h-5 text-violet-400 animate-spin mx-auto" />
            </motion.div>
          ) : !token ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Geçersiz Bağlantı</h2>
              <p className="text-gray-400 mb-6">
                Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.
              </p>
              <Link href="/forgot-password">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium transition-colors"
                >
                  Yeni Bağlantı İste
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-violet-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Yeni Şifre Belirle</h1>
                <p className="text-gray-400">
                  Hesabınız için yeni bir şifre oluşturun.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Yeni Şifre</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Şifre Tekrar</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-medium text-white disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Güncelleniyor...
                    </>
                  ) : (
                    'Şifremi Güncelle'
                  )}
                </motion.button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </main>
  )
}
