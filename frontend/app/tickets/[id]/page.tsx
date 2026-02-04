'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import api from '@/lib/api'
import { 
  ArrowLeft, Send, Loader2, Clock, CheckCircle, 
  AlertCircle, MessageSquare, User, Shield
} from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: number
  message: string
  isAdmin: boolean
  createdAt: string
  user?: { name: string }
}

interface Ticket {
  id: number
  subject: string
  message: string
  category: string
  status: string
  createdAt: string
  updatedAt: string
  replies: Message[]
  user: { name: string; email: string }
}

const statusLabels: Record<string, { label: string; color: string; icon: any }> = {
  open: { label: 'Açık', color: 'bg-amber-500/20 text-amber-400', icon: Clock },
  answered: { label: 'Yanıtlandı', color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle },
  closed: { label: 'Kapalı', color: 'bg-gray-500/20 text-gray-400', icon: AlertCircle },
}

const categoryLabels: Record<string, string> = {
  technical: 'Teknik Destek',
  billing: 'Ödeme/Fatura',
  general: 'Genel Soru',
  bug: 'Hata Bildirimi',
  feature: 'Özellik Talebi',
}

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadTicket()
    }
  }, [params.id])

  const loadTicket = async () => {
    try {
      const data = await api.getTicket(Number(params.id))
      setTicket(data)
    } catch (error) {
      router.push('/profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending || !ticket) return

    setSending(true)
    try {
      await api.replyToTicket(ticket.id, newMessage)
      setNewMessage('')
      await loadTicket()
    } catch (error) {
      console.error('Mesaj gönderilemedi:', error)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-dark">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <Footer />
      </main>
    )
  }

  if (!ticket) {
    return (
      <main className="min-h-screen bg-dark">
        <Header />
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <AlertCircle className="w-16 h-16 text-gray-600 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Talep Bulunamadı</h1>
          <p className="text-gray-400 mb-6">Bu destek talebi mevcut değil veya erişim izniniz yok.</p>
          <Link href="/profile">
            <button className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium">
              Profile Dön
            </button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const status = statusLabels[ticket.status] || statusLabels.open
  const StatusIcon = status.icon

  return (
    <main className="min-h-screen bg-dark">
      <Header />
      
      <section className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/profile" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Profile Dön
            </Link>
          </motion.div>

          {/* Ticket Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-gray-500 font-mono">#{ticket.id}</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg ${status.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {status.label}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">{ticket.subject}</h1>
              </div>
              <div className="text-sm text-gray-500">
                <p>{categoryLabels[ticket.category] || ticket.category}</p>
                <p>{new Date(ticket.createdAt).toLocaleDateString('tr-TR', { 
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}</p>
              </div>
            </div>
          </motion.div>

          {/* Messages */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 mb-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-violet-400" />
              Mesajlar
            </h2>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {/* İlk mesaj (ticket oluşturulurken yazılan) */}
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-500/20">
                  <User className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1 max-w-[80%] text-right">
                  <div className="inline-block p-4 rounded-2xl bg-violet-600/20 border border-violet-500/20 rounded-tr-none">
                    <p className="text-gray-300 whitespace-pre-wrap">{ticket.message}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {ticket.user.name} • {new Date(ticket.createdAt).toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>
              
              {/* Yanıtlar */}
              {(ticket.replies || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.isAdmin ? '' : 'flex-row-reverse'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.isAdmin ? 'bg-violet-500/20' : 'bg-emerald-500/20'
                  }`}>
                    {msg.isAdmin ? (
                      <Shield className="w-5 h-5 text-violet-400" />
                    ) : (
                      <User className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                  <div className={`flex-1 max-w-[80%] ${msg.isAdmin ? '' : 'text-right'}`}>
                    <div className={`inline-block p-4 rounded-2xl ${
                      msg.isAdmin 
                        ? 'bg-white/[0.03] border border-white/[0.08] rounded-tl-none' 
                        : 'bg-violet-600/20 border border-violet-500/20 rounded-tr-none'
                    }`}>
                      <p className="text-gray-300 whitespace-pre-wrap">{msg.message}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {msg.isAdmin ? (msg.adminName || 'Destek Ekibi') : ticket.user.name} • {new Date(msg.createdAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Reply Form */}
          {ticket.status !== 'closed' ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <form onSubmit={handleSendMessage}>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 resize-none mb-4"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors"
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    Gönder
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 text-center"
            >
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">Bu destek talebi kapatılmıştır.</p>
              <Link href="/support">
                <button className="mt-4 px-6 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium">
                  Yeni Talep Oluştur
                </button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
