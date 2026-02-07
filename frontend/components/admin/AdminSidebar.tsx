'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  LayoutDashboard, Package, FolderTree, Wallet, FileText, 
  MessageSquare, HelpCircle, Users, Settings, LogOut,
  Sparkles, Quote, Clock, Star, Bell, Palette, Award, Headphones, Receipt, Gift, Link2
} from 'lucide-react'
import { useSite } from '@/lib/site-context'

const menuGroups = [
  {
    title: null,
    items: [
      { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Mağaza',
    items: [
      { id: 'products', name: 'Ürünler', icon: Package },
      { id: 'coupons', name: 'Kuponlar', icon: Gift },
      { id: 'bundles', name: 'Bundleler', icon: Package },
      { id: 'categories', name: 'Kategoriler', icon: FolderTree },
      { id: 'changelogs', name: 'Değişiklikler', icon: Clock },
      { id: 'reviews', name: 'Değerlendirmeler', icon: Star },
    ]
  },
  {
    title: 'İçerik',
    items: [
      { id: 'blog', name: 'Blog', icon: FileText },
      { id: 'faq', name: 'SSS', icon: HelpCircle },
      { id: 'features', name: 'Özellikler', icon: Sparkles },
      { id: 'testimonials', name: 'Yorumlar', icon: Quote },
      { id: 'references', name: 'Referanslar', icon: Award },
      { id: 'referrals', name: 'Referans Sistemi', icon: Link2 },
    ]
  },
  {
    title: 'Yönetim',
    items: [
      { id: 'users', name: 'Kullanıcılar', icon: Users },
      { id: 'sales', name: 'Satışlar', icon: Receipt },
      { id: 'support', name: 'Destek Talepleri', icon: MessageSquare },
      { id: 'livechat', name: 'Canlı Destek', icon: Headphones },
      { id: 'balance', name: 'Bakiye', icon: Wallet },
    ]
  },
  {
    title: 'Sistem',
    items: [
      { id: 'notifications', name: 'Bildirimler', icon: Bell },
      { id: 'popups', name: 'Popuplar', icon: Bell },
      { id: 'theme', name: 'Tema Renkleri', icon: Palette },
      { id: 'settings', name: 'Ayarlar', icon: Settings },
    ]
  },
]

interface Props {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function AdminSidebar({ activeTab, setActiveTab }: Props) {
  const { settings, getImageUrl } = useSite()
  const logoUrl = settings.siteLogoDark || settings.siteLogo

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 bg-dark-50 border-r border-white/[0.06] p-5 flex flex-col h-screen overflow-hidden"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-3 py-4 mb-6">
        {logoUrl ? (
          <>
            <img 
              src={getImageUrl(logoUrl)} 
              alt={settings.siteName} 
              className="h-10 w-auto"
            />
            <span className="text-xs text-gray-500">Admin Panel</span>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold">{settings.siteName?.charAt(0) || 'N'}</span>
            </div>
            <div>
              <span className="text-white font-semibold">{settings.siteName}</span>
              <span className="text-xs text-gray-500 block">Admin Panel</span>
            </div>
          </>
        )}
      </Link>

      <nav className="flex-1 space-y-6 overflow-y-auto pb-4 pr-1">
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            {group.title && (
              <div className="px-3 mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {group.title}
                </span>
              </div>
            )}
            <div className="space-y-1.5">
              {group.items.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                    activeTab === item.id
                      ? 'bg-violet-600/20 text-violet-400 border-l-2 border-violet-500'
                      : 'text-gray-400 hover:bg-white/[0.03] hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm">{item.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="pt-4 border-t border-white/[0.06]">
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/[0.03] hover:text-white"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">Siteye Dön</span>
          </motion.button>
        </Link>
      </div>
    </motion.aside>
  )
}
