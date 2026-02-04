'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, X, Save, Eye, Calendar, Loader2, FolderOpen, Image as ImageIcon, Upload } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'
import MarkdownEditor from '@/components/MarkdownEditor'

interface BlogCategory {
  id: number
  name: string
  slug: string
  _count?: { posts: number }
}

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  image?: string
  author: string
  readTime: string
  featured: boolean
  categoryId?: number
  category?: BlogCategory
  createdAt: string
}

export default function BlogTab() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { showToast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [postsData, categoriesData] = await Promise.all([
        api.getBlogPosts(),
        api.getBlogCategories()
      ])
      setPosts(postsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Veriler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSave = async (post: any) => {
    try {
      if (editingPost) {
        await api.updateBlogPost(editingPost.id, post)
        showToast('Yazı güncellendi!', 'success')
      } else {
        await api.createBlogPost(post)
        showToast('Yazı eklendi!', 'success')
      }
      loadData()
      setShowModal(false)
    } catch (error) {
      showToast('Yazı kaydedilemedi!', 'error')
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Bu yazıyı silmek istediğinize emin misiniz?')) {
      try {
        await api.deleteBlogPost(id)
        loadData()
        showToast('Yazı silindi!', 'success')
      } catch (error) {
        showToast('Yazı silinemedi!', 'error')
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
        <h1 className="text-2xl font-bold text-white">Blog Yönetimi</h1>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] rounded-xl text-white font-medium"
          >
            <FolderOpen className="w-5 h-5" />
            Kategoriler
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setEditingPost(null); setShowModal(true) }}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium"
          >
            <Plus className="w-5 h-5" />
            Yeni Yazı
          </motion.button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Yazı ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
        />
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Başlık</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Kategori</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Tarih</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Öne Çıkan</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {post.image && (
                      <img src={post.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    )}
                    <span className="text-white font-medium">{post.title}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-400">
                  {post.category?.name || '-'}
                </td>
                <td className="py-4 px-6 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                    post.featured 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {post.featured ? 'Evet' : 'Hayır'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => { setEditingPost(post); setShowModal(true) }}
                      className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400 hover:text-white"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <BlogModal 
            post={editingPost} 
            categories={categories}
            onSave={handleSave}
            onClose={() => setShowModal(false)} 
          />
        )}
        {showCategoryModal && (
          <CategoryModal 
            categories={categories}
            onUpdate={loadData}
            onClose={() => setShowCategoryModal(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}


function BlogModal({ post, categories, onSave, onClose }: { post: BlogPost | null; categories: BlogCategory[]; onSave: (data: any) => void; onClose: () => void }) {
  const [form, setForm] = useState<any>(post || {
    title: '', excerpt: '', content: '', image: '', author: 'Admin', featured: false, categoryId: null
  })
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
        className="bg-dark-50 border border-white/[0.08] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {post ? 'Yazı Düzenle' : 'Yeni Yazı'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Resim Yükleme */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Kapak Resmi</label>
            <div className="flex gap-3">
              <div className="w-32 h-20 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center overflow-hidden flex-shrink-0">
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
                  placeholder="Resim URL'si veya yükleyin"
                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm"
                />
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-sm text-gray-400 hover:text-white disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? 'Yükleniyor...' : 'Dosya Yükle'}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Başlık</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
              placeholder="Yazı başlığı"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Kategori</label>
            <select
              value={form.categoryId || ''}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value ? +e.target.value : null })}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
            >
              <option value="" className="bg-dark">Kategori Seçin</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-dark">{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Özet</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white resize-none"
              placeholder="Kısa özet..."
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">İçerik (Markdown)</label>
            <MarkdownEditor
              value={form.content}
              onChange={(content) => setForm({ ...form, content })}
              placeholder="Markdown formatında içerik yazın..."
              minHeight="350px"
            />
          </div>

          <label className="flex items-center gap-3 p-4 bg-white/[0.02] rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-5 h-5 rounded border-white/20 bg-white/[0.03] text-violet-600"
            />
            <div>
              <p className="text-white font-medium">Öne Çıkan Yazı</p>
              <p className="text-sm text-gray-500">Ana sayfada gösterilsin</p>
            </div>
          </label>
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

function CategoryModal({ categories, onUpdate, onClose }: { categories: BlogCategory[]; onUpdate: () => void; onClose: () => void }) {
  const [newCategory, setNewCategory] = useState('')
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const handleAdd = async () => {
    if (!newCategory.trim()) return
    setSaving(true)
    try {
      await api.createBlogCategory({ name: newCategory })
      setNewCategory('')
      onUpdate()
      showToast('Kategori eklendi!', 'success')
    } catch (error) {
      showToast('Kategori eklenemedi!', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return
    try {
      await api.deleteBlogCategory(id)
      onUpdate()
      showToast('Kategori silindi!', 'success')
    } catch (error) {
      showToast('Kategori silinemedi!', 'error')
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
          <h2 className="text-xl font-semibold text-white">Blog Kategorileri</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Yeni Kategori Ekle */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Yeni kategori adı"
            className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button
            onClick={handleAdd}
            disabled={saving || !newCategory.trim()}
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-white disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          </button>
        </div>

        {/* Kategori Listesi */}
        <div className="space-y-2 max-h-64 overflow-auto">
          {categories.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Henüz kategori yok</p>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl">
                <div>
                  <p className="text-white font-medium">{cat.name}</p>
                  <p className="text-xs text-gray-500">{cat._count?.posts || 0} yazı</p>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white font-medium hover:bg-white/[0.05]"
        >
          Kapat
        </button>
      </motion.div>
    </motion.div>
  )
}
