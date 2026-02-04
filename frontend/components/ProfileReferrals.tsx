'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link2, Loader2, Plus, Mail, Globe, MessageCircle, Copy, Check } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'

interface Referral {
  id: number
  referrerName: string
  referrerEmail: string
  referrerImage?: string
  referrerWebsite?: string
  referrerDiscord?: string
  status: string
  active: boolean
  createdAt: string
}

interface Props {
  userId: number
}

export default function ProfileReferrals({ userId }: Props) {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [referralLink, setReferralLink] = useState<string>('')
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [generatingLink, setGeneratingLink] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    loadReferrals()
  }, [userId])

  const loadReferrals = async () => {
    try {
      const data = await api.getReferralsForUser(userId)
      setReferrals(data.filter((r: any) => r.active && r.status === 'approved'))
    } catch (error) {
      console.error('Referanslar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateLink = async () => {
    setGeneratingLink(true)
    try {
      const result = await api.generateReferralLink()
      setReferralLink(result.link)
      showToast('Referral linki oluşturuldu!', 'success')
    } catch (error) {
      showToast('Linki oluşturulamadı', 'error')
    } finally {
      setGeneratingLink(false)
    }
  }

  const handleCopyLink = () => {
    const fullLink = `${window.location.origin}/register?ref=${referralLink}`
    navigator.clipboard.writeText(fullLink)
    setCopiedLink(true)
    showToast('Linki kopyaladı!', 'success')
    setTimeout(() => setCopiedLink(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Yeni Referral Linki Oluştur */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-violet-400" />
          Yeni Referral Linki Oluştur
        </h2>

        {!showLinkForm ? (
          <button
            onClick={() => setShowLinkForm(true)}
            className="flex items-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Linki Oluştur
          </button>
        ) : (
          <div className="space-y-4">
            {!referralLink ? (
              <button
                onClick={handleGenerateLink}
                disabled={generatingLink}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-xl text-white font-medium transition-colors"
              >
                {generatingLink ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Linki Oluştur
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl">
                  <p className="text-sm text-gray-400 mb-2">Referral Linkin:</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={`${window.location.origin}/register?ref=${referralLink}`}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white/[0.02] border border-white/[0.08] rounded-lg text-white text-sm"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="p-2 hover:bg-violet-600/20 rounded-lg text-violet-400 transition-colors"
                    >
                      {copiedLink ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <p className="text-sm text-emerald-300">
                    ✓ Bu linki paylaş. Linke girenlere otomatik kredi verilecek!
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowLinkForm(false)
                    setReferralLink('')
                  }}
                  className="w-full px-4 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] rounded-xl text-white font-medium transition-colors"
                >
                  Kapat
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Referans Veren Kişiler */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-violet-400" />
          Referans Veren Kişiler
        </h2>

        {referrals.length === 0 ? (
          <div className="text-center py-12">
            <Link2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Henüz referans veren kişi yok</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {referrals.map((referral) => (
              <motion.div
                key={referral.id}
                whileHover={{ y: -4 }}
                className="glass-card p-4 border border-white/[0.08] hover:border-violet-500/30 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  {referral.referrerImage && (
                    <img
                      src={referral.referrerImage}
                      alt={referral.referrerName}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{referral.referrerName}</h3>
                    <p className="text-sm text-gray-400 truncate">{referral.referrerEmail}</p>
                  </div>
                </div>

                {/* Links */}
                <div className="space-y-2">
                  {referral.referrerWebsite && (
                    <a
                      href={referral.referrerWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <Globe className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">Website</span>
                    </a>
                  )}

                  {referral.referrerDiscord && (
                    <div className="flex items-center gap-2 text-sm text-indigo-400">
                      <MessageCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{referral.referrerDiscord}</span>
                    </div>
                  )}

                  {referral.referrerEmail && (
                    <a
                      href={`mailto:${referral.referrerEmail}`}
                      className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">E-posta Gönder</span>
                    </a>
                  )}
                </div>

                {/* Date */}
                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <p className="text-xs text-gray-500">
                    {new Date(referral.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
