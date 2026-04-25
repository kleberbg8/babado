'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Trophy, Star, MapPin, Heart, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RankEntry {
  position: number
  id: string
  stageName: string
  city: string
  state: string
  mainPhoto?: string
  voteCount: number
  score: number
  plan: 'FREE' | 'SILVER' | 'GOLD' | 'ELITE'
  isOnline: boolean
  hasVoted: boolean
}

const MOCK_RANK: RankEntry[] = [
  { position: 1, id: '1', stageName: 'Valentina', city: 'São Paulo', state: 'SP', mainPhoto: 'https://picsum.photos/seed/r1/300/400', voteCount: 1842, score: 4.9, plan: 'ELITE', isOnline: true, hasVoted: false },
  { position: 2, id: '2', stageName: 'Bruna Lima', city: 'Fortaleza', state: 'CE', mainPhoto: 'https://picsum.photos/seed/r2/300/400', voteCount: 1678, score: 4.8, plan: 'ELITE', isOnline: true, hasVoted: false },
  { position: 3, id: '3', stageName: 'Isabelle', city: 'Rio de Janeiro', state: 'RJ', mainPhoto: 'https://picsum.photos/seed/r3/300/400', voteCount: 1523, score: 4.7, plan: 'GOLD', isOnline: false, hasVoted: false },
  { position: 4, id: '4', stageName: 'Larissa M.', city: 'Curitiba', state: 'PR', mainPhoto: 'https://picsum.photos/seed/r4/300/400', voteCount: 1390, score: 4.6, plan: 'GOLD', isOnline: true, hasVoted: false },
  { position: 5, id: '5', stageName: 'Amanda F.', city: 'Belo Horizonte', state: 'MG', mainPhoto: 'https://picsum.photos/seed/r5/300/400', voteCount: 1210, score: 4.5, plan: 'GOLD', isOnline: false, hasVoted: false },
  { position: 6, id: '6', stageName: 'Júlia R.', city: 'Porto Alegre', state: 'RS', mainPhoto: 'https://picsum.photos/seed/r6/300/400', voteCount: 1045, score: 4.4, plan: 'SILVER', isOnline: true, hasVoted: false },
  { position: 7, id: '7', stageName: 'Melissa S.', city: 'Salvador', state: 'BA', mainPhoto: 'https://picsum.photos/seed/r7/300/400', voteCount: 980, score: 4.4, plan: 'SILVER', isOnline: false, hasVoted: false },
  { position: 8, id: '8', stageName: 'Renata C.', city: 'Brasília', state: 'DF', mainPhoto: 'https://picsum.photos/seed/r8/300/400', voteCount: 872, score: 4.3, plan: 'GOLD', isOnline: true, hasVoted: false },
  { position: 9, id: '9', stageName: 'Thais D.', city: 'Recife', state: 'PE', mainPhoto: 'https://picsum.photos/seed/r9/300/400', voteCount: 756, score: 4.2, plan: 'SILVER', isOnline: false, hasVoted: false },
  { position: 10, id: '10', stageName: 'Camila N.', city: 'Goiânia', state: 'GO', mainPhoto: 'https://picsum.photos/seed/r10/300/400', voteCount: 634, score: 4.1, plan: 'SILVER', isOnline: true, hasVoted: false },
]

const MEDAL: Record<number, { color: string; icon: typeof Crown }> = {
  1: { color: 'text-[#E8B84B]', icon: Crown },
  2: { color: 'text-[#BFA0AB]', icon: Crown },
  3: { color: 'text-[#CD7F32]', icon: Crown },
}

const PLAN_COLOR: Record<string, string> = {
  ELITE: 'text-[#E91E8C]',
  GOLD: 'text-[#E8B84B]',
  SILVER: 'text-[#BFA0AB]',
  FREE: 'text-[#7A5665]',
}

