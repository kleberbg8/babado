'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'

const STATS = [
  { value: '3.847', label: 'acompanhantes' },
  { value: '48', label: 'cidades' },
  { value: '12.500+', label: 'avaliações' },
]

export default function HeroBanner() {
  const [city, setCity] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = city ? `?cidade=${encodeURIComponent(city)}` : ''
    router.push(`/acompanhantes${params}`)
  }

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[rgba(233,30,140,0.05)] blur-3xl pointer-events-none" />

      <div className="max-content relative text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(233,30,140,0.2)] bg-[rgba(233,30,140,0.06)] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E91E8C] animate-pulse" />
          <span className="text-xs font-medium text-[#BFA0AB]">Portal +18 de acompanhantes premium</span>
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
          Encontre a companhia{' '}
          <span className="italic text-[#E91E8C]">perfeita</span>
        </h1>
        <p className="text-[#BFA0AB] text-lg md:text-xl mb-10 max-w-xl mx-auto">
          Perfis verificados e acompanhantes premium em todo o Brasil
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-14">
          <div className="relative flex-1">
            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A5665]" />
            <input
              type="text"
              placeholder="Qual cidade?"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="input-field pl-10 h-12"
            />
          </div>
          <button type="submit" className="btn-primary h-12 px-8 shrink-0">
            <Search size={16} />
            Buscar
          </button>
        </form>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
          {STATS.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="font-display text-2xl md:text-3xl font-bold text-[#E91E8C]">{s.value}</span>
              <span className="text-xs text-[#7A5665] mt-0.5">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
