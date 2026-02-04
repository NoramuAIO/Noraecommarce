'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Eye, X, Send, Clock, CheckCircle, AlertCircle, MessageSquare, Loader2, StickyNote, Save } from 'lucide-react'
import api from '@/lib/api'

const statusColors: any = {
  open: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Açık' },
  pending: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Beklemede' },
  answered: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Yanıtlandı' },
  closed: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Kapalı' },
}

export default function SupportTab() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    try {
      const data = await api.getTickets()
      setTickets(data)
    } catch (error) {
      console.error('Talepler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.updateTicketStatus(id, status)
      setTickets(tickets.map(t => t.id === id ? { ...t, status } : t))
      if (selectedTicket?.id === id) {
        setSelectedTicket({ ...selectedTicket, status })
      }
    } catch (error) {
      console.error('Durum güncellenemedi:', error)
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
        <h1 className="text-2xl font-bold text-white">Destek Talepleri</h1>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-sm rounded-lg">
            {tickets.filter(t => t.status === 'open').length} Açık
          </span>
          <span className="px-3 py-1.5 bg-amber-500/20 text-amber-400 text-sm rounded-lg">
            {tickets.filter(t => t.status === 'pending').length} Beklemede
          </span>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Talep ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
        >
          <option value="all" className="bg-dark">Tümü</option>
          <option value="open" className="bg-dark">Açık</option>
          <option value="pending" className="bg-dark">Beklemede</option>
          <option value="closed" className="bg-dark">Kapalı</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">ID</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Kullanıcı</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Konu</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Tarih</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Durum</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                <td className="py-4 px-6 text-gray-400 font-mono">T-{String(ticket.id).padStart(3, '0')}</td>
                <td className="py-4 px-6 text-white">{ticket.user?.email || 'Bilinmiyor'}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-white">{ticket.subject}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {ticket.replies?.length || 0}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-400">{new Date(ticket.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${statusColors[ticket.status]?.bg || 'bg-gray-500/20'} ${statusColors[ticket.status]?.text || 'text-gray-400'}`}>
                    {statusColors[ticket.status]?.label || ticket.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button 
                    onClick={() => setSelectedTicket(ticket)}
                    className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400 hover:text-white"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedTicket && (
          <TicketModal 
            ticket={selectedTicket}
            onUpdateStatus={updateStatus}
            onClose={() => setSelectedTicket(null)}
            onRefresh={loadTickets}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function TicketModal({ ticket, onUpdateStatus, onClose, onRefresh }: any) {
  const [currentTicket, setCurrentTicket] = useState(ticket)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [adminNote, setAdminNote] = useState(ticket.adminNote || '')
  const [savingNote, setSavingNote] = useState(false)
  const [noteSaved, setNoteSaved] = useState(false)

  const handleReply = async () => {
    if (!reply.trim()) return
    setSending(true)
    try {
      const updatedTicket = await api.replyToTicket(currentTicket.id, reply)
      setReply('')
      setCurrentTicket(updatedTicket)
      if (onRefresh) onRefresh()
    } catch (error) {
      console.error('Yanıt gönderilemedi:', error)
    } finally {
      setSending(false)
    }
  }

  const handleSaveNote = async () => {
    setSavingNote(true)
    try {
      await api.updateTicketAdminNote(currentTicket.id, adminNote)
      setNoteSaved(true)
      setTimeout(() => setNoteSaved(false), 2000)
    } catch (error) {
      console.error('Not kaydedilemedi:', error)
    } finally {
      setSavingNote(false)
    }
  }

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
        className="bg-dark-50 border border-white/[0.08] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">{currentTicket.subject}</h2>
            <p className="text-sm text-gray-500">T-{String(currentTicket.id).padStart(3, '0')} • {currentTicket.user?.email}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/[0.05] rounded-lg text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Actions */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => onUpdateStatus(currentTicket.id, 'open')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${currentTicket.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.03] text-gray-400'}`}
          >
            <AlertCircle className="w-4 h-4" />
            Açık
          </button>
          <button
            onClick={() => onUpdateStatus(currentTicket.id, 'pending')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${currentTicket.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/[0.03] text-gray-400'}`}
          >
            <Clock className="w-4 h-4" />
            Beklemede
          </button>
          <button
            onClick={() => onUpdateStatus(currentTicket.id, 'closed')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${currentTicket.status === 'closed' ? 'bg-gray-500/20 text-gray-400' : 'bg-white/[0.03] text-gray-400'}`}
          >
            <CheckCircle className="w-4 h-4" />
            Kapat
          </button>
        </div>

        {/* Admin Note */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <StickyNote className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">Yetkili Notu</span>
            <span className="text-xs text-gray-500">(Sadece yetkililer görebilir)</span>
          </div>
          <div className="flex gap-2">
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Bu talep hakkında özel not ekle..."
              rows={2}
              className="flex-1 px-4 py-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:border-amber-500/50"
            />
            <button
              onClick={handleSaveNote}
              disabled={savingNote}
              className={`px-4 py-3 rounded-xl text-white flex items-center gap-2 ${noteSaved ? 'bg-emerald-600' : 'bg-amber-600 hover:bg-amber-500'} disabled:opacity-50`}
            >
              {savingNote ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : noteSaved ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Save className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4 mb-6 max-h-64 overflow-auto">
          <div className="p-4 bg-white/[0.02] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{currentTicket.user?.email}</span>
              <span className="text-xs text-gray-500">{new Date(currentTicket.createdAt).toLocaleDateString('tr-TR')}</span>
            </div>
            <p className="text-gray-400">{currentTicket.message}</p>
          </div>
          {currentTicket.replies?.map((r: any, i: number) => (
            <div key={i} className={`p-4 rounded-xl ${r.isAdmin ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-white/[0.02]'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium ${r.isAdmin ? 'text-violet-400' : 'text-white'}`}>
                  {r.isAdmin ? (r.adminName || 'Destek Ekibi') : currentTicket.user?.email}
                </span>
                <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
              <p className="text-gray-300">{r.message}</p>
            </div>
          ))}
        </div>

        {/* Reply */}
        <div className="flex gap-3">
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Yanıt yaz..."
            className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500"
          />
          <button 
            onClick={handleReply}
            disabled={sending || !reply.trim()}
            className="px-4 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
