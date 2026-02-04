'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  id: number
  name: string
  price: number
  image?: string
}

interface CartContextType {
  items: CartItem[]
  couponCode: string
  appliedCoupon: any
  discountedTotal: number
  addItem: (item: CartItem) => void
  removeItem: (productId: number) => void
  clearCart: () => void
  applyCoupon: (code: string) => Promise<void>
  removeCoupon: () => void
  getTotal: () => number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  setCouponCode: (code: string) => void
  setAppliedCoupon: (coupon: any) => void
  setDiscountedTotal: (total: number) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [discountedTotal, setDiscountedTotal] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // LocalStorage'dan yükle (hydration sonrası)
  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {}
    }
    setIsHydrated(true)
  }, [])

  // LocalStorage'a kaydet (items değiştiğinde)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items, isHydrated])

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev
      }
      return [...prev, item]
    })
  }

  const removeItem = (productId: number) => {
    setItems(prev => prev.filter(i => i.id !== productId))
  }

  const clearCart = () => {
    setItems([])
    setCouponCode('')
    setAppliedCoupon(null)
    setDiscountedTotal(0)
  }

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.price, 0)
  }

  const applyCoupon = async (code: string) => {
    // Bu fonksiyon Header'dan çağrılacak
    // Sepet widget'ında kupon uygulanacak
    setCouponCode(code)
  }

  const removeCoupon = () => {
    setCouponCode('')
    setAppliedCoupon(null)
    setDiscountedTotal(0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        couponCode,
        appliedCoupon,
        discountedTotal,
        addItem,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        getTotal,
        isOpen,
        setIsOpen,
        setCouponCode,
        setAppliedCoupon,
        setDiscountedTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
