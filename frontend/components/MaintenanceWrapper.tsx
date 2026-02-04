'use client'

import { useSite } from '@/lib/site-context'
import { useAuth } from '@/lib/auth-context'
import { motion } from 'framer-motion'
import { Wrench, Clock, Loader2 } from 'lucide-react'
import { ReactNode } from 'react'

export default function MaintenanceWrapper({ children }: { children: ReactNode }) {
  const { settings, loading } = useSite()
  const { user } = useAuth()

  // Ayarlar yüklenirken bekle
  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Admin kullanıcılar bakım modunda da siteyi görebilir
  if (settings.maintenanceMode && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-primary-10 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Wrench className="w-12 h-12 text-primary" />
            </motion.div>
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Bakım Çalışması
          </h1>
          
          <p className="text-gray-400 mb-8">
            Sitemiz şu anda bakım çalışması nedeniyle geçici olarak kapalıdır. 
            En kısa sürede tekrar hizmetinizde olacağız.
          </p>
          
          {settings.maintenanceEstimate && (
            <div className="glass-card p-4 inline-flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-gray-300">Tahmini süre: {settings.maintenanceEstimate}</span>
            </div>
          )}

          {!settings.maintenanceEstimate && (
            <div className="glass-card p-4 inline-flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-gray-300">Tahmini süre: Bilinmiyor</span>
            </div>
          )}

          <div className="mt-4">
            <a 
              href={settings.discordLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] rounded-xl text-white font-medium transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Gelişmeler için {settings.discordName}'a gelin
            </a>
          </div>

          <div className="mt-8 pt-8 border-t border-white/[0.08]">
            <p className="text-sm text-gray-500">
              Sorularınız için: <a href={`mailto:${settings.contactEmail}`} className="text-primary hover:underline">{settings.contactEmail}</a>
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}
