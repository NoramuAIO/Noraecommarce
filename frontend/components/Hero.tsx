'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Zap, Shield, Clock, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useSite } from '@/lib/site-context'

export default function Hero() {
  const { settings } = useSite()

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Merkezi yumuşak gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.08)_0%,_transparent_70%)]" />
        
        {/* Animated Gradient Orbs - Merkezi ve simetrik */}
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-glow-primary rounded-full blur-[200px]" 
        />
        
        {/* Grid Pattern - Çok subtle */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          {/* Badge */}
          {settings.heroBadgeEnabled && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 cursor-default"
              style={{ 
                backgroundColor: `color-mix(in srgb, var(--color-primary) 10%, transparent)`,
                borderWidth: 1,
                borderColor: `color-mix(in srgb, var(--color-primary) 20%, transparent)`
              }}
            >
              <motion.span 
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-primary"
              >
                <Sparkles size={16} />
              </motion.span>
              <span className="text-sm" style={{ color: `color-mix(in srgb, var(--color-primary) 70%, white)` }}>{settings.heroBadgeText}</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={14} className="text-primary" />
              </motion.span>
            </motion.div>
          )}

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white inline-block"
            >
              {settings.heroTitle1}
            </motion.span>
            <br />
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-gradient inline-block"
            >
              {settings.heroTitle2}
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {settings.heroSubtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/products">
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 btn-primary rounded-2xl font-medium text-white transition-all shadow-xl"
              >
                Ürünleri Keşfet
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={20} />
                </motion.span>
              </motion.button>
            </Link>
            <a href={settings.discordLink} target="_blank" rel="noopener noreferrer">
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 glass-card glass-card-hover font-medium text-white"
              >
                Discord Sunucusu
              </motion.button>
            </a>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {[
              { icon: Zap, text: 'Yüksek Performans' },
              { icon: Shield, text: 'Güvenli Altyapı' },
              { icon: Clock, text: '7/24 Destek' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] cursor-default"
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                >
                  <item.icon size={16} className="text-primary" />
                </motion.span>
                <span className="text-sm text-gray-300">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border border-white/20 flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [0.8, 0.3, 0.8], y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1 bg-white/50 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
