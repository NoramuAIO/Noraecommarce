'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, X, Save, ChevronUp, Loader2, Image as ImageIcon, Upload } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'
import MarkdownEditor from '@/components/MarkdownEditor'

const updatePolicies = [
  { value: 'lifetime', label: 'Ömür Boyu' },
  { value: '1year', label: '1 Yıl' },
  { value: '6months', label: '6 Ay' },
]

interface Category { id: number; name: string; slug: string; image?: string }
interface Product {
  id: number; name: string; price: number; originalPrice: number | null
  category: Category; categoryId: number; description: string; longDescription?: string
  image?: string; downloads: number; status: string; version: string
  minecraftVersions: string; features?: string; requirements?: string
  updatePolicy: string; images?: string
}

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [saving, setSaving] = useState(false)

  const [newProduct, setNewProduct] = useState({
    name: '', image: '', price: '', originalPrice: '', categoryId: '', 
    description: '', longDescription: '', downloadUrl: '', licenseKey: '', version: '1.0.0',
    minecraftVersions: '1.20,1.21', features: '', requirements: '', 
    updatePolicy: 'lifetime', images: '', discordRoleId: ''
  })

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([api.getProducts(), api.getCategories()])
      setProducts(prods)
      setCategories(cats)
    } catch (error) { console.error('Error loading data:', error) }
    finally { setLoading(false) }
  }

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.categoryId) return
    setSaving(true)
    try {
      const created = await api.createProduct({
        name: newProduct.name, image: newProduct.image,
        price: newProduct.price === '' || newProduct.price === '0' ? 0 : Number(newProduct.price),
        originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : null,
        categoryId: Number(newProduct.categoryId), description: newProduct.description,
        longDescription: newProduct.longDescription, downloadUrl: newProduct.downloadUrl,
        licenseKey: newProduct.licenseKey,
        version: newProduct.version, minecraftVersions: newProduct.minecraftVersions,
        features: newProduct.features, requirements: newProduct.requirements,
        updatePolicy: newProduct.updatePolicy, images: newProduct.images,
        discordRoleId: newProduct.discordRoleId || null,
      })
      setProducts([created, ...products])
      setNewProduct({ name: '', image: '', price: '', originalPrice: '', categoryId: '', 
        description: '', longDescription: '', downloadUrl: '', licenseKey: '', version: '1.0.0',
        minecraftVersions: '1.20,1.21', features: '', requirements: '', updatePolicy: 'lifetime', images: '', discordRoleId: '' })
      setShowAddForm(false)
    } catch (error) { console.error('Error creating product:', error) }
    finally { setSaving(false) }
  }

  const handleSave = async (product: any) => {
    setSaving(true)
    try {
      // category objesini kaldır, sadece gerekli alanları gönder
      const { category, id, createdAt, updatedAt, ...updateData } = product
      updateData.categoryId = Number(updateData.categoryId)
      updateData.price = Number(updateData.price)
      if (updateData.originalPrice) updateData.originalPrice = Number(updateData.originalPrice)
      
      const updated = await api.updateProduct(product.id, updateData)
      setProducts(products.map(p => p.id === product.id ? updated : p))
      setShowModal(false)
    } catch (error) { console.error('Error updating product:', error) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return
    try { await api.deleteProduct(id); setProducts(products.filter(p => p.id !== id)) }
    catch (error) { console.error('Error deleting product:', error) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Ürün Yönetimi</h1>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${showAddForm ? 'bg-white/[0.05] border border-white/[0.08] text-white' : 'bg-violet-600 hover:bg-violet-500 text-white'}`}>
          {showAddForm ? <ChevronUp className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showAddForm ? 'Kapat' : 'Yeni Ürün'}
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Yeni Ürün Ekle</h3>
              <div className="grid gap-4">
                <ImageUpload 
                  value={newProduct.image} 
                  onChange={(url) => setNewProduct({ ...newProduct, image: url })} 
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">Ürün Adı *</label>
                    <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="Economy Plus" className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">Kategori *</label>
                    <select value={newProduct.categoryId} onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white">
                      <option value="" className="bg-dark">Seçin...</option>
                      {categories.map(c => <option key={c.id} value={c.id} className="bg-dark">{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">Fiyat (₺)</label>
                    <input type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="0" disabled={newProduct.price === '0'} className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white disabled:opacity-50" />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl cursor-pointer hover:bg-white/[0.05] w-full justify-center">
                      <input type="checkbox" checked={newProduct.price === '0'} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.checked ? '0' : '' })}
                        className="w-4 h-4 rounded accent-emerald-500" />
                      <span className="text-xs sm:text-sm text-emerald-400 font-medium">Ücretsiz</span>
                    </label>
                  </div>
                  <div><label className="text-sm text-gray-400 mb-1.5 block">Eski Fiyat</label>
                    <input type="number" value={newProduct.originalPrice} onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                      placeholder="0" className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" /></div>
                  <div><label className="text-sm text-gray-400 mb-1.5 block">Versiyon</label>
                    <input type="text" value={newProduct.version} onChange={(e) => setNewProduct({ ...newProduct, version: e.target.value })}
                      placeholder="1.0.0" className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" /></div>
                  <div><label className="text-sm text-gray-400 mb-1.5 block">MC Versiyon</label>
                    <input type="text" value={newProduct.minecraftVersions} onChange={(e) => setNewProduct({ ...newProduct, minecraftVersions: e.target.value })}
                      placeholder="1.20,1.21" className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" /></div>
                  <div><label className="text-sm text-gray-400 mb-1.5 block">Güncelleme</label>
                    <select value={newProduct.updatePolicy} onChange={(e) => setNewProduct({ ...newProduct, updatePolicy: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm">
                      {updatePolicies.map(p => <option key={p.value} value={p.value} className="bg-dark">{p.label}</option>)}
                    </select></div>
                </div>
                <div><label className="text-sm text-gray-400 mb-1.5 block">Kısa Açıklama</label>
                  <input type="text" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Kısa açıklama" className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" /></div>
                <div><label className="text-sm text-gray-400 mb-1.5 block">Detaylı Açıklama (Markdown)</label>
                  <MarkdownEditor 
                    value={newProduct.longDescription} 
                    onChange={(value) => setNewProduct({ ...newProduct, longDescription: value })}
                    placeholder="Ürün hakkında detaylı bilgi... (Markdown desteklenir)"
                    minHeight="200px"
                  /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="text-sm text-gray-400 mb-1.5 block">Özellikler (her satır bir madde)</label>
                    <textarea value={newProduct.features} onChange={(e) => setNewProduct({ ...newProduct, features: e.target.value })}
                      placeholder="Özellik 1&#10;Özellik 2&#10;Özellik 3" rows={4} className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white resize-none" /></div>
                  <div><label className="text-sm text-gray-400 mb-1.5 block">Gereksinimler (her satır bir madde)</label>
                    <textarea value={newProduct.requirements} onChange={(e) => setNewProduct({ ...newProduct, requirements: e.target.value })}
                      placeholder="Spigot/Paper 1.19+&#10;Java 17+&#10;Vault" rows={4} className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white resize-none" /></div>
                </div>
                <div><label className="text-sm text-gray-400 mb-1.5 block">İndirme Linki (opsiyonel)</label>
                  <input type="url" value={newProduct.downloadUrl} onChange={(e) => setNewProduct({ ...newProduct, downloadUrl: e.target.value })}
                    placeholder="https://..." className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" /></div>
                <div><label className="text-sm text-gray-400 mb-1.5 block">Lisans Kodu (opsiyonel - link yoksa kullanılır)</label>
                  <input type="text" value={newProduct.licenseKey} onChange={(e) => setNewProduct({ ...newProduct, licenseKey: e.target.value })}
                    placeholder="XXXX-XXXX-XXXX-XXXX" className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white font-mono" /></div>
                <p className="text-xs text-gray-500">Not: İndirme linki girilirse kullanıcıya link gösterilir. Girilmezse lisans kodu gösterilir. İkisi de boşsa otomatik kod üretilir.</p>
                <div><label className="text-sm text-gray-400 mb-1.5 block">Discord Rol ID (opsiyonel)</label>
                  <input type="text" value={newProduct.discordRoleId} onChange={(e) => setNewProduct({ ...newProduct, discordRoleId: e.target.value })}
                    placeholder="123456789012345678" className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white font-mono" />
                  <p className="text-xs text-gray-500 mt-1">Bu ürünü alan kullanıcıya verilecek Discord rolü</p></div>
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setShowAddForm(false)} className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-gray-300 hover:text-white">İptal</button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddProduct}
                    disabled={!newProduct.name || !newProduct.categoryId || saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-xl text-white font-medium">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Ürünü Ekle
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input type="text" placeholder="Ürün ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500" />
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead><tr className="border-b border-white/[0.06]">
            <th className="text-left py-4 px-4 sm:px-6 text-sm font-medium text-gray-500">Ürün</th>
            <th className="text-left py-4 px-4 sm:px-6 text-sm font-medium text-gray-500 hidden sm:table-cell">Kategori</th>
            <th className="text-left py-4 px-4 sm:px-6 text-sm font-medium text-gray-500">Fiyat</th>
            <th className="text-left py-4 px-4 sm:px-6 text-sm font-medium text-gray-500 hidden md:table-cell">Versiyon</th>
            <th className="text-left py-4 px-4 sm:px-6 text-sm font-medium text-gray-500 hidden sm:table-cell">Durum</th>
            <th className="text-right py-4 px-4 sm:px-6 text-sm font-medium text-gray-500">İşlemler</th>
          </tr></thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                <td className="py-4 px-4 sm:px-6"><div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {product.image ? (
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div className="min-w-0"><span className="text-white font-medium block truncate max-w-[120px] sm:max-w-[200px]">{product.name}</span>
                    <span className="text-gray-500 text-sm truncate block max-w-[120px] sm:max-w-[200px]">{product.description}</span></div>
                </div></td>
                <td className="py-4 px-4 sm:px-6 text-gray-400 hidden sm:table-cell truncate max-w-[100px]">{product.category?.name}</td>
                <td className="py-4 px-4 sm:px-6">
                  {product.price === 0 ? (
                    <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-500/20 text-emerald-400 whitespace-nowrap">Ücretsiz</span>
                  ) : (
                    <span className="whitespace-nowrap">
                      <span className="text-white">₺{product.price}</span>
                      {product.originalPrice && product.originalPrice > 0 && <span className="text-gray-500 line-through ml-2 text-sm hidden sm:inline">₺{product.originalPrice}</span>}
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 sm:px-6 text-gray-400 hidden md:table-cell">v{product.version}</td>
                <td className="py-4 px-4 sm:px-6 hidden sm:table-cell"><span className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${product.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {product.status === 'active' ? 'Aktif' : 'Pasif'}</span></td>
                <td className="py-4 px-4 sm:px-6"><div className="flex items-center justify-end gap-1 sm:gap-2">
                  <button onClick={() => { setEditingProduct(product); setShowModal(true) }} className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && editingProduct && <ProductModal product={editingProduct} categories={categories} saving={saving} onSave={handleSave} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  )
}

function ProductModal({ product, categories, saving, onSave, onClose }: any) {
  const [form, setForm] = useState({ ...product, categoryId: product.categoryId || product.category?.id })
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'content'>('basic')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()} className="bg-dark-50 border border-white/[0.08] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Ürün Düzenle</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex gap-2 mb-6">
          {[{ id: 'basic', label: 'Temel' }, { id: 'details', label: 'Detaylar' }, { id: 'content', label: 'İçerik' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-sm rounded-lg ${activeTab === tab.id ? 'bg-violet-600 text-white' : 'bg-white/[0.03] text-gray-400'}`}>{tab.label}</button>
          ))}
        </div>

        {activeTab === 'basic' && (
          <div className="space-y-4">
            <ImageUpload value={form.image || ''} onChange={(url) => setForm({ ...form, image: url })} />
            <div><label className="text-sm text-gray-400 mb-2 block">Ürün Adı</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" /></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div><label className="text-sm text-gray-400 mb-2 block">Fiyat (₺)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  disabled={form.price === 0} className="w-full px-3 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white disabled:opacity-50" /></div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 px-3 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl cursor-pointer hover:bg-white/[0.05] w-full justify-center">
                  <input type="checkbox" checked={form.price === 0} onChange={(e) => setForm({ ...form, price: e.target.checked ? 0 : 1 })}
                    className="w-4 h-4 rounded accent-emerald-500" />
                  <span className="text-xs sm:text-sm text-emerald-400 font-medium">Ücretsiz</span>
                </label>
              </div>
              <div><label className="text-sm text-gray-400 mb-2 block">Eski Fiyat</label>
                <input type="number" value={form.originalPrice || ''} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                  className="w-full px-3 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" placeholder="0" /></div>
              <div><label className="text-sm text-gray-400 mb-2 block">Kategori</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full px-3 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm">
                  {categories.map((c: any) => <option key={c.id} value={c.id} className="bg-dark">{c.name}</option>)}</select></div>
            </div>
            <div><label className="text-sm text-gray-400 mb-2 block">Kısa Açıklama</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" /></div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div><label className="text-sm text-gray-400 mb-2 block">Versiyon</label>
                <input type="text" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" /></div>
              <div><label className="text-sm text-gray-400 mb-2 block">MC Versiyonları</label>
                <input type="text" value={form.minecraftVersions} onChange={(e) => setForm({ ...form, minecraftVersions: e.target.value })}
                  placeholder="1.20,1.21" className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" /></div>
              <div><label className="text-sm text-gray-400 mb-2 block">Güncelleme Süresi</label>
                <select value={form.updatePolicy || 'lifetime'} onChange={(e) => setForm({ ...form, updatePolicy: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white">
                  {updatePolicies.map(p => <option key={p.value} value={p.value} className="bg-dark">{p.label}</option>)}</select></div>
            </div>
            <div><label className="text-sm text-gray-400 mb-2 block">İndirme Linki (opsiyonel)</label>
              <input type="url" value={form.downloadUrl || ''} onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" placeholder="https://..." /></div>
            <div><label className="text-sm text-gray-400 mb-2 block">Lisans Kodu (opsiyonel - link yoksa kullanılır)</label>
              <input type="text" value={form.licenseKey || ''} onChange={(e) => setForm({ ...form, licenseKey: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white font-mono" placeholder="XXXX-XXXX-XXXX-XXXX" /></div>
            <p className="text-xs text-gray-500">Not: İndirme linki girilirse kullanıcıya link gösterilir. Girilmezse lisans kodu gösterilir. İkisi de boşsa otomatik kod üretilir.</p>
            <div><label className="text-sm text-gray-400 mb-2 block">Discord Rol ID (opsiyonel)</label>
              <input type="text" value={form.discordRoleId || ''} onChange={(e) => setForm({ ...form, discordRoleId: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white font-mono" placeholder="123456789012345678" />
              <p className="text-xs text-gray-500 mt-1">Bu ürünü alan kullanıcıya verilecek Discord rolü</p></div>
            <div><label className="text-sm text-gray-400 mb-2 block">Durum</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white">
                <option value="active" className="bg-dark">Aktif</option>
                <option value="inactive" className="bg-dark">Pasif</option></select></div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400 mb-2 block">Detaylı Açıklama (Markdown)</label>
              <MarkdownEditor 
                value={form.longDescription || ''} 
                onChange={(value) => setForm({ ...form, longDescription: value })}
                placeholder="Ürün hakkında detaylı bilgi... (Markdown desteklenir)"
                minHeight="250px"
              /></div>
            <div><label className="text-sm text-gray-400 mb-2 block">Özellikler (her satır bir madde)</label>
              <textarea value={form.features || ''} onChange={(e) => setForm({ ...form, features: e.target.value })}
                rows={4} placeholder="Özellik 1&#10;Özellik 2" className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white resize-none" /></div>
            <div><label className="text-sm text-gray-400 mb-2 block">Gereksinimler (her satır bir madde)</label>
              <textarea value={form.requirements || ''} onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                rows={3} placeholder="Spigot 1.19+&#10;Java 17+" className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white resize-none" /></div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white font-medium hover:bg-white/[0.05]">İptal</button>
          <button onClick={() => onSave(form)} disabled={saving}
            className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Kaydet</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const result = await api.uploadFile(file)
      onChange(result.url)
    } catch (error: any) {
      showToast(error.message || 'Dosya yüklenemedi', 'error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="text-sm text-gray-400 mb-1.5 block">Ürün Resmi</label>
      <div className="flex gap-3">
        <div className="w-20 h-20 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center overflow-hidden flex-shrink-0">
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-gray-500" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input 
            type="url" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... veya dosya yükle"
            className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder-gray-500"
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
              className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg text-sm text-gray-300 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'Yükleniyor...' : 'Dosya Yükle'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg text-sm"
              >
                Kaldır
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
