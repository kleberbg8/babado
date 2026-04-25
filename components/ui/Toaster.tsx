'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
}

let toastQueue: Toast[] = []
let setToastsExternal: ((t: Toast[]) => void) | null = null

export function toast(message: string, type: ToastType = 'info') {
  const id = Math.random().toString(36).slice(2)
  toastQueue = [...toastQueue, { id, type, message }]
  setToastsExternal?.([...toastQueue])
  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t.id !== id)
    setToastsExternal?.([...toastQueue])
  }, 4000)
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    setToastsExternal = setToasts
    return () => { setToastsExternal = null }
  }, [])

  const remove = (id: string) => {
    toastQueue = toastQueue.filter((t) => t.id !== id)
    setToasts([...toastQueue])
  }

  const icons = { success: CheckCircle, error: AlertCircle, info: Info }
  const colors = {
    success: 'border-green-500/20 text-green-400',
    error: 'border-[rgba(233,30,140,0.3)] text-[#E91E8C]',
    info: 'border-[rgba(255,255,255,0.1)] text-[#BFA0AB]',
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9998] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => {
        const Icon = icons[t.type]
        return (
          <div
            key={t.id}
            className={cn(
              'flex items-start gap-3 p-4 rounded bg-[#201519] border shadow-card animate-fade-up',
              colors[t.type]
            )}
          >
            <Icon size={16} className="shrink-0 mt-0.5" />
            <p className="text-sm text-[#F8F0F4] flex-1">{t.message}</p>
            <button onClick={() => remove(t.id)} className="text-[#7A5665] hover:text-white transition-colors">
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
