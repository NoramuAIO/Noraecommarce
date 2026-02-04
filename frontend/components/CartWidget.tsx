'use client'

import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useSite } from '@/lib/site-context'
import Link from 'next/link'

export default function CartWidget() {
  const { items } = useCart()
  const { settings, loading } = useSite()

  if (loading || settings?.cartSystemEnabled !== 'true') {
    return null
  }

  return (
    <Link href="/cart">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2 text-gray-300 hover:text-white transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        {items.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center text-white text-xs font-bold"
          >
            {items.length}
          </motion.span>
        )}
      </motion.button>
    </Link>
  )
}
