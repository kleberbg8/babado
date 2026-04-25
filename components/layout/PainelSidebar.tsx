'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard,
  User,
  Images,
  PlaySquare,
  Calendar,
  MessageSquare,
  Star,
  CreditCard,
  DollarSign,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const painelNav = [
  { href: '/painel', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/painel/perfil', label: 'Meu Perfil', icon: User },
  { href: '/painel/fotos', label: 'Fotos e Vídeos', icon: Images },
  { href: '/painel/stories', label: 'Stories', icon: PlaySquare },
  { href: '/painel/agenda', label: 'Agenda', icon: Calendar },
  { href: '/painel/mensagens', label: 'Mensagens', icon: MessageSquare },
  { href: '/painel/avaliacoes', label: 'Avaliações', icon: Star },
  { href: '/painel/planos', label: 'Planos', icon: CreditCard },
  { href: '/painel/financeiro', label: 'Financeiro', icon: DollarSign },
  { href: '/painel/configuracoes', label: 'Configurações', icon: Settings },
]

export default function PainelSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 bg-[#130E11] border-r border-[rgba(233,30,140,0.15)] min-h-screen sticky top-0">
      <div className="p-6 border-b border-[rgba(233,30,140,0.15)]">
        <Link href="/" className="block">
          <div className="flex items-center gap-2 mb-2">
            <Image
              src="https://gatasdobabado.com.br/wp-content/uploads/2021/08/logo.webp"
              alt="Gatas do Babado"
              width={126}
              height={28}
              className="h-7 w-auto"
            />
          </div>
          <p className="text-xs text-[#7A5665]">Painel da Modelo</p>
        </Link>
      </div>

      <nav className="p-4 flex flex-col gap-1">
        {painelNav.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/painel' && pathname.startsWith(item.href))

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
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-6 left-0 right-0 px-4">
        <Link href="/painel/perfil" className="flex items-center gap-3 p-3 rounded bg-[#201519] border border-[rgba(233,30,140,0.15)] hover:border-[#E91E8C] transition-all">
          <div className="w-8 h-8 rounded-full bg-[rgba(233,30,140,0.2)] flex items-center justify-center text-[#E91E8C] text-sm font-bold">
            M
          </div>
          <div>
            <p className="text-sm font-medium text-[#F8F0F4]">Meu Perfil</p>
            <p className="text-xs text-[#7A5665]">Ver como visitante</p>
          </div>
        </Link>
      </div>
    </aside>
  )
}
