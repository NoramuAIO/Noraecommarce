'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Wallet, CreditCard, Smartphone, Gift, Check, Sparkles, Loader2, AlertTriangle, Mail, MessageCircle, CheckCircle, XCircle } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'
import { PayTRLogo, IyzicoLogo, PaparaLogo } from '@/components/PaymentLogos'

export default function BalancePage() {
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  const [balancePackages, setBalancePackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(0)
  const [selectedMethod, setSelectedMethod] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [availableProviders, setAvailableProviders] = useState<any[]>([])
  const [paymentResult, setPaymentResult] = useState<'success' | 'fail' | null>(null)

  useEffect(() => {
    // URL'den ödeme sonucunu kontrol et
    const status = searchParams.get('status')
    if (status === 'success') {
      setPaymentResult('success')
      showToast('Ödeme başarılı! Bakiyeniz yüklendi.', 'success')
    } else if (status === 'fail') {
      setPaymentResult('fail')
      showToast('Ödeme başarısız oldu.', 'error')
    }
    
    loadData()
  }, [searchParams])

  const loadData = async () => {
    try {
      const [packagesData, providersData] = await Promise.all([
        api.getBalancePackages(),
        api.request('/payment/providers')
      ])
      
      const activePackages = packagesData.filter((p: any) => p.active !== false)
      setBalancePackages(activePackages)
      setAvailableProviders(providersData as any[])
      
      if (activePackages.length > 0) {
        const popular = activePackages.find((p: any) => p.popular) || activePackages[Math.floor(activePackages.length / 2)]
        setSelectedAmount(popular?.amount || activePackages[0].amount)
      }
      
      if ((providersData as any[]).length > 0) {
        setSelectedMethod((providersData as any[])[0].id)
      }
    } catch (error) {
      console.error('Veriler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedPackage = balancePackages.find(p => p.amount === selectedAmount)
  const bonus = selectedPackage?.bonus || 0
  const total = selectedAmount + bonus
  const finalAmount = customAmount ? parseInt(customAmount) || 0 : selectedAmount

  const handlePayment = async () => {
    if (!selectedMethod || finalAmount <= 0) {
      showToast('Lütfen miktar ve ödeme yöntemi seçin', 'error')
      return
    }

    setProcessing(true)
    try {
      const result = await api.request('/payment/create', {
        method: 'POST',
        body: JSON.stringify({
          provider: selectedMethod,
          amount: finalAmount,
          packageId: selectedPackage?.id,
        }),
      })

      // Ödeme yöntemine göre yönlendirme
      if (selectedMethod === 'paytr' && (result as any).iframeUrl) {
        // PayTR iframe'i aç
        window.location.href = (result as any).iframeUrl
      } else if (selectedMethod === 'iyzico' && (result as any).paymentPageUrl) {
        // iyzico sayfasına yönlendir
        window.location.href = (result as any).paymentPageUrl
      } else if (selectedMethod === 'papara' && (result as any).paymentUrl) {
        // Papara sayfasına yönlendir
        window.location.href = (result as any).paymentUrl
      } else {
        showToast('Ödeme başlatılamadı', 'error')
      }
    } catch (error: any) {
      showToast(error.message || 'Ödeme başlatılamadı', 'error')
    } finally {
      setProcessing(false)
    }
  }

  const getProviderLogo = (id: string) => {
    switch (id) {
      case 'paytr':
        return <PayTRLogo className="w-20 h-10" />
      case 'iyzico':
        return <IyzicoLogo className="w-20 h-10" />
      case 'papara':
        return <PaparaLogo className="w-20 h-10" />
      default:
        return null
    }
  }

  const getProviderIcon = (id: string) => {
    switch (id) {
      case 'paytr':
      case 'iyzico':
        return CreditCard
      case 'papara':
        return Smartphone
      default:
        return CreditCard
    }
  }

  const getProviderDescription = (id: string) => {
    switch (id) {
      case 'paytr':
        return 'Visa, Mastercard, Troy'
      case 'iyzico':
        return 'Kredi/Banka Kartı'
      case 'papara':
        return 'Anında yükleme'
      default:
        return ''
    }
  }

  // Ödeme sonucu gösterimi
  if (paymentResult) {
    return (
      <main className="min-h-screen bg-dark">
        <Header />
        <section className="pt-28 pb-20">
          <div className="max-w-md mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 text-center"
            >
              {paymentResult === 'success' ? (
                <>
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">Ödeme Başarılı!</h1>
                  <p className="text-gray-400 mb-6">Bakiyeniz hesabınıza yüklendi.</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                    <XCircle className="w-10 h-10 text-red-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">Ödeme Başarısız</h1>
                  <p className="text-gray-400 mb-6">Ödeme işlemi tamamlanamadı. Lütfen tekrar deneyin.</p>
                </>
              )}
              <div className="flex gap-3">
                <a
                  href="/balance"
                  className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium transition-colors"
                >
                  Tekrar Dene
                </a>
                <a
                  href="/profile"
                  className="flex-1 py-3 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] rounded-xl text-gray-300 font-medium transition-colors"
                >
                  Profile Git
                </a>
              </div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-dark">
      <Header />
      
      <section className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-500/10 flex items-center justify-center"
            >
              <Wallet className="w-8 h-8 text-emerald-400" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Bakiye Yükle
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Hesabınıza bakiye yükleyin ve alışverişlerinizde kullanın
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left - Amount Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Balance Packages */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
              >
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-violet-400" />
                  Bakiye Paketi Seçin
                </h2>
                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {balancePackages.map((pkg, index) => (
                    <motion.button
                      key={pkg.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedAmount(pkg.amount)
                        setCustomAmount('')
                      }}
                      className={`relative p-4 rounded-xl border transition-all ${
                        selectedAmount === pkg.amount && !customAmount
                          ? 'bg-violet-600/20 border-violet-500 text-white'
                          : 'bg-white/[0.02] border-white/[0.08] text-gray-300 hover:border-violet-500/30'
                      }`}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-violet-600 text-white text-xs font-medium rounded-full">
                          Popüler
                        </span>
                      )}
                      <div className="text-2xl font-bold">₺{pkg.amount}</div>
                      {pkg.bonus > 0 && (
                        <div className="text-sm text-emerald-400 mt-1">
                          +₺{pkg.bonus} bonus
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
                )}

                {/* Custom Amount */}
                <div className="mt-4">
                  <label className="text-sm text-gray-400 mb-2 block">veya özel miktar girin</label>
                  <input
                    type="number"
                    placeholder="Miktar (₺)"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedAmount(0)
                    }}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
              </motion.div>

              {/* Payment Methods */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6"
              >
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-violet-400" />
                  Ödeme Yöntemi
                </h2>
                
                {!loading && availableProviders.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                      <AlertTriangle className="w-8 h-8 text-amber-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Ödeme Yöntemleri Geçici Olarak Kapalı
                    </h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      Şu anda ödeme işlemleri gerçekleştirilememektedir. Bakiye yüklemek için lütfen yönetici ile iletişime geçin.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <a
                        href="/support"
                        className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Destek Talebi Oluştur
                      </a>
                      <a
                        href="mailto:destek@site.com"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] rounded-xl text-gray-300 font-medium transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        E-posta Gönder
                      </a>
                    </div>
                  </motion.div>
                ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {availableProviders.map((provider, index) => {
                    const logo = getProviderLogo(provider.id)
                    const Icon = getProviderIcon(provider.id)
                    return (
                      <motion.button
                        key={provider.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedMethod(provider.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                          selectedMethod === provider.id
                            ? 'bg-violet-600/20 border-violet-500'
                            : 'bg-white/[0.02] border-white/[0.08] hover:border-violet-500/30'
                        }`}
                      >
                        {logo ? (
                          logo
                        ) : (
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            selectedMethod === provider.id ? 'bg-violet-500/20' : 'bg-white/[0.05]'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              selectedMethod === provider.id ? 'text-violet-400' : 'text-gray-400'
                            }`} />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-white">{provider.name}</div>
                          <div className="text-sm text-gray-500">{getProviderDescription(provider.id)}</div>
                        </div>
                        {selectedMethod === provider.id && (
                          <Check className="w-5 h-5 text-violet-400" />
                        )}
                      </motion.button>
                    )
                  })}
                </div>
                )}
              </motion.div>
            </div>

            {/* Right - Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="glass-card p-6 sticky top-28">
                <h2 className="text-lg font-semibold text-white mb-6">Özet</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Yükleme Miktarı</span>
                    <span className="text-white">₺{finalAmount}</span>
                  </div>
                  {bonus > 0 && !customAmount && (
                    <div className="flex justify-between text-gray-400">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        Bonus
                      </span>
                      <span className="text-emerald-400">+₺{bonus}</span>
                    </div>
                  )}
                  <div className="border-t border-white/[0.08] pt-4">
                    <div className="flex justify-between">
                      <span className="font-medium text-white">Toplam Bakiye</span>
                      <span className="text-2xl font-bold text-white">
                        ₺{customAmount ? parseInt(customAmount) || 0 : total}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: availableProviders.length > 0 ? 1.02 : 1 }}
                  whileTap={{ scale: availableProviders.length > 0 ? 0.98 : 1 }}
                  disabled={availableProviders.length === 0 || processing || finalAmount <= 0}
                  onClick={handlePayment}
                  className={`w-full py-4 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2 ${
                    availableProviders.length > 0 && finalAmount > 0
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40' 
                      : 'bg-gray-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      İşleniyor...
                    </>
                  ) : availableProviders.length > 0 ? (
                    'Ödemeye Geç'
                  ) : (
                    'Ödeme Yöntemleri Kapalı'
                  )}
                </motion.button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Ödeme yaparak kullanım şartlarını kabul etmiş olursunuz
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
