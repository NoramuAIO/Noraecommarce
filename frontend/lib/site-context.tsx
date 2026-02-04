'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface SiteSettings {
  siteName: string
  siteDescription: string
  discordLink: string
  discordName: string
  contactEmail: string
  maintenanceMode: boolean
  maintenanceEstimate: string
  workingHoursWeekday: string
  workingHoursSaturday: string
  workingHoursSunday: string
  // Tema renkleri - Genişletilmiş
  primaryColor: string
  accentColor: string
  backgroundColor: string
  surfaceColor: string
  textColor: string
  textSecondaryColor: string
  borderColor: string
  successColor: string
  warningColor: string
  errorColor: string
  infoColor: string
  // Hero ayarları
  heroTitle1: string
  heroTitle2: string
  heroSubtitle: string
  heroBadgeText: string
  heroBadgeEnabled: boolean
  // OAuth ayarları
  googleLoginEnabled: boolean
  discordLoginEnabled: boolean
  // Canlı destek ayarları
  liveChatEnabled: string
  liveChatWelcome: string
  liveChatOffline: string
  liveChatPages: string
  // Sepet sistemi
  cartSystemEnabled: string
  // Logo ayarları
  siteLogo: string
  siteLogoDark: string
  siteFavicon: string
  // Ana sayfa bölümleri
  bestSellersEnabled: boolean
}

interface SiteContextType {
  settings: SiteSettings
  loading: boolean
  apiError: boolean
  getImageUrl: (url: string) => string
}

const defaultSettings: SiteSettings = {
  siteName: 'Noramu',
  siteDescription: 'Premium Minecraft Pluginleri',
  discordLink: 'https://discord.gg/noramu',
  discordName: 'Discord Sunucumuz',
  contactEmail: 'destek@noramu.com',
  maintenanceMode: false,
  maintenanceEstimate: '',
  workingHoursWeekday: '09:00 - 22:00',
  workingHoursSaturday: '10:00 - 18:00',
  workingHoursSunday: '12:00 - 18:00',
  // Tema renkleri - Genişletilmiş
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
  // Hero ayarları
  heroTitle1: 'Minecraft için',
  heroTitle2: 'Premium Pluginler',
  heroSubtitle: 'Sunucunuzu bir üst seviyeye taşıyın. Performans odaklı, güvenilir ve sürekli güncellenen pluginler ile fark yaratın.',
  heroBadgeText: 'Yeni pluginler eklendi',
  heroBadgeEnabled: true,
  // OAuth ayarları
  googleLoginEnabled: false,
  discordLoginEnabled: false,
  // Canlı destek ayarları
  liveChatEnabled: 'false',
  liveChatWelcome: 'Merhaba! Size nasıl yardımcı olabiliriz?',
  liveChatOffline: 'Şu anda çevrimdışıyız. Lütfen destek talebi oluşturun.',
  liveChatPages: '["home","products","blog","faq","contact"]',
  // Sepet sistemi
  cartSystemEnabled: 'false',
  // Logo ayarları
  siteLogo: '',
  siteLogoDark: '',
  siteFavicon: '',
  // Ana sayfa bölümleri
  bestSellersEnabled: true,
}

