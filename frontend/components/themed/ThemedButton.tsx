'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ThemedButtonProps {
  children: ReactNode
  onClick?: () => void
  href?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}

export default function ThemedButton({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}: ThemedButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const baseClasses = `theme-button inline-flex items-center justify-center gap-2 font-medium transition-all ${sizeClasses[size]} ${className}`

  const variantClasses = {
    primary: 'text-white',
    secondary: 'text-gray-300',
    ghost: 'text-primary',
  }

  const Component = motion.button

  return (
    <Component
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </Component>
  )
}
