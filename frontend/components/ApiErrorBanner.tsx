'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, MessageCircle } from 'lucide-react'
import { useState } from 'react'

interface Props {
  show: boolean
}

export default function ApiErrorBanner({ show }: Props) {
  const [dismissed, setDismissed] = useState(false)

  if (!show || dismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative mx-4 max-w-md w-full bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-amber-500/30 rounded-2xl p-6 shadow-2xl shadow-amber-500/10"
        >
          {/* Close Button */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full">
              <AlertTriangle className="w-10 h-10 text-amber-400" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">
              Sunucuya Bağlanılamadı
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Şu an bakım yapıyor olabiliriz. Kusura bakmayın, en kısa sürede döneceğiz! 
              Güncel bilgiler için Discord sunucumuza katılabilirsiniz.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://discord.gg/dZPxj7MKNH"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-xl text-white font-medium transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Discord'a Katıl
            </a>
            <button
              onClick={() => setDismissed(true)}
              className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-all"
            >
              Kapat
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
