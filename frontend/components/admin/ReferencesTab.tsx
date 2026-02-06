'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Save, Loader2, Image as ImageIcon, Upload, Globe, MessageCircle } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'

interface Reference {
  id: number
  name: string
  image: string
  website?: string
  discord?: string
  order: number
  active: boolean
}

export default function ReferencesTab() {
  const [references, setReferences] = useState<Reference[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingRef, setEditingRef] = useState<Reference | null>(null)
  const [form, setForm] = useState({ name: '', image: '', website: '', discord: '' })

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const data = await api.getReferencesAdmin()
      setReferences(data)
    } catch (error) { console.error('Error:', error) }
    finally { setLoading(false) }
  }

  const handleSubmit = async () => {
    if (!form.name || !form.image) return
    setSaving(true)
    try {
      if (editingRef) {
        const updated = await api.updateReference(editingRef.id, form)
        setReferences(references.map(r => r.id === editingRef.id ? updated : r))
      } else {
        const created = await api.createReference(form)
        setReferences([...references, created])
      }
      setShowModal(false)
      setEditingRef(null)
      setForm({ name: '', image: '', website: '', discord: '' })
    } catch (error) { console.error('Error:', error) }
    finally { setSaving(false) }
  }

  const handleEdit = (ref: Reference) => {
    setEditingRef(ref)
    setForm({ name: ref.name, image: ref.image, website: ref.website || '', discord: ref.discord || '' })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu referansı silmek istediğinize emin misiniz?')) return
    try {
      await api.deleteReference(id)
      setReferences(references.filter(r => r.id !== id))
    } catch (error) { console.error('Error:', error) }
  }

  const toggleActive = async (ref: Reference) => {
    try {
      const updated = await api.updateReference(ref.id, { active: !ref.active })
      setReferences(references.map(r => r.id === ref.id ? updated : r))
    } catch (error) { console.error('Error:', error) }
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Referanslar</h1>
          <p className="text-gray-500 mt-1">Müşteri referanslarını yönetin</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setEditingRef(null); setForm({ name: '', image: '', website: '', discord: '' }); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium"
        >
          <Plus className="w-5 h-5" />
          Yeni Referans
        </motion.button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {references.map((ref) => (
          <motion.div
            key={ref.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-4 ${!ref.active ? 'opacity-50' : ''}`}
          >
            <div className="aspect-video rounded-lg bg-white/[0.03] overflow-hidden mb-3 flex items-center justify-center">
              {ref.image ? (
                <img src={ref.image} alt={ref.name} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-600" />
                </div>
              )}
            </div>
            <h3 className="text-white font-medium mb-2">{ref.name}</h3>
            <div className="flex items-center gap-2 mb-3">
              {ref.website && (
                <a href={ref.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {ref.discord && (
                <a href={ref.discord} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-violet-400">
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
            <div className="flex items-center justify-between">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={ref.active} onChange={() => toggleActive(ref)} className="sr-only peer" />
                <div className="w-9 h-5 bg-white/[0.1] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
              </label>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(ref)} className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400 hover:text-white">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(ref.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {references.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Henüz referans eklenmemiş</p>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-50 border border-white/[0.08] rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingRef ? 'Referans Düzenle' : 'Yeni Referans'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Referans Adı *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Sunucu adı"
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
                  />
                </div>

                <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} />

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Website (opsiyonel)</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Discord (opsiyonel)</label>
                  <input
                    type="url"
                    value={form.discord}
                    onChange={(e) => setForm({ ...form, discord: e.target.value })}
                    placeholder="https://discord.gg/..."
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white font-medium hover:bg-white/[0.05]">
                  İptal
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!form.name || !form.image || saving}
                  className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingRef ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
      <label className="text-sm text-gray-400 mb-2 block">Görsel *</label>
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
            className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm"
          />
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg text-sm text-gray-300 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Yükleniyor...' : 'Dosya Yükle'}
          </button>
        </div>
      </div>
    </div>
  )
}
