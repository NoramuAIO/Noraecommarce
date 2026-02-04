'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { Loader2, Menu, X, LogOut } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import DashboardTab from '@/components/admin/DashboardTab'
import ProductsTab from '@/components/admin/ProductsTab'
import CouponsTab from '@/components/admin/CouponsTab'
import BundlesTab from '@/components/admin/BundlesTab'
import CategoriesTab from '@/components/admin/CategoriesTab'
import BalanceTab from '@/components/admin/BalanceTab'
import BlogTab from '@/components/admin/BlogTab'
import SupportTab from '@/components/admin/SupportTab'
import FAQTab from '@/components/admin/FAQTab'
import UsersTab from '@/components/admin/UsersTab'
import FeaturesTab from '@/components/admin/FeaturesTab'
import TestimonialsTab from '@/components/admin/TestimonialsTab'
import ChangelogsTab from '@/components/admin/ChangelogsTab'
import ReviewsTab from '@/components/admin/ReviewsTab'
import NotificationsTab from '@/components/admin/NotificationsTab'
import ReferencesTab from '@/components/admin/ReferencesTab'
import ReferralsTab from '@/components/admin/ReferralsTab'
import SettingsTab from '@/components/admin/SettingsTab'
import LiveChatTab from '@/components/admin/LiveChatTab'
import SalesTab from '@/components/admin/SalesTab'
import PopupsTab from '@/components/admin/PopupsTab'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/')
    }
  }, [loading, isAdmin, router])

  // Tab değiştiğinde mobilde sidebar'ı kapat
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setSidebarOpen(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Erişim Engellendi</h1>
          <p className="text-gray-400">Bu sayfaya erişim yetkiniz yok.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-dark-50 border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.05]"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <span className="text-white font-semibold">Admin Panel</span>
        </Link>
        <Link href="/" className="p-2 text-gray-400 hover:text-white rounded-lg">
          <LogOut className="w-5 h-5" />
        </Link>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <AdminSidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-8 overflow-auto pt-20 lg:pt-8">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'coupons' && <CouponsTab />}
        {activeTab === 'bundles' && <BundlesTab />}
        {activeTab === 'categories' && <CategoriesTab />}
        {activeTab === 'changelogs' && <ChangelogsTab />}
        {activeTab === 'reviews' && <ReviewsTab />}
        {activeTab === 'balance' && <BalanceTab />}
        {activeTab === 'blog' && <BlogTab />}
        {activeTab === 'support' && <SupportTab />}
        {activeTab === 'livechat' && <LiveChatTab />}
        {activeTab === 'faq' && <FAQTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'features' && <FeaturesTab />}
        {activeTab === 'testimonials' && <TestimonialsTab />}
        {activeTab === 'references' && <ReferencesTab />}
        {activeTab === 'referrals' && <ReferralsTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'popups' && <PopupsTab />}
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'sales' && <SalesTab />}
      </div>
    </div>
  )
}
