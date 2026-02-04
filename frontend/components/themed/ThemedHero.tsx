'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Zap, Shield, Clock, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useSite } from '@/lib/site-context'
import { useTheme } from '@/lib/theme-context'
import ThemedButton from './ThemedButton'

export default function ThemedHero() {
  const { settings } = useSite()
  const { theme } = useTheme()

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden theme-hero">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden theme-hero-bg">
        {/* Dynamic background based on theme */}
        {theme.components.hero.backgroundStyle === 'gradient' && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.08)_0%,_transparent_70%)]" />
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-glow-primary rounded-full blur-[200px]" 
            />
          </>
        )}
        
        {theme.components.hero.backgroundStyle === 'grid' && (
          <div className="absolute inset-0 bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-[size:50px_50px]" />
        )}
        
        {theme.components.hero.backgroundStyle === 'particles' && (
          <>
            <motion.div 
              animate={{ 
                x: [0, 100, 0],
                y: [0, -50, 0],
              }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute top-20 left-20 w-64 h-64 bg-primary opacity-10 rounded-full blur-3xl" 
            />
            <motion.div 
              animate={{ 
                x: [0, -100, 0],
                y: [0, 50, 0],
              }}
              transition={{ duration: 25, repeat: Infinity }}
              className="absolute bottom-20 right-20 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl" 
            />
          </>
        )}
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={theme.components.hero.layout === 'centered' ? 'text-center' : 'text-left'}>
          {/* Badge */}
          {settings.heroBadgeEnabled && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 cursor-default ${
                theme.components.hero.layout === 'centered' ? '' : 'ml-0'
              }`}
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
              <span className="theme-text-sm" style={{ color: `color-mix(in srgb, var(--color-primary) 70%, white)` }}>
                {settings.heroBadgeText}
              </span>
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
            className="theme-text-5xl font-bold mb-6 tracking-tight"
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
            className="theme-text-lg text-secondary mb-10 max-w-2xl leading-relaxed"
            style={{ margin: theme.components.hero.layout === 'centered' ? '0 auto 2.5rem' : '0 0 2.5rem' }}
          >
            {settings.heroSubtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={`flex flex-col sm:flex-row gap-4 mb-16 ${
              theme.components.hero.layout === 'centered' ? 'justify-center' : 'justify-start'
            }`}
          >
            <Link href="/products">
              <ThemedButton variant="primary" size="lg">
                Ürünleri Keşfet
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={20} />
                </motion.span>
              </ThemedButton>
            </Link>
            <a href={settings.discordLink} target="_blank" rel="noopener noreferrer">
              <ThemedButton variant="secondary" size="lg">
                Discord Sunucusu
              </ThemedButton>
            </a>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className={`flex flex-wrap gap-4 ${
              theme.components.hero.layout === 'centered' ? 'justify-center' : 'justify-start'
            }`}
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
                <span className="theme-text-sm text-gray-300">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {theme.effects.animations !== 'none' && (
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
      )}
    </section>
  )
}
