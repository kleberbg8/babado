'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NextImage from 'next/image'
import {
  LayoutDashboard,
  Clock,
  Users,
  Image,
  CreditCard,
  DollarSign,
  Settings,
  FileText,
  Shield,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/aprovacoes', label: 'Aprovações', icon: Clock, badge: true },
  { href: '/admin/modelos', label: 'Modelos', icon: Users },
  { href: '/admin/midias', label: 'Moderação de Mídias', icon: Image },
  { href: '/admin/usuarios', label: 'Usuários', icon: Shield },
  { href: '/admin/planos', label: 'Planos', icon: CreditCard },
  { href: '/admin/financeiro', label: 'Financeiro', icon: DollarSign },
  { href: '/admin/relatorios', label: 'Relatórios', icon: BarChart3 },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
  { href: '/admin/logs', label: 'Logs de Auditoria', icon: FileText },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 bg-[#130E11] border-r border-[rgba(233,30,140,0.15)] min-h-screen sticky top-0">
      <div className="p-6 border-b border-[rgba(233,30,140,0.15)]">
        <Link href="/" className="block">
          <div className="flex items-center gap-2 mb-2">
            <NextImage
              src="https://gatasdobabado.com.br/wp-content/uploads/2021/08/logo.webp"
              alt="Gatas do Babado"
              width={126}
              height={28}
              className="h-7 w-auto"
            />
          </div>
          <p className="text-xs text-[#7A5665]">Painel Administrativo</p>
        </Link>
      </div>

      <nav className="p-4 flex flex-col gap-1">
        {adminNav.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-[rgba(233,30,140,0.12)] text-[#E91E8C] border border-[rgba(233,30,140,0.2)]'
                  : 'text-[#BFA0AB] hover:text-white hover:bg-[#201519]'
              )}
            >
              <Icon size={16} className="shrink-0" />
              {item.label}
              {item.badge && (
                <span className="ml-auto w-5 h-5 rounded-full bg-[#E91E8C] text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-6 left-0 right-0 px-4">
        <div className="p-3 rounded bg-[rgba(233,30,140,0.08)] border border-[rgba(233,30,140,0.15)]">
          <p className="text-xs text-[#7A5665]">Logado como</p>
          <p className="text-sm font-medium text-[#F8F0F4] mt-0.5">Admin</p>
          <Link href="/admin/logout" className="text-xs text-[#E91E8C] mt-1 block hover:underline">
            Sair
          </Link>
        </div>
      </div>
    </aside>
  )
}
