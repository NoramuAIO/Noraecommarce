'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Calendar, Clock, ArrowRight, Search, Loader2 } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'

interface BlogCategory {
  id: number
  name: string
  slug: string
}

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  image?: string
  readTime: string
  featured: boolean
  categoryId?: number
  category?: BlogCategory
  createdAt: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [postsData, categoriesData] = await Promise.all([
        api.getBlogPosts(),
        api.getBlogCategories()
      ])
      setPosts(postsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Veriler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === null || post.categoryId === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPosts = filteredPosts.filter(p => p.featured).slice(0, 2)
  const regularPosts = filteredPosts.filter(p => !featuredPosts.includes(p))

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
              Blog
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Güncellemeler, rehberler ve Minecraft dünyasından haberler
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Yazı ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl border transition-all ${
                selectedCategory === null
                  ? 'bg-violet-600 border-violet-600 text-white'
                  : 'bg-white/[0.03] border-white/[0.08] text-gray-300 hover:border-violet-500/30'
              }`}
            >
              Tümü
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl border transition-all ${
                  selectedCategory === category.id
                    ? 'bg-violet-600 border-violet-600 text-white'
                    : 'bg-white/[0.03] border-white/[0.08] text-gray-300 hover:border-violet-500/30'
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
          <>
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 gap-6 mb-10"
            >
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <Link href={`/blog/${post.id}`}>
                    <div className="glass-card overflow-hidden h-full">
                      <div className="h-48 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center overflow-hidden">
                        {post.image ? (
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-7xl">📝</span>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          {post.category && (
                            <span className="px-2.5 py-1 bg-violet-500/20 text-violet-300 text-xs font-medium rounded-lg">
                              {post.category.name}
                            </span>
                          )}
                          <span className="text-gray-500 text-sm flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readTime}
                          </span>
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                          <span className="text-violet-400 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                            Devamını Oku
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}

          {/* Regular Posts */}
          {regularPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {regularPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <Link href={`/blog/${post.id}`}>
                    <div className="glass-card p-5 h-full flex flex-col">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-white/[0.03] rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {post.image ? (
                            <img src={post.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">📝</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {post.category && (
                            <span className="text-xs text-violet-400 font-medium">
                              {post.category.name}
                            </span>
                          )}
                          <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}
          </>
          )}

          {/* Empty State */}
          {!loading && filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-400 text-lg">Henüz blog yazısı bulunmuyor.</p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
