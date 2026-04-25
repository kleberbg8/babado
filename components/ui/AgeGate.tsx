'use client'

import { useState, useEffect } from 'react'
import { ShieldAlert } from 'lucide-react'

export default function AgeGate() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const verified = document.cookie.includes('age_verified=true')
    if (!verified) setShow(true)
  }, [])

  const handleConfirm = () => {
    const expires = new Date()
    expires.setDate(expires.getDate() + 30)
    document.cookie = `age_verified=true; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
    setShow(false)
  }

  const handleDeny = () => {
    window.location.href = 'https://www.google.com'
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0D0A0C]">
      <div className="w-full max-w-md animate-scale-in">
        {/* Top bar */}
        <div className="h-1 w-full bg-[#E91E8C] rounded-t-lg" />

        <div className="bg-[#130E11] border border-[rgba(233,30,140,0.2)] rounded-b-lg p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[rgba(233,30,140,0.12)] border border-[rgba(233,30,140,0.2)] flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={28} className="text-[#E91E8C]" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(233,30,140,0.1)] border border-[rgba(233,30,140,0.2)] mb-4">
            <span className="text-[#E91E8C] font-bold text-sm">+18</span>
            <span className="text-[#BFA0AB] text-xs">Conteúdo adulto</span>
          </div>

          <h1 className="font-display text-2xl font-bold text-white mb-2">
            Gatas do <span className="italic text-[#E91E8C]">Babado</span>
          </h1>
          <p className="text-[#BFA0AB] text-sm mb-2">
            Este site contém conteúdo destinado exclusivamente a adultos maiores de 18 anos.
          </p>
          <p className="text-[#7A5665] text-xs mb-8">
            Ao acessar, você confirma ter 18 anos ou mais e concorda com nossos{' '}
            <a href="/termos-de-uso" className="text-[#E91E8C] hover:underline">Termos de Uso</a>.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              className="btn-primary w-full text-base py-3.5"
            >
              Tenho 18 anos ou mais — Entrar
            </button>
            <button
              onClick={handleDeny}
              className="btn-secondary w-full text-sm py-2.5"
            >
              Sou menor de idade — Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
