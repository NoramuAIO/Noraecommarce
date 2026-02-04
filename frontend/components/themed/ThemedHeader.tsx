'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogOut, Settings, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useSite } from '@/lib/site-context'
import { useTheme } from '@/lib/theme-context'
import CartWidget from '../CartWidget'

const navItems = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'Ürünler', href: '/products' },
  { name: 'Ücretsiz', href: '/free' },
  { name: 'Bakiye Yükle', href: '/balance' },
  { name: 'Blog', href: '/blog' },
  { name: 'Destek', href: '/support' },
  { name: 'SSS', href: '/faq' },
]

export default function ThemedHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const { settings, getImageUrl } = useSite()
  const { theme } = useTheme()

  const logoUrl = settings.siteLogoDark || settings.siteLogo

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={theme.components.header.position === 'fixed' ? 'fixed top-0 left-0 right-0 z-50' : 'relative z-50'}
    >
      <div className="mx-4 mt-4">
        <motion.div 
          className="max-w-6xl mx-auto theme-header px-6 py-3"
          whileHover={{ borderColor: 'rgba(139, 92, 246, 0.2)' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/" className="flex items-center">
                {logoUrl ? (
                  <img 
                    src={getImageUrl(logoUrl)} 
                    alt={settings.siteName} 
                    className="h-8 w-auto"
                  />
                ) : (
                  <span className="theme-text-xl font-bold text-white">{settings.siteName}</span>
                )}
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="px-4 py-2 theme-text-sm text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5 relative group"
                  >
                    {item.name}
                    {theme.effects.animations !== 'none' && (
                      <motion.span
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-1/2 transition-all duration-300"
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Auth Buttons / User Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              <CartWidget />
              {user ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] hover-border-primary transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-medium theme-text-sm overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="text-left">
                      <p className="theme-text-sm text-white font-medium">{user.name}</p>
                      <p className="theme-text-xs text-gray-500">₺{user.balance?.toFixed(2) || '0.00'}</p>
                    </div>
                  </motion.button>

                  {/* Mobile user button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-primary text-white font-medium theme-text-sm overflow-hidden"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 theme-card p-2 origin-top-right"
                      >
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Profilim
                        </Link>
                        <Link
                          href="/profile?tab=orders"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Siparişlerim
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-primary hover:text-primary-light hover:bg-primary-10 rounded-xl transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-white/[0.06] my-2" />
                        <button
                          onClick={() => {
                            logout()
                            setShowUserMenu(false)
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Çıkış Yap
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <motion.button 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="hidden sm:block px-4 py-2 theme-text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      Giriş Yap
                    </motion.button>
                  </Link>
                  <Link href="/register">
                    <motion.button 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="hidden sm:block px-5 py-2.5 theme-text-sm font-medium text-white theme-button shadow-primary"
                    >
                      Kayıt Ol
                    </motion.button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="sm:hidden p-2 text-gray-300"
              onClick={() => setIsOpen(!isOpen)}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden mx-4 mt-2 relative"
            style={{ zIndex: 9999 }}
          >
            <div className="theme-card p-4 max-h-[70vh] overflow-y-auto">
              <nav className="space-y-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                  {user ? (
                    <>
                      <Link href="/profile" onClick={() => setIsOpen(false)}>
                        <div className="w-full px-4 py-3 text-gray-300 hover:text-white text-left rounded-xl hover:bg-white/5 flex items-center gap-3">
                          <User className="w-4 h-4" />
                          {user.name}
                        </div>
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setIsOpen(false)}>
                          <div className="w-full px-4 py-3 text-primary text-left rounded-xl hover:bg-primary-10 flex items-center gap-3">
                            <Settings className="w-4 h-4" />
                            Admin Panel
                          </div>
                        </Link>
                      )}
                      <button 
                        onClick={() => { logout(); setIsOpen(false); }}
                        className="w-full px-4 py-3 text-red-400 text-left rounded-xl hover:bg-red-500/10 flex items-center gap-3"
                      >
                        <LogOut className="w-4 h-4" />
                        Çıkış Yap
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <div className="w-full px-4 py-3 text-gray-300 hover:text-white text-left rounded-xl hover:bg-white/5">
                          Giriş Yap
                        </div>
                      </Link>
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        <div className="w-full px-4 py-3 text-white theme-button rounded-xl font-medium text-center">
                          Kayıt Ol
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
