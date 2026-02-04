'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, Loader2 } from 'lucide-react'
import api from '@/lib/api'

interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  rating: number
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
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

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await api.getTestimonials()
        setTestimonials(data)
      } catch (error) {
        console.error('Yorumlar yüklenemedi:', error)
      } finally {
        setLoading(false)
      }
    }
    loadTestimonials()
  }, [])

  if (loading) {
    return (
      <section className="py-24 relative">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) return null

  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block"
          >
            Yorumlar
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Müşterilerimiz Ne Diyor?
          </motion.h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`grid gap-6 ${testimonials.length === 1 ? 'max-w-md mx-auto' : testimonials.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3'}`}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <motion.div 
                className="glass-card p-6 h-full relative overflow-hidden"
                whileHover={{ borderColor: 'rgba(139, 92, 246, 0.3)' }}
              >
                <motion.div
                  initial={{ opacity: 0.05 }}
                  whileHover={{ opacity: 0.1, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-primary" />
                </motion.div>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <Star className={`w-4 h-4 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />
                    </motion.span>
                  ))}
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-medium"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {testimonial.name[0]}
                  </motion.div>
                  <div>
                    <p className="font-medium text-white text-sm">{testimonial.name}</p>
                    <p className="text-gray-500 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
