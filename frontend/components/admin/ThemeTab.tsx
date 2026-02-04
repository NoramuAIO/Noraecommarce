'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Palette, Loader2, RotateCcw, Sparkles } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'

const presetThemes = [
  { 
    name: 'Varsayılan (Mor)', 
    primary: '#8B5CF6', 
    accent: '#EC4899',
    background: '#030712',
    surface: '#111827',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#1F2937',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  },
  { 
    name: 'Okyanus (Mavi)', 
    primary: '#0EA5E9', 
    accent: '#06B6D4',
    background: '#020617',
    surface: '#0F172A',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#1E293B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  },
  { 
    name: 'Orman (Yeşil)', 
    primary: '#22C55E', 
    accent: '#10B981',
    background: '#021203',
    surface: '#0A1F0F',
    text: '#F0FDF4',
    textSecondary: '#86EFAC',
    border: '#14532D',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  },
  { 
    name: 'Gün Batımı (Turuncu)', 
    primary: '#F97316', 
    accent: '#EF4444',
    background: '#120702',
    surface: '#1F0F0A',
    text: '#FFF7ED',
    textSecondary: '#FDBA74',
    border: '#431407',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  },
  { 
    name: 'Altın (Sarı)', 
    primary: '#EAB308', 
    accent: '#F59E0B',
    background: '#120F02',
    surface: '#1F1A0A',
    text: '#FEFCE8',
    textSecondary: '#FDE047',
    border: '#422006',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  },
  { 
    name: 'Gece (İndigo)', 
    primary: '#6366F1', 
    accent: '#8B5CF6',
    background: '#020617',
    surface: '#0F0F1E',
    text: '#EEF2FF',
    textSecondary: '#A5B4FC',
    border: '#1E1B4B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  },
  { 
    name: 'Kırmızı Şeytan', 
    primary: '#DC2626', 
    accent: '#EF4444',
    background: '#0F0202',
    surface: '#1F0A0A',
    text: '#FEF2F2',
    textSecondary: '#FCA5A5',
    border: '#450A0A',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  },
  { 
    name: 'Pembe Rüya', 
    primary: '#EC4899', 
    accent: '#F472B6',
    background: '#120212',
    surface: '#1F0A1F',
    text: '#FDF2F8',
    textSecondary: '#F9A8D4',
    border: '#500724',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  },
]

export default function ThemeTab() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()
  const [theme, setTheme] = useState({
    primaryColor: '#8B5CF6',
    accentColor: '#EC4899',
    backgroundColor: '#030712',
    surfaceColor: '#111827',
    textColor: '#F9FAFB',
    textSecondaryColor: '#9CA3AF',
    borderColor: '#1F2937',
    successColor: '#10B981',
    warningColor: '#F59E0B',
    errorColor: '#EF4444',
    infoColor: '#3B82F6',
  })

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      const data = await api.getSettings()
      if (data) {
        setTheme({
          primaryColor: data.primaryColor || '#8B5CF6',
          accentColor: data.accentColor || '#EC4899',
          backgroundColor: data.backgroundColor || '#030712',
          surfaceColor: data.surfaceColor || '#111827',
          textColor: data.textColor || '#F9FAFB',
          textSecondaryColor: data.textSecondaryColor || '#9CA3AF',
          borderColor: data.borderColor || '#1F2937',
          successColor: data.successColor || '#10B981',
          warningColor: data.warningColor || '#F59E0B',
          errorColor: data.errorColor || '#EF4444',
          infoColor: data.infoColor || '#3B82F6',
        })
      }
    } catch (error) {
      console.error('Tema yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.updateSettings(theme)
      showToast('Tema kaydedildi! Sayfa yenileniyor...', 'success')
      setTimeout(() => window.location.reload(), 1500)
    } catch (error) {
      console.error('Tema kaydedilemedi:', error)
      showToast('Tema kaydedilemedi!', 'error')
    } finally {
      setSaving(false)
    }
  }

  const applyPreset = (preset: typeof presetThemes[0]) => {
    setTheme({
      primaryColor: preset.primary,
      accentColor: preset.accent,
      backgroundColor: preset.background,
      surfaceColor: preset.surface,
      textColor: preset.text,
      textSecondaryColor: preset.textSecondary,
      borderColor: preset.border,
      successColor: preset.success,
      warningColor: preset.warning,
      errorColor: preset.error,
      infoColor: preset.info,
    })
  }

  const resetToDefault = () => {
    setTheme({
      primaryColor: '#8B5CF6',
      accentColor: '#EC4899',
      backgroundColor: '#030712',
      surfaceColor: '#111827',
      textColor: '#F9FAFB',
      textSecondaryColor: '#9CA3AF',
      borderColor: '#1F2937',
      successColor: '#10B981',
      warningColor: '#F59E0B',
      errorColor: '#EF4444',
      infoColor: '#3B82F6',
    })
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
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Kapsamlı Tema Sistemi
          </h1>
          <p className="text-sm text-gray-400 mt-1">Tüm sayfalar ve componentler için dinamik tema desteği</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetToDefault}
            className="flex items-center gap-2 px-4 py-2.5 glass-card text-gray-300 font-medium"
          >
            <RotateCcw className="w-5 h-5" />
            Sıfırla
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:opacity-90 rounded-xl text-white font-medium disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Kaydet ve Uygula
          </motion.button>
        </div>
      </div>

      {/* Preset Themes */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Hazır Temalar
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {presetThemes.map((preset) => (
            <motion.button
              key={preset.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => applyPreset(preset)}
              className={`p-4 rounded-xl border transition-all ${
                theme.primaryColor === preset.primary && theme.accentColor === preset.accent
                  ? 'border-primary bg-primary-10'
                  : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]'
              }`}
            >
              <div className="flex gap-2 mb-3">
                <div 
                  className="w-8 h-8 rounded-lg" 
                  style={{ backgroundColor: preset.primary }}
                />
                <div 
                  className="w-8 h-8 rounded-lg" 
                  style={{ backgroundColor: preset.accent }}
                />
              </div>
              <span className="text-sm text-white font-medium">{preset.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Ana Renkler */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Ana Renkler</h2>
          <div className="space-y-6">
            <ColorPicker
              label="Ana Renk (Primary)"
              value={theme.primaryColor}
              onChange={(value) => setTheme({ ...theme, primaryColor: value })}
              description="Butonlar, linkler ve vurgular için"
            />
            <ColorPicker
              label="Vurgu Rengi (Accent)"
              value={theme.accentColor}
              onChange={(value) => setTheme({ ...theme, accentColor: value })}
              description="Gradient'ler ve ikincil vurgular için"
            />
          </div>
        </div>

        {/* Arka Plan Renkleri */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Arka Plan Renkleri</h2>
          <div className="space-y-6">
            <ColorPicker
              label="Ana Arka Plan"
              value={theme.backgroundColor}
              onChange={(value) => setTheme({ ...theme, backgroundColor: value })}
              description="Sayfa arka plan rengi"
            />
            <ColorPicker
              label="Yüzey Rengi (Surface)"
              value={theme.surfaceColor}
              onChange={(value) => setTheme({ ...theme, surfaceColor: value })}
              description="Kartlar ve paneller için"
            />
          </div>
        </div>

        {/* Metin Renkleri */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Metin Renkleri</h2>
          <div className="space-y-6">
            <ColorPicker
              label="Ana Metin"
              value={theme.textColor}
              onChange={(value) => setTheme({ ...theme, textColor: value })}
              description="Başlıklar ve ana metinler"
            />
            <ColorPicker
              label="İkincil Metin"
              value={theme.textSecondaryColor}
              onChange={(value) => setTheme({ ...theme, textSecondaryColor: value })}
              description="Açıklamalar ve yardımcı metinler"
            />
            <ColorPicker
              label="Kenarlık Rengi"
              value={theme.borderColor}
              onChange={(value) => setTheme({ ...theme, borderColor: value })}
              description="Kenarlıklar ve ayırıcılar"
            />
          </div>
        </div>

        {/* Durum Renkleri */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Durum Renkleri</h2>
          <div className="space-y-6">
            <ColorPicker
              label="Başarı (Success)"
              value={theme.successColor}
              onChange={(value) => setTheme({ ...theme, successColor: value })}
              description="Başarılı işlemler için"
            />
            <ColorPicker
              label="Uyarı (Warning)"
              value={theme.warningColor}
              onChange={(value) => setTheme({ ...theme, warningColor: value })}
              description="Dikkat gerektiren durumlar"
            />
            <ColorPicker
              label="Hata (Error)"
              value={theme.errorColor}
              onChange={(value) => setTheme({ ...theme, errorColor: value })}
              description="Hata mesajları için"
            />
            <ColorPicker
              label="Bilgi (Info)"
              value={theme.infoColor}
              onChange={(value) => setTheme({ ...theme, infoColor: value })}
              description="Bilgilendirme mesajları"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-6">Canlı Önizleme</h2>
          <div className="space-y-8">
            {/* Buttons Preview */}
            <div>
              <p className="text-sm text-gray-400 mb-3">Butonlar</p>
              <div className="flex flex-wrap gap-4">
                <button 
                  className="px-6 py-3 rounded-xl font-medium text-white"
                  style={{ background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.accentColor})` }}
                >
                  Gradient Buton
                </button>
                <button 
                  className="px-6 py-3 rounded-xl font-medium text-white"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  Ana Renk
                </button>
                <button 
                  className="px-6 py-3 rounded-xl font-medium text-white"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  Vurgu Renk
                </button>
              </div>
            </div>

            {/* Status Colors */}
            <div>
              <p className="text-sm text-gray-400 mb-3">Durum Renkleri</p>
              <div className="flex flex-wrap gap-4">
                <span 
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: `${theme.successColor}20`, color: theme.successColor }}
                >
                  Başarılı
                </span>
                <span 
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: `${theme.warningColor}20`, color: theme.warningColor }}
                >
                  Uyarı
                </span>
                <span 
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: `${theme.errorColor}20`, color: theme.errorColor }}
                >
                  Hata
                </span>
                <span 
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: `${theme.infoColor}20`, color: theme.infoColor }}
                >
                  Bilgi
                </span>
              </div>
            </div>

            {/* Card Preview */}
            <div>
              <p className="text-sm text-gray-400 mb-3">Kart Önizlemesi</p>
              <div 
                className="p-6 rounded-xl border"
                style={{ 
                  backgroundColor: theme.surfaceColor,
                  borderColor: theme.borderColor
                }}
              >
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ color: theme.textColor }}
                >
                  Örnek Başlık
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: theme.textSecondaryColor }}
                >
                  Bu bir örnek açıklama metnidir. Tema renklerinizin nasıl göründüğünü buradan görebilirsiniz.
                </p>
                <div className="mt-4 flex gap-2">
                  <button 
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ backgroundColor: theme.primaryColor, color: '#fff' }}
                  >
                    Birincil Buton
                  </button>
                  <button 
                    className="px-4 py-2 rounded-lg text-sm font-medium border"
                    style={{ 
                      borderColor: theme.borderColor,
                      color: theme.textColor
                    }}
                  >
                    İkincil Buton
                  </button>
                </div>
              </div>
            </div>

            {/* Gradient Text */}
            <div>
              <p className="text-sm text-gray-400 mb-3">Gradient Metin</p>
              <h3 
                className="text-4xl font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(to right, ${theme.primaryColor}, ${theme.accentColor})` }}
              >
                Premium Minecraft Pluginleri
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ColorPicker({ label, value, onChange, description }: { 
  label: string
  value: string
  onChange: (value: string) => void
  description: string
}) {
  return (
    <div>
      <label className="text-sm text-gray-400 mb-3 block">{label}</label>
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-16 rounded-xl border-0 cursor-pointer"
        />
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white font-mono"
          />
          <p className="text-xs text-gray-500 mt-2">{description}</p>
        </div>
      </div>
    </div>
  )
}
