'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import api from '@/lib/api'
import Link from 'next/link'

export default function PopupModal() {
  const [popup, setPopup] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Register sayfasında popup gösterme
    const isRegisterPage = typeof window !== 'undefined' && window.location.pathname === '/register'
    if (isRegisterPage) {
      setLoading(false)
      return
    }
    
    loadPopup()
  }, [])

  const loadPopup = async () => {
    try {
      const data = await api.getActivePopup()
      if (data) {
        // localStorage'dan kontrol et
        const popupState = localStorage.getItem(`popup_${data.id}`)
        
        if (!popupState) {
          // İlk kez göster
          setPopup(data)
          setIsOpen(true)
        } else {
          const state = JSON.parse(popupState)
          if (state.neverShow) {
            // Hiç gösterme seçilmişse gösterme
            setPopup(null)
          } else if (state.hideUntil && new Date(state.hideUntil) > new Date()) {
            // 24 saat henüz geçmemişse gösterme
            setPopup(null)
          } else {
            // 24 saat geçtiyse tekrar göster
            setPopup(data)
            setIsOpen(true)
          }
        }
      }
    } catch (error) {
      console.error('Popup yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = (action: 'close' | 'hide24h' | 'neverShow') => {
    if (!popup) return

    const state: any = {}
    
    if (action === 'close') {
      // Sadece kapat - bir sonraki sayfada tekrar göster
      setIsOpen(false)
      return
    } else if (action === 'hide24h') {
      // 24 saat sonra tekrar göster
      const hideUntil = new Date()
      hideUntil.setHours(hideUntil.getHours() + 24)
      state.hideUntil = hideUntil.toISOString()
    } else if (action === 'neverShow') {
      // Hiç gösterme
      state.neverShow = true
    }

    localStorage.setItem(`popup_${popup.id}`, JSON.stringify(state))
    setIsOpen(false)
  }

  if (loading || !popup || !isOpen) {
    return null
  }

  const productImage = popup.product?.image

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => handleClose('close')}
            className="fixed inset-0 bg-black/60 z-40"
          />

          {/* Modal - Centered */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="relative w-full max-w-lg">
              {/* Full Image */}
              {productImage && (
                <div className="relative w-full h-96 overflow-hidden rounded-t-2xl flex items-center justify-center bg-black">
                  <img
                    src={productImage}
                    alt={popup.product?.name || popup.title}
                    className="w-full h-full object-contain bg-black"
                  />
                  
                  {/* Close Button - Top Right Corner */}
                  <button
                    onClick={() => handleClose('close')}
                    className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Content Below Image */}
              <div className="bg-slate-800/90 backdrop-blur-sm rounded-b-2xl p-6 border border-t-0 border-b border-l border-r border-amber-500/30">
                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {popup.title}
                </h2>

                {/* Description */}
                {popup.description && (
                  <p className="text-gray-300 text-sm mb-4">
                    {popup.description}
                  </p>
                )}

                {/* Main Button */}
                {popup.product ? (
                  <Link href={`/products/${popup.product.id}`} className="block" onClick={() => handleClose('close')}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-lg transition-all mb-3 text-sm"
                    >
                      {popup.buttonText}
                    </motion.button>
                  </Link>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleClose('close')}
                    className="w-full py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-lg transition-all mb-3 text-sm"
                  >
                    {popup.buttonText}
                  </motion.button>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleClose('hide24h')}
                    className="flex-1 py-2 text-gray-300 hover:text-white text-xs transition-colors border border-gray-600 hover:border-gray-400 rounded-lg"
                  >
                    24 Saat Sonra
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleClose('neverShow')}
                    className="flex-1 py-2 text-gray-400 hover:text-gray-300 text-xs transition-colors border border-gray-700 hover:border-gray-600 rounded-lg"
                  >
                    Hiç Gösterme
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
