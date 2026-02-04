'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Palette, Check, Loader2, Save } from 'lucide-react'
import { api } from '@/lib/api'
import { useTheme } from '@/lib/theme-context'
import { ThemeId } from '@/themes'

const themeInfo: Record<ThemeId, { 
  name: string
  description: string
  preview: string
  features: string[]
}> = {
  modern: {
    name: 'Modern',
    description: 'Glassmorphism efektleri, gradient renkler ve yumuşak animasyonlar',
    preview: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    features: ['Glassmorphism', 'Gradient Buttons', 'Smooth Animations', 'Blur Effects'],
  },
  minimal: {
    name: 'Minimal',
    description: 'Temiz çizgiler, flat tasarım, keskin köşeler ve minimal efektler',
    preview: 'linear-gradient(135deg, #000000 0%, #3B82F6 100%)',
    features: ['Flat Design', 'Sharp Corners', 'No Effects', 'System Fonts'],
  },
  retro: {
    name: 'Retro',
    description: '80s/90s tarzı cesur renkler, kalın kenarlıklar ve pixel-perfect tasarım',
    preview: 'linear-gradient(135deg, #FF6B9D 0%, #FEC84B 100%)',
    features: ['Bold Colors', 'Chunky Borders', 'Monospace Font', 'Strong Shadows'],
  },
  elegant: {
    name: 'Elegant',
    description: 'Lüks ve sofistike tasarım, serif fontlar, altın vurgular',
    preview: 'linear-gradient(135deg, #D4AF37 0%, #C9A961 100%)',
    features: ['Luxury Design', 'Serif Fonts', 'Gold Accents', 'Subtle Effects'],
  },
  neon: {
    name: 'Neon',
    description: 'Cyberpunk tarzı, neon ışıltılar, koyu arka plan ve canlı renkler',
    preview: 'linear-gradient(135deg, #00F0FF 0%, #FF00FF 100%)',
    features: ['Neon Glow', 'Cyberpunk Style', 'Vibrant Colors', 'Futuristic Font'],
  },
  family: {
    name: 'Family',
    description: 'Sıcak, samimi ve aile dostu tasarım - yumuşak renkler ve rahat spacing',
    preview: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
    features: ['Warm Colors', 'Rounded Corners', 'Comfortable Spacing', 'Friendly Typography'],
  },
}

export default function ThemeSelectorTab() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('modern')
  const [savedTheme, setSavedTheme] = useState<ThemeId>('modern') // Kaydedilmiş tema
  const { currentTheme, setTheme, availableThemes } = useTheme()

  useEffect(() => {
    loadCurrentTheme()
  }, [])

  const loadCurrentTheme = async () => {
    setLoading(true)
    try {
      const settings = await api.getSettings()
      const theme = settings.siteTheme as ThemeId
      if (theme && ['modern', 'minimal', 'retro', 'elegant', 'neon', 'family'].includes(theme)) {
        setSelectedTheme(theme)
        setSavedTheme(theme) // Kaydedilmiş temayı sakla
      }
    } catch (error) {
      console.error('Failed to load theme:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.updateSettings({ siteTheme: selectedTheme })
      setSavedTheme(selectedTheme) // Kaydedildi olarak işaretle
      alert('Tema başarıyla kaydedildi!')
    } catch (error) {
      console.error('Failed to save theme:', error)
      alert('Tema kaydedilemedi!')
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = (themeId: ThemeId) => {
    setSelectedTheme(themeId)
    setTheme(themeId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Tema Yönetimi</h2>
          <p className="text-gray-400">Site genelinde kullanılacak temayı seçin</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving || selectedTheme === savedTheme}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-primary rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Kaydet
            </>
          )}
        </motion.button>
      </div>

      {/* Current Theme Info */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-white">Aktif Tema</h3>
            <p className="text-sm text-gray-400">
              {themeInfo[currentTheme].name} - {themeInfo[currentTheme].description}
            </p>
          </div>
        </div>
        <div
          className="h-24 rounded-xl"
          style={{ background: themeInfo[currentTheme].preview }}
        />
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableThemes.map((themeId) => {
          const info = themeInfo[themeId]
          const isSelected = selectedTheme === themeId
          const isCurrent = currentTheme === themeId

          return (
            <motion.div
              key={themeId}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => handlePreview(themeId)}
              className={`glass-card p-6 cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-white/[0.06] hover:border-primary/50'
              }`}
            >
              {/* Preview */}
              <div
                className="h-32 rounded-xl mb-4 relative overflow-hidden"
                style={{ background: info.preview }}
              >
                {isCurrent && (
                  <div className="absolute top-2 right-2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                    Önizleme
                  </div>
                )}
                {themeId === savedTheme && (
                  <div className="absolute top-2 left-2 px-3 py-1 bg-green-500/80 backdrop-blur-sm rounded-full text-xs text-white font-medium flex items-center gap-1">
                    <Check size={12} />
                    Kaydedildi
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-2">{info.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{info.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-2">
                {info.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    {feature}
                  </div>
                ))}
              </div>

              {/* Select Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation()
                  handlePreview(themeId)
                }}
                className={`w-full mt-4 px-4 py-2 rounded-lg font-medium transition-all ${
                  isSelected
                    ? 'bg-primary text-white'
                    : 'bg-white/[0.05] text-gray-400 hover:bg-white/[0.1] hover:text-white'
                }`}
              >
                {isSelected ? 'Seçildi' : 'Önizle'}
              </motion.button>
            </motion.div>
          )
        })}
      </div>

      {/* Info Box */}
      <div className="glass-card p-6 border-l-4 border-primary">
        <h4 className="text-white font-semibold mb-2">💡 Bilgi</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Tema değişikliği tüm site genelinde geçerli olur</li>
          <li>• Önizleme için temaya tıklayın, kaydetmek için "Kaydet" butonuna basın</li>
          <li>• Her tema farklı renkler, şekiller, animasyonlar ve layout içerir</li>
          <li>• Tema değişikliği anında uygulanır, sayfa yenilemeye gerek yoktur</li>
        </ul>
      </div>
    </div>
  )
}
