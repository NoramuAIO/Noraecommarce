'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Loader2, Save, X, Clock, Package } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'

interface Product {
  id: number
  name: string
  emoji: string
  version: string
}

interface Changelog {
  id: number
  version: string
  changes: string
  createdAt: string
  productId: number
}

export default function ChangelogsTab() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [changelogs, setChangelogs] = useState<Changelog[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingChangelogs, setLoadingChangelogs] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({ version: '', changes: '' })
  const { showToast } = useToast()

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    if (selectedProduct) {
      loadChangelogs(selectedProduct)
    }
  }, [selectedProduct])

  const loadProducts = async () => {
    try {
      const data = await api.getProducts()
      setProducts(data)
      if (data.length > 0) {
        setSelectedProduct(data[0].id)
      }
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadChangelogs = async (productId: number) => {
    setLoadingChangelogs(true)
    try {
      const data = await api.getProductChangelogs(productId)
      setChangelogs(data)
    } catch (error) {
      console.error('Değişiklikler yüklenemedi:', error)
      setChangelogs([])
    } finally {
      setLoadingChangelogs(false)
    }
  }

  const handleAdd = async () => {
    if (!selectedProduct || !formData.version || !formData.changes) return
    setSaving(true)
    try {
      const changes = formData.changes.split('\n').filter(c => c.trim())
      await api.createProductChangelog(selectedProduct, { version: formData.version, changes })
      await loadChangelogs(selectedProduct)
      await loadProducts()
      setFormData({ version: '', changes: '' })
      setShowAddForm(false)
      showToast('Güncelleme eklendi!', 'success')
    } catch (error) {
      showToast('Eklenemedi!', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu güncellemeyi silmek istediğinize emin misiniz?')) return
    try {
      await api.deleteProductChangelog(id)
      if (selectedProduct) await loadChangelogs(selectedProduct)
      showToast('Güncelleme silindi!', 'success')
    } catch (error) {
      showToast('Silinemedi!', 'error')
    }
  }

  const selectedProductData = products.find(p => p.id === selectedProduct)

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
          <h1 className="text-2xl font-bold text-white">Değişiklik Günlüğü</h1>
          <p className="text-gray-400 text-sm mt-1">Ürün güncellemelerini yönetin</p>
        </div>
      </div>

      {/* Product Selector */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <label className="text-sm text-gray-400 flex-shrink-0">Ürün Seçin:</label>
          <select
            value={selectedProduct || ''}
            onChange={(e) => setSelectedProduct(Number(e.target.value))}
            className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
          >
            {products.map(p => (
              <option key={p.id} value={p.id} className="bg-dark">{p.name} (v{p.version})</option>
            ))}
          </select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:opacity-90 rounded-xl text-white font-medium whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Yeni Güncelleme</span>
            <span className="sm:hidden">Ekle</span>
          </motion.button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && selectedProductData && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 sm:p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-white">
              {selectedProductData.name} - Yeni Güncelleme
            </h3>
            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Versiyon</label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="w-full sm:max-w-xs px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
                placeholder="2.5.0"
              />
              <p className="text-gray-500 text-xs mt-1">Mevcut: v{selectedProductData.version}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Değişiklikler (her satır bir madde)</label>
              <textarea
                value={formData.changes}
                onChange={(e) => setFormData({ ...formData, changes: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white resize-none"
                rows={5}
                placeholder="Performans iyileştirmeleri&#10;Yeni özellik eklendi&#10;Hata düzeltmeleri"
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            disabled={saving || !formData.version || !formData.changes}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:opacity-90 rounded-xl text-white font-medium disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Güncelleme Yayınla
          </motion.button>
        </motion.div>
      )}

      {/* Changelogs List */}
      {loadingChangelogs ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {changelogs.map((changelog) => {
            let changes: string[] = []
            try {
              changes = JSON.parse(changelog.changes)
            } catch {
              changes = [changelog.changes]
            }
            
            return (
              <motion.div
                key={changelog.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                      <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-lg">
                        v{changelog.version}
                      </span>
                      <span className="text-gray-500 text-xs sm:text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        {new Date(changelog.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {changes.map((change, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          <span className="break-words">{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => handleDelete(changelog.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )
          })}

          {changelogs.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Bu ürün için henüz güncelleme yok</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
