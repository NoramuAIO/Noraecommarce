'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, Send, Loader2, User, Clock, X, Trash2, 
  CheckCircle, AlertCircle, Search, RefreshCw
} from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'

interface Message {
  id: number
  content: string
  isAdmin: boolean
  adminName?: string
  createdAt: string
}

interface Chat {
  id: number
  sessionId: string
  userName?: string
  userEmail?: string
  status: string
  createdAt: string
  updatedAt: string
  messages: Message[]
}

export default function LiveChatTab() {
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('active')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { showToast } = useToast()

  useEffect(() => {
    loadChats()
    const interval = setInterval(loadChats, 5000)
    return () => clearInterval(interval)
  }, [filter])

  useEffect(() => {
    if (selectedChat?.id) {
      loadChatDetail(selectedChat.id)
    }
  }, [selectedChat?.id])

  // Seçili chat'in mesajlarını periyodik güncelle
  useEffect(() => {
    if (!selectedChat?.id) return
    const interval = setInterval(() => {
      loadChatDetail(selectedChat.id)
    }, 3000)
    return () => clearInterval(interval)
  }, [selectedChat?.id])

  useEffect(() => {
    scrollToBottom()
  }, [selectedChat?.messages])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }

  const loadChats = async () => {
    try {
      const data = filter === 'active' 
        ? await api.getActiveChats()
        : await api.getAllChats()
      
      const filtered = filter === 'closed' 
        ? data.filter((c: Chat) => c.status === 'closed')
        : data
      
      setChats(filtered)
    } catch (error) {
      console.error('Chatler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadChatDetail = async (id: number) => {
    try {
      const data = await api.getLiveChatById(id)
      setSelectedChat(data)
      // Chat yüklendikten sonra scroll
      setTimeout(scrollToBottom, 100)
    } catch (error) {
      console.error('Chat detayı yüklenemedi:', error)
    }
  }

  const sendMessage = async () => {
    if (!message.trim() || !selectedChat) return
    setSending(true)
    try {
      await api.sendAdminChatMessage(selectedChat.id, message)
      setMessage('')
      await loadChatDetail(selectedChat.id)
      loadChats()
      // Mesaj gönderildikten sonra scroll
      setTimeout(scrollToBottom, 100)
    } catch (error) {
      showToast('Mesaj gönderilemedi', 'error')
    } finally {
      setSending(false)
    }
  }

  const closeChat = async (id: number) => {
    try {
      await api.closeLiveChat(id)
      showToast('Sohbet kapatıldı', 'success')
      if (selectedChat?.id === id) {
        await loadChatDetail(id)
      }
      loadChats()
    } catch (error) {
      showToast('Sohbet kapatılamadı', 'error')
    }
  }

  const deleteChat = async (id: number) => {
    if (!confirm('Bu sohbeti silmek istediğinize emin misiniz?')) return
    try {
      await api.deleteLiveChat(id)
      showToast('Sohbet silindi', 'success')
      if (selectedChat?.id === id) {
        setSelectedChat(null)
      }
      loadChats()
    } catch (error) {
      showToast('Sohbet silinemedi', 'error')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">Bekliyor</span>
      case 'active':
        return <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Aktif</span>
      case 'closed':
        return <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 text-xs rounded-full">Kapalı</span>
      default:
        return null
    }
  }

  const waitingCount = chats.filter(c => c.status === 'waiting').length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-180px)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Canlı Destek</h1>
          {waitingCount > 0 && (
            <p className="text-amber-400 text-sm mt-1">
              {waitingCount} kişi yanıt bekliyor
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'active' ? 'bg-violet-600 text-white' : 'bg-white/[0.03] text-gray-400 hover:text-white'
            }`}
          >
            Aktif
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'closed' ? 'bg-violet-600 text-white' : 'bg-white/[0.03] text-gray-400 hover:text-white'
            }`}
          >
            Kapalı
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-violet-600 text-white' : 'bg-white/[0.03] text-gray-400 hover:text-white'
            }`}
          >
            Tümü
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 h-full">
        {/* Chat List */}
        <div className="glass-card p-4 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-white">Sohbetler</h3>
            <button onClick={loadChats} className="p-1.5 hover:bg-white/[0.05] rounded-lg text-gray-400">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {chats.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Henüz sohbet yok</p>
              </div>
            ) : (
              chats.map((chat) => (
                <motion.button
                  key={chat.id}
                  onClick={() => {
                    setSelectedChat(chat)
                    loadChatDetail(chat.id)
                  }}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    selectedChat?.id === chat.id
                      ? 'bg-violet-600/20 border border-violet-500/30'
                      : 'bg-white/[0.02] hover:bg-white/[0.05] border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-medium text-white text-sm truncate">
                      {chat.userName || 'Anonim'}
                    </span>
                    {getStatusBadge(chat.status)}
                  </div>
                  {chat.userEmail && (
                    <p className="text-xs text-gray-500 truncate">{chat.userEmail}</p>
                  )}
                  {chat.messages?.[0] && (
                    <p className="text-xs text-gray-400 truncate mt-1">
                      {chat.messages[0].content}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-600 mt-1">
                    {new Date(chat.updatedAt).toLocaleString('tr-TR')}
                  </p>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Chat Detail */}
        <div className="col-span-2 glass-card overflow-hidden flex flex-col">
          {selectedChat ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{selectedChat.userName || 'Anonim'}</h3>
                    <p className="text-xs text-gray-500">{selectedChat.userEmail || 'E-posta yok'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedChat.status)}
                  {selectedChat.status !== 'closed' && (
                    <button
                      onClick={() => closeChat(selectedChat.id)}
                      className="p-2 hover:bg-amber-500/10 rounded-lg text-gray-400 hover:text-amber-400"
                      title="Sohbeti Kapat"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteChat(selectedChat.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedChat.messages?.map((msg) => (
                  <div key={msg.id} className={`flex gap-2 ${msg.isAdmin ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.isAdmin ? 'bg-violet-500/20' : 'bg-emerald-500/20'
                    }`}>
                      <User className={`w-4 h-4 ${msg.isAdmin ? 'text-violet-400' : 'text-emerald-400'}`} />
                    </div>
                    <div className={`rounded-2xl px-4 py-2 max-w-[70%] ${
                      msg.isAdmin ? 'bg-violet-600 rounded-tr-sm' : 'bg-white/[0.05] rounded-tl-sm'
                    }`}>
                      {msg.isAdmin && msg.adminName && (
                        <p className="text-xs text-violet-200 mb-1">{msg.adminName}</p>
                      )}
                      <p className="text-sm text-white">{msg.content}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              {selectedChat.status !== 'closed' && (
                <div className="p-4 border-t border-white/[0.06]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Mesajınızı yazın..."
                      className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={sendMessage}
                      disabled={sending || !message.trim()}
                      className="px-4 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white disabled:opacity-50"
                    >
                      {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </motion.button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Bir sohbet seçin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
