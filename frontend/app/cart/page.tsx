'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Loader2, Tag, AlertCircle, ShoppingCart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/lib/cart-context'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, removeItem, clearCart, couponCode, setCouponCode, appliedCoupon, setAppliedCoupon, setDiscountedTotal } = useCart()
  const router = useRouter()
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const total = items.reduce((sum: number, item) => sum + item.price, 0)
  const discountedTotal = appliedCoupon ? items.reduce((sum: number, item) => sum + item.price, 0) - (appliedCoupon.discountType === 'percentage' ? (total * appliedCoupon.discountValue) / 100 : appliedCoupon.discountValue) : total

  const applyCoupon = async () => {
    if (!couponCode.trim()) return

    setCouponLoading(true)
    setCouponError('')

    try {
      const result = await api.calculateDiscount(couponCode, null, total)
      setAppliedCoupon(result.coupon)
      setDiscountedTotal(result.finalAmount)
    } catch (error: any) {
      setCouponError(error.message || 'Kupon geçersiz')
      setAppliedCoupon(null)
    } finally {
      setCouponLoading(false)
    }
  }

  const removeCoupon = () => {
    setCouponCode('')
    setAppliedCoupon(null)
    setCouponError('')
  }

  const handleCheckout = async () => {
    if (items.length === 0) return

    setCheckoutLoading(true)
    try {
      for (const item of items) {
        await api.createOrder(item.id, 'balance', appliedCoupon?.code)
      }
      clearCart()
      router.push('/profile?tab=orders')
    } catch (error: any) {
      console.error('Satın alma hatası:', error)
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-dark">
      <Header />
      <section className="pt-20 sm:pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 mb-6 sm:mb-8">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-white">Sepetim</span>
          </motion.div>

          {/* Title */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
              <ShoppingCart className="w-6 sm:w-10 h-6 sm:h-10 text-violet-400" />
              Sepetim
            </h1>
            <p className="text-sm sm:text-base text-gray-400">Toplam {items.length} ürün</p>
          </motion.div>

          {items.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 sm:p-12 text-center">
              <div className="w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <ShoppingCart className="w-8 sm:w-12 h-8 sm:h-12 text-violet-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Sepetiniz Boş</h2>
              <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">Ürün ekleyerek alışverişe başlayın</p>
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold rounded-xl transition-all"
                >
                  Ürünleri Keşfet
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Ürünler */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-3 sm:space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card p-4 sm:p-6 flex items-center gap-3 sm:gap-6 hover:border-violet-500/30 transition-all group cursor-pointer"
                    onClick={() => router.push(`/products/${item.id}`)}
                  >
                    {item.image && (
                      <div className="relative w-16 sm:w-24 h-16 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-1 truncate">{item.name}</h3>
                      <p className="text-violet-400 font-bold text-lg sm:text-xl">₺{item.price.toFixed(2)}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        removeItem(item.id)
                      }}
                      className="p-2 sm:p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0"
                    >
                      <Trash2 className="w-5 sm:w-6 h-5 sm:h-6" />
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>

              {/* Özet */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 sm:space-y-6">
                {/* Kupon */}
                <div className="glass-card p-4 sm:p-6 border border-violet-500/20">
                  <label className="text-xs sm:text-sm font-semibold text-white mb-3 sm:mb-4 block flex items-center gap-2">
                    <Tag className="w-4 h-4 text-violet-400" />
                    Kupon Kodu
                  </label>
                  {appliedCoupon ? (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center justify-between p-2.5 sm:p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"
                    >
                      <div>
                        <p className="text-emerald-400 font-bold text-xs sm:text-sm">{appliedCoupon.code}</p>
                        <p className="text-emerald-300 text-xs mt-0.5 sm:mt-1">
                          {appliedCoupon.discountType === 'percentage'
                            ? `%${appliedCoupon.discountValue} indirim`
                            : `₺${appliedCoupon.discountValue} indirim`}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={removeCoupon}
                        className="text-emerald-400 hover:text-emerald-300 transition-colors flex-shrink-0"
                      >
                        <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                      </motion.button>
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setCouponCode(e.target.value.toUpperCase())
                          setCouponError('')
                        }}
                        placeholder="Kupon kodunu girin"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 text-xs sm:text-sm"
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && applyCoupon()}
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={applyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                      >
                        {couponLoading ? (
                          <Loader2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 animate-spin" />
                        ) : (
                          <>
                            <Tag className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                            Uygula
                          </>
                        )}
                      </motion.button>
                      {couponError && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {couponError}
                        </motion.p>
                      )}
                    </div>
                  )}
                </div>

                {/* Fiyat Özeti */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4 sm:p-6 space-y-3 sm:space-y-4 border border-violet-500/20"
                >
                  <h3 className="text-base sm:text-lg font-bold text-white">Sipariş Özeti</h3>
                  
                  <div className="space-y-2.5 sm:space-y-3 pt-3 sm:pt-4 border-t border-white/[0.08]">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs sm:text-sm">Ara Toplam</span>
                      <span className="text-white font-semibold text-sm sm:text-base">₺{total.toFixed(2)}</span>
                    </div>
                    {appliedCoupon && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between text-emerald-400 text-xs sm:text-sm"
                      >
                        <span>İndirim</span>
                        <span className="font-bold">-₺{(total - discountedTotal).toFixed(2)}</span>
                      </motion.div>
                    )}
                    <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-white/[0.08]">
                      <span className="text-white font-bold text-sm sm:text-base">Toplam</span>
                      <span className="text-xl sm:text-2xl font-bold text-cyan-400">
                        ₺{discountedTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Butonlar */}
                  <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-white/[0.08]">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      disabled={checkoutLoading}
                      className="w-full py-2.5 sm:py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      {checkoutLoading ? (
                        <>
                          <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
                          <span className="hidden sm:inline">İşleniyor...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5" />
                          <span className="hidden sm:inline">Satın Al</span>
                          <span className="sm:hidden">Satın Al</span>
                        </>
                      )}
                    </motion.button>

                    <Link href="/products">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2.5 sm:py-3 glass-card text-white font-semibold rounded-xl hover:border-violet-500/30 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
                        <span className="hidden sm:inline">Alışverişe Devam</span>
                        <span className="sm:hidden">Devam</span>
                      </motion.button>
                    </Link>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={clearCart}
                      className="w-full py-2 sm:py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs sm:text-sm font-medium transition-all rounded-lg"
                    >
                      Sepeti Temizle
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
