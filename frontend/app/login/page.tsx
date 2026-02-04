'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Sparkles, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useSite } from '@/lib/site-context'
import { api } from '@/lib/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const { settings } = useSite()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showResendForm, setShowResendForm] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam === 'oauth_failed') {
      setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setShowResendForm(false)

    try {
      await login(formData.email, formData.password, rememberMe)
      router.push('/profile')
    } catch (err: any) {
      const errorMessage = err.message || 'Giriş yapılırken bir hata oluştu'
      setError(errorMessage)
      
      // E-posta doğrulama hatası ise resend formunu göster
      if (errorMessage.includes('e-postanızı doğrulayın')) {
        setShowResendForm(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async () => {
    if (!formData.email) {
      setError('Lütfen e-posta adresinizi girin.')
      return
    }

    setResendLoading(true)
    try {
      const result = await api.resendVerificationEmail(formData.email)
      setError('')
      setShowResendForm(false)
      alert(result.message)
    } catch (err: any) {
      setError(err.message || 'E-posta gönderilemedi. Lütfen tekrar deneyin.')
    } finally {
      setResendLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/oauth/google`
  }

  const handleDiscordLogin = () => {
    window.location.href = `${API_URL}/auth/oauth/discord`
  }

  const showSocialLogin = settings.googleLoginEnabled || settings.discordLoginEnabled

  return (
    <main className="min-h-screen bg-dark flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Back & Logo */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-violet-500/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <Link href="/" className="text-2xl font-bold text-white">Noramu</Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Hoş Geldiniz</h1>
            <p className="text-gray-400">Hesabınıza giriş yapın</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-xl text-sm flex gap-3 ${
                showResendForm 
                  ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' 
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p>{error}</p>
                {showResendForm && (
                  <p className="text-xs mt-2 opacity-80">
                    Doğrulama e-postasını yeniden göndermek için aşağıdaki butona tıklayın.
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/[0.03] text-violet-600 focus:ring-violet-500" 
                />
                <span className="text-sm text-gray-400">Beni hatırla</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-violet-400 hover:text-violet-300">
                Şifremi unuttum
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-medium text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </motion.button>

            {/* Resend Email Button */}
            {showResendForm && (
              <motion.button
                type="button"
                onClick={handleResendEmail}
                disabled={resendLoading}
                whileHover={{ scale: resendLoading ? 1 : 1.01 }}
                whileTap={{ scale: resendLoading ? 1 : 0.99 }}
                className="w-full py-3 mt-3 bg-amber-500/10 border border-amber-500/30 rounded-xl font-medium text-amber-400 hover:bg-amber-500/20 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
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
            )}
          </form>

          {/* Divider */}
          {showSocialLogin && (
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-sm text-gray-500">veya</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>
          )}

          {/* Social Login */}
          {showSocialLogin && (
            <div className={`grid gap-3 ${settings.googleLoginEnabled && settings.discordLoginEnabled ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {settings.googleLoginEnabled && (
                <button 
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-2 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white hover:border-violet-500/30 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google ile Giriş
                </button>
              )}
              {settings.discordLoginEnabled && (
                <button 
                  onClick={handleDiscordLogin}
                  className="flex items-center justify-center gap-2 py-3 bg-[#5865F2]/10 border border-[#5865F2]/30 rounded-xl text-white hover:bg-[#5865F2]/20 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                  Discord ile Giriş
                </button>
              )}
            </div>
          )}

          {/* Register Link */}
          <p className="text-center text-gray-400 mt-8">
            Hesabınız yok mu?{' '}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 font-medium">
              Kayıt Ol
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-center p-12"
        >
          <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-2xl shadow-violet-500/30">
            <Sparkles className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Premium Pluginler</h2>
          <p className="text-gray-400 max-w-sm">
            Minecraft sunucunuz için en kaliteli pluginlere erişin
          </p>
        </motion.div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 right-20 text-6xl"
        >
          ⚡
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-32 left-20 text-5xl"
        >
          🎮
        </motion.div>
      </div>
    </main>
  )
}
