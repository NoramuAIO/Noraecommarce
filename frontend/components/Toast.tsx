'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const config = {
    success: { icon: CheckCircle, bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400' },
    error: { icon: XCircle, bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400' },
    warning: { icon: AlertTriangle, bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400' },
    info: { icon: Info, bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
  }[toast.type]

  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl ${config.bg} ${config.border} shadow-lg min-w-[280px] max-w-[400px]`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${config.text}`} />
      <p className="text-white text-sm flex-1">{toast.message}</p>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </motion.div>
  )
}
