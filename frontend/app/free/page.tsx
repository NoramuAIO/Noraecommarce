'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import api from '@/lib/api'
import { 
  Gift, Download, Star, Search, Grid3X3, List, 
  Loader2, Eye
} from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: number
  name: string
  slug: string
  icon: string
}

interface Product {
  id: number; name: string; description: string; image?: string
  rating: number; reviews: number; downloads: number; version: string
  category: { id: number; name: string; icon?: string }; downloadUrl?: string
}

export default function FreePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allProducts, cats] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ])
        // Sadece ücretsiz ürünleri filtrele (price === 0)
        const freeProducts = allProducts.filter((p: any) => p.price === 0)
        setProducts(freeProducts)
        setCategories(cats)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Kategoriye göre ücretsiz ürün sayısını hesapla
  const getCategoryFreeCount = (categoryId: number) => {
    return products.filter(p => p.category?.id === categoryId).length
  }

  const filteredProducts = products.filter(p => {
    const matchesCategory = !selectedCategory || p.category?.id === selectedCategory
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <main className="min-h-screen bg-dark">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-dark">
      <Header />
      
      <section className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Gift className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Ücretsiz Ürünler</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Ücretsiz <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Kaynaklar</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Tamamen ücretsiz ürünlerimizi keşfedin ve hemen kullanmaya başlayın
            </p>
          </motion.div>

          {/* Search & View Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Ücretsiz ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white/[0.03] text-gray-400 hover:text-white'}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white/[0.03] text-gray-400 hover:text-white'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                !selectedCategory
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-white/[0.03] border-white/[0.08] text-gray-300 hover:border-primary/30'
              }`}
            >
              <span className="text-lg">🎁</span>
              <span className="font-medium">Tümü</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${!selectedCategory ? 'bg-white/20' : 'bg-white/[0.05]'}`}>
                {products.length}
              </span>
            </motion.button>
            
            {categories.filter(cat => getCategoryFreeCount(cat.id) > 0).map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-white/[0.03] border-white/[0.08] text-gray-300 hover:border-primary/30'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedCategory === category.id ? 'bg-white/20' : 'bg-white/[0.05]'
                }`}>
                  {getCategoryFreeCount(category.id)}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Products */}
          {filteredProducts.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={viewMode === 'grid' ? '' : 'glass-card p-4'}
                >
                  {viewMode === 'grid' ? (
                    <div className="glass-card p-6 h-full flex flex-col group hover:border-primary/30 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                          {product.image ? (
                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">📦</span>
                          )}
                        </div>
                        <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-lg">
                          Ücretsiz
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                      <p className="text-gray-400 text-sm mb-4 flex-1">{product.description}</p>
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-white">{product.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Download className="w-4 h-4" />
                          <span>{product.downloads}</span>
                        </div>
                      </div>
                      <Link
                        href={`/products/${product.id}`}
                        className="w-full py-3 bg-gradient-to-r from-primary to-accent hover:opacity-90 rounded-xl font-medium text-white flex items-center justify-center gap-2"
                      >
                        <Eye className="w-5 h-5" />
                        Detay
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {product.image ? (
                          <img src={product.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl">📦</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">{product.name}</h3>
                        <p className="text-gray-500 text-sm truncate">{product.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-white">{product.rating}</span>
                        </div>
                        <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-lg">
                          Ücretsiz
                        </span>
                        <Link
                          href={`/products/${product.id}`}
                          className="px-4 py-2 bg-gradient-to-r from-primary to-accent rounded-lg font-medium text-white text-sm flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" /> Detay
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Gift className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Ücretsiz ürün bulunamadı</h3>
              <p className="text-gray-500">Henüz ücretsiz ürün eklenmemiş veya aramanızla eşleşen sonuç yok.</p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
