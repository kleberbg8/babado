'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard, Clock, Users, Image, CreditCard, DollarSign,
  Settings, FileText, Shield, BarChart3, Sparkles, X, LogOut, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/aprovacoes', label: 'Aprovações', icon: Clock, badge: 'pending' },
  { href: '/admin/modelos', label: 'Modelos', icon: Users },
  { href: '/admin/midias', label: 'Moderação de Mídias', icon: Image, badge: 'media' },
  { href: '/admin/destaques', label: 'Destaques & Ranking', icon: Sparkles },
  { href: '/admin/usuarios', label: 'Usuários', icon: Shield },
  { href: '/admin/planos', label: 'Planos', icon: CreditCard },
  { href: '/admin/financeiro', label: 'Financeiro', icon: DollarSign },
  { href: '/admin/relatorios', label: 'Relatórios', icon: BarChart3 },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
  { href: '/admin/logs', label: 'Logs de Auditoria', icon: FileText },
]

type Badges = { pending: number; media: number }

export default function AdminSidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname()
  const [badges, setBadges] = useState<Badges>({ pending: 0, media: 0 })

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setBadges({ pending: d.data.pendingModels ?? 0, media: d.data.pendingMedia ?? 0 })
        }
      })
      .catch(() => {})
  }, [pathname])

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(233,30,140,0.15)] shrink-0">
        <div>
          <p className="font-display font-black text-[#E91E8C] text-lg leading-tight tracking-tight">babado</p>
          <p className="text-[10px] text-[#7A5665] uppercase tracking-widest">Admin Panel</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded text-[#7A5665] hover:text-white hover:bg-[#201519] transition-all md:hidden">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV.map((item) => {
          const Icon = item.icon
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          const count = item.badge ? badges[item.badge as keyof Badges] : 0

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-[rgba(233,30,140,0.14)] text-[#E91E8C] shadow-[inset_0_0_0_1px_rgba(233,30,140,0.2)]'
                  : 'text-[#7A5665] hover:text-[#BFA0AB] hover:bg-[rgba(255,255,255,0.04)]'
              )}
            >
              <Icon size={16} className={cn('shrink-0 transition-all', isActive ? 'text-[#E91E8C]' : 'text-[#7A5665] group-hover:text-[#BFA0AB]')} />
              <span className="flex-1 truncate">{item.label}</span>
              {count > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#E91E8C] text-white text-[10px] font-bold flex items-center justify-center">
                  {count > 99 ? '99+' : count}
                </span>
              )}
              {isActive && <ChevronRight size={13} className="shrink-0 opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[rgba(255,255,255,0.05)] shrink-0">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[rgba(233,30,140,0.06)] border border-[rgba(233,30,140,0.1)]">
          <div className="w-8 h-8 rounded-full bg-[rgba(233,30,140,0.2)] flex items-center justify-center text-[#E91E8C] font-bold text-sm shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#F8F0F4] truncate">Administrador</p>
            <p className="text-[10px] text-[#7A5665]">Admin</p>
          </div>
          <button className="p-1.5 text-[#7A5665] hover:text-red-400 transition-colors" title="Sair">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-[#130E11] border-r border-[rgba(233,30,140,0.12)] h-screen sticky top-0 overflow-hidden">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={onClose} />
          <aside className="fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-[#130E11] border-r border-[rgba(233,30,140,0.15)] md:hidden animate-[slideInRight_0.2s_ease-out]">
            {content}
          </aside>
        </>
      )}
    </>
  )
}
