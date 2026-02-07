'use client'

import Image from 'next/image'

interface LogoProps {
  className?: string
}

// PayTR Logo - JPEG formatı
export const PayTRLogo = ({ className = 'w-20 h-10' }: LogoProps) => (
  <Image 
    src="/payment-logos/paytr.jpeg" 
    alt="PayTR" 
    width={120} 
    height={48} 
    className={className}
  />
)

// iyzico Logo - SVG
export const IyzicoLogo = ({ className = 'w-20 h-10' }: LogoProps) => (
  <img 
    src="/payment-logos/iyzico.svg" 
    alt="iyzico" 
    className={className}
  />
)

// Papara Logo - SVG
export const PaparaLogo = ({ className = 'w-20 h-10' }: LogoProps) => (
  <img 
    src="/payment-logos/papara.svg" 
    alt="Papara" 
    className={className}
  />
)
