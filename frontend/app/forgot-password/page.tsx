'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import api from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.forgotPassword(email)
      setSent(true)
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

          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">E-posta Gönderildi!</h2>
              <p className="text-gray-400 mb-6">
                Eğer bu e-posta adresine kayıtlı bir hesap varsa, şifre sıfırlama bağlantısı gönderildi.
              </p>
              <p className="text-sm text-gray-500">
                E-postayı göremiyorsanız spam klasörünü kontrol edin.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                  <Mail className="w-7 h-7 text-violet-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Şifremi Unuttum</h1>
                <p className="text-gray-400">
                  E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">E-posta Adresi</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="ornek@email.com"
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
                      Gönderiliyor...
                    </>
                  ) : (
                    'Sıfırlama Bağlantısı Gönder'
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
