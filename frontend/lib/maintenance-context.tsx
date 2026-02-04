'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface MaintenanceContextType {
  isMaintenanceMode: boolean
  loading: boolean
}

const MaintenanceContext = createContext<MaintenanceContextType>({
  isMaintenanceMode: false,
  loading: true
})

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkMaintenance()
  }, [])

  const checkMaintenance = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const res = await fetch(`${API_URL}/settings/public`)
      if (res.ok) {
        const settings = await res.json()
        setIsMaintenanceMode(settings.maintenanceMode === 'true')
      }
    } catch (error) {
      setIsMaintenanceMode(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <MaintenanceContext.Provider value={{ isMaintenanceMode, loading }}>
      {children}
    </MaintenanceContext.Provider>
  )
}

export const useMaintenance = () => useContext(MaintenanceContext)
