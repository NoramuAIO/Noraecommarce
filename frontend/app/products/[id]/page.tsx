'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import api from '@/lib/api'
import { useCart } from '@/lib/cart-context'
import { useSite } from '@/lib/site-context'
import { 
  ShoppingCart, Star, Download, Shield, Clock, 
  CheckCircle, MessageSquare, ChevronDown, ChevronUp,
  Heart, Share2, Tag, Loader2, AlertCircle, X, Wallet, CreditCard, FileText
} from 'lucide-react'

interface Product {
  id: number; name: string; description: string; longDescription?: string
  price: number; originalPrice?: number; image?: string; rating: number
  reviews: number; badge?: string; version: string; downloads: number
  minecraftVersions: string; features?: string; requirements?: string
  updatePolicy: string; images?: string; category: { name: string }
  changelogs: { id: number; version: string; changes: string; createdAt: string }[]
  productReviews: { id: number; rating: number; comment: string; userName: string; createdAt: string }[]
  _count?: { favorites: number }
}

interface User {
  id: number; name: string; email: string; balance: number; role: string
}

const updatePolicyLabels: Record<string, string> = {
  lifetime: 'Ömür Boyu', '1year': '1 Yıl', '6months': '6 Ay'
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem, setIsOpen } = useCart()
  const { settings } = useSite()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'features' | 'reviews' | 'changelog'>('features')
  const [selectedImage, setSelectedImage] = useState(0)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [purchasing, setPurchasing] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  const [purchaseError, setPurchaseError] = useState('')
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [discountedPrice, setDiscountedPrice] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productData, userData] = await Promise.all([
          api.getProduct(params.id as string),
          api.getMe().catch(() => null)
        ])
        setProduct(productData)
        setUser(userData)
        
        // Favori durumunu kontrol et
        if (userData && productData) {
          try {
            const favStatus = await api.checkFavorite(productData.id)
            setIsFavorite(favStatus.isFavorite)
          } catch {}
        }
      } catch (error) {
        // Ürün yüklenemedi
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [params.id])

  const toggleFavorite = async () => {
    if (!user) {
      router.push('/login')
      return
    }
    if (!product || favoriteLoading) return
    
    setFavoriteLoading(true)
    try {
      if (isFavorite) {
        await api.removeFavorite(product.id)
        setIsFavorite(false)
      } else {
        await api.addFavorite(product.id)
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Favori işlemi başarısız:', error)
    } finally {
      setFavoriteLoading(false)
    }
  }

  const shareProduct = (platform: string) => {
    if (!product) return
    const url = window.location.href
    const text = `${product.name} - ${product.description}`
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      copy: url
    }
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url)
      setShowShareMenu(false)
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
      setShowShareMenu(false)
    }
  }

  const handlePurchase = async () => {
    if (!user) {
      router.push('/login')
      return
    }
    setShowPurchaseModal(true)
    setPurchaseError('')
    setPurchaseSuccess(false)
    setCouponCode('')
    setAppliedCoupon(null)
    setCouponError('')
    setDiscountedPrice(0)
  }

  const confirmPurchase = async () => {
    if (!product || !user) return
    
    setPurchasing(true)
    setPurchaseError('')
    
    try {
      await api.createOrder(product.id, 'balance', appliedCoupon?.code)
      setPurchaseSuccess(true)
      // Kullanıcı bakiyesini güncelle
      const updatedUser = await api.getMe()
      setUser(updatedUser)
      // Ürün indirme sayısını güncelle
      setProduct(prev => prev ? { ...prev, downloads: prev.downloads + 1 } : null)
    } catch (error: any) {
      setPurchaseError(error.message || 'Satın alma işlemi başarısız')
    } finally {
      setPurchasing(false)
    }
  }

  const closePurchaseModal = () => {
    setShowPurchaseModal(false)
    setPurchaseSuccess(false)
    setPurchaseError('')
    setCouponCode('')
    setAppliedCoupon(null)
    setCouponError('')
    setDiscountedPrice(0)
  }

  const applyCoupon = async () => {
    if (!couponCode.trim() || !product) return
    
    setCouponLoading(true)
    setCouponError('')
    
    try {
      const result = await api.calculateDiscount(couponCode, product.id, product.price)
      setAppliedCoupon(result.coupon)
      setDiscountedPrice(result.finalAmount)
    } catch (error: any) {
      setCouponError(error.message || 'Kupon geçersiz')
      setAppliedCoupon(null)
      setDiscountedPrice(0)
    } finally {
      setCouponLoading(false)
    }
  }

  const removeCoupon = () => {
    setCouponCode('')
    setAppliedCoupon(null)
    setCouponError('')
    setDiscountedPrice(0)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-dark">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <Footer />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-dark">
        <Header />
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <AlertCircle className="w-16 h-16 text-gray-600 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Ürün Bulunamadı</h1>
          <p className="text-gray-400">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
        </div>
        <Footer />
      </main>
    )
  }

  const images = product.images ? product.images.split(',') : (product.image ? [product.image] : [])
  const mcVersions = product.minecraftVersions.split(',').map(v => v.trim())

  const badgeColors: Record<string, string> = {
    'Popüler': 'bg-violet-500/20 text-violet-300',
    'Yeni': 'bg-emerald-500/20 text-emerald-300',
    'En Çok Satan': 'bg-amber-500/20 text-amber-300',
    'Premium': 'bg-fuchsia-500/20 text-fuchsia-300',
  }

  return (
    <main className="min-h-screen bg-dark">
      <Header />
      <section className="pt-20 sm:pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <a href="/" className="hover:text-white transition-colors">Ana Sayfa</a><span>/</span>
            <a href="/products" className="hover:text-white transition-colors">Ürünler</a><span>/</span>
            <span className="text-white">{product.name}</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Sol: Ürün Görseli */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-card p-6">
                <div className="aspect-square bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-2xl flex items-center justify-center overflow-hidden">
                  {images.length > 0 ? (
                    <motion.img 
                      key={selectedImage} 
                      src={images[selectedImage]} 
                      alt={product.name}
                      initial={{ scale: 0.8, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-9xl text-gray-600">📦</div>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-3 mt-4">
                    {images.map((img, index) => (
                      <motion.button key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedImage(index)}
                        className={`w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden transition-all ${selectedImage === index ? 'ring-2 ring-violet-500' : 'glass-card hover:border-violet-500/30'}`}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Sağ: Ürün Bilgileri ve Satın Alma */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              {product.badge && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg mb-4 ${badgeColors[product.badge] || 'bg-gray-500/20 text-gray-300'}`}>
                  <Tag size={14} />{product.badge}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{product.name}</h1>
              {product.reviews > 0 && (
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />)}
                    <span className="text-white font-medium ml-1">{product.rating}</span>
                  </div>
                  <span className="text-gray-500">({product.reviews} değerlendirme)</span>
                </div>
              )}
              
              {/* Kısa açıklama */}
              <p className="text-gray-400 mb-6 leading-relaxed">{product.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="glass-card p-3 text-center">
                  <Download className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                  <p className="text-white font-semibold text-sm">{product.downloads.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs">İndirme</p>
                </div>
                <div className="glass-card p-3 text-center">
                  <Heart className="w-5 h-5 text-red-400 mx-auto mb-1" />
                  <p className="text-white font-semibold text-sm">{product._count?.favorites || 0}</p>
                  <p className="text-gray-500 text-xs">Favori</p>
                </div>
                <div className="glass-card p-3 text-center">
                  <Clock className="w-5 h-5 text-fuchsia-400 mx-auto mb-1" />
                  <p className="text-white font-semibold text-sm">v{product.version}</p>
                  <p className="text-gray-500 text-xs">Versiyon</p>
                </div>
                <div className="glass-card p-3 text-center">
                  <Shield className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <p className="text-white font-semibold text-sm">{updatePolicyLabels[product.updatePolicy] || product.updatePolicy}</p>
                  <p className="text-gray-500 text-xs">Güncelleme</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-2">Desteklenen Versiyonlar:</p>
                <div className="flex flex-wrap gap-2">
                  {mcVersions.map(v => (
                    <span key={v} className="px-3 py-1 bg-white/[0.05] border border-white/[0.08] rounded-lg text-sm text-white">{v}</span>
                  ))}
                </div>
              </div>

              <div className="glass-card p-5">
                <div className="flex items-baseline gap-3 mb-4">
                  {product.price === 0 ? (
                    <span className="text-3xl font-bold text-emerald-400">Ücretsiz</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-white">₺{product.price}</span>
                      {product.originalPrice && (
                        <>
                          <span className="text-lg text-gray-500 line-through">₺{product.originalPrice}</span>
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-lg">
                            %{Math.round((1 - product.price / product.originalPrice) * 100)} İndirim
                          </span>
                        </>
                      )}
                    </>
                  )}
                </div>
                <div className="space-y-3">
                  {settings?.cartSystemEnabled === 'true' && product.price > 0 ? (
                    <motion.button 
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        addItem({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image,
                        })
                        setIsOpen(true)
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl font-semibold text-white"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Sepete Ekle
                    </motion.button>
                  ) : (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handlePurchase}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl font-semibold text-white">
                      <ShoppingCart className="w-5 h-5" />{product.price === 0 ? 'Ücretsiz Al' : 'Satın Al'}
                    </motion.button>
                  )}
                  <div className="flex gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }} 
                      onClick={toggleFavorite}
                      disabled={favoriteLoading}
                      className={`flex-1 p-3 glass-card transition-all ${isFavorite ? 'border-red-500/50 bg-red-500/10' : 'hover:border-violet-500/30'}`}
                    >
                      <Heart className={`w-5 h-5 transition-all mx-auto ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'} ${favoriteLoading ? 'animate-pulse' : ''}`} />
                    </motion.button>
                    <div className="relative flex-1">
                      <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }} 
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="w-full p-3 glass-card hover:border-violet-500/30 flex items-center justify-center"
                      >
                        <Share2 className="w-5 h-5 text-gray-400 hover:text-violet-400" />
                      </motion.button>
                      {showShareMenu && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute right-0 top-full mt-2 w-48 glass-card p-2 z-50"
                        >
                          <button onClick={() => shareProduct('twitter')} className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-white/[0.05] rounded-lg transition-colors">
                            <span className="text-lg">𝕏</span> Twitter
                          </button>
                          <button onClick={() => shareProduct('facebook')} className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-white/[0.05] rounded-lg transition-colors">
                            <span className="text-lg">📘</span> Facebook
                          </button>
                          <button onClick={() => shareProduct('whatsapp')} className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-white/[0.05] rounded-lg transition-colors">
                            <span className="text-lg">💬</span> WhatsApp
                          </button>
                          <button onClick={() => shareProduct('telegram')} className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-white/[0.05] rounded-lg transition-colors">
                            <span className="text-lg">✈️</span> Telegram
                          </button>
                          <hr className="border-white/[0.08] my-1" />
                          <button onClick={() => shareProduct('copy')} className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-white/[0.05] rounded-lg transition-colors">
                            <span className="text-lg">📋</span> Linki Kopyala
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Detaylı Açıklama */}
          {product.longDescription && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.15 }}
              className="glass-card p-6 mb-8"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-400" />
                Ürün Açıklaması
              </h2>
              <MarkdownRenderer content={product.longDescription} />
            </motion.div>
          )}

          {/* Tabs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8">
            <div className="flex gap-1 mb-8 bg-white/[0.03] p-1 rounded-xl border border-white/[0.08] w-fit">
              {[
                { id: 'features', label: 'Özellikler', icon: CheckCircle },
                { id: 'reviews', label: 'Değerlendirmeler', icon: MessageSquare },
                { id: 'changelog', label: 'Değişiklik Günlüğü', icon: Clock },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20' : 'text-gray-400 hover:text-gray-300'}`}>
                  <tab.icon className="w-4 h-4" />{tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'features' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="glass-card p-6 border border-violet-500/20">
                  <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    Özellikler
                  </h3>
                  {product.features ? (
                    <div className="prose prose-invert max-w-none">
                      <MarkdownRenderer content={product.features} />
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Özellik bilgisi henüz eklenmemiş.</p>
                  )}
                </div>
                <div className="glass-card p-6 border border-fuchsia-500/20">
                  <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-fuchsia-400" />
                    Gereksinimler
                  </h3>
                  {product.requirements ? (
                    <div className="prose prose-invert max-w-none">
                      <MarkdownRenderer content={product.requirements} />
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Gereksinim bilgisi henüz eklenmemiş.</p>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Rating özeti - sadece değerlendirme varsa göster */}
                {product.reviews > 0 && (
                  <div className="glass-card p-6 border border-amber-500/20">
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-5xl font-bold text-white mb-2">{product.rating}</p>
                        <div className="flex items-center gap-1 mb-2 justify-center">
                          {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />)}
                        </div>
                        <p className="text-gray-400 text-sm">{product.reviews} değerlendirme</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Değerlendirme Formu */}
                {user && (
                  <div className="glass-card p-6 border border-violet-500/20">
                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-violet-400" />
                      Değerlendirme Yap
                    </h3>
                    {reviewSuccess ? (
                      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <p className="text-emerald-400 text-sm">Değerlendirmeniz gönderildi! Onaylandıktan sonra görünecektir.</p>
                      </motion.div>
                    ) : (
                      <form onSubmit={async (e) => {
                        e.preventDefault()
                        if (!user || !reviewForm.comment.trim()) return
                        setSubmittingReview(true)
                        try {
                          await api.createProductReview(product.id, {
                            rating: reviewForm.rating,
                            comment: reviewForm.comment,
                            userName: user.name
                          })
                          setReviewSuccess(true)
                          setReviewForm({ rating: 5, comment: '' })
                        } catch (error) {
                          console.error('Değerlendirme gönderilemedi:', error)
                        } finally {
                          setSubmittingReview(false)
                        }
                      }}>
                        <div className="mb-4">
                          <label className="text-sm font-medium text-gray-300 mb-3 block">Puanınız</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <motion.button
                                key={star}
                                type="button"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                className="transition-all"
                              >
                                <Star className={`w-8 h-8 ${star <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600 hover:text-amber-300'}`} />
                              </motion.button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="text-sm font-medium text-gray-300 mb-2 block">Yorumunuz</label>
                          <textarea
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            placeholder="Bu ürün hakkında ne düşünüyorsunuz?"
                            rows={4}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 resize-none"
                            required
                          />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={submittingReview || !reviewForm.comment.trim()}
                          className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {submittingReview ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Gönderiliyor...
                            </>
                          ) : (
                            <>
                              <MessageSquare className="w-4 h-4" />
                              Değerlendirme Gönder
                            </>
                          )}
                        </motion.button>
                      </form>
                    )}
                  </div>
                )}

                {/* Giriş yapmamış kullanıcılar için uyarı */}
                {!user && (
                  <div className="glass-card p-4 border border-amber-500/20 bg-amber-500/5">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      <p className="text-gray-400 text-sm">Değerlendirme yapmak için <button onClick={() => router.push('/login')} className="text-violet-400 hover:text-violet-300 font-medium">giriş yapın</button>.</p>
                    </div>
                  </div>
                )}

                {/* Değerlendirmeler listesi */}
                {product.productReviews.length > 0 ? (
                  <div className="space-y-4">
                    {(showAllReviews ? product.productReviews : product.productReviews.slice(0, 3)).map((review, index) => (
                      <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="glass-card p-5 border border-white/[0.08] hover:border-violet-500/20 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold text-sm">
                              {review.userName[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">{review.userName}</p>
                              <p className="text-gray-500 text-xs">{new Date(review.createdAt).toLocaleDateString('tr-TR')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />)}
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                      </motion.div>
                    ))}
                    {product.productReviews.length > 3 && (
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowAllReviews(!showAllReviews)} 
                        className="w-full flex items-center justify-center gap-2 py-3 text-violet-400 hover:text-violet-300 font-medium transition-colors"
                      >
                        {showAllReviews ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Daha az göster
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Tüm değerlendirmeleri göster ({product.productReviews.length})
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-50" />
                    <p className="text-gray-500">Henüz değerlendirme yok. İlk değerlendirmeyi siz yapın!</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'changelog' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {product.changelogs.length > 0 ? (
                  product.changelogs.map((log, index) => {
                    let changes: string[] = []
                    try { changes = JSON.parse(log.changes) } catch { changes = [log.changes] }
                    return (
                      <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="glass-card p-5 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-sm font-bold rounded-lg border border-cyan-500/30">v{log.version}</span>
                          <span className="text-gray-400 text-sm">{new Date(log.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <ul className="space-y-2.5">
                          {changes.map((change, i) => (
                            <motion.li key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3 text-gray-300 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0 mt-1.5" />
                              <span>{change}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )
                  })
                ) : (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-50" />
                    <p className="text-gray-500">Henüz değişiklik günlüğü yok</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Satın Alma Modal */}
      <AnimatePresence>
        {showPurchaseModal && product && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closePurchaseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              {purchaseSuccess ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Satın Alma Başarılı!</h3>
                  <p className="text-gray-400 mb-4">
                    {product.name} başarıyla satın alındı. Lisansınız profilinize eklendi.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push('/profile')}
                      className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-semibold text-white"
                    >
                      Profilime Git
                    </button>
                    <button
                      onClick={closePurchaseModal}
                      className="flex-1 py-3 glass-card text-white font-semibold"
                    >
                      Kapat
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Satın Almayı Onayla</h3>
                    <button onClick={closePurchaseModal} className="text-gray-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="glass-card p-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl">📦</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{product.name}</h4>
                        <p className="text-gray-400 text-sm">{product.category?.name}</p>
                      </div>
                      <div className="text-right">
                        {appliedCoupon && discountedPrice > 0 ? (
                          <div>
                            <p className="text-sm text-gray-500 line-through">₺{product.price.toFixed(2)}</p>
                            <p className="text-xl font-bold text-emerald-400">₺{discountedPrice.toFixed(2)}</p>
                          </div>
                        ) : (
                          <p className="text-xl font-bold text-white">₺{product.price.toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-violet-400" />
                        <span className="text-gray-300">Mevcut Bakiye</span>
                      </div>
                      <span className={`font-bold ${user && user.balance >= (appliedCoupon && discountedPrice > 0 ? discountedPrice : product.price) ? 'text-emerald-400' : 'text-red-400'}`}>
                        ₺{user?.balance?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    {user && user.balance >= (appliedCoupon && discountedPrice > 0 ? discountedPrice : product.price) && (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                        <span className="text-gray-400">Satın alma sonrası</span>
                        <span className="text-white font-medium">₺{(user.balance - (appliedCoupon && discountedPrice > 0 ? discountedPrice : product.price)).toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* Kupon Kodu Giriş */}
                  {product.price > 0 && (
                    <div className="glass-card p-4 mb-4">
                      <label className="text-sm text-gray-400 mb-2 block">Kupon Kodu (İsteğe Bağlı)</label>
                      {appliedCoupon ? (
                        <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                          <div>
                            <p className="text-emerald-400 font-medium">{appliedCoupon.code}</p>
                            <p className="text-emerald-300 text-sm">
                              {appliedCoupon.discountType === 'percentage' 
                                ? `%${appliedCoupon.discountValue} indirim` 
                                : `₺${appliedCoupon.discountValue} indirim`}
                            </p>
                          </div>
                          <button
                            onClick={removeCoupon}
                            className="text-emerald-400 hover:text-emerald-300"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value.toUpperCase())
                              setCouponError('')
                            }}
                            placeholder="Kupon kodunu girin"
                            className="flex-1 px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
                            onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                          />
                          <button
                            onClick={applyCoupon}
                            disabled={couponLoading || !couponCode.trim()}
                            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                          >
                            {couponLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Tag className="w-4 h-4" />
                            )}
                            Uygula
                          </button>
                        </div>
                      )}
                      {couponError && (
                        <p className="text-red-400 text-sm mt-2">{couponError}</p>
                      )}
                    </div>
                  )}

                  {/* Fiyat Özeti */}
                  {appliedCoupon && discountedPrice > 0 && (
                    <div className="glass-card p-4 mb-4 space-y-2">
                      <div className="flex items-center justify-between text-gray-300">
                        <span>Ürün Fiyatı</span>
                        <span>₺{product.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-400">
                        <span>İndirim</span>
                        <span>-₺{(product.price - discountedPrice).toFixed(2)}</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 flex items-center justify-between text-white font-bold">
                        <span>Toplam</span>
                        <span>₺{(discountedPrice || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {purchaseError && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-4">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <p className="text-red-400 text-sm">{purchaseError}</p>
                    </div>
                  )}

                  {user && user.balance < (appliedCoupon && discountedPrice > 0 ? discountedPrice : product.price) ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                        <p className="text-amber-400 text-sm">
                          Yetersiz bakiye. ₺{((appliedCoupon && discountedPrice > 0 ? discountedPrice : product.price) - user.balance).toFixed(2)} daha yüklemeniz gerekiyor.
                        </p>
                      </div>
                      <button
                        onClick={() => router.push('/balance')}
                        className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-5 h-5" />
                        Bakiye Yükle
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={confirmPurchase}
                      disabled={purchasing}
                      className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {purchasing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          İşleniyor...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          {appliedCoupon && discountedPrice > 0 ? `₺${discountedPrice.toFixed(2)} ile Satın Al` : `Satın Al`}
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