export default function GatasDaSemanaPage() {
  const [ranking, setRanking] = useState<RankEntry[]>(MOCK_RANK)

  const vote = (id: string) => {
    setRanking((prev) => {
      const updated = prev.map((r) =>
        r.id === id
          ? { ...r, voteCount: r.hasVoted ? r.voteCount - 1 : r.voteCount + 1, hasVoted: !r.hasVoted }
          : r
      )
      return updated.sort((a, b) => b.voteCount - a.voteCount).map((r, i) => ({ ...r, position: i + 1 }))
    })
  }

  const top3 = ranking.slice(0, 3)
  const rest = ranking.slice(3)

  return (
    <>
      <div className="page-bar" />
      <Navbar />
      <main className="pt-20 pb-20">
        {/* Hero */}
        <div className="max-content mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(232,184,75,0.12)] border border-[rgba(232,184,75,0.25)] mb-4">
            <Trophy size={14} className="text-[#E8B84B]" />
            <span className="text-sm font-semibold text-[#E8B84B]">Ranking Semanal</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-3">
            Gatas da <span className="italic text-[#E91E8C]">Semana</span>
          </h1>
          <p className="text-[#7A5665] max-w-md mx-auto">
            Vote na sua favorita! O ranking é reiniciado toda segunda-feira às 00h.
          </p>
        </div>

        {/* Top 3 podium */}
        <div className="max-content mb-12">
          <div className="flex items-end justify-center gap-4">
            {[top3[1], top3[0], top3[2]].map((entry, idx) => {
              if (!entry) return null
              const podiumPos = [2, 1, 3][idx]
              const heights = ['h-44', 'h-56', 'h-40']
              const medal = MEDAL[podiumPos]
              const Icon = medal.icon

              return (
                <div key={entry.id} className="flex flex-col items-center gap-3 flex-1 max-w-[160px]">
                  <Link href={`/acompanhante/${entry.id}/${entry.stageName.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div className="relative">
                      <div className={cn(
                        'w-20 h-20 rounded-full overflow-hidden border-4',
                        podiumPos === 1 ? 'border-[#E8B84B]' : podiumPos === 2 ? 'border-[#BFA0AB]' : 'border-[#CD7F32]'
                      )}>
                        <Image src={entry.mainPhoto!} alt={entry.stageName} width={80} height={80} className="w-full h-full object-cover" />
                      </div>
                      <div className={cn('absolute -top-3 -right-1 w-7 h-7 rounded-full flex items-center justify-center', medal.color, 'bg-[#130E11] border border-current')}>
                        <Icon size={14} className="fill-current" />
                      </div>
                    </div>
                  </Link>
                  <div className="text-center">
                    <p className="font-display font-bold text-white text-sm">{entry.stageName}</p>
                    <p className="text-xs text-[#7A5665]">{entry.city}</p>
                    <p className={cn('text-xs font-bold mt-0.5', medal.color)}>{entry.voteCount.toLocaleString('pt-BR')} votos</p>
                  </div>
                  <div className={cn('w-full rounded-t flex items-end justify-center pb-2', heights[idx], {
                    'bg-[rgba(232,184,75,0.15)] border border-[rgba(232,184,75,0.25)]': podiumPos === 1,
                    'bg-[rgba(191,160,171,0.1)] border border-[rgba(191,160,171,0.2)]': podiumPos === 2,
                    'bg-[rgba(205,127,50,0.1)] border border-[rgba(205,127,50,0.2)]': podiumPos === 3,
                  })}>
                    <span className={cn('font-display text-4xl font-black opacity-30', medal.color)}>#{podiumPos}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Rest of ranking */}
        <div className="max-content">
          <div className="space-y-3">
            {rest.map((entry) => (
              <div key={entry.id} className="card p-4 flex items-center gap-4 hover:border-[rgba(233,30,140,0.2)] transition-all">
                <span className="font-display text-2xl font-black text-[#7A5665] w-8 text-center shrink-0">
                  {entry.position}
                </span>

                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[rgba(233,30,140,0.2)]">
                  <Image src={entry.mainPhoto!} alt={entry.stageName} width={48} height={48} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/acompanhante/${entry.id}/${entry.stageName.toLowerCase().replace(/\s+/g, '-')}`}
                      className="font-semibold text-[#F8F0F4] hover:text-[#E91E8C] transition-colors"
                    >
                      {entry.stageName}
                    </Link>
                    {entry.isOnline && (
                      <span className="flex items-center gap-1 text-[10px] text-green-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        Online
                      </span>
                    )}
                    <span className={cn('text-xs font-semibold', PLAN_COLOR[entry.plan])}>{entry.plan}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-[#7A5665]">
                      <MapPin size={10} /> {entry.city}, {entry.state}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#E8B84B]">
                      <Star size={10} className="fill-current" /> {entry.score}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold text-[#BFA0AB]">
                    {entry.voteCount.toLocaleString('pt-BR')} votos
                  </span>
                  <button
                    onClick={() => vote(entry.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded text-sm font-semibold border transition-all',
                      entry.hasVoted
                        ? 'bg-[rgba(233,30,140,0.15)] border-[rgba(233,30,140,0.3)] text-[#E91E8C]'
                        : 'bg-[#201519] border-[rgba(255,255,255,0.08)] text-[#7A5665] hover:text-[#E91E8C] hover:border-[rgba(233,30,140,0.2)]'
                    )}
                  >
                    <Heart size={13} className={entry.hasVoted ? 'fill-current' : ''} />
                    {entry.hasVoted ? 'Votado' : 'Votar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
