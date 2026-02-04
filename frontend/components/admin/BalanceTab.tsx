'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Plus, Trash2, Gift, Percent, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'

export default function BalanceTab() {
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const [settings, setSettings] = useState({
    minAmount: 10,
    maxAmount: 5000,
    customAmountEnabled: true,
    bonusEnabled: true,
  })

  useEffect(() => {
    loadPackages()
  }, [])

  const loadPackages = async () => {
    try {
      const data = await api.getBalancePackages()
      setPackages(data)
    } catch (error) {
      console.error('Paketler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const updatePackage = (id: number, field: string, value: any) => {
    setPackages(packages.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  const addPackage = async () => {
    try {
      const newPkg = await api.createBalancePackage({ amount: 0, bonus: 0, active: true })
      setPackages([...packages, newPkg])
    } catch (error) {
      console.error('Paket eklenemedi:', error)
    }
  }

  const removePackage = async (id: number) => {
    if (packages.length > 1) {
      try {
        await api.deleteBalancePackage(id)
        setPackages(packages.filter(p => p.id !== id))
      } catch (error) {
        console.error('Paket silinemedi:', error)
      }
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      for (const pkg of packages) {
        await api.updateBalancePackage(pkg.id, { amount: pkg.amount, bonus: pkg.bonus, active: pkg.active })
      }
      showToast('Paketler kaydedildi!', 'success')
    } catch (error) {
      console.error('Kaydetme hatası:', error)
      showToast('Paketler kaydedilemedi!', 'error')
    } finally {
      setSaving(false)
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
        <h1 className="text-2xl font-bold text-white">Bakiye Ayarları</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Kaydet
        </motion.button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Packages */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-violet-400" />
              Bakiye Paketleri
            </h2>
            <button
              onClick={addPackage}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-violet-400 hover:bg-violet-500/10 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Ekle
            </button>
          </div>

          <div className="space-y-4">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]"
              >
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Miktar (₺)</label>
                    <input
                      type="number"
                      value={pkg.amount}
                      onChange={(e) => updatePackage(pkg.id, 'amount', Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Bonus (₺)</label>
                    <input
                      type="number"
                      value={pkg.bonus}
                      onChange={(e) => updatePackage(pkg.id, 'bonus', Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pkg.active}
                      onChange={(e) => updatePackage(pkg.id, 'active', e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/[0.03] text-violet-600"
                    />
                    <span className="text-xs text-gray-400">Aktif</span>
                  </label>
                  <button
                    onClick={() => removePackage(pkg.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Preview */}
          <div className="mt-6 pt-6 border-t border-white/[0.05]">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Önizleme</h3>
            <div className="flex flex-wrap gap-2">
              {packages.filter(p => p.active).map(pkg => (
                <div key={pkg.id} className="px-3 py-2 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                  <span className="text-white font-medium">₺{pkg.amount}</span>
                  {pkg.bonus > 0 && (
                    <span className="text-emerald-400 text-sm ml-1">+₺{pkg.bonus}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Percent className="w-5 h-5 text-violet-400" />
            Genel Ayarlar
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Minimum Yükleme (₺)</label>
                <input
                  type="number"
                  value={settings.minAmount}
                  onChange={(e) => setSettings({ ...settings, minAmount: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Maksimum Yükleme (₺)</label>
                <input
                  type="number"
                  value={settings.maxAmount}
                  onChange={(e) => setSettings({ ...settings, maxAmount: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl cursor-pointer">
                <div>
                  <p className="text-white font-medium">Özel Miktar Girişi</p>
                  <p className="text-sm text-gray-500">Kullanıcılar özel miktar girebilsin</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.customAmountEnabled}
                  onChange={(e) => setSettings({ ...settings, customAmountEnabled: e.target.checked })}
                  className="w-5 h-5 rounded border-white/20 bg-white/[0.03] text-violet-600"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl cursor-pointer">
                <div>
                  <p className="text-white font-medium">Bonus Sistemi</p>
                  <p className="text-sm text-gray-500">Paket bonusları aktif olsun</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.bonusEnabled}
                  onChange={(e) => setSettings({ ...settings, bonusEnabled: e.target.checked })}
                  className="w-5 h-5 rounded border-white/20 bg-white/[0.03] text-violet-600"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
