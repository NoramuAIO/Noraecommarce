'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ChevronDown, Search, MessageCircle, HelpCircle, CreditCard, Shield, Zap, Loader2 } from 'lucide-react'
import api from '@/lib/api'

const faqCategories = [
  { id: 'all', name: 'Tümü', icon: HelpCircle },
  { id: 'general', name: 'Genel', icon: MessageCircle },
  { id: 'payment', name: 'Ödeme', icon: CreditCard },
  { id: 'technical', name: 'Teknik', icon: Zap },
  { id: 'security', name: 'Güvenlik', icon: Shield },
]

export default function FAQPage() {
  const [faqs, setFaqs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [openId, setOpenId] = useState<number | null>(null)

  useEffect(() => {
    loadFaqs()
  }, [])

  const loadFaqs = async () => {
    try {
      const data = await api.getFaqs()
      setFaqs(data)
      if (data.length > 0) setOpenId(data[0].id)
    } catch (error) {
      console.error('SSS yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <main className="min-h-screen bg-dark">
      <Header />
      
      <section className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <HelpCircle className="w-8 h-8 text-violet-400" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Sıkça Sorulan Sorular
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Merak ettiğiniz tüm soruların cevaplarını burada bulabilirsiniz
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative mb-8"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Soru ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {faqCategories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                  selectedCategory === category.id
                    ? 'bg-violet-600 border-violet-600 text-white'
                    : 'bg-white/[0.03] border-white/[0.08] text-gray-300 hover:border-violet-500/30'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span className="font-medium text-sm">{category.name}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* FAQ List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <AnimatePresence mode="wait">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.03 }}
                  layout
                >
                  <motion.button
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className={`w-full glass-card p-5 flex items-center justify-between text-left transition-all duration-300 ${
                      openId === faq.id ? 'border-violet-500/30' : ''
                    }`}
                    whileHover={{ scale: 1.005 }}
                  >
                    <span className="font-medium text-white pr-4">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openId === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className={`w-5 h-5 flex-shrink-0 ${
                        openId === faq.id ? 'text-violet-400' : 'text-gray-400'
                      }`} />
                    </motion.div>
                  </motion.button>
                  <AnimatePresence>
                    {openId === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 py-4 text-gray-400 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          )}

          {/* Empty State */}
          {!loading && filteredFaqs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <HelpCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Aramanızla eşleşen soru bulunamadı.</p>
            </motion.div>
          )}

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
            <div className="glass-card p-8">
              <h3 className="text-xl font-semibold text-white mb-2">
                Sorunuz hala cevaplanmadı mı?
              </h3>
              <p className="text-gray-400 mb-6">
                Destek ekibimiz size yardımcı olmaktan mutluluk duyar
              </p>
              <motion.a
                href="/support"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-medium text-white transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Destek Al
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
