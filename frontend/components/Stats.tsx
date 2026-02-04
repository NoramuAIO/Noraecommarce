'use client'

import { motion, animate } from 'framer-motion'
import { useEffect, useState } from 'react'
import api from '@/lib/api'

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (value === 0) {
      setDisplayValue(0)
      return
    }
    
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplayValue(Math.floor(v)),
    })

    return () => controls.stop()
  }, [value])

  return (
    <span>
      {displayValue.toLocaleString()}{suffix}
    </span>
  )
}

export default function Stats() {
  const [stats, setStats] = useState([
    { value: 0, label: 'Aktif Kullanıcı', suffix: '+' },
    { value: 0, label: 'Toplam Sipariş', suffix: '+' },
    { value: 0, label: 'Premium Plugin', suffix: '+' },
    { value: 99, label: 'Memnuniyet', suffix: '%' },
  ])

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await api.getPublicStats()
      if (data) {
        setStats([
          { value: data.users || 0, label: 'Aktif Kullanıcı', suffix: '+' },
          { value: data.orders || 0, label: 'Toplam Sipariş', suffix: '+' },
          { value: data.products || 0, label: 'Premium Plugin', suffix: '+' },
          { value: 99, label: 'Memnuniyet', suffix: '%' },
        ])
      }
    } catch (error) {
      console.error('İstatistikler yüklenemedi:', error)
      // Varsayılan değerler zaten set edilmiş
    }
  }
  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 sm:p-12 relative overflow-hidden"
        >
          {/* Background Glow */}
          <motion.div
            animate={{ 
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[100px] pointer-events-none"
          />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <motion.p 
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.2, type: "spring", stiffness: 200 }}
                >
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </motion.p>
                <motion.p 
                  className="text-gray-400 text-sm sm:text-base"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.4 }}
                >
                  {stat.label}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
