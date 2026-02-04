'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { RotateCcw, Clock, CheckCircle, XCircle, AlertCircle, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const refundSteps = [
  { step: 1, title: 'Talep Oluştur', description: 'Destek sayfasından iade talebi oluşturun' },
  { step: 2, title: 'İnceleme', description: 'Talebiniz 24 saat içinde incelenir' },
  { step: 3, title: 'Onay', description: 'Uygun görülürse iade onaylanır' },
  { step: 4, title: 'Ödeme', description: '3-5 iş günü içinde iade yapılır' },
]

const eligibleCases = [
  'Satın alma tarihinden itibaren 7 gün içinde',
  'Ürün henüz kullanılmamışsa',
  'Lisans aktif edilmemişse',
  'Teknik sorun çözülemezse',
]

const nonEligibleCases = [
  '7 günden fazla süre geçmişse',
  'Ürün kullanılmış veya lisans aktif edilmişse',
  'İndirimli satın alınan ürünler',
  'Bakiye yüklemeleri',
  'Kullanım şartları ihlal edilmişse',
]

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-dark">
      <Header />
      
      <section className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-500/10 flex items-center justify-center"
            >
              <RotateCcw className="w-8 h-8 text-amber-400" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              İade Politikası
            </h1>
            <p className="text-gray-400">
              Müşteri memnuniyeti bizim için önemlidir
            </p>
          </motion.div>

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">7 Gün İade Garantisi</h2>
                <p className="text-gray-400 leading-relaxed">
                  Satın aldığınız ürünlerden memnun kalmazsanız, satın alma tarihinden itibaren 7 gün içinde 
                  iade talebinde bulunabilirsiniz. Koşulları karşılayan talepler tam iade ile sonuçlanır.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Refund Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-6">İade Süreci</h2>
            <div className="grid sm:grid-cols-4 gap-4">
              {refundSteps.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <span className="text-violet-400 font-bold">{item.step}</span>
                  </div>
                  <h3 className="font-medium text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Eligible / Non-Eligible */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Eligible */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">İade Yapılabilir</h2>
              </div>
              <ul className="space-y-3">
                {eligibleCases.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-400">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Non-Eligible */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">İade Yapılamaz</h2>
              </div>
              <ul className="space-y-3">
                {nonEligibleCases.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-400">
                    <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Important Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card p-6 mb-8 border-amber-500/20"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Önemli Bilgi</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  İade işlemi onaylandıktan sonra ödeme, kullandığınız ödeme yöntemine göre 3-5 iş günü içinde 
                  hesabınıza yansır. Kredi kartı iadeleri bankanıza bağlı olarak daha uzun sürebilir. 
                  Bakiye olarak iade tercih ederseniz anında hesabınıza eklenir.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="text-gray-400 mb-4">İade talebi oluşturmak için destek ekibimizle iletişime geçin</p>
            <Link href="/support">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-medium text-white transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Destek Al
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
