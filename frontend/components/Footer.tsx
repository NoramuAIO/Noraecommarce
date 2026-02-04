'use client'

import Link from 'next/link'
import { MessageCircle, Twitter, Github } from 'lucide-react'
import { useSite } from '@/lib/site-context'

export default function Footer() {
  const { settings } = useSite()

  const links = {
    product: [
      { name: 'Ürünler', href: '/products' },
      { name: 'Bakiye Yükle', href: '/balance' },
      { name: 'Blog', href: '/blog' },
    ],
    support: [
      { name: 'Destek', href: '/support' },
      { name: 'SSS', href: '/faq' },
      { name: 'Discord', href: settings.discordLink },
    ],
    legal: [
      { name: 'Gizlilik', href: '/privacy' },
      { name: 'Şartlar', href: '/terms' },
      { name: 'İade', href: '/refund' },
    ],
  }

  return (
    <footer className="border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold text-white mb-4 block">
              {settings.siteName}
            </Link>
            <p className="text-gray-500 text-sm mb-4">
              {settings.siteDescription}
            </p>
            <div className="flex gap-3">
              <a
                href={settings.discordLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white hover-border-primary transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white hover-border-primary transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white hover-border-primary transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-white font-medium mb-4 capitalize">{title === 'product' ? 'Ürün' : title === 'support' ? 'Destek' : 'Yasal'}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.name}>
                    {item.href.startsWith('http') ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white text-sm transition-colors">
                        {item.name}
                      </a>
                    ) : (
                      <Link href={item.href} className="text-gray-500 hover:text-white text-sm transition-colors">
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/[0.06] text-center">
          <p className="text-gray-500 text-sm">
            © 2025 {settings.siteName}. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}
