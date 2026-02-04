'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Loader2, User, Headphones, MinusCircle } from 'lucide-react'
import api from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { useSite } from '@/lib/site-context'

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
  status: string
  messages: Message[]
}

export default function LiveChat() {
  const { user } = useAuth()
  const { settings } = useSite()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [chat, setChat] = useState<Chat | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '' })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Ayarlardan canlı destek aktif mi kontrol et
  const isEnabled = settings.liveChatEnabled === 'true'
  const welcomeMessage = settings.liveChatWelcome || 'Merhaba! Size nasıl yardımcı olabiliriz?'
  const offlineMessage = settings.liveChatOffline || 'Şu anda çevrimdışıyız. Lütfen destek talebi oluşturun.'
  
  // liveChatPages string olarak gelebilir, parse et
  let allowedPages: string[] = ['home', 'products', 'blog', 'faq', 'contact']
  if (settings.liveChatPages) {
    if (typeof settings.liveChatPages === 'string') {
      try {
        allowedPages = JSON.parse(settings.liveChatPages)
      } catch {
        allowedPages = ['home', 'products', 'blog', 'faq', 'contact']
      }
    } else if (Array.isArray(settings.liveChatPages)) {
      allowedPages = settings.liveChatPages
    }
  }

  // Sayfa kontrolü - hangi sayfalarda gösterilecek
  const pageMap: Record<string, string[]> = {
    home: ['/'],
    products: ['/products', '/product'],
    blog: ['/blog'],
    faq: ['/faq'],
    contact: ['/contact'],
    balance: ['/balance'],
    profile: ['/profile'],
    tickets: ['/tickets'],
    favorites: ['/favorites'],
  }

  const isPageAllowed = () => {
    for (const page of allowedPages) {
      const paths = pageMap[page] || []
      for (const path of paths) {
        if (pathname === path || pathname.startsWith(path + '/')) {
          return true
        }
      }
    }
    return false
  }

  useEffect(() => {
    // Session'dan chat'i yükle
    const sessionId = localStorage.getItem('livechat_session')
    if (sessionId) {
      loadChat(sessionId)
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Kullanıcı giriş yaptıysa form bilgilerini doldur
    if (user) {
      setFormData({ name: user.name, email: user.email })
    }
  }, [user])

  useEffect(() => {
    scrollToBottom()
  }, [chat?.messages])

  useEffect(() => {
    // Chat açıkken mesajları poll et
    if (isOpen && chat && chat.status !== 'closed') {
      pollIntervalRef.current = setInterval(() => {
        loadChat(chat.sessionId)
      }, 3000)
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [isOpen, chat?.sessionId, chat?.status])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadChat = async (sessionId: string) => {
    try {
      const data = await api.getLiveChatBySession(sessionId)
      if (data) {
        setChat(data)
        setShowForm(false)
      }
    } catch (error) {
      localStorage.removeItem('livechat_session')
    }
  }

  const startChat = async () => {
    if (!formData.name.trim()) return
    setLoading(true)
    try {
      const data = await api.startLiveChat({
        userName: formData.name,
        userEmail: formData.email || undefined,
        userId: user?.id,
      })
      setChat(data)
      localStorage.setItem('livechat_session', data.sessionId)
      setShowForm(false)
    } catch (error) {
      console.error('Chat başlatılamadı:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!message.trim() || !chat) return
    setSending(true)
    try {
      await api.sendLiveChatMessage(chat.sessionId, message)
      setMessage('')
      await loadChat(chat.sessionId)
    } catch (error) {
      console.error('Mesaj gönderilemedi:', error)
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (showForm) {
        startChat()
      } else {
        sendMessage()
      }
    }
  }

  const endChat = () => {
    localStorage.removeItem('livechat_session')
    setChat(null)
    setShowForm(true)
    setIsOpen(false)
  }

  if (!isEnabled || !isPageAllowed()) return null

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full shadow-lg shadow-violet-500/30 flex items-center justify-center text-white z-50"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 w-[360px] bg-dark-50 border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50 ${isMinimized ? 'h-14' : 'h-[500px]'}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Headphones className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm">Canlı Destek</h3>
                  <p className="text-xs text-white/70">
                    {chat?.status === 'active' ? 'Bağlandı' : chat?.status === 'waiting' ? 'Bekleniyor...' : 'Çevrimiçi'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <MinusCircle className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 h-[360px] overflow-y-auto p-4 space-y-3">
                  {showForm ? (
                    <div className="space-y-4">
                      <div className="text-center py-4">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-500/20 flex items-center justify-center">
                          <MessageCircle className="w-8 h-8 text-violet-400" />
                        </div>
                        <p className="text-gray-300 text-sm">{welcomeMessage}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Adınız *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          onKeyPress={handleKeyPress}
                          placeholder="Adınızı girin"
                          className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">E-posta (opsiyonel)</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          onKeyPress={handleKeyPress}
                          placeholder="E-posta adresiniz"
                          className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm placeholder-gray-500"
                        />
                      </div>
                      <button
                        onClick={startChat}
                        disabled={loading || !formData.name.trim()}
                        className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-white text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sohbeti Başlat'}
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Welcome message */}
                      <div className="flex gap-2">
                        <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                          <Headphones className="w-3.5 h-3.5 text-violet-400" />
                        </div>
                        <div className="bg-white/[0.05] rounded-2xl rounded-tl-sm px-3 py-2 max-w-[80%]">
                          <p className="text-sm text-gray-300">{welcomeMessage}</p>
                        </div>
                      </div>

                      {/* Messages */}
                      {chat?.messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-2 ${msg.isAdmin ? '' : 'flex-row-reverse'}`}>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.isAdmin ? 'bg-violet-500/20' : 'bg-emerald-500/20'}`}>
                            {msg.isAdmin ? (
                              <Headphones className="w-3.5 h-3.5 text-violet-400" />
                            ) : (
                              <User className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </div>
                          <div className={`rounded-2xl px-3 py-2 max-w-[80%] ${msg.isAdmin ? 'bg-white/[0.05] rounded-tl-sm' : 'bg-violet-600 rounded-tr-sm'}`}>
                            {msg.isAdmin && msg.adminName && (
                              <p className="text-xs text-violet-400 mb-1">{msg.adminName}</p>
                            )}
                            <p className="text-sm text-white">{msg.content}</p>
                            <p className="text-[10px] text-gray-500 mt-1">
                              {new Date(msg.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}

                      {chat?.status === 'closed' && (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">Bu sohbet sonlandırıldı.</p>
                          <button
                            onClick={endChat}
                            className="mt-2 text-sm text-violet-400 hover:text-violet-300"
                          >
                            Yeni sohbet başlat
                          </button>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Input */}
                {!showForm && chat?.status !== 'closed' && (
                  <div className="p-3 border-t border-white/[0.06]">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Mesajınızı yazın..."
                        className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={sending || !message.trim()}
                        className="px-3 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-white disabled:opacity-50"
                      >
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
