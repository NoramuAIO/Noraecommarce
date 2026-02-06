'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Save, Loader2, CheckCircle, XCircle, Link2, CreditCard } from 'lucide-react'
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
  creditGiven: boolean
  order: number
  active: boolean
  referrer: any
  referred: any
  createdAt: string
}

export default function ReferralsTab() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [savingCredits, setSavingCredits] = useState(false)
  const { showToast } = useToast()

  const [creditSettings, setCreditSettings] = useState({
    referralCreditReferred: 50,
    referralCreditReferrer: 50,
  })

  useEffect(() => {
    loadReferrals()
    loadCreditSettings()
  }, [])

  const loadCreditSettings = async () => {
    try {
      const data = await api.getSettings()
      if (data) {
        setCreditSettings({
          referralCreditReferred: parseFloat(data.referralCreditReferred) || 50,
          referralCreditReferrer: parseFloat(data.referralCreditReferrer) || 50,
        })
      }
    } catch (error) {
      console.error('Kredi ayarları yüklenemedi:', error)
    }
  }

  const loadReferrals = async () => {
    try {
      const data = await api.getAllReferrals()
      setReferrals(data)
    } catch (error) {
      showToast('Referanslar yüklenemedi', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu referansı silmek istediğinize emin misiniz?')) return

    try {
      await api.deleteReferral(id)
      showToast('Referans silindi', 'success')
      loadReferrals()
    } catch (error) {
      showToast('Referans silinemedi', 'error')
    }
  }

  const handleApprove = async (id: number) => {
    try {
      await api.approveReferral(id)
      showToast('Referans onaylandı', 'success')
      loadReferrals()
    } catch (error) {
      showToast('İşlem başarısız', 'error')
    }
  }

  const handleReject = async (id: number) => {
    try {
      await api.rejectReferral(id)
      showToast('Referans reddedildi', 'success')
      loadReferrals()
    } catch (error) {
      showToast('İşlem başarısız', 'error')
    }
  }

  const handleSaveCredits = async () => {
    setSavingCredits(true)
    try {
      await api.updateSettings({
        referralCreditReferred: String(creditSettings.referralCreditReferred),
        referralCreditReferrer: String(creditSettings.referralCreditReferrer),
      })
      showToast('Kredi ayarları kaydedildi', 'success')
    } catch (error) {
      showToast('Kredi ayarları kaydedilemedi', 'error')
    } finally {
      setSavingCredits(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Referansı Alan Kişi</h1>
          <p className="text-gray-500 mt-1">Referans yönetimi ve kredi ayarları</p>
        </div>
      </div>

      {/* Kredi Ayarları */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-8"
      >
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-violet-400" />
          Referral Kredi Ayarları
        </h2>
        <p className="text-sm text-gray-500 mb-6">Referral ile kayıt olan ve referral veren kullanıcılara verilecek kredi miktarı</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Referans Alan Kişiye Verilecek Kredi</label>
            <input
              type="number"
              value={creditSettings.referralCreditReferred}
              onChange={(e) => setCreditSettings({ ...creditSettings, referralCreditReferred: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
              min="0"
              step="1"
            />
            <p className="text-xs text-gray-500 mt-2">Referans linki ile kayıt olan kişi</p>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Referans Veren Kişiye Verilecek Kredi</label>
            <input
              type="number"
              value={creditSettings.referralCreditReferrer}
              onChange={(e) => setCreditSettings({ ...creditSettings, referralCreditReferrer: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
              min="0"
              step="1"
            />
            <p className="text-xs text-gray-500 mt-2">Referans veren kişi</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSaveCredits}
          disabled={savingCredits}
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium disabled:opacity-50 transition-colors"
        >
          {savingCredits ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {savingCredits ? 'Kaydediliyor...' : 'Kredi Ayarlarını Kaydet'}
        </motion.button>
      </motion.div>

      {/* Referrals List */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Ad</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">E-posta</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Durum</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Kredi Verildi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Aktif</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((referral) => (
                <tr key={referral.id} className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {referral.referrerImage && (
                        <img
                          src={referral.referrerImage}
                          alt={referral.referrerName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <span className="font-medium text-white">{referral.referrerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{referral.referrerEmail}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        referral.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : referral.status === 'rejected'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {referral.status === 'approved'
                        ? 'Onaylandı'
                        : referral.status === 'rejected'
                        ? 'Reddedildi'
                        : 'Beklemede'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${referral.creditGiven ? 'text-emerald-400' : 'text-gray-500'}`}>
                      {referral.creditGiven ? '✓ Verildi' : '✗ Verilmedi'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${referral.active ? 'text-emerald-400' : 'text-gray-500'}`}>
                      {referral.active ? '✓' : '✗'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {referral.status === 'pending' && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleApprove(referral.id)}
                            className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors"
                            title="Onayla"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleReject(referral.id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Reddet"
                          >
                            <XCircle className="w-4 h-4" />
                          </motion.button>
                        </>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(referral.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {referrals.length === 0 && (
          <div className="text-center py-12">
            <Link2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Henüz referans eklenmemiş</p>
          </div>
        )}
      </div>
    </div>
  )
}
