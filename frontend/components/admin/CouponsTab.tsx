'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Save, Loader2, Gift, Calendar, Percent, DollarSign } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'

interface Coupon {
  id: number
  code: string
  description?: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  maxUses?: number
  usedCount: number
  expiresAt?: string
  active: boolean
  products: any[]
  createdAt: string
}

interface Product {
  id: number
  name: string
}

export default function CouponsTab() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    maxUses: undefined as number | undefined,
    expiresAt: '',
    usableInCart: false,
    productIds: [] as number[],
  })

  useEffect(() => {
    loadCoupons()
    loadProducts()
  }, [])

  const loadCoupons = async () => {
    try {
      const data = await api.getCoupons()
      setCoupons(data)
    } catch (error) {
      showToast('Kuponlar yüklenemedi', 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    try {
      const data = await api.getProducts()
      // Bedava ürünleri filtrele (price === 0)
      const paidProducts = data.filter((product: any) => product.price > 0)
      setProducts(paidProducts)
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.code || formData.discountValue <= 0) {
      showToast('Lütfen tüm alanları doldurun', 'error')
      return
    }

    setSaving(true)
    try {
      if (editingCoupon) {
        await api.updateCoupon(editingCoupon.id, {
          ...formData,
          maxUses: formData.maxUses || undefined,
        })
        showToast('Kupon güncellendi', 'success')
      } else {
        await api.createCoupon({
          ...formData,
          maxUses: formData.maxUses || undefined,
        })
        showToast('Kupon oluşturuldu', 'success')
      }
      setShowForm(false)
      setEditingCoupon(null)
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        maxUses: undefined,
        expiresAt: '',
        productIds: [],
      })
      loadCoupons()
    } catch (error: any) {
      showToast(error.message || 'İşlem başarısız', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxUses: coupon.maxUses,
      expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : '',
      usableInCart: (coupon as any).usableInCart || false,
      productIds: coupon.products.map(p => p.id),
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu kuponu silmek istediğinize emin misiniz?')) return

    try {
      await api.deleteCoupon(id)
      showToast('Kupon silindi', 'success')
      loadCoupons()
    } catch (error) {
      showToast('Kupon silinemedi', 'error')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCoupon(null)
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      maxUses: undefined,
      expiresAt: '',
      usableInCart: false,
      productIds: [],
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Kuponlar</h1>
          <p className="text-gray-500 mt-1">Kupon kodlarını yönetin</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Kupon
        </motion.button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            {editingCoupon ? 'Kuponu Düzenle' : 'Yeni Kupon Oluştur'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Kupon Kodu</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="NORAMUAIO"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">İndirim Türü</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
                >
                  <option value="percentage">Yüzde (%)</option>
                  <option value="fixed">Sabit (₺)</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">İndirim Değeri</label>
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                  placeholder="20"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Maksimum Kullanım</label>
                <input
                  type="number"
                  value={formData.maxUses || ''}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="100"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Açıklama</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Kupon açıklaması..."
                rows={2}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 resize-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Son Kullanma Tarihi</label>
              <input
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/[0.08] rounded-xl">
              <input
                type="checkbox"
                id="usableInCart"
                checked={formData.usableInCart}
                onChange={(e) => setFormData({ ...formData, usableInCart: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-white/[0.03] text-violet-600"
              />
              <label htmlFor="usableInCart" className="text-sm text-gray-300 cursor-pointer">
                Sepette Kullanılabilir
              </label>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Ürünler</label>
              <div className="grid md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {products.map((product) => (
                  <label key={product.id} className="flex items-center gap-2 p-2 hover:bg-white/[0.02] rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.productIds.includes(product.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, productIds: [...formData.productIds, product.id] })
                        } else {
                          setFormData({ ...formData, productIds: formData.productIds.filter(id => id !== product.id) })
                        }
                      }}
                      className="w-4 h-4 rounded border-white/20 bg-white/[0.03] text-violet-600"
                    />
                    <span className="text-sm text-gray-300">{product.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <motion.button
                type="submit"
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </motion.button>
              <motion.button
                type="button"
                onClick={handleCancel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                İptal
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Coupons List */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Kod</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">İndirim</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Kullanım</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Son Tarih</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Durum</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-violet-400" />
                      <span className="font-medium text-white">{coupon.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      {coupon.discountType === 'percentage' ? (
                        <>
                          <Percent className="w-4 h-4" />
                          {coupon.discountValue}%
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4" />
                          ₺{coupon.discountValue}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {coupon.usedCount}{coupon.maxUses ? ` / ${coupon.maxUses}` : ''}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {coupon.expiresAt ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(coupon.expiresAt).toLocaleDateString('tr-TR')}
                      </div>
                    ) : (
                      'Sınırsız'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        coupon.active
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {coupon.active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(coupon)}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(coupon.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {coupons.length === 0 && (
          <div className="text-center py-12">
            <Gift className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Henüz kupon oluşturulmamış</p>
          </div>
        )}
      </div>
    </div>
  )
}
