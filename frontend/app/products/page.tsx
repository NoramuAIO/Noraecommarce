'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ShoppingCart, Star, Sparkles, Search, Grid3X3, List, Loader2 } from 'lucide-react'
import api from '@/lib/api'

interface Category {
  id: number
  name: string
  slug: string
  icon: string
  _count?: { products: number }
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice: number | null
  image?: string
  rating: number
  reviews: number
  badge: string | null
  category: Category
}

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [cats, prods] = await Promise.all([
        api.getCategories(),
        api.getProducts()
      ])
      setCategories(cats)
      setProducts(prods)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    // Ücretsiz ürünleri hariç tut (price > 0)
    if (product.price === 0) return false
    const matchesCategory = !selectedCategory || product.category?.id === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <main className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-dark">
      <Header />
      
      <section className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Ürünlerimiz
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Sunucunuz için en kaliteli Minecraft pluginlerini keşfedin
            </p>
          </motion.div>

          {/* Search & Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Plugin ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl border transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-violet-600 border-violet-600 text-white' 
                    : 'bg-white/[0.03] border-white/[0.08] text-gray-400 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl border transition-all ${
                  viewMode === 'list' 
                    ? 'bg-violet-600 border-violet-600 text-white' 
                    : 'bg-white/[0.03] border-white/[0.08] text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
                !selectedCategory
                  ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-500/25'
                  : 'bg-white/[0.03] border-white/[0.08] text-gray-300 hover:border-violet-500/30'
              }`}
            >
              <span className="text-lg">🎯</span>
              <span className="font-medium">Tümü</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${!selectedCategory ? 'bg-white/20' : 'bg-white/[0.05]'}`}>
                {products.filter(p => p.price > 0).length}
              </span>
            </motion.button>
            
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
                  selectedCategory === category.id
                    ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-500/25'
                    : 'bg-white/[0.03] border-white/[0.08] text-gray-300 hover:border-violet-500/30'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedCategory === category.id ? 'bg-white/20' : 'bg-white/[0.05]'
                }`}>
                  {category._count?.products || 0}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Products Grid/List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory + viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={viewMode === 'grid' 
                ? 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'
              }
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  {viewMode === 'grid' ? (
                    <ProductCard product={product} />
                  ) : (
                    <ProductListItem product={product} />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-400 text-lg">Aramanızla eşleşen ürün bulunamadı.</p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

function ProductCard({ product }: { product: Product }) {
  const badgeColors: Record<string, string> = {
    'Popüler': 'bg-violet-600 text-white font-bold shadow-lg shadow-violet-600/50',
    'Yeni': 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/50',
    'En Çok Satan': 'bg-amber-600 text-white font-bold shadow-lg shadow-amber-600/50',
    'Premium': 'bg-fuchsia-600 text-white font-bold shadow-lg shadow-fuchsia-600/50',
  }

  return (
    <motion.a 
      href={`/products/${product.id}`}
      className="glass-card overflow-hidden h-full flex flex-col cursor-pointer"
      whileHover={{ borderColor: 'rgba(139, 92, 246, 0.3)' }}
    >
      {/* Image Area */}
      <div className="relative h-36 bg-gradient-to-br from-white/[0.02] to-white/[0.05] flex items-center justify-center overflow-hidden">
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg ${badgeColors[product.badge] || 'bg-gray-500/20 text-gray-300'}`}>
              <Sparkles size={12} />
              {product.badge}
            </span>
          </div>
        )}
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
            className="text-5xl"
            whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
          >
            📦
          </motion.span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-white mb-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-sm text-white font-medium">{product.rating}</span>
          <span className="text-sm text-gray-500">({product.reviews})</span>
        </div>

        {/* Price & Button */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            {product.price === 0 ? (
              <span className="text-xl font-bold text-emerald-400">Ücretsiz</span>
            ) : (
              <>
                <span className="text-xl font-bold text-white">₺{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">₺{product.originalPrice}</span>
                )}
              </>
            )}
          </div>

          <motion.span 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/[0.05] hover:bg-violet-600 border border-white/[0.08] hover:border-violet-600 rounded-xl font-medium text-white transition-all duration-300 text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            Satın Al
          </motion.span>
        </div>
      </div>
    </motion.a>
  )
}

function ProductListItem({ product }: { product: Product }) {
  const badgeColors: Record<string, string> = {
    'Popüler': 'bg-violet-600 text-white font-bold shadow-lg shadow-violet-600/50',
    'Yeni': 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/50',
    'En Çok Satan': 'bg-amber-600 text-white font-bold shadow-lg shadow-amber-600/50',
    'Premium': 'bg-fuchsia-600 text-white font-bold shadow-lg shadow-fuchsia-600/50',
  }

  return (
    <motion.a 
      href={`/products/${product.id}`}
      className="glass-card p-4 flex items-center gap-6 cursor-pointer"
      whileHover={{ borderColor: 'rgba(139, 92, 246, 0.3)' }}
    >
      {/* Image */}
      <div className="w-16 h-16 bg-white/[0.03] rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl">📦</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-white">{product.name}</h3>
          {product.badge && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-lg ${badgeColors[product.badge] || 'bg-gray-500/20 text-gray-300'}`}>
              {product.badge}
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm mb-2">{product.description}</p>
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-sm text-white font-medium">{product.rating}</span>
          <span className="text-sm text-gray-500">({product.reviews} yorum)</span>
        </div>
      </div>

      {/* Price & Button */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="text-right">
          {product.price === 0 ? (
            <span className="text-xl font-bold text-emerald-400">Ücretsiz</span>
          ) : (
            <>
              <span className="text-xl font-bold text-white">₺{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">₺{product.originalPrice}</span>
              )}
            </>
          )}
        </div>
        <motion.span 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl font-medium text-white transition-all"
        >
          <ShoppingCart className="w-4 h-4" />
          Satın Al
        </motion.span>
      </div>
    </motion.a>
  )
}
