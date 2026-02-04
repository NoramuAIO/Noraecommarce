'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ThemedCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function ThemedCard({
  children,
  className = '',
  hover = false,
  onClick,
}: ThemedCardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      onClick={onClick}
      className={`theme-card ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {children}
    </motion.div>
  )
}
