'use client'

import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import FAQ from '@/components/FAQ'
import Products from '@/components/Products'
import BestSellers from '@/components/BestSellers'
import Testimonials from '@/components/Testimonials'
import References from '@/components/References'
import Stats from '@/components/Stats'
import Footer from '@/components/Footer'
import { OrganizationSchema, WebsiteSchema } from '@/components/StructuredData'
import { useSite } from '@/lib/site-context'

export default function Home() {
  const { settings } = useSite()

  return (
    <main className="min-h-screen bg-dark">
      <OrganizationSchema />
      <WebsiteSchema />
      <Header />
      <Hero />
      <Features />
      <FAQ />
      <Products />
      {settings.bestSellersEnabled && <BestSellers />}
      <Testimonials />
      <References />
      <Stats />
      <Footer />
    </main>
  )
}
