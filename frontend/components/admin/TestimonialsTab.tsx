'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Loader2, Star, Save, X, Quote } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'

interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  rating: number
  order: number
  active: boolean
}

export default function TestimonialsTab() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', role: '', content: '', rating: 5 })
  const { showToast } = useToast()

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      const data = await api.getTestimonialsAdmin()
      setTestimonials(data)
    } catch (error) {
      console.error('Yorumlar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.name || !formData.content) return
    setSaving(true)
    try {
      await api.createTestimonial(formData)
      await loadTestimonials()
      setFormData({ name: '', role: '', content: '', rating: 5 })
      setShowAddForm(false)
      showToast('Yorum eklendi!', 'success')
    } catch (error) {
      showToast('Eklenemedi!', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (id: number, data: Partial<Testimonial>) => {
    try {
      await api.updateTestimonial(id, data)
      await loadTestimonials()
      setEditingId(null)
      showToast('Yorum güncellendi!', 'success')
    } catch (error) {
      showToast('Güncellenemedi!', 'error')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return
    try {
      await api.deleteTestimonial(id)
      await loadTestimonials()
      showToast('Yorum silindi!', 'success')
    } catch (error) {
      showToast('Silinemedi!', 'error')
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
        <div>
          <h1 className="text-2xl font-bold text-white">Müşteri Yorumları</h1>
          <p className="text-gray-400 text-sm mt-1">Ana sayfadaki müşteri yorumlarını düzenleyin</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:opacity-90 rounded-xl text-white font-medium"
        >
          <Plus className="w-5 h-5" />
          Yeni Yorum Ekle
        </motion.button>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Yeni Yorum Ekle</h3>
            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">İsim</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
                placeholder="Ahmet K."
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Rol/Unvan</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
                placeholder="Sunucu Sahibi"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-400 mb-2 block">Yorum</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white resize-none"
                rows={3}
                placeholder="Müşteri yorumu..."
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Puan</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1"
                  >
                    <Star className={`w-6 h-6 ${star <= formData.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:opacity-90 rounded-xl text-white font-medium disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Kaydet
          </motion.button>
        </motion.div>
      )}

      <div className="grid gap-4">
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5"
          >
            {editingId === testimonial.id ? (
              <EditForm
                testimonial={testimonial}
                onSave={(data) => handleUpdate(testimonial.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-medium shrink-0">
                    {testimonial.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-medium">{testimonial.name}</h3>
                      <span className="text-gray-500 text-sm">•</span>
                      <span className="text-gray-400 text-sm">{testimonial.role}</span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />
                      ))}
                    </div>
                    <p className="text-gray-400 text-sm">&ldquo;{testimonial.content}&rdquo;</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <label className="flex items-center gap-2 mr-2">
                    <input
                      type="checkbox"
                      checked={testimonial.active}
                      onChange={(e) => handleUpdate(testimonial.id, { active: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-400">Aktif</span>
                  </label>
                  <button
                    onClick={() => setEditingId(testimonial.id)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12">
          <Quote className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Henüz yorum eklenmemiş</p>
        </div>
      )}
    </div>
  )
}

function EditForm({ testimonial, onSave, onCancel }: { testimonial: Testimonial; onSave: (data: Partial<Testimonial>) => void; onCancel: () => void }) {
  const [data, setData] = useState(testimonial)

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="text"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          className="px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
          placeholder="İsim"
        />
        <input
          type="text"
          value={data.role}
          onChange={(e) => setData({ ...data, role: e.target.value })}
          className="px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
          placeholder="Rol"
        />
        <textarea
          value={data.content}
          onChange={(e) => setData({ ...data, content: e.target.value })}
          className="sm:col-span-2 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white resize-none"
          rows={2}
        />
        <div className="flex gap-1 items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => setData({ ...data, rating: star })}>
              <Star className={`w-5 h-5 ${star <= data.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave(data)} className="px-4 py-2 bg-primary rounded-xl text-white text-sm">Kaydet</button>
        <button onClick={onCancel} className="px-4 py-2 bg-white/[0.05] rounded-xl text-white text-sm">İptal</button>
      </div>
    </div>
  )
}
