'use client'

import { AuthProvider } from '@/lib/auth-context'
import { SiteProvider, useSite } from '@/lib/site-context'
import { CartProvider } from '@/lib/cart-context'
import { ToastProvider } from '@/components/Toast'
import MaintenanceWrapper from '@/components/MaintenanceWrapper'
import ApiErrorBanner from '@/components/ApiErrorBanner'
import { ReactNode } from 'react'

function ApiErrorWrapper({ children }: { children: ReactNode }) {
  const { apiError } = useSite()
  return (
    <>
      <ApiErrorBanner show={apiError} />
      {children}
    </>
  )
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SiteProvider>
        <CartProvider>
          <ToastProvider>
            <ApiErrorWrapper>
              <MaintenanceWrapper>
                {children}
              </MaintenanceWrapper>
            </ApiErrorWrapper>
          </ToastProvider>
        </CartProvider>
      </SiteProvider>
    </AuthProvider>
  )
}
