'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Calendar, Loader2, X, ChevronDown, Package } from 'lucide-react'
import api from '@/lib/api'

interface Order {
  id: number
  orderNumber: string
  amount: number
  status: string
  paymentMethod: string
  createdAt: string
  user: { id: number; name: string; email: string }
  product: { id: number; name: string; image?: string; price: number }
}

type FilterType = 'all' | 'paid' | 'free'
type DateFilter = 'all' | 'today' | 'week' | 'month' | 'year'

export default function SalesTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<FilterType>('all')
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [productFilter, setProductFilter] = useState<number | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [ordersData, productsData] = await Promise.all([
        api.getOrders(),
        api.getProducts()
      ])
      // Sadece tamamlanmış siparişleri al
      setOrders(ordersData.filter((o: Order) => o.status === 'completed'))
      setProducts(productsData)
    } catch (error) {
      console.error('Veriler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  // Tarih filtresi
  const filterByDate = (order: Order) => {
    if (dateFilter === 'all') return true
    
    const orderDate = new Date(order.createdAt)
    const now = new Date()
    
    switch (dateFilter) {
      case 'today':
        return orderDate.toDateString() === now.toDateString()
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return orderDate >= weekAgo
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        return orderDate >= monthAgo
      case 'year':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        return orderDate >= yearAgo
      default:
        return true
    }
  }

  // Filtrelenmiş siparişler
  const filteredOrders = orders.filter(order => {
    // Arama filtresi
    const matchesSearch = 
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Tip filtresi (ücretli/ücretsiz)
    const matchesType = 
      typeFilter === 'all' ||
      (typeFilter === 'free' && (order.amount === 0 || order.paymentMethod === 'free')) ||
      (typeFilter === 'paid' && order.amount > 0 && order.paymentMethod !== 'free')
    
    // Ürün filtresi
    const matchesProduct = !productFilter || order.product?.id === productFilter
    
    // Tarih filtresi
    const matchesDate = filterByDate(order)
    
    return matchesSearch && matchesType && matchesProduct && matchesDate
  })

  // İstatistikler
  const stats = {
    total: filteredOrders.length,
    paid: filteredOrders.filter(o => o.amount > 0 && o.paymentMethod !== 'free').length,
    free: filteredOrders.filter(o => o.amount === 0 || o.paymentMethod === 'free').length,
    revenue: filteredOrders.reduce((sum, o) => sum + (o.amount || 0), 0)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setTypeFilter('all')
    setDateFilter('all')
    setProductFilter(null)
  }

  const hasActiveFilters = searchQuery || typeFilter !== 'all' || dateFilter !== 'all' || productFilter

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
        <h1 className="text-2xl font-bold text-white">Satış Geçmişi</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            Toplam: <span className="text-white font-medium">{stats.total}</span> satış
          </span>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-gray-400 text-sm mb-1">Toplam Satış</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-gray-400 text-sm mb-1">Ücretli</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.paid}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-gray-400 text-sm mb-1">Ücretsiz</p>
          <p className="text-2xl font-bold text-blue-400">{stats.free}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-gray-400 text-sm mb-1">Toplam Gelir</p>
          <p className="text-2xl font-bold text-violet-400">₺{stats.revenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Arama ve Filtreler */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Arama */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Kullanıcı, e-posta, ürün veya sipariş no ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500"
            />
          </div>

          {/* Filtre Butonu */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
              hasActiveFilters 
                ? 'bg-violet-600/20 border-violet-500 text-violet-400' 
                : 'bg-white/[0.03] border-white/[0.08] text-gray-400 hover:text-white'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filtreler
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-violet-500" />
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filtre Paneli */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-white/[0.06]"
          >
            <div className="grid sm:grid-cols-3 gap-4">
              {/* Tip Filtresi */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Satış Tipi</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as FilterType)}
                  className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
                >
                  <option value="all" className="bg-dark">Tümü</option>
                  <option value="paid" className="bg-dark">Ücretli</option>
                  <option value="free" className="bg-dark">Ücretsiz</option>
                </select>
              </div>

              {/* Tarih Filtresi */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Tarih Aralığı</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                  className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
                >
                  <option value="all" className="bg-dark">Tüm Zamanlar</option>
                  <option value="today" className="bg-dark">Bugün</option>
                  <option value="week" className="bg-dark">Son 7 Gün</option>
                  <option value="month" className="bg-dark">Son 30 Gün</option>
                  <option value="year" className="bg-dark">Son 1 Yıl</option>
                </select>
              </div>

              {/* Ürün Filtresi */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Ürün</label>
                <select
                  value={productFilter || ''}
                  onChange={(e) => setProductFilter(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
                >
                  <option value="" className="bg-dark">Tüm Ürünler</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id} className="bg-dark">{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
                Filtreleri Temizle
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Satış Tablosu */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Kullanıcı</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Ürün</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Tip</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Tutar</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Tarih</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Sipariş No</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    {hasActiveFilters ? 'Filtrelere uygun satış bulunamadı' : 'Henüz satış yok'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isFree = order.amount === 0 || order.paymentMethod === 'free'
                  return (
                    <tr key={order.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center text-white font-medium">
                            {order.user?.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="text-white font-medium">{order.user?.name || 'Bilinmiyor'}</p>
                            <p className="text-sm text-gray-500">{order.user?.email || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center overflow-hidden">
                            {order.product?.image ? (
                              <img src={order.product.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          <span className="text-white">{order.product?.name || 'Bilinmiyor'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                          isFree 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {isFree ? 'Ücretsiz' : 'Ücretli'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-medium ${isFree ? 'text-blue-400' : 'text-emerald-400'}`}>
                          {isFree ? 'Ücretsiz' : `₺${order.amount}`}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(order.createdAt).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-500 font-mono text-sm">
                          {order.orderNumber?.slice(-10) || '-'}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
