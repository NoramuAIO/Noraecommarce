'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Shield, Eye, Lock, Database, Bell, Mail } from 'lucide-react'

const sections = [
  {
    icon: Eye,
    title: 'Toplanan Bilgiler',
    content: `Hizmetlerimizi kullanırken aşağıdaki bilgileri topluyoruz:

• Hesap Bilgileri: Ad, e-posta adresi, kullanıcı adı
• Ödeme Bilgileri: Fatura adresi, ödeme yöntemi (kart bilgileri saklanmaz)
• Kullanım Verileri: IP adresi, tarayıcı türü, ziyaret edilen sayfalar
• Sunucu Bilgileri: Lisans kullanımı için sunucu IP adresleri

Kredi kartı bilgileriniz tarafımızca saklanmaz, doğrudan ödeme sağlayıcısı tarafından işlenir.`
  },
  {
    icon: Database,
    title: 'Bilgilerin Kullanımı',
    content: `Topladığımız bilgileri şu amaçlarla kullanıyoruz:

• Hesabınızı oluşturmak ve yönetmek
• Satın aldığınız ürünleri teslim etmek
• Lisans doğrulaması yapmak
• Teknik destek sağlamak
• Hizmetlerimizi geliştirmek
• Güvenlik önlemleri almak
• Yasal yükümlülüklerimizi yerine getirmek`
  },
  {
    icon: Lock,
    title: 'Bilgi Güvenliği',
    content: `Verilerinizin güvenliği bizim için önceliktir:

• 256-bit SSL şifreleme ile veri iletimi
• Güvenli sunucularda veri depolama
• Düzenli güvenlik denetimleri
• Erişim kontrolü ve yetkilendirme
• Şüpheli aktivite izleme

Güvenlik ihlali durumunda 72 saat içinde bilgilendirilirsiniz.`
  },
  {
    icon: Bell,
    title: 'Çerezler',
    content: `Web sitemizde çerezler kullanıyoruz:

• Zorunlu Çerezler: Site işlevselliği için gerekli
• Analitik Çerezler: Kullanım istatistikleri için
• Tercih Çerezleri: Ayarlarınızı hatırlamak için

Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz. Zorunlu çerezlerin devre dışı bırakılması site işlevselliğini etkileyebilir.`
  },
  {
    icon: Shield,
    title: 'Üçüncü Taraflar',
    content: `Bilgilerinizi şu durumlar dışında üçüncü taraflarla paylaşmıyoruz:

• Ödeme işlemleri için ödeme sağlayıcıları
• Yasal zorunluluklar (mahkeme kararı vb.)
• Hizmet sağlayıcılarımız (hosting, e-posta)

Üçüncü taraf hizmet sağlayıcılarımız da gizlilik standartlarımıza uymakla yükümlüdür.`
  },
  {
    icon: Mail,
    title: 'Haklarınız',
    content: `KVKK kapsamında aşağıdaki haklara sahipsiniz:

• Verilerinize erişim talep etme
• Verilerinizin düzeltilmesini isteme
• Verilerinizin silinmesini talep etme
• Veri işlemeye itiraz etme
• Veri taşınabilirliği

Bu haklarınızı kullanmak için destek@noramu.com adresine başvurabilirsiniz.`
  },
]

export default function PrivacyPage() {
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
              className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-violet-500/10 flex items-center justify-center"
            >
              <Shield className="w-8 h-8 text-violet-400" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Gizlilik Politikası
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
              Noramu olarak gizliliğinize önem veriyoruz. Bu politika, kişisel verilerinizin nasıl toplandığını, 
              kullanıldığını ve korunduğunu açıklamaktadır. Hizmetlerimizi kullanarak bu politikayı kabul etmiş sayılırsınız.
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
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                </div>
                <div className="text-gray-400 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-gray-500 text-sm"
          >
            Sorularınız için: <a href="mailto:destek@noramu.com" className="text-violet-400 hover:underline">destek@noramu.com</a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
