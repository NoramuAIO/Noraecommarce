'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Save, Loader2, Package, Calendar, Percent, DollarSign } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'

interface Bundle {
  id: number
  name: string
  description?: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  applyTo: 'category' | 'products'
  expiresAt?: string
  active: boolean
  category?: { id: number; name: string }
  products: any[]
  createdAt: string
}

interface Category {
  id: number
  name: string
}

interface Product {
  id: number
  name: string
}

export default function BundlesTab() {
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    applyTo: 'category' as 'category' | 'products',
    expiresAt: '',
    categoryId: 0,
    productIds: [] as number[],
  })

  useEffect(() => {
    loadBundles()
    loadCategories()
    loadProducts()
  }, [])

  const loadBundles = async () => {
    try {
      const data = await api.getBundles()
      setBundles(data)
    } catch (error) {
      showToast('Bundleler yüklenemedi', 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await api.getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error)
    }
  }

  const loadProducts = async () => {
    try {
      const data = await api.getProducts()
      // Bedava ürünleri filtrele
      const paidProducts = data.filter((p: any) => p.price > 0)
      setProducts(paidProducts)
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || formData.discountValue <= 0) {
      showToast('Lütfen tüm alanları doldurun', 'error')
      return
    }

    if (formData.applyTo === 'category' && formData.categoryId === 0) {
      showToast('Kategori seçiniz', 'error')
      return
    }

    if (formData.applyTo === 'products' && formData.productIds.length === 0) {
      showToast('En az bir ürün seçiniz', 'error')
      return
    }

    setSaving(true)
    try {
      if (editingBundle) {
        await api.updateBundle(editingBundle.id, {
          ...formData,
          categoryId: formData.applyTo === 'category' ? formData.categoryId : undefined,
        })
        showToast('Bundle güncellendi', 'success')
      } else {
        await api.createBundle({
          ...formData,
          categoryId: formData.applyTo === 'category' ? formData.categoryId : undefined,
        })
        showToast('Bundle oluşturuldu', 'success')
      }
      setShowForm(false)
      setEditingBundle(null)
      setFormData({
        name: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        applyTo: 'category',
        expiresAt: '',
        categoryId: 0,
        productIds: [],
      })
      loadBundles()
    } catch (error: any) {
      showToast(error.message || 'İşlem başarısız', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (bundle: Bundle) => {
    setEditingBundle(bundle)
    setFormData({
      name: bundle.name,
      description: bundle.description || '',
      discountType: bundle.discountType as 'percentage' | 'fixed',
      discountValue: bundle.discountValue,
      applyTo: bundle.applyTo as 'category' | 'products',
      expiresAt: bundle.expiresAt ? bundle.expiresAt.split('T')[0] : '',
      categoryId: bundle.category?.id || 0,
      productIds: bundle.products.map(p => p.id),
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu bundleı silmek istediğinize emin misiniz?')) return

    try {
      await api.deleteBundle(id)
      showToast('Bundle silindi', 'success')
      loadBundles()
    } catch (error) {
      showToast('Bundle silinemedi', 'error')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingBundle(null)
    setFormData({
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      applyTo: 'category',
      expiresAt: '',
      categoryId: 0,
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
          <h1 className="text-2xl font-bold text-white">Bundleler</h1>
          <p className="text-gray-500 mt-1">Kategori veya ürün bazlı indirimler</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Bundle
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
            {editingBundle ? 'Bundleı Düzenle' : 'Yeni Bundle Oluştur'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Bundle Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Yazılım Geliştirme Paketi"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Uygula</label>
                <select
                  value={formData.applyTo}
                  onChange={(e) => setFormData({ ...formData, applyTo: e.target.value as 'category' | 'products' })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
                >
                  <option value="category">Tüm Kategoriye</option>
                  <option value="products">Seçili Ürünlere</option>
                </select>
              </div>
            </div>

            {formData.applyTo === 'category' && (
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Kategori</label>
                <select
                  value={formData.categoryId.toString()}
                  onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
                >
                  <option value="0">Kategori Seçin</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.applyTo === 'products' && (
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Ürünler</label>
                <div className="grid md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-white/[0.02] border border-white/[0.08] rounded-xl">
                  {products.map((product) => (
                    <label key={product.id} className="flex items-center gap-2 cursor-pointer">
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
            )}

            <div className="grid md:grid-cols-2 gap-4">
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

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Açıklama</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Bundle açıklaması..."
                rows={2}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 resize-none"
              />
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

      {/* Bundles List */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Adı</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Uygula</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">İndirim</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Son Tarih</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Durum</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {bundles.map((bundle) => (
                <tr key={bundle.id} className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-violet-400" />
                      <span className="font-medium text-white">{bundle.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {bundle.applyTo === 'category' ? bundle.category?.name : `${bundle.products.length} ürün`}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      {bundle.discountType === 'percentage' ? (
                        <>
                          <Percent className="w-4 h-4" />
                          {bundle.discountValue}%
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4" />
                          ₺{bundle.discountValue}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {bundle.expiresAt ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(bundle.expiresAt).toLocaleDateString('tr-TR')}
                      </div>
                    ) : (
                      'Sınırsız'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        bundle.active
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {bundle.active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(bundle)}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(bundle.id)}
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

        {bundles.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Henüz bundle oluşturulmamış</p>
          </div>
        )}
      </div>
    </div>
  )
}
