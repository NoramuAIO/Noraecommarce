'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Loader2 } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import api from '@/lib/api'

interface Feature {
  id: number
  title: string
  description: string
  icon: string
  color: string
  order: number
  active: boolean
}

const colorMap: Record<string, { gradient: string; iconBg: string; iconColor: string }> = {
  cyan: { gradient: 'from-cyan-500 to-blue-500', iconBg: 'bg-cyan-500/10', iconColor: 'text-cyan-400' },
  violet: { gradient: 'from-violet-500 to-purple-500', iconBg: 'bg-violet-500/10', iconColor: 'text-violet-400' },
  amber: { gradient: 'from-amber-500 to-orange-500', iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400' },
  pink: { gradient: 'from-pink-500 to-rose-500', iconBg: 'bg-pink-500/10', iconColor: 'text-pink-400' },
  emerald: { gradient: 'from-emerald-500 to-green-500', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' },
  blue: { gradient: 'from-blue-500 to-indigo-500', iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
  red: { gradient: 'from-red-500 to-rose-500', iconBg: 'bg-red-500/10', iconColor: 'text-red-400' },
  orange: { gradient: 'from-orange-500 to-amber-500', iconBg: 'bg-orange-500/10', iconColor: 'text-orange-400' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
}

export default function Features() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const data = await api.getFeatures()
        setFeatures(data)
      } catch (error) {
        console.error('Features yüklenemedi:', error)
      } finally {
        setLoading(false)
      }
    }
    loadFeatures()
  }, [])

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName]
    return Icon || LucideIcons.Sparkles
  }

  const getColorStyles = (color: string) => {
    return colorMap[color] || colorMap.violet
  }

  if (loading) {
    return (
      <section className="py-24 relative">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </section>
    )
  }

  if (features.length === 0) return null

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block"
          >
            Neden Biz?
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Farkımızı Keşfedin
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Yılların deneyimi ve müşteri memnuniyeti odaklı yaklaşımımızla hizmetinizdeyiz.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`grid gap-6 ${features.length <= 2 ? 'sm:grid-cols-2 max-w-2xl mx-auto' : features.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'}`}
        >
          {features.map((feature, index) => {
            const IconComponent = getIconComponent(feature.icon)
            const colors = getColorStyles(feature.color)
            
            return (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <motion.div 
                  className="glass-card glass-card-hover p-6 h-full relative overflow-hidden"
                  whileHover={{ borderColor: 'rgba(139, 92, 246, 0.3)' }}
                >
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.05 }}
                    className={`absolute inset-0 bg-gradient-to-br ${colors.gradient}`} 
                  />
                  
                  <motion.div 
                    className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center mb-5`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                    >
                      <IconComponent className={`w-6 h-6 ${colors.iconColor}`} />
                    </motion.div>
                  </motion.div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    {feature.title}
                    <motion.span
                      initial={{ opacity: 0, x: -10, y: 10 }}
                      whileHover={{ opacity: 0.5, x: 0, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.span>
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
