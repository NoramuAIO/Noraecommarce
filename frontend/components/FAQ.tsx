'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Loader2 } from 'lucide-react'
import api from '@/lib/api'

export default function FAQ() {
  const [faqs, setFaqs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useEffect(() => {
    loadFaqs()
  }, [])

  const loadFaqs = async () => {
    try {
      const data = await api.getFaqs()
      setFaqs(data.slice(0, 5)) // İlk 5 soru
    } catch (error) {
      console.error('SSS yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="faq" className="py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-violet-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            SSS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-gray-400">
            Merak ettiğiniz soruların cevaplarını burada bulabilirsiniz.
          </p>
        </motion.div>

        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={`w-full glass-card p-5 flex items-center justify-between text-left transition-all duration-300 ${
                  openIndex === index ? 'border-violet-500/30' : ''
                }`}
              >
                <span className="font-medium text-white pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-violet-400' : ''
                  }`} 
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 py-4 text-gray-400 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