const SiteContext = createContext<SiteContextType>({
  settings: defaultSettings,
  loading: true,
  apiError: false,
  getImageUrl: (url: string) => url
})

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

  // Resim URL'sini oluştur - /uploads/ yollarını API üzerinden serve et
  const getImageUrl = (url: string): string => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return url.startsWith('/') ? `${API_URL}${url}` : url
  }

  useEffect(() => {
    loadSettings()
  }, [])

  // CSS değişkenlerini güncelle
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      root.style.setProperty('--color-primary', settings.primaryColor)
      root.style.setProperty('--color-accent', settings.accentColor)
      root.style.setProperty('--color-background', settings.backgroundColor)
      root.style.setProperty('--color-surface', settings.surfaceColor)
      root.style.setProperty('--color-text', settings.textColor)
      root.style.setProperty('--color-text-secondary', settings.textSecondaryColor)
      root.style.setProperty('--color-border', settings.borderColor)
      root.style.setProperty('--color-success', settings.successColor)
      root.style.setProperty('--color-warning', settings.warningColor)
      root.style.setProperty('--color-error', settings.errorColor)
      root.style.setProperty('--color-info', settings.infoColor)
    }
  }, [settings])

  const loadSettings = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const res = await fetch(`${API_URL}/settings/public`)
      if (res.ok) {
        const data = await res.json()
        setSettings({
          siteName: data.siteName || defaultSettings.siteName,
          siteDescription: data.siteDescription || defaultSettings.siteDescription,
          discordLink: data.discordLink || defaultSettings.discordLink,
          discordName: data.discordName || defaultSettings.discordName,
          contactEmail: data.contactEmail || defaultSettings.contactEmail,
          maintenanceMode: data.maintenanceMode === 'true' || data.maintenanceMode === true,
          maintenanceEstimate: data.maintenanceEstimate || '',
          workingHoursWeekday: data.workingHoursWeekday || defaultSettings.workingHoursWeekday,
          workingHoursSaturday: data.workingHoursSaturday || defaultSettings.workingHoursSaturday,
          workingHoursSunday: data.workingHoursSunday || defaultSettings.workingHoursSunday,
          // Tema renkleri
          primaryColor: data.primaryColor || defaultSettings.primaryColor,
          accentColor: data.accentColor || defaultSettings.accentColor,
          backgroundColor: data.backgroundColor || defaultSettings.backgroundColor,
          surfaceColor: data.surfaceColor || defaultSettings.surfaceColor,
          textColor: data.textColor || defaultSettings.textColor,
          textSecondaryColor: data.textSecondaryColor || defaultSettings.textSecondaryColor,
          borderColor: data.borderColor || defaultSettings.borderColor,
          successColor: data.successColor || defaultSettings.successColor,
          warningColor: data.warningColor || defaultSettings.warningColor,
          errorColor: data.errorColor || defaultSettings.errorColor,
          infoColor: data.infoColor || defaultSettings.infoColor,
          // Hero ayarları
          heroTitle1: data.heroTitle1 || defaultSettings.heroTitle1,
          heroTitle2: data.heroTitle2 || defaultSettings.heroTitle2,
          heroSubtitle: data.heroSubtitle || defaultSettings.heroSubtitle,
          heroBadgeText: data.heroBadgeText || defaultSettings.heroBadgeText,
          heroBadgeEnabled: data.heroBadgeEnabled !== 'false' && data.heroBadgeEnabled !== false,
          // OAuth ayarları
          googleLoginEnabled: data.googleLoginEnabled === 'true' || data.googleLoginEnabled === true,
          discordLoginEnabled: data.discordLoginEnabled === 'true' || data.discordLoginEnabled === true,
          // Canlı destek ayarları
          liveChatEnabled: data.liveChatEnabled || 'false',
          liveChatWelcome: data.liveChatWelcome || defaultSettings.liveChatWelcome,
          liveChatOffline: data.liveChatOffline || defaultSettings.liveChatOffline,
          liveChatPages: data.liveChatPages || defaultSettings.liveChatPages,
          // Sepet sistemi
          cartSystemEnabled: data.cartSystemEnabled || 'false',
          // Logo ayarları
          siteLogo: data.siteLogo || '',
          siteLogoDark: data.siteLogoDark || '',
          siteFavicon: data.siteFavicon || '',
          // Ana sayfa bölümleri
          bestSellersEnabled: data.bestSellersEnabled !== 'false' && data.bestSellersEnabled !== false,
        })
      }
    } catch (error) {
      console.error('Settings load error:', error)
      setApiError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SiteContext.Provider value={{ settings, loading, apiError, getImageUrl }}>
      {children}
    </SiteContext.Provider>
  )
}

export const useSite = () => useContext(SiteContext)
