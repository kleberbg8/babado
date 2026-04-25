import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import type { CityCard } from '@/types'

interface CitiesSectionProps {
  cities: CityCard[]
}

export default function CitiesSection({ cities }: CitiesSectionProps) {
  return (
    <section className="py-12 border-t border-[rgba(233,30,140,0.08)] bg-[#130E11]">
      <div className="max-content">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-[#BFA0AB] uppercase tracking-widest mb-2">
              <MapPin size={11} className="inline mr-1" />
              Localização
            </p>
            <h2 className="section-title">
              Cidades em <span>Destaque</span>
            </h2>
          </div>
          <Link
            href="/cidades"
            className="hidden sm:flex items-center gap-1.5 text-sm text-[#BFA0AB] hover:text-[#E91E8C] transition-colors"
          >
            Ver todas as cidades
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/acompanhantes?cidade=${encodeURIComponent(city.city)}&estado=${city.state}`}
              className="group relative overflow-hidden rounded-lg aspect-square bg-[#201519] border border-[rgba(233,30,140,0.1)] hover:border-[#E91E8C] transition-all duration-300 hover:shadow-pink-glow"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <span className="font-display text-6xl font-black text-[#E91E8C]">
                  {city.state}
                </span>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0A0C] via-[#0D0A0C]/50 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="font-display font-bold text-sm text-white leading-tight group-hover:text-[#E91E8C] transition-colors">
                  {city.city}
                </p>
                <p className="text-xs text-[#7A5665] mt-0.5">
                  {formatNumber(city.modelCount)} perfis
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
