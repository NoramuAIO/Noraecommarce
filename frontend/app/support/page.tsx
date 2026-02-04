'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { 
  MessageCircle, 
  Mail, 
  Send, 
  HelpCircle, 
  FileText, 
  Bug, 
  CreditCard,
  ExternalLink,
  Clock,
  CheckCircle2,
  Loader2
} from 'lucide-react'
import api from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { useSite } from '@/lib/site-context'
import { useToast } from '@/components/Toast'

const defaultCategories = [
  { id: 'general', name: 'Genel Soru', icon: HelpCircle, color: 'bg-blue-500/10 text-blue-400' },
  { id: 'technical', name: 'Teknik Destek', icon: Bug, color: 'bg-red-500/10 text-red-400' },
  { id: 'billing', name: 'Ödeme/Fatura', icon: CreditCard, color: 'bg-emerald-500/10 text-emerald-400' },
  { id: 'other', name: 'Diğer', icon: FileText, color: 'bg-violet-500/10 text-violet-400' },
]

export default function SupportPage() {
  const { user } = useAuth()
  const { settings } = useSite()
  const { showToast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [stats, setStats] = useState<{ avgResponseTime: number | null, todayResolved: number | null, hasTicketStats: boolean }>({ 
    avgResponseTime: null, 
    todayResolved: null,
    hasTicketStats: false 
  })

  const quickLinks = [
    { name: 'Sıkça Sorulan Sorular', href: '/faq', icon: HelpCircle },
    { name: 'İade Politikası', href: '/refund', icon: FileText },
    { name: settings.discordName, href: settings.discordLink, icon: MessageCircle },
  ]

  useEffect(() => {
    loadStats()
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }))
    }
  }, [user])

  const loadStats = async () => {
    try {
      const data = await api.getPublicStats()
      setStats({
        avgResponseTime: data.avgResponseTime,
        todayResolved: data.todayResolved,
        hasTicketStats: data.hasTicketStats || false
      })
    } catch (error) {
      // Veri yok
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) {
      showToast('Lütfen bir kategori seçin', 'warning')
      return
    }
    
    setSubmitting(true)
    try {
      await api.createTicket({
        subject: formData.subject,
        message: formData.message,
        category: selectedCategory,
        priority: 'normal'
      })
      setIsSubmitted(true)
    } catch (error: any) {
      showToast(error.message || 'Talep gönderilemedi. Lütfen giriş yapın.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-dark">
      <Header />
      
      <section className="pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-violet-500/10 flex items-center justify-center"
            >
              <MessageCircle className="w-8 h-8 text-violet-400" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Destek Merkezi
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Size nasıl yardımcı olabiliriz? Sorularınız için buradayız.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-3 gap-4 mb-12"
          >
            {quickLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card p-5 flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <link.icon className="w-5 h-5 text-violet-400" />
                </div>
                <span className="font-medium text-white flex-1">{link.name}</span>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-violet-400 transition-colors" />
              </motion.a>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="glass-card p-6 sm:p-8">
                {!isSubmitted ? (
                  <>
                    <h2 className="text-xl font-semibold text-white mb-6">Destek Talebi Oluştur</h2>
                    
                    {/* Category Selection */}
                    <div className="mb-6">
                      <label className="text-sm text-gray-400 mb-3 block">Kategori Seçin</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {defaultCategories.map((category) => (
                          <motion.button
                            key={category.id}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`p-3 rounded-xl border transition-all text-center ${
                              selectedCategory === category.id
                                ? 'bg-violet-600/20 border-violet-500'
                                : 'bg-white/[0.02] border-white/[0.08] hover:border-violet-500/30'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center mx-auto mb-2`}>
                              <category.icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm text-white">{category.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Adınız</label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                            placeholder="Adınızı girin"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">E-posta</label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                            placeholder="ornek@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Konu</label>
                        <input
                          type="text"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                          placeholder="Destek talebinizin konusu"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Mesajınız</label>
                        <textarea
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
                          placeholder="Sorununuzu veya sorunuzu detaylı açıklayın..."
                        />
                      </div>

                      <motion.button
                        type="submit"
                        disabled={submitting}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-medium text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        {submitting ? 'Gönderiliyor...' : 'Gönder'}
                      </motion.button>
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </motion.div>
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      Talebiniz Alındı!
                    </h3>
                    <p className="text-gray-400 mb-6">
                      En kısa sürede size dönüş yapacağız.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsSubmitted(false)
                        setFormData({ name: '', email: '', subject: '', message: '' })
                        setSelectedCategory('')
                      }}
                      className="px-6 py-3 glass-card text-white font-medium"
                    >
                      Yeni Talep Oluştur
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Right - Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Response Time - sadece veri varsa göster */}
              {stats.hasTicketStats && (
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Yanıt Süresi</h3>
                      {stats.avgResponseTime !== null && (
                        <p className="text-sm text-gray-500">Ortalama {stats.avgResponseTime} dakika</p>
                      )}
                    </div>
                  </div>
                  {stats.todayResolved !== null && (
                    <>
                      <div className="flex gap-2">
                        <div className="flex-1 h-2 bg-emerald-500/20 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.todayResolved}%` }} />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Bugün %{stats.todayResolved} talep yanıtlandı</p>
                    </>
                  )}
                </div>
              )}

              {/* Contact Info */}
              <div className="glass-card p-6">
                <h3 className="font-medium text-white mb-4">İletişim</h3>
                <div className="space-y-4">
                  <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                    <span>{settings.contactEmail}</span>
                  </a>
                  <a href={settings.discordLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>{settings.discordName}</span>
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="glass-card p-6">
                <h3 className="font-medium text-white mb-4">Çalışma Saatleri</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pazartesi - Cuma</span>
                    <span className={settings.workingHoursWeekday.toLowerCase() === 'kapalı' ? 'text-red-400' : 'text-white'}>
                      {settings.workingHoursWeekday}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cumartesi</span>
                    <span className={settings.workingHoursSaturday.toLowerCase() === 'kapalı' ? 'text-red-400' : 'text-white'}>
                      {settings.workingHoursSaturday}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pazar</span>
                    <span className={settings.workingHoursSunday.toLowerCase() === 'kapalı' ? 'text-red-400' : 'text-white'}>
                      {settings.workingHoursSunday}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm text-emerald-400">Şu an çevrimiçi</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
