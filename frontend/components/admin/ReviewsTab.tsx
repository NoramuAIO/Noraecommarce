'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Trash2, Loader2, Star, MessageSquare, Filter } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'

interface Review {
  id: number
  rating: number
  comment: string
  userName: string
  approved: boolean
  createdAt: string
  product?: { id: number; name: string; emoji: string }
}

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')
  const { showToast } = useToast()

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const data = await api.getAllReviewsAdmin()
      setReviews(data)
    } catch (error) {
      console.error('Yorumlar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: number, approved: boolean) => {
    try {
      await api.updateProductReview(id, { approved })
      setReviews(reviews.map(r => r.id === id ? { ...r, approved } : r))
      showToast(approved ? 'Yorum onaylandı!' : 'Yorum onayı kaldırıldı!', 'success')
    } catch (error) {
      showToast('Güncellenemedi!', 'error')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return
    try {
      await api.deleteProductReview(id)
      setReviews(reviews.filter(r => r.id !== id))
      showToast('Yorum silindi!', 'success')
    } catch (error) {
      showToast('Silinemedi!', 'error')
    }
  }

  const filteredReviews = reviews.filter(r => {
    if (filter === 'pending') return !r.approved
    if (filter === 'approved') return r.approved
    return true
  })

  const pendingCount = reviews.filter(r => !r.approved).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Ürün Değerlendirmeleri</h1>
          <p className="text-gray-400 text-sm mt-1">Müşteri yorumlarını yönetin ve onaylayın</p>
        </div>
        {pendingCount > 0 && (
          <span className="px-3 py-1.5 bg-amber-500/20 text-amber-400 text-sm font-medium rounded-lg">
            {pendingCount} onay bekliyor
          </span>
        )}
      </div>

      {/* Filter */}
      <div className="glass-card p-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400 mr-2">Filtre:</span>
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'pending', label: 'Bekleyenler' },
            { id: 'approved', label: 'Onaylananlar' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                filter === f.id
                  ? 'bg-primary text-white'
                  : 'bg-white/[0.03] text-gray-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-5 ${!review.approved ? 'border-amber-500/30' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-medium shrink-0">
                {review.userName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white font-medium">{review.userName}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />
                    ))}
                  </div>
                  {!review.approved && (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded">Onay Bekliyor</span>
                  )}
                </div>
                {review.product && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{review.product.emoji}</span>
                    <span className="text-gray-400 text-sm">{review.product.name}</span>
                  </div>
                )}
                <p className="text-gray-300 text-sm mb-2">&ldquo;{review.comment}&rdquo;</p>
                <span className="text-gray-500 text-xs">
                  {new Date(review.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!review.approved ? (
                  <button
                    onClick={() => handleApprove(review.id, true)}
                    className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg"
                    title="Onayla"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleApprove(review.id, false)}
                    className="p-2 text-gray-400 hover:bg-white/[0.05] rounded-lg"
                    title="Onayı Kaldır"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">
              {filter === 'pending' ? 'Onay bekleyen yorum yok' : 'Henüz yorum yok'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
