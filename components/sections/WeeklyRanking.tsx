'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Crown, ArrowRight } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import type { WeeklyRank } from '@/types'

interface WeeklyRankingProps {
  rank: WeeklyRank[]
}

const POSITION_STYLES = [
  'text-[#E8B84B] text-7xl', // #1 — gold
  'text-[#C0C0C0] text-6xl', // #2 — silver
  'text-[#CD7F32] text-5xl', // #3 — bronze
  'text-[#7A5665] text-5xl', // #4
  'text-[#7A5665] text-5xl', // #5
]

export default function WeeklyRanking({ rank }: WeeklyRankingProps) {
  const [voted, setVoted] = useState<Record<string, boolean>>({})

  const handleVote = (modelId: string) => {
    setVoted((prev) => ({ ...prev, [modelId]: !prev[modelId] }))
  }

  return (
    <section className="py-12 border-t border-[rgba(233,30,140,0.08)] bg-[rgba(233,30,140,0.03)]">
      <div className="max-content">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-[#E8B84B] uppercase tracking-widest mb-2">★ Ranking</p>
            <h2 className="section-title">
              Gatas da <span>Semana</span>
            </h2>
            <p className="text-sm text-[#7A5665] mt-1">Ranking por votos — atualizado em tempo real</p>
          </div>
          <Link
            href="/gatas-da-semana"
            className="hidden sm:flex items-center gap-1.5 text-sm text-[#BFA0AB] hover:text-[#E91E8C] transition-colors"
          >
            Ranking completo
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {rank.map((item) => (
            <div
              key={item.modelId}
              className="flex items-center gap-4 p-4 rounded-lg bg-[#201519] border border-[rgba(233,30,140,0.1)] hover:border-[rgba(233,30,140,0.25)] transition-all duration-200 group"
            >
              {/* Position number */}
              <div className="w-16 shrink-0 flex justify-center relative">
                <span className={`font-display font-black leading-none ${POSITION_STYLES[item.position - 1]}`}>
                  {item.position}
                </span>
                {item.position === 1 && (
                  <Crown
                    size={16}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-[#E8B84B] fill-[#E8B84B] animate-bounce-subtle"
                  />
                )}
              </div>

              {/* Avatar */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[rgba(233,30,140,0.15)] shrink-0 border-2 border-[rgba(233,30,140,0.2)] group-hover:border-[#E91E8C] transition-colors">
                {item.mainPhoto ? (
                  <Image src={item.mainPhoto} alt={item.stageName} width={48} height={48} className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#E91E8C] font-display font-bold">
                    {item.stageName.charAt(0)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/acompanhante/${item.modelId}`}
                  className="font-display font-semibold text-[#F8F0F4] hover:text-[#E91E8C] transition-colors block truncate"
                >
                  {item.stageName}
                </Link>
                <p className="text-xs text-[#7A5665] mt-0.5">
                  {item.city}, {item.state}
                </p>
              </div>

              {/* Votes */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="font-display font-bold text-[#E8B84B]">{formatNumber(item.voteCount)}</p>
                  <p className="text-xs text-[#7A5665]">votos</p>
                </div>
                <button
                  onClick={() => handleVote(item.modelId)}
                  className={`px-4 py-2 rounded-sm text-sm font-semibold transition-all duration-200 border ${
                    voted[item.modelId]
                      ? 'bg-[rgba(233,30,140,0.15)] border-[#E91E8C] text-[#E91E8C]'
                      : 'bg-[#2A1C22] border-[rgba(233,30,140,0.2)] text-[#BFA0AB] hover:border-[#E91E8C] hover:text-[#E91E8C]'
                  }`}
                >
                  {voted[item.modelId] ? '♥ Votado' : '♡ Votar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
