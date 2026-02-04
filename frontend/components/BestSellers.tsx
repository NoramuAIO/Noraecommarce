'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, Star, TrendingUp, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import api from '@/lib/api'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
}

export default function BestSellers() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await api.getBestSellers(8)
      // Sadece en az 1 satışı olan ürünleri göster
      setProducts(data.filter((p: any) => p.downloads > 0).slice(0, 8))
    } catch (error) {
      console.error('En çok satanlar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  // Hiç satış yoksa bölümü gösterme
  if (!loading && products.length === 0) {
    return null
  }

  return (
    <section id="best-sellers" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-600/[0.03] to-transparent" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
            className="inline-flex items-center gap-2 text-amber-400 text-sm font-medium tracking-wider uppercase mb-4"
          >
            <TrendingUp className="w-4 h-4" />
            En Çok Satanlar
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Popüler Ürünler
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Kullanıcılarımızın en çok tercih ettiği pluginler
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {loading ? (
            <div className="col-span-4 flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
          ) : products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link href={`/products/${product.id}`}>
                <motion.div 
                  className="glass-card overflow-hidden h-full flex flex-col relative"
                  whileHover={{ borderColor: 'rgba(251, 191, 36, 0.3)' }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Rank Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-bold rounded-lg ${
                      index === 0 ? 'bg-amber-500 text-black' :
                      index === 1 ? 'bg-gray-300 text-black' :
                      index === 2 ? 'bg-amber-700 text-white' :
                      'bg-white/10 text-white'
                    }`}>
                      #{index + 1}
                    </span>
                  </div>

                  {/* Sales Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-emerald-500/20 text-emerald-400">
                      <TrendingUp size={12} />
                      {product.downloads} satış
                    </span>
                  </div>

                  {/* Image Area */}
                  <div className="relative h-40 bg-gradient-to-br from-white/[0.02] to-white/[0.05] flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <motion.img 
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                      />
                    ) : (
                      <motion.span 
                        className="text-6xl"
                        whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.4 }}
                      >
                        📦
                      </motion.span>
                    )}
                    
                    {/* Hover Glow */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-t from-amber-600/10 to-transparent pointer-events-none"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-semibold text-white mb-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>

                    {/* Rating */}
                    {product.reviews > 0 && (
                      <div className="flex items-center gap-1.5 mb-4">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm text-white font-medium">{product.rating || '0'}</span>
                        <span className="text-sm text-gray-500">({product.reviews})</span>
                      </div>
                    )}

                    {/* Price & Button */}
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-4">
                        {product.price === 0 ? (
                          <span className="text-2xl font-bold text-emerald-400">Ücretsiz</span>
                        ) : (
                          <>
                            <span className="text-2xl font-bold text-white">₺{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ₺{product.originalPrice}
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white/[0.05] hover:bg-amber-600 border border-white/[0.08] hover:border-amber-600 rounded-xl font-medium text-white transition-all duration-300"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Satın Al
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/products">
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 glass-card glass-card-hover font-medium text-white"
            >
              Tüm Ürünleri Gör
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
