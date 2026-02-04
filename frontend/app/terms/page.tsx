'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FileText, CheckCircle, XCircle, AlertTriangle, Scale, RefreshCw } from 'lucide-react'

const sections = [
  {
    icon: CheckCircle,
    title: 'Kabul Edilen Kullanım',
    content: `Hizmetlerimizi kullanırken aşağıdaki kurallara uymanız gerekmektedir:

• Satın aldığınız pluginleri yalnızca kendi sunucunuzda kullanabilirsiniz
• Her lisans yalnızca 1 (bir) sunucu için geçerlidir
• Pluginleri üçüncü şahıslarla paylaşamazsınız
• Pluginlerin kaynak kodunu değiştiremez veya tersine mühendislik yapamazsınız
• Lisans anahtarınızı başkalarıyla paylaşamazsınız`
  },
  {
    icon: XCircle,
    title: 'Yasaklanan Kullanım',
    content: `Aşağıdaki davranışlar kesinlikle yasaktır:

• Pluginleri yeniden satmak veya dağıtmak
• Lisans sistemini atlatmaya çalışmak
• Zararlı amaçlarla kullanmak
• Başkalarının lisanslarını kullanmak
• Hizmetlerimize saldırı düzenlemek
• Sahte hesap oluşturmak

Bu kuralların ihlali hesabınızın kalıcı olarak kapatılmasına neden olabilir.`
  },
  {
    icon: Scale,
    title: 'Lisans Koşulları',
    content: `Satın aldığınız ürünler için:

• Lisans süresi: Süresiz (tek seferlik ödeme)
• Güncelleme hakkı: Ömür boyu ücretsiz
• Destek süresi: 1 yıl (yenilenebilir)
• Transfer: Lisanslar başkasına devredilemez
• IP Değişikliği: Yılda 3 kez ücretsiz

Lisans, ödemenin onaylanmasıyla birlikte aktif hale gelir.`
  },
  {
    icon: AlertTriangle,
    title: 'Sorumluluk Sınırları',
    content: `Noramu olarak:

• Pluginlerin kesintisiz çalışacağını garanti etmiyoruz
• Sunucu kaynaklı sorunlardan sorumlu değiliz
• Üçüncü taraf yazılımlarla uyumluluk garantisi vermiyoruz
• Dolaylı zararlardan sorumlu tutulamayız

Pluginlerimiz "olduğu gibi" sunulmaktadır. Kullanım öncesi test sunucusunda denemenizi öneririz.`
  },
  {
    icon: RefreshCw,
    title: 'Değişiklikler',
    content: `Bu şartlar önceden haber vermeksizin değiştirilebilir:

• Önemli değişiklikler e-posta ile bildirilir
• Değişiklikler yayınlandığı anda yürürlüğe girer
• Hizmeti kullanmaya devam etmeniz değişiklikleri kabul ettiğiniz anlamına gelir

Son güncelleme tarihini bu sayfanın başında bulabilirsiniz.`
  },
]

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-dark">
      <Header />
      
      <section className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-500/10 flex items-center justify-center"
            >
              <FileText className="w-8 h-8 text-blue-400" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Kullanım Şartları
            </h1>
            <p className="text-gray-400">
              Son güncelleme: 25 Aralık 2025
            </p>
          </motion.div>

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 mb-8"
          >
            <p className="text-gray-300 leading-relaxed">
              Noramu hizmetlerini kullanarak aşağıdaki şartları kabul etmiş sayılırsınız. 
              Lütfen bu şartları dikkatlice okuyunuz. Şartları kabul etmiyorsanız hizmetlerimizi kullanmayınız.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                </div>
                <div className="text-gray-400 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Agreement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 glass-card p-6 border-blue-500/20"
          >
            <p className="text-gray-300 text-center">
              Hizmetlerimizi kullanarak bu şartları okuduğunuzu ve kabul ettiğinizi onaylıyorsunuz.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
