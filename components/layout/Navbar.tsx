'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Menu, X, LogIn, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/acompanhantes', label: 'Acompanhantes' },
  { href: '/cidades', label: 'Cidades' },
  { href: '/gatas-da-semana', label: 'Ranking' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#0D0A0C]/95 backdrop-blur-md border-b border-[rgba(233,30,140,0.15)] shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      )}
    >
      <div className="max-content flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display text-xl font-bold text-white">
            Gatas do{' '}
            <span className="italic text-[#E91E8C]">Babado</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-sm text-sm font-medium text-[#BFA0AB] hover:text-white hover:bg-[#201519] transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/planos"
            className="px-4 py-2 rounded-sm text-sm font-semibold text-[#E8B84B] hover:bg-[rgba(232,184,75,0.1)] transition-all duration-200"
          >
            Premium ✦
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            className="relative p-2 rounded-sm text-[#BFA0AB] hover:text-white hover:bg-[#201519] transition-all duration-200"
            aria-label="Notificações"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E91E8C]" />
          </button>

          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium text-[#BFA0AB] hover:text-white hover:bg-[#201519] border border-[rgba(233,30,140,0.15)] transition-all duration-200"
          >
            <LogIn size={16} />
            Entrar
          </Link>

          <Link
            href="/cadastrar"
            className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-semibold text-white transition-all duration-200 bg-[#E91E8C] hover:bg-[#FF4DB3] hover:shadow-[0_0_20px_rgba(233,30,140,0.3)]"
          >
            <UserPlus size={16} />
            Cadastre-se Grátis
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-sm text-[#BFA0AB] hover:text-white hover:bg-[#201519] transition-all duration-200"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[rgba(233,30,140,0.15)] bg-[#130E11]">
          <div className="max-content py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-sm text-sm font-medium text-[#BFA0AB] hover:text-white hover:bg-[#201519] transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/planos"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-sm text-sm font-semibold text-[#E8B84B]"
            >
              Premium ✦
            </Link>
            <div className="mt-3 pt-3 border-t border-[rgba(233,30,140,0.15)] flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="btn-secondary text-sm text-center"
              >
                Entrar
              </Link>
              <Link
                href="/cadastrar"
                onClick={() => setMenuOpen(false)}
                className="btn-primary text-sm text-center"
              >
                Cadastre-se Grátis
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
