'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Calendar, Clock, ArrowLeft, Loader2, User } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'
import MarkdownRenderer from '@/components/MarkdownRenderer'

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  image?: string
  author: string
  readTime: string
  featured: boolean
  category?: { id: number; name: string; slug: string }
  createdAt: string
}

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadPost(params.id as string)
    }
  }, [params.id])

  const loadPost = async (id: string) => {
    try {
      const data = await api.getBlogPost(id)
      if (!data) {
        router.push('/blog')
        return
      }
      setPost(data)
    } catch (error) {
      console.error('Blog yazısı yüklenemedi:', error)
      router.push('/blog')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-dark">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </main>
    )
  }

  if (!post) return null

  return (
    <main className="min-h-screen bg-dark">
      <Header />
      
      <article className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Blog'a Dön
            </Link>
          </motion.div>

          <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            {post.category && (
              <span className="inline-block px-3 py-1 bg-violet-500/20 text-violet-300 text-sm font-medium rounded-lg mb-4">
                {post.category.name}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-400">
              <span className="flex items-center gap-2"><User className="w-4 h-4" />{post.author}</span>
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{post.readTime}</span>
            </div>
          </motion.header>

          {post.image && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10">
              <img src={post.image} alt={post.title} className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl" />
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }} 
          >
            <MarkdownRenderer content={post.content} />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-12 pt-8 border-t border-white/[0.08]">
            <Link href="/blog">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white hover:bg-white/[0.06] transition-colors">
                <ArrowLeft className="w-4 h-4" />Tüm Yazılar
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </article>

      <Footer />
    </main>
  )
}
