'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Save, GripVertical, ChevronDown, Loader2, Settings2 } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'

const defaultCategories = [
  { id: 'general', name: 'Genel' },
  { id: 'payment', name: 'Ödeme' },
  { id: 'technical', name: 'Teknik' },
  { id: 'security', name: 'Güvenlik' },
]

export default function FAQTab() {
  const [faqs, setFaqs] = useState<any[]>([])
  const [categories, setCategories] = useState(defaultCategories)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingFaq, setEditingFaq] = useState<any>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { showToast } = useToast()

  useEffect(() => {
    loadFaqs()
    loadCategories()
  }, [])

  const loadFaqs = async () => {
    try {
      const data = await api.getFaqs()
      setFaqs(data)
    } catch (error) {
      console.error('SSS yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const settings = await api.getSettings()
      if (settings.faqCategories) {
        const parsed = JSON.parse(settings.faqCategories)
        if (parsed.length > 0) setCategories(parsed)
      }
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error)
    }
  }

  const handleSave = async (faq: any) => {
    try {
      if (editingFaq) {
        await api.updateFaq(editingFaq.id, faq)
        showToast('Soru güncellendi!', 'success')
      } else {
        await api.createFaq(faq)
        showToast('Soru eklendi!', 'success')
      }
      loadFaqs()
      setShowModal(false)
    } catch (error) {
      console.error('SSS kaydedilemedi:', error)
      showToast('Kaydedilemedi!', 'error')
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Bu soruyu silmek istediğinize emin misiniz?')) {
      try {
        await api.deleteFaq(id)
        loadFaqs()
        showToast('Soru silindi!', 'success')
      } catch (error) {
        console.error('SSS silinemedi:', error)
        showToast('Silinemedi!', 'error')
      }
    }
  }

  const handleSaveCategories = async (newCategories: any[]) => {
    try {
      await api.updateSettings({ faqCategories: JSON.stringify(newCategories) })
      setCategories(newCategories)
      setShowCategoryModal(false)
      showToast('Kategoriler kaydedildi!', 'success')
    } catch (error) {
      showToast('Kaydedilemedi!', 'error')
    }
  }

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(f => f.category === selectedCategory)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">SSS Yönetimi</h1>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-2 px-3 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-gray-300 hover:text-white"
          >
            <Settings2 className="w-4 h-4" />
            <span className="hidden sm:inline">Kategoriler</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setEditingFaq(null); setShowModal(true) }}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Yeni Soru</span>
            <span className="sm:hidden">Ekle</span>
          </motion.button>
        </div>
      </div>

      {/* Category Filter - Scrollable on mobile */}
      <div className="overflow-x-auto pb-2 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-violet-600 text-white'
                : 'bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white hover:border-violet-500/30'
            }`}
          >
            Tümü ({faqs.length})
          </button>
          {categories.map(cat => {
            const count = faqs.filter(f => f.category === cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white hover:border-violet-500/30'
                }`}
              >
                {cat.name} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card overflow-hidden"
          >
            <div 
              className="flex items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 cursor-pointer"
              onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
            >
              <GripVertical className="w-5 h-5 text-gray-600 cursor-grab flex-shrink-0 hidden sm:block" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-white font-medium text-sm sm:text-base line-clamp-2 sm:line-clamp-1">{faq.question}</span>
                  <span className="px-2 py-0.5 bg-white/[0.05] text-gray-500 text-xs rounded w-fit flex-shrink-0">
                    {categories.find(c => c.id === faq.category)?.name || faq.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button 
                  onClick={(e) => { e.stopPropagation(); setEditingFaq(faq); setShowModal(true) }}
                  className="p-1.5 sm:p-2 hover:bg-white/[0.05] rounded-lg text-gray-400 hover:text-white"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(faq.id) }}
                  className="p-1.5 sm:p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === faq.id ? 'rotate-180' : ''}`} />
              </div>
            </div>
            <AnimatePresence>
              {expandedId === faq.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 sm:pl-14 text-gray-400 text-sm sm:text-base">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Bu kategoride soru bulunmuyor
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <FAQModal 
            faq={editingFaq} 
            categories={categories}
            onSave={handleSave}
            onClose={() => setShowModal(false)} 
          />
        )}
        {showCategoryModal && (
          <CategoryModal
            categories={categories}
            onSave={handleSaveCategories}
            onClose={() => setShowCategoryModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function FAQModal({ faq, categories, onSave, onClose }: any) {
  const [form, setForm] = useState(faq || { question: '', answer: '', category: categories[0]?.id || 'general' })

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
        className="bg-dark-50 border border-white/[0.08] rounded-2xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            {faq ? 'Soru Düzenle' : 'Yeni Soru'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Soru</label>
            <input
              type="text"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
              placeholder="Soru metni"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Kategori</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
            >
              {categories.map((c: any) => (
                <option key={c.id} value={c.id} className="bg-dark">{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Cevap</label>
            <textarea
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white resize-none"
              placeholder="Cevap metni"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white font-medium">
            İptal
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.question || !form.answer}
            className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-xl text-white font-medium flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Kaydet
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function CategoryModal({ categories, onSave, onClose }: any) {
  const [items, setItems] = useState([...categories])
  const [newCategory, setNewCategory] = useState({ id: '', name: '' })

  const handleAdd = () => {
    if (!newCategory.id || !newCategory.name) return
    if (items.find(c => c.id === newCategory.id)) {
      alert('Bu ID zaten kullanılıyor')
      return
    }
    setItems([...items, { ...newCategory }])
    setNewCategory({ id: '', name: '' })
  }

  const handleRemove = (id: string) => {
    setItems(items.filter(c => c.id !== id))
  }

  const handleUpdate = (id: string, name: string) => {
    setItems(items.map(c => c.id === id ? { ...c, name } : c))
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
        className="bg-dark-50 border border-white/[0.08] rounded-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white">SSS Kategorileri</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Categories */}
        <div className="space-y-2 mb-4">
          {items.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-20 truncate">{cat.id}</span>
              <input
                type="text"
                value={cat.name}
                onChange={(e) => handleUpdate(cat.id, e.target.value)}
                className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm"
              />
              <button
                onClick={() => handleRemove(cat.id)}
                className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Category */}
        <div className="border-t border-white/[0.08] pt-4 mb-4">
          <p className="text-sm text-gray-400 mb-2">Yeni Kategori Ekle</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2 flex-1">
              <input
                type="text"
                value={newCategory.id}
                onChange={(e) => setNewCategory({ ...newCategory, id: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                className="w-24 sm:w-20 px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm"
                placeholder="ID"
              />
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm"
                placeholder="Kategori Adı"
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!newCategory.id || !newCategory.name}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-lg text-white font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Ekle</span>
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white font-medium">
            İptal
          </button>
          <button
            onClick={() => onSave(items)}
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
