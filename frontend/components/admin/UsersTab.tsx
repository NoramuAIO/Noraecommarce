'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Eye, X, Shield, Ban, CheckCircle, Wallet, Loader2, Plus, Minus, Trash2 } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'

export default function UsersTab() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [balanceUser, setBalanceUser] = useState<any>(null)
  const [deleteUser, setDeleteUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { showToast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const data = await api.getUsers()
      setUsers(data)
    } catch (error) {
      console.error('Kullanıcılar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleBan = async (id: number) => {
    const user = users.find(u => u.id === id)
    const currentStatus = user?.status || 'active'
    const newStatus = currentStatus === 'banned' ? 'active' : 'banned'
    try {
      await api.updateUser(id, { status: newStatus })
      setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u))
    } catch (error) {
      console.error('Durum güncellenemedi:', error)
    }
  }

  const toggleAdmin = async (id: number) => {
    const user = users.find(u => u.id === id)
    const newRole = user?.role === 'admin' ? 'user' : 'admin'
    try {
      await api.updateUser(id, { role: newRole })
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u))
    } catch (error) {
      console.error('Rol güncellenemedi:', error)
    }
  }

  const handleBalanceUpdate = async (userId: number, newBalance: number, type: string, isRevenue: boolean) => {
    try {
      await api.updateUserBalance(userId, { newBalance, type, isRevenue })
      setUsers(users.map(u => u.id === userId ? { ...u, balance: newBalance } : u))
      setBalanceUser(null)
      showToast('Bakiye güncellendi!', 'success')
    } catch (error) {
      showToast('Bakiye güncellenemedi!', 'error')
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      await api.deleteUser(userId)
      setUsers(users.filter(u => u.id !== userId))
      setDeleteUser(null)
      showToast('Kullanıcı silindi!', 'success')
    } catch (error) {
      showToast('Kullanıcı silinemedi!', 'error')
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
        <h1 className="text-2xl font-bold text-white">Kullanıcı Yönetimi</h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-3 py-1.5 bg-violet-500/20 text-violet-400 rounded-lg">
            {users.length} Kullanıcı
          </span>
          <span className="px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
            {users.filter(u => u.role === 'admin').length} Admin
          </span>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Kullanıcı ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
        />
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left py-4 px-4 sm:px-6 text-sm font-medium text-gray-500">Kullanıcı</th>
              <th className="text-left py-4 px-4 sm:px-6 text-sm font-medium text-gray-500 hidden lg:table-cell">Kayıt Tarihi</th>
              <th className="text-left py-4 px-4 sm:px-6 text-sm font-medium text-gray-500 hidden sm:table-cell">Bakiye</th>
              <th className="text-left py-4 px-4 sm:px-6 text-sm font-medium text-gray-500 hidden md:table-cell">Sipariş</th>
              <th className="text-left py-4 px-4 sm:px-6 text-sm font-medium text-gray-500 hidden sm:table-cell">Rol</th>
              <th className="text-left py-4 px-4 sm:px-6 text-sm font-medium text-gray-500">Durum</th>
              <th className="text-right py-4 px-4 sm:px-6 text-sm font-medium text-gray-500">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                <td className="py-4 px-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-medium overflow-hidden flex-shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name[0]
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate max-w-[100px] sm:max-w-[150px]">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-[100px] sm:max-w-[150px]">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 sm:px-6 hidden lg:table-cell">
                  <div className="text-sm">
                    <p className="text-white">{new Date(user.createdAt).toLocaleDateString('tr-TR')}</p>
                    <p className="text-gray-500">{new Date(user.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </td>
                <td className="py-4 px-4 sm:px-6 hidden sm:table-cell">
                  <button 
                    onClick={() => setBalanceUser(user)}
                    className="text-white hover:text-emerald-400 transition-colors whitespace-nowrap"
                  >
                    ₺{user.balance || 0}
                  </button>
                </td>
                <td className="py-4 px-4 sm:px-6 text-gray-400 hidden md:table-cell">{user._count?.orders || 0}</td>
                <td className="py-4 px-4 sm:px-6 hidden sm:table-cell">
                  {user.role === 'admin' ? (
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-lg flex items-center gap-1 w-fit whitespace-nowrap">
                      <Shield className="w-3 h-3" />
                      Admin
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">Kullanıcı</span>
                  )}
                </td>
                <td className="py-4 px-4 sm:px-6">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
                    (!user.status || user.status === 'active')
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {(!user.status || user.status === 'active') ? 'Aktif' : 'Yasaklı'}
                  </span>
                </td>
                <td className="py-4 px-4 sm:px-6">
                  <div className="flex items-center justify-end gap-1">
                    <button 
                      onClick={() => setBalanceUser(user)}
                      className="p-2 hover:bg-emerald-500/10 rounded-lg text-gray-400 hover:text-emerald-400 sm:hidden"
                      title="Bakiye Ekle"
                    >
                      <Wallet className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400 hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => toggleAdmin(user.id)}
                      className={`p-2 rounded-lg hidden sm:block ${user.role === 'admin' ? 'bg-amber-500/10 text-amber-400' : 'hover:bg-white/[0.05] text-gray-400 hover:text-white'}`}
                    >
                      <Shield className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => toggleBan(user.id)}
                      className={`p-2 rounded-lg ${user.status === 'banned' ? 'bg-red-500/10 text-red-400' : 'hover:bg-red-500/10 text-gray-400 hover:text-red-400'}`}
                      title={user.status === 'banned' ? 'Yasağı Kaldır' : 'Yasakla'}
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setDeleteUser(user)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 hidden sm:block"
                      title="Kullanıcıyı Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedUser && (
          <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        )}
        {balanceUser && (
          <BalanceModal 
            user={balanceUser} 
            onClose={() => setBalanceUser(null)} 
            onUpdate={handleBalanceUpdate}
          />
        )}
        {deleteUser && (
          <DeleteModal 
            user={deleteUser} 
            onClose={() => setDeleteUser(null)} 
            onDelete={handleDeleteUser}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function UserModal({ user, onClose }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-dark-50 border border-white/[0.08] rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Kullanıcı Detayı</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name[0]
            )}
          </div>
          <h3 className="text-lg font-semibold text-white">{user.name}</h3>
          <p className="text-gray-500">{user.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-white/[0.02] rounded-xl text-center">
            <Wallet className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">₺{user.balance || 0}</p>
            <p className="text-xs text-gray-500">Bakiye</p>
          </div>
          <div className="p-4 bg-white/[0.02] rounded-xl text-center">
            <CheckCircle className="w-5 h-5 text-violet-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{user._count?.orders || 0}</p>
            <p className="text-xs text-gray-500">Sipariş</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-white/[0.05]">
            <span className="text-gray-500">Kayıt Tarihi</span>
            <span className="text-white">{new Date(user.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/[0.05]">
            <span className="text-gray-500">Rol</span>
            <span className="text-white">{user.role === 'admin' ? 'Admin' : 'Kullanıcı'}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Durum</span>
            <span className={(!user.status || user.status === 'active') ? 'text-emerald-400' : 'text-red-400'}>
              {(!user.status || user.status === 'active') ? 'Aktif' : 'Yasaklı'}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white font-medium hover:bg-white/[0.05]"
        >
          Kapat
        </button>
      </motion.div>
    </motion.div>
  )
}


function BalanceModal({ user, onClose, onUpdate }: { user: any; onClose: () => void; onUpdate: (userId: number, balance: number, type: string, isRevenue: boolean) => void }) {
  const [amount, setAmount] = useState('')
  const [operation, setOperation] = useState<'add' | 'subtract' | 'set'>('add')
  const [isRevenue, setIsRevenue] = useState(false)
  const [saving, setSaving] = useState(false)

  const currentBalance = user.balance || 0
  
  const getNewBalance = () => {
    const value = parseFloat(amount) || 0
    if (operation === 'add') return currentBalance + value
    if (operation === 'subtract') return Math.max(0, currentBalance - value)
    return value
  }

  const handleSubmit = async () => {
    if (!amount) return
    setSaving(true)
    await onUpdate(user.id, getNewBalance(), operation, isRevenue)
    setSaving(false)
  }

  const quickAmounts = [50, 100, 250, 500, 1000]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-dark-50 border border-white/[0.08] rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Bakiye İşlemi</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6 p-4 bg-white/[0.02] rounded-xl">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name[0]
            )}
          </div>
          <div>
            <p className="text-white font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-gray-500">Mevcut Bakiye</p>
            <p className="text-lg font-bold text-emerald-400">₺{currentBalance}</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-2 block">İşlem Türü</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setOperation('add')}
              className={`py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                operation === 'add' ? 'bg-emerald-500 text-white' : 'bg-white/[0.03] text-gray-400 hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4" />Ekle
            </button>
            <button
              onClick={() => setOperation('subtract')}
              className={`py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                operation === 'subtract' ? 'bg-red-500 text-white' : 'bg-white/[0.03] text-gray-400 hover:text-white'
              }`}
            >
              <Minus className="w-4 h-4" />Çıkar
            </button>
            <button
              onClick={() => setOperation('set')}
              className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                operation === 'set' ? 'bg-violet-500 text-white' : 'bg-white/[0.03] text-gray-400 hover:text-white'
              }`}
            >
              Ayarla
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-2 block">Miktar (₺)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-lg font-medium placeholder-gray-600 focus:outline-none focus:border-violet-500/50"
          />
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">Hızlı Seçim</label>
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((q) => (
              <button
                key={q}
                onClick={() => setAmount(q.toString())}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  amount === q.toString() ? 'bg-violet-500 text-white' : 'bg-white/[0.03] text-gray-400 hover:text-white'
                }`}
              >
                ₺{q}
              </button>
            ))}
          </div>
        </div>

        {/* Gelir olarak işaretle checkbox */}
        {operation === 'add' && (
          <label className="flex items-center gap-3 mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={isRevenue}
              onChange={(e) => setIsRevenue(e.target.checked)}
              className="w-5 h-5 rounded border-white/20 bg-white/[0.03] text-emerald-600"
            />
            <div>
              <p className="text-white font-medium">Gelir Olarak İşaretle</p>
              <p className="text-sm text-gray-500">Dashboard'da toplam gelire dahil edilsin</p>
            </div>
          </label>
        )}

        {amount && (
          <div className="mb-6 p-4 bg-white/[0.02] rounded-xl">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Mevcut Bakiye</span>
              <span className="text-white">₺{currentBalance}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">
                {operation === 'add' ? 'Eklenecek' : operation === 'subtract' ? 'Çıkarılacak' : 'Yeni Değer'}
              </span>
              <span className={operation === 'add' ? 'text-emerald-400' : operation === 'subtract' ? 'text-red-400' : 'text-violet-400'}>
                {operation === 'add' ? '+' : operation === 'subtract' ? '-' : ''}₺{amount || 0}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/[0.05]">
              <span className="text-gray-400 font-medium">Yeni Bakiye</span>
              <span className="text-white font-bold">₺{getNewBalance()}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white font-medium hover:bg-white/[0.05]"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!amount || saving}
            className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
            Uygula
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}


function DeleteModal({ user, onClose, onDelete }: { user: any; onClose: () => void; onDelete: (userId: number) => void }) {
  const [deleting, setDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const handleDelete = async () => {
    setDeleting(true)
    await onDelete(user.id)
    setDeleting(false)
  }

  const canDelete = confirmText === user.email

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-dark-50 border border-white/[0.08] rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-red-400">Kullanıcıyı Sil</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name[0]
            )}
          </div>
          <div>
            <p className="text-white font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <p className="text-amber-400 text-sm font-medium mb-2">⚠️ Dikkat!</p>
          <p className="text-gray-400 text-sm">
            Bu işlem geri alınamaz. Kullanıcının tüm verileri (siparişler, lisanslar, destek talepleri) silinecektir.
          </p>
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">
            Onaylamak için <span className="text-white font-mono">{user.email}</span> yazın
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="E-posta adresini yazın"
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white font-medium hover:bg-white/[0.05]"
          >
            İptal
          </button>
          <button
            onClick={handleDelete}
            disabled={!canDelete || deleting}
            className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Sil
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
