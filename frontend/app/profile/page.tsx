'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import api from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/components/Toast'
import { 
  User, Mail, Key, ShoppingBag, MessageSquare, LogOut, Shield,
  Edit2, Copy, Check, Clock, AlertCircle, Loader2, Save, X, Download, Gift, Heart, Bell, Link2
} from 'lucide-react'
import Link from 'next/link'
import ProfileReferrals from '@/components/ProfileReferrals'

interface UserData {
  id: number; name: string; email: string; balance: number; role: string; createdAt: string; avatar?: string
}

const menuItems = [
  { id: 'contact', name: 'İletişim Bilgileri', icon: Mail },
  { id: 'favorites', name: 'Favorilerim', icon: Heart },
  { id: 'notifications', name: 'Bildirimler', icon: Bell },
  { id: 'licenses', name: 'Lisanslarım', icon: Key },
  { id: 'free', name: 'Ücretsiz Ürünlerim', icon: Gift },
  { id: 'orders', name: 'Siparişler', icon: ShoppingBag },
  { id: 'referrals', name: 'Referanslar', icon: Link2 },
  { id: 'support', name: 'Destekler', icon: MessageSquare },
]

export default function ProfilePage() {
  const router = useRouter()
  const { logout } = useAuth()
  const { showToast } = useToast()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('contact')
  const [orders, setOrders] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [licenses, setLicenses] = useState<any[]>([])
  const [freeLicenses, setFreeLicenses] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await api.getMe()
        setUser(userData)
        setEditForm({ name: userData.name })
        
        const [ordersData, ticketsData, favoritesData, notificationsData] = await Promise.all([
          api.getMyOrders().catch(() => []),
          api.getMyTickets().catch(() => []),
          api.getFavorites().catch(() => []),
          api.getProductNotifications().catch(() => []),
        ])
        setOrders(ordersData)
        setTickets(ticketsData)
        setFavorites(favoritesData)
        setNotifications(notificationsData)
        
        // Lisansları siparişlerden çıkar (ücretli ve ücretsiz ayrı)
        const allLicenses = ordersData
          .filter((o: any) => o.license)
          .map((o: any) => ({ 
            ...o.license, 
            productName: o.product?.name,
            downloadUrl: o.product?.downloadUrl,
            isFree: o.paymentMethod === 'free' || o.amount === 0
          }))
        
        setLicenses(allLicenses.filter((l: any) => !l.isFree))
        setFreeLicenses(allLicenses.filter((l: any) => l.isFree))
      } catch (error) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleSaveProfile = async () => {
    if (!user) return
    setSaving(true)
    try {
      await api.updateUser(user.id, { name: editForm.name })
      setUser({ ...user, name: editForm.name })
      setEditing(false)
    } catch (error) {
      showToast('Güncellenemedi!', 'error')
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(text)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-dark">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </main>
    )
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-dark">
      <Header />
      <section className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-28">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-4xl shadow-lg shadow-violet-500/25 overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name[0]?.toUpperCase() || '👤'
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-white">{user.name}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-lg">
                    <span className="text-emerald-400 font-medium">₺{user.balance}</span>
                    <span className="text-gray-500 text-sm">bakiye</span>
                  </div>
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <motion.button key={item.id} whileHover={{ x: 4 }} onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeTab === item.id ? 'bg-violet-600/20 text-violet-400' : 'text-gray-400 hover:bg-white/[0.03] hover:text-white'}`}>
                      <item.icon className="w-5 h-5" /><span className="font-medium">{item.name}</span>
                    </motion.button>
                  ))}
                </nav>

                {user.role === 'admin' && (
                  <Link href="/admin">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-3 px-4 py-3 mt-4 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20">
                      <Shield className="w-5 h-5" /><span className="font-medium">Admin Paneli</span>
                    </motion.button>
                  </Link>
                )}

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-red-400 hover:bg-red-500/10">
                  <LogOut className="w-5 h-5" /><span className="font-medium">Çıkış Yap</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3">
              {activeTab === 'favorites' && (
                <div className="glass-card p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Favorilerim</h2>
                  {favorites.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {favorites.map((fav: any) => (
                        <Link key={fav.id} href={`/products/${fav.product?.id}`}>
                          <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.05] hover:border-violet-500/30 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center overflow-hidden">
                                {fav.product?.image ? (
                                  <img src={fav.product.image} alt={fav.product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-2xl">📦</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-white">{fav.product?.name}</h3>
                                <p className="text-sm text-gray-500">{fav.product?.category?.name}</p>
                                <p className="text-violet-400 font-medium mt-1">₺{fav.product?.price}</p>
                              </div>
                              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="Henüz favori ürününüz bulunmuyor" />
                  )}
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Bildirimler</h2>
                    {notifications.length > 0 && (
                      <button 
                        onClick={async () => {
                          await api.markAllNotificationsRead()
                          setNotifications(notifications.map(n => ({ ...n, read: true })))
                        }}
                        className="text-sm text-violet-400 hover:text-violet-300"
                      >
                        Tümünü Okundu İşaretle
                      </button>
                    )}
                  </div>
                  {notifications.length > 0 ? (
                    <div className="space-y-3">
                      {notifications.map((notif: any) => (
                        <div 
                          key={notif.id} 
                          className={`p-4 rounded-xl border transition-all ${notif.read ? 'bg-white/[0.01] border-white/[0.05]' : 'bg-violet-500/5 border-violet-500/20'}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`w-2 h-2 rounded-full ${notif.read ? 'bg-gray-500' : 'bg-violet-500'}`} />
                                <span className="text-white font-medium">{notif.message}</span>
                              </div>
                              {(notif.oldValue || notif.newValue) && (
                                <div className="flex items-center gap-3 text-sm mt-2">
                                  {notif.oldValue && <span className="text-red-400 line-through">{notif.oldValue}</span>}
                                  {notif.oldValue && notif.newValue && <span className="text-gray-500">→</span>}
                                  {notif.newValue && <span className="text-emerald-400">{notif.newValue}</span>}
                                </div>
                              )}
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(notif.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            {!notif.read && (
                              <button 
                                onClick={async () => {
                                  await api.markNotificationRead(notif.id)
                                  setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n))
                                }}
                                className="text-xs text-gray-400 hover:text-white"
                              >
                                Okundu
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="Henüz bildiriminiz bulunmuyor" />
                  )}
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">İletişim Bilgileri</h2>
                    {!editing ? (
                      <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 text-sm text-violet-400 hover:bg-violet-500/10 rounded-lg">
                        <Edit2 className="w-4 h-4" />Düzenle
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm bg-violet-600 text-white rounded-lg disabled:opacity-50">
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}Kaydet
                        </button>
                        <button onClick={() => { setEditing(false); setEditForm({ name: user.name }) }} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:bg-white/[0.05] rounded-lg">
                          <X className="w-4 h-4" />İptal
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-500 mb-2 block">Ad Soyad</label>
                      {editing ? (
                        <input type="text" value={editForm.name} onChange={(e) => setEditForm({ name: e.target.value })}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white" />
                      ) : (
                        <div className="flex items-center gap-3 p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                          <User className="w-5 h-5 text-gray-500" /><span className="text-white">{user.name}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-2 block">E-posta</label>
                      <div className="flex items-center gap-3 p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                        <Mail className="w-5 h-5 text-gray-500" /><span className="text-white">{user.email}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-2 block">Kayıt Tarihi</label>
                      <div className="flex items-center gap-3 p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <span className="text-white">{new Date(user.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-2 block">Bakiye</label>
                      <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                        <span className="text-white font-medium">₺{user.balance}</span>
                        <Link href="/balance" className="text-sm text-violet-400 hover:underline">Yükle</Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'licenses' && (
                <div className="glass-card p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Lisanslarım</h2>
                  {licenses.length > 0 ? (
                    <div className="space-y-4">
                      {licenses.map((license: any) => (
                        <div key={license.id} className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-medium text-white">{license.productName || 'Ürün'}</h3>
                              <p className="text-sm text-gray-500">
                                {license.downloadUrl ? 'İndirme Linki' : 'Lisans Kodu'}
                              </p>
                            </div>
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${license.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                              {license.status === 'active' ? 'Aktif' : 'Pasif'}
                            </span>
                          </div>
                          
                          {license.downloadUrl ? (
                            <a 
                              href={license.downloadUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 p-3 bg-dark hover:bg-white/[0.05] rounded-lg text-violet-400 hover:text-violet-300 transition-all"
                            >
                              <Download className="w-4 h-4" />
                              <span className="font-medium">İndir</span>
                            </a>
                          ) : (
                            <div className="flex items-center gap-2 p-3 bg-dark rounded-lg">
                              <Key className="w-4 h-4 text-violet-400 flex-shrink-0" />
                              <code className="flex-1 text-sm text-gray-400 font-mono">{license.key}</code>
                              <button onClick={() => copyToClipboard(license.key)} className="p-2 hover:bg-white/[0.05] rounded-lg">
                                {copiedKey === license.key ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-500" />}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="Henüz lisansınız bulunmuyor" />
                  )}
                </div>
              )}

              {activeTab === 'free' && (
                <div className="glass-card p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Ücretsiz Ürünlerim</h2>
                  {freeLicenses.length > 0 ? (
                    <div className="space-y-4">
                      {freeLicenses.map((license: any) => (
                        <div key={license.id} className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-medium text-white">{license.productName || 'Ürün'}</h3>
                              <p className="text-sm text-gray-500">
                                {license.downloadUrl ? 'İndirme Linki' : 'Lisans Kodu'}
                              </p>
                            </div>
                            <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-500/20 text-emerald-400">
                              Ücretsiz
                            </span>
                          </div>
                          
                          {license.downloadUrl ? (
                            <a 
                              href={license.downloadUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 p-3 bg-dark hover:bg-white/[0.05] rounded-lg text-emerald-400 hover:text-emerald-300 transition-all"
                            >
                              <Download className="w-4 h-4" />
                              <span className="font-medium">İndir</span>
                            </a>
                          ) : (
                            <div className="flex items-center gap-2 p-3 bg-dark rounded-lg">
                              <Key className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              <code className="flex-1 text-sm text-gray-400 font-mono">{license.key}</code>
                              <button onClick={() => copyToClipboard(license.key)} className="p-2 hover:bg-white/[0.05] rounded-lg">
                                {copiedKey === license.key ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-500" />}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="Henüz ücretsiz ürününüz bulunmuyor" />
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="glass-card p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Siparişler</h2>
                  {orders.length > 0 ? (
                    <div className="space-y-3">
                      {orders.map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 font-mono">#{order.orderNumber?.slice(-8)}</span>
                            <div>
                              <span className="text-white">{order.product?.name || '-'}</span>
                              {order.discountAmount > 0 && (
                                <p className="text-xs text-emerald-400 mt-1">
                                  ₺{order.originalAmount?.toFixed(2)} → ₺{order.amount?.toFixed(2)} (-₺{order.discountAmount?.toFixed(2)})
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-white font-medium">₺{order.amount?.toFixed(2)}</span>
                            <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</span>
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                              order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                              order.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {order.status === 'completed' ? 'Tamamlandı' : order.status === 'pending' ? 'Bekliyor' : order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="Henüz siparişiniz bulunmuyor" />
                  )}
                </div>
              )}

              {activeTab === 'support' && (
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Destek Taleplerim</h2>
                    <Link href="/support">
                      <button className="flex items-center gap-2 px-4 py-2 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded-lg">Yeni Talep</button>
                    </Link>
                  </div>
                  {tickets.length > 0 ? (
                    <div className="space-y-3">
                      {tickets.map((ticket: any) => (
                        <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                          <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.05] hover:bg-white/[0.05] hover:border-violet-500/30 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-500 font-mono">#{ticket.id}</span>
                              <span className="text-white">{ticket.subject}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-500">{new Date(ticket.createdAt).toLocaleDateString('tr-TR')}</span>
                              <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                                ticket.status === 'open' ? 'bg-amber-500/20 text-amber-400' : 
                                ticket.status === 'answered' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {ticket.status === 'open' ? 'Açık' : ticket.status === 'answered' ? 'Yanıtlandı' : 'Kapalı'}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="Henüz destek talebiniz bulunmuyor" />
                  )}
                </div>
              )}

              {activeTab === 'referrals' && user && (
                <ProfileReferrals userId={user.id} />
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
      <p className="text-gray-500">{message}</p>
    </div>
  )
}
