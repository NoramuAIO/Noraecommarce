'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Globe, MessageCircle } from 'lucide-react'
import api from '@/lib/api'

interface Reference {
  id: number
  name: string
  image: string
  website?: string
  discord?: string
}

export default function References() {
  const [references, setReferences] = useState<Reference[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getReferences()
      .then(setReferences)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading || references.length === 0) return null

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-medium tracking-wider uppercase">Referanslar</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Bizi Tercih Edenler
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Ürünlerimizi kullanan sunucular ve topluluklar
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {references.map((ref, index) => (
            <motion.div
              key={ref.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-4 hover:border-primary/30 transition-all duration-300">
                <div className="aspect-video rounded-lg bg-white/[0.03] overflow-hidden mb-3">
                  <img 
                    src={ref.image} 
                    alt={ref.name} 
                    className="w-full h-full object-cover object-center" 
                  />
                </div>
                <h3 className="text-white font-medium text-center mb-2">{ref.name}</h3>
                {(ref.website || ref.discord) && (
                  <div className="flex items-center justify-center gap-3">
                    {ref.website && (
                      <a 
                        href={ref.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 rounded-lg bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                    {ref.discord && (
                      <a 
                        href={ref.discord} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 rounded-lg bg-white/[0.03] text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
