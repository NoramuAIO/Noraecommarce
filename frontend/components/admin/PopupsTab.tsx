'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Save, Loader2, Bell, ToggleLeft, ToggleRight } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'

interface Product {
  id: number
  name: string
  image?: string
}

interface Popup {
  id: number
  title: string
  description?: string
  buttonText: string
  enabled: boolean
  productId?: number
  product?: Product
  createdAt: string
}

export default function PopupsTab() {
  const [popups, setPopups] = useState<Popup[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    buttonText: 'Tıkla ve Ürünü İncele!',
    productId: '',
    enabled: true,
  })

  useEffect(() => {
    loadPopups()
    loadProducts()
  }, [])

  const loadPopups = async () => {
    try {
      const data = await api.getPopups()
      setPopups(data)
    } catch (error) {
      showToast('Popuplar yüklenemedi', 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    try {
      const data = await api.getProducts()
      setProducts(data)
    } catch (error) {
      showToast('Ürünler yüklenemedi', 'error')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title) {
      showToast('Başlık gerekli', 'error')
      return
    }
    if (!formData.productId) {
      showToast('Ürün seçimi gerekli', 'error')
      return
    }

    setSaving(true)
    try {
      const submitData = {
        title: formData.title,
        description: formData.description,
        buttonText: formData.buttonText,
        productId: parseInt(formData.productId),
        enabled: formData.enabled,
      }

      if (editingPopup) {
        await api.updatePopup(editingPopup.id, submitData)
        showToast('Popup güncellendi', 'success')
      } else {
        await api.createPopup(submitData)
        showToast('Popup oluşturuldu', 'success')
      }
      setShowForm(false)
      setEditingPopup(null)
      setFormData({
        title: '',
        description: '',
        buttonText: 'Tıkla ve Ürünü İncele!',
        productId: '',
        enabled: true,
      })
      loadPopups()
    } catch (error: any) {
      showToast(error.message || 'İşlem başarısız', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (popup: Popup) => {
    setEditingPopup(popup)
    setFormData({
      title: popup.title,
      description: popup.description || '',
      buttonText: popup.buttonText,
      productId: popup.productId?.toString() || '',
      enabled: popup.enabled,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu popupı silmek istediğinize emin misiniz?')) return

    try {
      await api.deletePopup(id)
      showToast('Popup silindi', 'success')
      loadPopups()
    } catch (error) {
      showToast('Popup silinemedi', 'error')
    }
  }

  const handleToggle = async (popup: Popup) => {
    try {
      await api.updatePopup(popup.id, { enabled: !popup.enabled })
      showToast(popup.enabled ? 'Popup devre dışı bırakıldı' : 'Popup etkinleştirildi', 'success')
      loadPopups()
    } catch (error) {
      showToast('İşlem başarısız', 'error')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingPopup(null)
    setFormData({
      title: '',
      description: '',
      buttonText: 'Tıkla ve Ürünü İncele!',
      productId: '',
      enabled: true,
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
          <h1 className="text-2xl font-bold text-white">Popuplar</h1>
          <p className="text-gray-500 mt-1">Açılır pencere yönetimi</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Popup
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
            {editingPopup ? 'Popupı Düzenle' : 'Yeni Popup Oluştur'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Başlık</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Popup başlığı"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Açıklama</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Popup açıklaması..."
                rows={3}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 resize-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Ürün Seçimi</label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500"
              >
                <option value="">Ürün seçiniz...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Buton Metni</label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="Tıkla ve Ürünü İncele!"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/[0.08] rounded-xl">
              <input
                type="checkbox"
                id="enabled"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-white/[0.03] text-violet-600"
              />
              <label htmlFor="enabled" className="text-sm text-gray-300 cursor-pointer">
                Etkinleştirildi
              </label>
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

      {/* Popups List */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Başlık</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Ürün</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Buton Metni</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Durum</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {popups.map((popup) => (
                <tr key={popup.id} className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-violet-400" />
                      <span className="font-medium text-white">{popup.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{popup.product?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{popup.buttonText}</td>
                  <td className="px-6 py-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggle(popup)}
                      className="transition-colors"
                    >
                      {popup.enabled ? (
                        <ToggleRight className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-gray-500" />
                      )}
                    </motion.button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(popup)}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(popup.id)}
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

        {popups.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Henüz popup oluşturulmamış</p>
          </div>
        )}
      </div>
    </div>
  )
}
