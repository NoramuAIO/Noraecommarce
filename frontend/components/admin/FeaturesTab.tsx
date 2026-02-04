'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Loader2, Sparkles, Save, X } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'

const colorOptions = [
  { name: 'Cyan', value: 'cyan' },
  { name: 'Violet', value: 'violet' },
  { name: 'Amber', value: 'amber' },
  { name: 'Pink', value: 'pink' },
  { name: 'Emerald', value: 'emerald' },
  { name: 'Blue', value: 'blue' },
  { name: 'Red', value: 'red' },
  { name: 'Orange', value: 'orange' },
]

const iconOptions = [
  'Headphones', 'BookOpen', 'Wallet', 'Heart', 'Shield', 'Zap', 'Star', 'Award',
  'Clock', 'Users', 'Settings', 'Gift', 'Rocket', 'Target', 'CheckCircle', 'ThumbsUp'
]

interface FeatureFormData {
  title: string
  description: string
  icon: string
  color: string
}

interface Feature {
  id: number
  title: string
  description: string
  icon: string
  color: string
  order: number
  active: boolean
}

export default function FeaturesTab() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', icon: 'Headphones', color: 'cyan' })
  const { showToast } = useToast()

  useEffect(() => {
    loadFeatures()
  }, [])

  const loadFeatures = async () => {
    try {
      const data = await api.getFeaturesAdmin()
      setFeatures(data)
    } catch (error) {
      console.error('Features yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.title || !formData.description) return
    setSaving(true)
    try {
      await api.createFeature(formData)
      await loadFeatures()
      setFormData({ title: '', description: '', icon: 'Headphones', color: 'cyan' })
      setShowAddForm(false)
      showToast('Özellik eklendi!', 'success')
    } catch (error) {
      showToast('Eklenemedi!', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (id: number, data: Partial<Feature>) => {
    try {
      await api.updateFeature(id, data)
      await loadFeatures()
      setEditingId(null)
      showToast('Özellik güncellendi!', 'success')
    } catch (error) {
      showToast('Güncellenemedi!', 'error')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu özelliği silmek istediğinize emin misiniz?')) return
    try {
      await api.deleteFeature(id)
      await loadFeatures()
      showToast('Özellik silindi!', 'success')
    } catch (error) {
      showToast('Silinemedi!', 'error')
    }
  }

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName]
    return Icon ? <Icon className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />
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
          <h1 className="text-2xl font-bold text-white">Neden Biz Yönetimi</h1>
          <p className="text-gray-400 text-sm mt-1">Ana sayfadaki "Neden Biz" bölümünü düzenleyin</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:opacity-90 rounded-xl text-white font-medium"
        >
          <Plus className="w-5 h-5" />
          Yeni Ekle
        </motion.button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Yeni Özellik Ekle</h3>
            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Başlık</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
                placeholder="Ücretsiz Destek"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Açıklama</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
                placeholder="7/24 ücretsiz teknik destek"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">İkon</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Renk</label>
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
              >
                {colorOptions.map(color => (
                  <option key={color.value} value={color.value}>{color.name}</option>
                ))}
              </select>
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

      {/* Features List */}
      <div className="grid gap-4">
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5"
          >
            {editingId === feature.id ? (
              <EditForm
                feature={feature}
                onSave={(data: FeatureFormData) => handleUpdate(feature.id, data)}
                onCancel={() => setEditingId(null)}
                iconOptions={iconOptions}
                colorOptions={colorOptions}
              />
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/10 flex items-center justify-center text-${feature.color}-400`}>
                    {getIconComponent(feature.icon)}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 mr-4">
                    <input
                      type="checkbox"
                      checked={feature.active}
                      onChange={(e) => handleUpdate(feature.id, { active: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-400">Aktif</span>
                  </label>
                  <button
                    onClick={() => setEditingId(feature.id)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(feature.id)}
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

      {features.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          Henüz özellik eklenmemiş
        </div>
      )}
    </div>
  )
}

function EditForm({ feature, onSave, onCancel, iconOptions, colorOptions }: any) {
  const [data, setData] = useState(feature)

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="text"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
        />
        <input
          type="text"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
        />
        <select
          value={data.icon}
          onChange={(e) => setData({ ...data, icon: e.target.value })}
          className="px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
        >
          {iconOptions.map((icon: string) => (
            <option key={icon} value={icon}>{icon}</option>
          ))}
        </select>
        <select
          value={data.color}
          onChange={(e) => setData({ ...data, color: e.target.value })}
          className="px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
        >
          {colorOptions.map((color: any) => (
            <option key={color.value} value={color.value}>{color.name}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave(data)} className="px-4 py-2 bg-primary rounded-xl text-white text-sm">Kaydet</button>
        <button onClick={onCancel} className="px-4 py-2 bg-white/[0.05] rounded-xl text-white text-sm">İptal</button>
      </div>
    </div>
  )
}
