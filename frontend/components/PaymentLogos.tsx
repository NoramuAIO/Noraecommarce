'use client'

interface LogoProps {
  className?: string
}

export const PayTRLogo = ({ className = 'w-16 h-8' }: LogoProps) => (
  <svg viewBox="0 0 80 32" className={className}>
    <rect width="80" height="32" rx="6" fill="#0a1628"/>
    <text x="8" y="21" fill="#00d4aa" fontFamily="Arial" fontWeight="bold" fontSize="14">Pay</text>
    <text x="38" y="21" fill="#ff6b35" fontFamily="Arial" fontWeight="bold" fontSize="14">TR</text>
    <circle cx="68" cy="16" r="8" fill="#00d4aa" opacity="0.2"/>
    <path d="M64 16l3 3 5-6" stroke="#00d4aa" strokeWidth="1.5" fill="none"/>
  </svg>
)

export const IyzicoLogo = ({ className = 'w-16 h-8' }: LogoProps) => (
  <svg viewBox="0 0 80 32" className={className}>
    <rect width="80" height="32" rx="6" fill="#1a2744"/>
    <text x="10" y="21" fill="#1dc9a0" fontFamily="Arial" fontWeight="bold" fontSize="13">iyzico</text>
    <circle cx="68" cy="16" r="8" fill="#1dc9a0" opacity="0.2"/>
    <circle cx="68" cy="16" r="4" fill="#1dc9a0"/>
  </svg>
)

export const PaparaLogo = ({ className = 'w-16 h-8' }: LogoProps) => (
  <svg viewBox="0 0 80 32" className={className}>
    <rect width="80" height="32" rx="6" fill="#5c2d91"/>
    <text x="8" y="21" fill="#ffffff" fontFamily="Arial" fontWeight="bold" fontSize="12">Papara</text>
    <circle cx="68" cy="16" r="7" fill="#ffffff" opacity="0.2"/>
    <path d="M65 13v6M68 13v6M65 16h6" stroke="#ffffff" strokeWidth="1.2"/>
  </svg>
)
