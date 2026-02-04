'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Save, GripVertical, Loader2, Image as ImageIcon, Upload } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'

export default function CategoriesTab() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const { showToast } = useToast()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await api.getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (category: any) => {
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, { name: category.name, image: category.image })
        showToast('Kategori güncellendi!', 'success')
      } else {
        await api.createCategory({ name: category.name, image: category.image })
        showToast('Kategori eklendi!', 'success')
      }
      loadCategories()
      setShowModal(false)
    } catch (error) {
      console.error('Kategori kaydedilemedi:', error)
      showToast('Kategori kaydedilemedi!', 'error')
    }
  }

  const handleDelete = async (id: number) => {
    const cat = categories.find(c => c.id === id)
    if (cat && cat._count?.products > 0) {
      showToast('Bu kategoride ürün bulunuyor. Önce ürünleri taşıyın.', 'warning')
      return
    }
    if (confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
      try {
        await api.deleteCategory(id)
        loadCategories()
        showToast('Kategori silindi!', 'success')
      } catch (error) {
        console.error('Kategori silinemedi:', error)
        showToast('Kategori silinemedi!', 'error')
      }
    }
  }

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
        <h1 className="text-2xl font-bold text-white">Kategori Yönetimi</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setEditingCategory(null); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium"
        >
          <Plus className="w-5 h-5" />
          Yeni Kategori
        </motion.button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center overflow-hidden">
                  {category.image ? (
                    <img src={category.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category._count?.products || 0} ürün</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => { setEditingCategory(category); setShowModal(true) }}
                  className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400 hover:text-white"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(category.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <GripVertical className="w-4 h-4" />
              ID: {category.id}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <CategoryModal 
            category={editingCategory} 
            onSave={handleSave}
            onClose={() => setShowModal(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function CategoryModal({ category, onSave, onClose }: any) {
  const [form, setForm] = useState(category || { name: '', image: '' })
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const result = await api.uploadFile(file)
      setForm({ ...form, image: result.url })
    } catch (error: any) {
      showToast(error.message || 'Dosya yüklenemedi', 'error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-dark-50 border border-white/[0.08] rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {category ? 'Kategori Düzenle' : 'Yeni Kategori'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Kategori Resmi</label>
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center overflow-hidden flex-shrink-0">
                {form.image ? (
                  <img src={form.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="url"
                  value={form.image || ''}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm"
                  placeholder="https://..."
                />
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-3 py-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg text-sm text-gray-300 disabled:opacity-50"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? 'Yükleniyor...' : 'Yükle'}
                  </button>
                  {form.image && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: '' })}
                      className="px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg text-sm"
                    >
                      Kaldır
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Kategori Adı</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
              placeholder="Kategori adı"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white font-medium">
            İptal
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Kaydet
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
