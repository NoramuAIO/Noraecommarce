'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Globe, Shield, CreditCard, Eye, EyeOff, Loader2, Clock, Home, LogIn, Headphones, Bot, Upload, Trash2, Plus } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'
import { PayTRLogo, IyzicoLogo, PaparaLogo } from '@/components/PaymentLogos'

type SettingsCategory = 'general' | 'security' | 'hero' | 'payment' | 'oauth' | 'livechat' | 'discord'

const categories = [
  { id: 'general' as const, label: 'Genel', icon: Globe },
  { id: 'security' as const, label: 'Güvenlik', icon: Shield },
  { id: 'hero' as const, label: 'Ana Sayfa', icon: Home },
  { id: 'payment' as const, label: 'Ödeme', icon: CreditCard },
  { id: 'oauth' as const, label: 'Sosyal Giriş', icon: LogIn },
  { id: 'livechat' as const, label: 'Canlı Destek', icon: Headphones },
  { id: 'discord' as const, label: 'Discord Bot', icon: Bot },
]

export default function SettingsTab() {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('general')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()
  const [settings, setSettings] = useState({
    siteName: 'Noramu',
    siteDescription: 'Premium Minecraft Pluginleri',
    contactEmail: 'destek@noramu.com',
    discordLink: 'https://discord.gg/noramu',
    discordName: 'Discord Sunucumuz',
    maintenanceMode: false,
    maintenanceEstimate: '',
    workingHoursWeekday: '09:00 - 22:00',
    workingHoursSaturday: '10:00 - 18:00',
    workingHoursSunday: '12:00 - 18:00',
    registrationEnabled: true,
    emailVerificationEnabled: true,
    cartSystemEnabled: false,
    heroTitle1: 'Minecraft için',
    heroTitle2: 'Premium Pluginler',
    heroSubtitle: 'Sunucunuzu bir üst seviyeye taşıyın.',
    heroBadgeText: 'Yeni pluginler eklendi',
    heroBadgeEnabled: true,
    bestSellersEnabled: true,
  })

  const [paymentSettings, setPaymentSettings] = useState({
    paytr: { enabled: false, merchantId: '', merchantKey: '', merchantSalt: '', showKey: false, showSalt: false },
    papara: { enabled: false, apiKey: '', secretKey: '', showApi: false, showSecret: false },
    iyzico: { enabled: false, apiKey: '', secretKey: '', showApi: false, showSecret: false },
  })

  const [oauthSettings, setOauthSettings] = useState({
    google: { enabled: false, clientId: '', clientSecret: '', redirectUri: '', showSecret: false },
    discord: { enabled: false, clientId: '', clientSecret: '', redirectUri: '', showSecret: false },
  })

  const [liveChatSettings, setLiveChatSettings] = useState({
    enabled: false,
    welcomeMessage: 'Merhaba! Size nasıl yardımcı olabiliriz?',
    offlineMessage: 'Şu anda çevrimdışıyız. Lütfen destek talebi oluşturun.',
    pages: ['home', 'products', 'blog', 'faq', 'contact'] as string[],
  })

  const [discordBotSettings, setDiscordBotSettings] = useState({
    enabled: false,
    botToken: '',
    guildId: '',
    customerRoleId: '',
    premiumRoleId: '',
    showToken: false,
  })

  const [brandingSettings, setBrandingSettings] = useState({
    logo: '',
    logoDark: '',
    favicon: '',
  })
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingLogoDark, setUploadingLogoDark] = useState(false)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)

  const [whitelist, setWhitelist] = useState<Array<{ id: number; email: string; createdAt: string }>>([])
  const [whitelistEmail, setWhitelistEmail] = useState('')
  const [loadingWhitelist, setLoadingWhitelist] = useState(false)

  useEffect(() => { loadSettings(); loadWhitelist() }, [])

  const loadSettings = async () => {
    try {
      const data = await api.getSettings()
      if (data) {
        setSettings(prev => ({
          ...prev,
          siteName: data.siteName || prev.siteName,
          siteDescription: data.siteDescription || prev.siteDescription,
          contactEmail: data.contactEmail || prev.contactEmail,
          discordLink: data.discordLink || prev.discordLink,
          discordName: data.discordName || prev.discordName,
          maintenanceMode: data.maintenanceMode === 'true',
          maintenanceEstimate: data.maintenanceEstimate || '',
          workingHoursWeekday: data.workingHoursWeekday || prev.workingHoursWeekday,
          workingHoursSaturday: data.workingHoursSaturday || prev.workingHoursSaturday,
          workingHoursSunday: data.workingHoursSunday || prev.workingHoursSunday,
          registrationEnabled: data.registrationEnabled !== 'false',
          emailVerificationEnabled: data.emailVerificationEnabled !== 'false',
          cartSystemEnabled: data.cartSystemEnabled === 'true',
          heroTitle1: data.heroTitle1 || prev.heroTitle1,
          heroTitle2: data.heroTitle2 || prev.heroTitle2,
          heroSubtitle: data.heroSubtitle || prev.heroSubtitle,
          heroBadgeText: data.heroBadgeText || prev.heroBadgeText,
          heroBadgeEnabled: data.heroBadgeEnabled !== 'false',
          bestSellersEnabled: data.bestSellersEnabled !== 'false',
        }))
        setPaymentSettings(prev => ({
          paytr: { ...prev.paytr, enabled: data.paytrEnabled === 'true', merchantId: data.paytrMerchantId || '', merchantKey: data.paytrMerchantKey || '', merchantSalt: data.paytrMerchantSalt || '' },
          papara: { ...prev.papara, enabled: data.paparaEnabled === 'true', apiKey: data.paparaApiKey || '', secretKey: data.paparaSecretKey || '' },
          iyzico: { ...prev.iyzico, enabled: data.iyzicoEnabled === 'true', apiKey: data.iyzicoApiKey || '', secretKey: data.iyzicoSecretKey || '' },
        }))
        setOauthSettings(prev => ({
          google: { ...prev.google, enabled: data.googleLoginEnabled === 'true', clientId: data.googleClientId || '', clientSecret: data.googleClientSecret || '', redirectUri: data.googleRedirectUri || '' },
          discord: { ...prev.discord, enabled: data.discordLoginEnabled === 'true', clientId: data.discordClientId || '', clientSecret: data.discordClientSecret || '', redirectUri: data.discordRedirectUri || '' },
        }))
        setLiveChatSettings(prev => ({
          ...prev,
          enabled: data.liveChatEnabled === 'true',
          welcomeMessage: data.liveChatWelcome || prev.welcomeMessage,
          offlineMessage: data.liveChatOffline || prev.offlineMessage,
          pages: data.liveChatPages ? JSON.parse(data.liveChatPages) : prev.pages,
        }))
        setDiscordBotSettings(prev => ({
          ...prev,
          enabled: data.discordBotEnabled === 'true',
          botToken: data.discordBotToken || '',
          guildId: data.discordGuildId || '',
          customerRoleId: data.discordCustomerRoleId || '',
          premiumRoleId: data.discordPremiumRoleId || '',
        }))
        setBrandingSettings({
          logo: data.siteLogo || '',
          logoDark: data.siteLogoDark || '',
          favicon: data.siteFavicon || '',
        })
      }
    } catch (error) {
      console.error('Ayarlar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.updateSettings({
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        contactEmail: settings.contactEmail,
        discordLink: settings.discordLink,
        discordName: settings.discordName,
        maintenanceMode: String(settings.maintenanceMode),
        maintenanceEstimate: settings.maintenanceEstimate,
        workingHoursWeekday: settings.workingHoursWeekday,
        workingHoursSaturday: settings.workingHoursSaturday,
        workingHoursSunday: settings.workingHoursSunday,
        registrationEnabled: String(settings.registrationEnabled),
        emailVerificationEnabled: String(settings.emailVerificationEnabled),
        cartSystemEnabled: String(settings.cartSystemEnabled),
        heroTitle1: settings.heroTitle1,
        heroTitle2: settings.heroTitle2,
        heroSubtitle: settings.heroSubtitle,
        heroBadgeText: settings.heroBadgeText,
        heroBadgeEnabled: String(settings.heroBadgeEnabled),
        bestSellersEnabled: String(settings.bestSellersEnabled),
        paytrEnabled: String(paymentSettings.paytr.enabled),
        paytrMerchantId: paymentSettings.paytr.merchantId,
        paytrMerchantKey: paymentSettings.paytr.merchantKey,
        paytrMerchantSalt: paymentSettings.paytr.merchantSalt,
        paparaEnabled: String(paymentSettings.papara.enabled),
        paparaApiKey: paymentSettings.papara.apiKey,
        paparaSecretKey: paymentSettings.papara.secretKey,
        iyzicoEnabled: String(paymentSettings.iyzico.enabled),
        iyzicoApiKey: paymentSettings.iyzico.apiKey,
        iyzicoSecretKey: paymentSettings.iyzico.secretKey,
        googleLoginEnabled: String(oauthSettings.google.enabled),
        googleClientId: oauthSettings.google.clientId,
        googleClientSecret: oauthSettings.google.clientSecret,
        googleRedirectUri: oauthSettings.google.redirectUri,
        discordLoginEnabled: String(oauthSettings.discord.enabled),
        discordClientId: oauthSettings.discord.clientId,
        discordClientSecret: oauthSettings.discord.clientSecret,
        discordRedirectUri: oauthSettings.discord.redirectUri,
        liveChatEnabled: String(liveChatSettings.enabled),
        liveChatWelcome: liveChatSettings.welcomeMessage,
        liveChatOffline: liveChatSettings.offlineMessage,
        liveChatPages: JSON.stringify(liveChatSettings.pages),
        discordBotEnabled: String(discordBotSettings.enabled),
        discordBotToken: discordBotSettings.botToken,
        discordGuildId: discordBotSettings.guildId,
        discordCustomerRoleId: discordBotSettings.customerRoleId,
        discordPremiumRoleId: discordBotSettings.premiumRoleId,
        siteLogo: brandingSettings.logo,
        siteLogoDark: brandingSettings.logoDark,
        siteFavicon: brandingSettings.favicon,
      })
      showToast('Ayarlar kaydedildi!', 'success')
    } catch (error) {
      console.error('Ayarlar kaydedilemedi:', error)
      showToast('Ayarlar kaydedilemedi!', 'error')
    } finally {
      setSaving(false)
    }
  }

  const loadWhitelist = async () => {
    try {
      setLoadingWhitelist(true)
      const data = await api.getEmailVerificationWhitelist()
      setWhitelist(data || [])
    } catch (error) {
      console.error('Whitelist yüklenemedi:', error)
    } finally {
      setLoadingWhitelist(false)
    }
  }

  const handleAddToWhitelist = async () => {
    if (!whitelistEmail.trim()) {
      showToast('E-posta adresi girin', 'error')
      return
    }
    try {
      await api.addToEmailVerificationWhitelist(whitelistEmail)
      setWhitelistEmail('')
      await loadWhitelist()
      showToast('E-posta whitelist\'e eklendi', 'success')
    } catch (error) {
      showToast('E-posta eklenemedi', 'error')
    }
  }

  const handleRemoveFromWhitelist = async (email: string) => {
    try {
      await api.removeFromEmailVerificationWhitelist(email)
      await loadWhitelist()
      showToast('E-posta whitelist\'ten kaldırıldı', 'success')
    } catch (error) {
      showToast('E-posta kaldırılamadı', 'error')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Site Ayarları</h1>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium disabled:opacity-50">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Kaydet
        </motion.button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
              activeCategory === cat.id 
                ? 'bg-violet-600 text-white' 
                : 'bg-white/[0.03] text-gray-400 hover:bg-white/[0.06] hover:text-white'
            }`}>
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeCategory === 'general' && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-violet-400" />
              Genel Ayarlar
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Site Adı</label>
                <input type="text" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Site Açıklaması</label>
                <input type="text" value={settings.siteDescription} onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">İletişim E-posta</label>
                <input type="email" value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Discord Linki</label>
                <input type="url" value={settings.discordLink} onChange={(e) => setSettings({ ...settings, discordLink: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400 mb-2 block">Discord Sunucu Adı</label>
                <input type="text" value={settings.discordName} onChange={(e) => setSettings({ ...settings, discordName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" />
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-400" />
              Çalışma Saatleri
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Pazartesi - Cuma</label>
                <input type="text" value={settings.workingHoursWeekday} onChange={(e) => setSettings({ ...settings, workingHoursWeekday: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Cumartesi</label>
                <input type="text" value={settings.workingHoursSaturday} onChange={(e) => setSettings({ ...settings, workingHoursSaturday: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Pazar</label>
                <input type="text" value={settings.workingHoursSunday} onChange={(e) => setSettings({ ...settings, workingHoursSunday: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" />
              </div>
            </div>
          </div>

          {/* Logo & Favicon */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-violet-400" />
              Logo & Favicon
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Logo */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Site Logosu</label>
                <div className="w-full h-24 bg-white/[0.03] border border-white/[0.08] rounded-xl flex items-center justify-center overflow-hidden mb-2">
                  {brandingSettings.logo ? (
                    <img src={brandingSettings.logo.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${brandingSettings.logo}` : brandingSettings.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <span className="text-gray-500 text-sm">Logo yok</span>
                  )}
                </div>
                <label className="flex items-center justify-center gap-2 px-3 py-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 rounded-lg text-violet-400 cursor-pointer transition-colors text-sm">
                  <Upload className="w-4 h-4" />
                  {uploadingLogo ? 'Yükleniyor...' : 'Yükle'}
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    setUploadingLogo(true)
                    try {
                      const result = await api.uploadFile(file)
                      setBrandingSettings(prev => ({ ...prev, logo: result.url }))
                      showToast('Logo yüklendi', 'success')
                    } catch { showToast('Logo yüklenemedi', 'error') }
                    finally { setUploadingLogo(false) }
                  }} />
                </label>
              </div>

              {/* Logo Dark */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Logo (Koyu Tema)</label>
                <div className="w-full h-24 bg-gray-800 border border-white/[0.08] rounded-xl flex items-center justify-center overflow-hidden mb-2">
                  {brandingSettings.logoDark ? (
                    <img src={brandingSettings.logoDark.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${brandingSettings.logoDark}` : brandingSettings.logoDark} alt="Logo Dark" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <span className="text-gray-500 text-sm">Logo yok</span>
                  )}
                </div>
                <label className="flex items-center justify-center gap-2 px-3 py-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 rounded-lg text-violet-400 cursor-pointer transition-colors text-sm">
                  <Upload className="w-4 h-4" />
                  {uploadingLogoDark ? 'Yükleniyor...' : 'Yükle'}
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    setUploadingLogoDark(true)
                    try {
                      const result = await api.uploadFile(file)
                      setBrandingSettings(prev => ({ ...prev, logoDark: result.url }))
                      showToast('Logo yüklendi', 'success')
                    } catch { showToast('Logo yüklenemedi', 'error') }
                    finally { setUploadingLogoDark(false) }
                  }} />
                </label>
              </div>

              {/* Favicon */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Favicon</label>
                <div className="w-full h-24 bg-white/[0.03] border border-white/[0.08] rounded-xl flex items-center justify-center overflow-hidden mb-2">
                  {brandingSettings.favicon ? (
                    <img src={brandingSettings.favicon.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${brandingSettings.favicon}` : brandingSettings.favicon} alt="Favicon" className="w-12 h-12 object-contain" />
                  ) : (
                    <span className="text-gray-500 text-sm">Favicon yok</span>
                  )}
                </div>
                <label className="flex items-center justify-center gap-2 px-3 py-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 rounded-lg text-violet-400 cursor-pointer transition-colors text-sm">
                  <Upload className="w-4 h-4" />
                  {uploadingFavicon ? 'Yükleniyor...' : 'Yükle'}
                  <input type="file" accept="image/*,.ico" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    setUploadingFavicon(true)
                    try {
                      const result = await api.uploadFile(file)
                      setBrandingSettings(prev => ({ ...prev, favicon: result.url }))
                      showToast('Favicon yüklendi', 'success')
                    } catch { showToast('Favicon yüklenemedi', 'error') }
                    finally { setUploadingFavicon(false) }
                  }} />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeCategory === 'security' && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-400" />
            Güvenlik Ayarları
          </h2>
          <div className="space-y-4">
            {/* Maintenance Mode */}
            <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Bakım Modu</p>
                  <p className="text-sm text-gray-500">Siteyi geçici olarak kapat</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    settings.maintenanceMode ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      settings.maintenanceMode ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {settings.maintenanceMode && (
                <div className="pt-3 border-t border-white/[0.06]">
                  <label className="text-sm text-gray-400 mb-2 block">Tahmini Bakım Süresi</label>
                  <input type="text" value={settings.maintenanceEstimate} onChange={(e) => setSettings({ ...settings, maintenanceEstimate: e.target.value })}
                    placeholder="Örn: 30 dakika, 2 saat" className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500" />
                </div>
              )}
            </div>

            {/* Registration System */}
            <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Kayıt Sistemi</p>
                  <p className="text-sm text-gray-500">Yeni kullanıcı kaydına izin ver</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, registrationEnabled: !settings.registrationEnabled })}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    settings.registrationEnabled ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      settings.registrationEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Email Verification */}
            <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">E-Posta Doğrulama</p>
                  <p className="text-sm text-gray-500">Yeni kullanıcıların e-postasını doğrulamasını iste</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, emailVerificationEnabled: !settings.emailVerificationEnabled })}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    settings.emailVerificationEnabled ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      settings.emailVerificationEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Cart System */}
            <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Sepet Sistemi</p>
                  <p className="text-sm text-gray-500">Ürünleri sepete ekleyip toplu satın alma yap</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, cartSystemEnabled: !settings.cartSystemEnabled })}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    settings.cartSystemEnabled ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      settings.cartSystemEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Email Verification Whitelist */}
            {settings.emailVerificationEnabled && (
              <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-xl">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-violet-400" />
                  E-Posta Doğrulama Whitelist
                </h3>
                <p className="text-sm text-gray-500 mb-4">Bu e-posta adreslerinin doğrulama yapması gerekmez (örn: admin kullanıcıları)</p>
                <div className="flex gap-2 mb-4">
                  <input type="email" value={whitelistEmail} onChange={(e) => setWhitelistEmail(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddToWhitelist()}
                    placeholder="E-posta adresi girin" className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500" />
                  <button onClick={handleAddToWhitelist} disabled={loadingWhitelist}
                    className="px-4 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium disabled:opacity-50 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Ekle
                  </button>
                </div>
                {whitelist.length > 0 && (
                  <div className="space-y-2">
                    {whitelist.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-lg">
                        <span className="text-white text-sm">{item.email}</span>
                        <button onClick={() => handleRemoveFromWhitelist(item.email)}
                          className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero Settings */}
      {activeCategory === 'hero' && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Home className="w-5 h-5 text-violet-400" />
            Ana Sayfa Hero Ayarları
          </h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Başlık Satır 1</label>
                <input type="text" value={settings.heroTitle1} onChange={(e) => setSettings({ ...settings, heroTitle1: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Başlık Satır 2 (Gradient)</label>
                <input type="text" value={settings.heroTitle2} onChange={(e) => setSettings({ ...settings, heroTitle2: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Alt Yazı</label>
              <textarea value={settings.heroSubtitle} onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })} rows={3}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white resize-none" />
            </div>
            <label className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl cursor-pointer">
              <div>
                <p className="text-white font-medium">Üst Badge</p>
                <p className="text-sm text-gray-500">Başlığın üstündeki rozet</p>
              </div>
              <input type="checkbox" checked={settings.heroBadgeEnabled} onChange={(e) => setSettings({ ...settings, heroBadgeEnabled: e.target.checked })}
                className="w-5 h-5 rounded border-white/20 bg-white/[0.03] text-violet-600" />
            </label>
            {settings.heroBadgeEnabled && (
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Badge Metni</label>
                <input type="text" value={settings.heroBadgeText} onChange={(e) => setSettings({ ...settings, heroBadgeText: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" />
              </div>
            )}
            
            {/* Ana Sayfa Bölümleri */}
            <div className="border-t border-white/[0.06] pt-4 mt-4">
              <h3 className="text-md font-medium text-white mb-4">Ana Sayfa Bölümleri</h3>
              <label className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl cursor-pointer">
                <div>
                  <p className="text-white font-medium">En Çok Satanlar</p>
                  <p className="text-sm text-gray-500">En çok satan ürünleri ana sayfada göster</p>
                </div>
                <input type="checkbox" checked={settings.bestSellersEnabled} onChange={(e) => setSettings({ ...settings, bestSellersEnabled: e.target.checked })}
                  className="w-5 h-5 rounded border-white/20 bg-white/[0.03] text-violet-600" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Payment Settings */}
      {activeCategory === 'payment' && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-violet-400" />
            Ödeme Yöntemleri
          </h2>
          <div className="space-y-6">
            {/* PayTR */}
            <div className="p-4 bg-white/[0.02] rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <PayTRLogo />
                  <div>
                    <p className="text-white font-medium">PayTR</p>
                    <p className="text-sm text-gray-500">Kredi kartı, banka kartı</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={paymentSettings.paytr.enabled}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, paytr: { ...paymentSettings.paytr, enabled: e.target.checked } })} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/[0.1] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                </label>
              </div>
              {paymentSettings.paytr.enabled && (
                <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.06]">
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">Merchant ID</label>
                    <input type="text" value={paymentSettings.paytr.merchantId}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, paytr: { ...paymentSettings.paytr, merchantId: e.target.value } })}
                      className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">Merchant Key</label>
                    <div className="relative">
                      <input type={paymentSettings.paytr.showKey ? 'text' : 'password'} value={paymentSettings.paytr.merchantKey}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, paytr: { ...paymentSettings.paytr, merchantKey: e.target.value } })}
                        className="w-full px-3 py-2.5 pr-10 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm" />
                      <button type="button" onClick={() => setPaymentSettings({ ...paymentSettings, paytr: { ...paymentSettings.paytr, showKey: !paymentSettings.paytr.showKey } })}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                        {paymentSettings.paytr.showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">Merchant Salt</label>
                    <div className="relative">
                      <input type={paymentSettings.paytr.showSalt ? 'text' : 'password'} value={paymentSettings.paytr.merchantSalt}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, paytr: { ...paymentSettings.paytr, merchantSalt: e.target.value } })}
                        className="w-full px-3 py-2.5 pr-10 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm" />
                      <button type="button" onClick={() => setPaymentSettings({ ...paymentSettings, paytr: { ...paymentSettings.paytr, showSalt: !paymentSettings.paytr.showSalt } })}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                        {paymentSettings.paytr.showSalt ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Papara */}
            <div className="p-4 bg-white/[0.02] rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <PaparaLogo />
                  <div>
                    <p className="text-white font-medium">Papara</p>
                    <p className="text-sm text-gray-500">Papara ile ödeme</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={paymentSettings.papara.enabled}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, papara: { ...paymentSettings.papara, enabled: e.target.checked } })} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/[0.1] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                </label>
              </div>
              {paymentSettings.papara.enabled && (
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">API Key</label>
                    <div className="relative">
                      <input type={paymentSettings.papara.showApi ? 'text' : 'password'} value={paymentSettings.papara.apiKey}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, papara: { ...paymentSettings.papara, apiKey: e.target.value } })}
                        className="w-full px-3 py-2.5 pr-10 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm" />
                      <button type="button" onClick={() => setPaymentSettings({ ...paymentSettings, papara: { ...paymentSettings.papara, showApi: !paymentSettings.papara.showApi } })}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                        {paymentSettings.papara.showApi ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">Secret Key</label>
                    <div className="relative">
                      <input type={paymentSettings.papara.showSecret ? 'text' : 'password'} value={paymentSettings.papara.secretKey}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, papara: { ...paymentSettings.papara, secretKey: e.target.value } })}
                        className="w-full px-3 py-2.5 pr-10 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm" />
                      <button type="button" onClick={() => setPaymentSettings({ ...paymentSettings, papara: { ...paymentSettings.papara, showSecret: !paymentSettings.papara.showSecret } })}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                        {paymentSettings.papara.showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* iyzico */}
            <div className="p-4 bg-white/[0.02] rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <IyzicoLogo />
                  <div>
                    <p className="text-white font-medium">iyzico</p>
                    <p className="text-sm text-gray-500">Kredi kartı, BKM Express</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={paymentSettings.iyzico.enabled}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, iyzico: { ...paymentSettings.iyzico, enabled: e.target.checked } })} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/[0.1] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                </label>
              </div>
              {paymentSettings.iyzico.enabled && (
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">API Key</label>
                    <div className="relative">
                      <input type={paymentSettings.iyzico.showApi ? 'text' : 'password'} value={paymentSettings.iyzico.apiKey}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, iyzico: { ...paymentSettings.iyzico, apiKey: e.target.value } })}
                        className="w-full px-3 py-2.5 pr-10 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm" />
                      <button type="button" onClick={() => setPaymentSettings({ ...paymentSettings, iyzico: { ...paymentSettings.iyzico, showApi: !paymentSettings.iyzico.showApi } })}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                        {paymentSettings.iyzico.showApi ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">Secret Key</label>
                    <div className="relative">
                      <input type={paymentSettings.iyzico.showSecret ? 'text' : 'password'} value={paymentSettings.iyzico.secretKey}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, iyzico: { ...paymentSettings.iyzico, secretKey: e.target.value } })}
                        className="w-full px-3 py-2.5 pr-10 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm" />
                      <button type="button" onClick={() => setPaymentSettings({ ...paymentSettings, iyzico: { ...paymentSettings.iyzico, showSecret: !paymentSettings.iyzico.showSecret } })}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                        {paymentSettings.iyzico.showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OAuth Settings */}
      {activeCategory === 'oauth' && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <LogIn className="w-5 h-5 text-violet-400" />
            Sosyal Giriş Ayarları
          </h2>
          <div className="space-y-6">
            {/* Google */}
            <div className="p-4 bg-white/[0.02] rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Google ile Giriş</p>
                    <p className="text-sm text-gray-500">Google OAuth 2.0</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={oauthSettings.google.enabled}
                    onChange={(e) => setOauthSettings({ ...oauthSettings, google: { ...oauthSettings.google, enabled: e.target.checked } })} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/[0.1] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                </label>
              </div>
              {oauthSettings.google.enabled && (
                <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1.5 block">Client ID</label>
                      <input type="text" value={oauthSettings.google.clientId}
                        onChange={(e) => setOauthSettings({ ...oauthSettings, google: { ...oauthSettings.google, clientId: e.target.value } })}
                        placeholder="xxxx.apps.googleusercontent.com" className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1.5 block">Client Secret</label>
                      <div className="relative">
                        <input type={oauthSettings.google.showSecret ? 'text' : 'password'} value={oauthSettings.google.clientSecret}
                          onChange={(e) => setOauthSettings({ ...oauthSettings, google: { ...oauthSettings.google, clientSecret: e.target.value } })}
                          className="w-full px-3 py-2.5 pr-10 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm" />
                        <button type="button" onClick={() => setOauthSettings({ ...oauthSettings, google: { ...oauthSettings.google, showSecret: !oauthSettings.google.showSecret } })}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                          {oauthSettings.google.showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">Redirect URI</label>
                    <input type="text" value={oauthSettings.google.redirectUri}
                      onChange={(e) => setOauthSettings({ ...oauthSettings, google: { ...oauthSettings.google, redirectUri: e.target.value } })}
                      placeholder="https://siteniz.com/api/auth/oauth/google/callback" className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm" />
                    <p className="text-xs text-gray-500 mt-1">Google Console'da bu URL'i Authorized redirect URIs'e ekleyin</p>
                  </div>
                </div>
              )}
            </div>

            {/* Discord */}
            <div className="p-4 bg-white/[0.02] rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#5865F2]/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.373-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Discord ile Giriş</p>
                    <p className="text-sm text-gray-500">Discord OAuth 2.0</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={oauthSettings.discord.enabled}
                    onChange={(e) => setOauthSettings({ ...oauthSettings, discord: { ...oauthSettings.discord, enabled: e.target.checked } })} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/[0.1] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                </label>
              </div>
              {oauthSettings.discord.enabled && (
                <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1.5 block">Client ID</label>
                      <input type="text" value={oauthSettings.discord.clientId}
                        onChange={(e) => setOauthSettings({ ...oauthSettings, discord: { ...oauthSettings.discord, clientId: e.target.value } })}
                        placeholder="123456789012345678" className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1.5 block">Client Secret</label>
                      <div className="relative">
                        <input type={oauthSettings.discord.showSecret ? 'text' : 'password'} value={oauthSettings.discord.clientSecret}
                          onChange={(e) => setOauthSettings({ ...oauthSettings, discord: { ...oauthSettings.discord, clientSecret: e.target.value } })}
                          className="w-full px-3 py-2.5 pr-10 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm" />
                        <button type="button" onClick={() => setOauthSettings({ ...oauthSettings, discord: { ...oauthSettings.discord, showSecret: !oauthSettings.discord.showSecret } })}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                          {oauthSettings.discord.showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block">Redirect URI</label>
                    <input type="text" value={oauthSettings.discord.redirectUri}
                      onChange={(e) => setOauthSettings({ ...oauthSettings, discord: { ...oauthSettings.discord, redirectUri: e.target.value } })}
                      placeholder="https://siteniz.com/api/auth/oauth/discord/callback" className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm" />
                    <p className="text-xs text-gray-500 mt-1">Discord Developer Portal'da bu URL'i Redirects'e ekleyin</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Live Chat Settings */}
      {activeCategory === 'livechat' && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Headphones className="w-5 h-5 text-violet-400" />
            Canlı Destek Ayarları
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl cursor-pointer">
              <div>
                <p className="text-white font-medium">Canlı Destek</p>
                <p className="text-sm text-gray-500">Sitede canlı destek widget'ını göster</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={liveChatSettings.enabled}
                  onChange={(e) => setLiveChatSettings({ ...liveChatSettings, enabled: e.target.checked })} className="sr-only peer" />
                <div className="w-11 h-6 bg-white/[0.1] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
              </label>
            </label>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Karşılama Mesajı</label>
              <textarea
                value={liveChatSettings.welcomeMessage}
                onChange={(e) => setLiveChatSettings({ ...liveChatSettings, welcomeMessage: e.target.value })}
                rows={2}
                placeholder="Merhaba! Size nasıl yardımcı olabiliriz?"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white resize-none placeholder-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Kullanıcı sohbeti başlattığında gösterilecek mesaj</p>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Çevrimdışı Mesajı</label>
              <textarea
                value={liveChatSettings.offlineMessage}
                onChange={(e) => setLiveChatSettings({ ...liveChatSettings, offlineMessage: e.target.value })}
                rows={2}
                placeholder="Şu anda çevrimdışıyız. Lütfen destek talebi oluşturun."
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white resize-none placeholder-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Destek ekibi çevrimdışıyken gösterilecek mesaj</p>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-3 block">Görüntülenecek Sayfalar</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'home', label: 'Ana Sayfa' },
                  { id: 'products', label: 'Ürünler' },
                  { id: 'blog', label: 'Blog' },
                  { id: 'faq', label: 'SSS' },
                  { id: 'contact', label: 'İletişim' },
                  { id: 'balance', label: 'Bakiye' },
                  { id: 'profile', label: 'Profil' },
                  { id: 'tickets', label: 'Destek Talepleri' },
                  { id: 'favorites', label: 'Favoriler' },
                ].map((page) => (
                  <label key={page.id} className="flex items-center gap-2 p-3 bg-white/[0.02] rounded-lg cursor-pointer hover:bg-white/[0.04] transition-colors">
                    <input
                      type="checkbox"
                      checked={liveChatSettings.pages.includes(page.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setLiveChatSettings({ ...liveChatSettings, pages: [...liveChatSettings.pages, page.id] })
                        } else {
                          setLiveChatSettings({ ...liveChatSettings, pages: liveChatSettings.pages.filter(p => p !== page.id) })
                        }
                      }}
                      className="w-4 h-4 rounded border-white/20 bg-white/[0.03] text-violet-600"
                    />
                    <span className="text-sm text-gray-300">{page.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Canlı destek widget'ının hangi sayfalarda görüneceğini seçin</p>
            </div>
          </div>
        </div>
      )}

      {/* Discord Bot Settings */}
      {activeCategory === 'discord' && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Bot className="w-5 h-5 text-violet-400" />
            Discord Bot Ayarları
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl cursor-pointer">
              <div>
                <p className="text-white font-medium">Discord Rol Sistemi</p>
                <p className="text-sm text-gray-500">Ürün satın alanlara otomatik Discord rolü ver</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={discordBotSettings.enabled}
                  onChange={(e) => setDiscordBotSettings({ ...discordBotSettings, enabled: e.target.checked })} className="sr-only peer" />
                <div className="w-11 h-6 bg-white/[0.1] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
              </label>
            </label>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-amber-400 text-sm">
                <strong>Önemli:</strong> Bu özelliğin çalışması için kullanıcıların Discord ile giriş yapması ve hesaplarını bağlaması gerekir.
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Bot Token</label>
              <div className="relative">
                <input
                  type={discordBotSettings.showToken ? 'text' : 'password'}
                  value={discordBotSettings.botToken}
                  onChange={(e) => setDiscordBotSettings({ ...discordBotSettings, botToken: e.target.value })}
                  placeholder="MTIzNDU2Nzg5MDEyMzQ1Njc4OQ..."
                  className="w-full px-4 py-3 pr-10 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500"
                />
                <button type="button" onClick={() => setDiscordBotSettings({ ...discordBotSettings, showToken: !discordBotSettings.showToken })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {discordBotSettings.showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Discord Developer Portal'dan bot token'ınızı alın</p>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Sunucu (Guild) ID</label>
              <input
                type="text"
                value={discordBotSettings.guildId}
                onChange={(e) => setDiscordBotSettings({ ...discordBotSettings, guildId: e.target.value })}
                placeholder="123456789012345678"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Discord sunucunuzun ID'si (Geliştirici Modu açıkken sağ tık → ID'yi Kopyala)</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Müşteri Rol ID</label>
                <input
                  type="text"
                  value={discordBotSettings.customerRoleId}
                  onChange={(e) => setDiscordBotSettings({ ...discordBotSettings, customerRoleId: e.target.value })}
                  placeholder="123456789012345678"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Ücretsiz veya ücretli ürün alanlara verilecek rol</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Premium Rol ID</label>
                <input
                  type="text"
                  value={discordBotSettings.premiumRoleId}
                  onChange={(e) => setDiscordBotSettings({ ...discordBotSettings, premiumRoleId: e.target.value })}
                  placeholder="123456789012345678"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Sadece ücretli ürün alanlara verilecek ek rol</p>
              </div>
            </div>

            <div className="p-4 bg-white/[0.02] rounded-xl">
              <h4 className="text-white font-medium mb-2">Kurulum Adımları:</h4>
              <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                <li>Discord Developer Portal'da bir bot oluşturun</li>
                <li>Bot'a "Manage Roles" yetkisi verin</li>
                <li>Bot'u sunucunuza davet edin</li>
                <li>Bot rolünün, vereceği rollerden üstte olduğundan emin olun</li>
                <li>Yukarıdaki bilgileri doldurun ve kaydedin</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
