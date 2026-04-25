'use client'

import { useState } from 'react'
import { Search, Trophy, Star, Sparkles, GripVertical, Plus, X, Crown, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

type Tab = 'destaques' | 'ranking' | 'stories'

interface ModelEntry {
  id: string
  name: string
  city: string
  state: string
  plan: string
  photo: string
  isOnline: boolean
  score: number
}

interface RankEntry extends ModelEntry {
  position: number
  votes: number
  locked: boolean
}

interface StoryEntry {
  id: string
  modelName: string
  photo: string
  expiresAt: string
  views: number
  isPinned: boolean
}

const ALL_MODELS: ModelEntry[] = [
  { id: '1', name: 'Valentina Silva', city: 'São Paulo', state: 'SP', plan: 'ELITE', photo: 'https://picsum.photos/seed/r1/300/400', isOnline: true, score: 4.9 },
  { id: '2', name: 'Bruna Lima', city: 'Fortaleza', state: 'CE', plan: 'ELITE', photo: 'https://picsum.photos/seed/r2/300/400', isOnline: true, score: 4.8 },
  { id: '3', name: 'Isabelle Costa', city: 'Rio de Janeiro', state: 'RJ', plan: 'GOLD', photo: 'https://picsum.photos/seed/r3/300/400', isOnline: false, score: 4.7 },
  { id: '4', name: 'Larissa Mendes', city: 'Curitiba', state: 'PR', plan: 'GOLD', photo: 'https://picsum.photos/seed/r4/300/400', isOnline: true, score: 4.6 },
  { id: '5', name: 'Amanda Ferreira', city: 'Belo Horizonte', state: 'MG', plan: 'GOLD', photo: 'https://picsum.photos/seed/r5/300/400', isOnline: false, score: 4.5 },
  { id: '6', name: 'Júlia Rocha', city: 'Porto Alegre', state: 'RS', plan: 'SILVER', photo: 'https://picsum.photos/seed/r6/300/400', isOnline: true, score: 4.4 },
  { id: '7', name: 'Melissa Santos', city: 'Salvador', state: 'BA', plan: 'SILVER', photo: 'https://picsum.photos/seed/r7/300/400', isOnline: false, score: 4.4 },
  { id: '8', name: 'Renata Campos', city: 'Brasília', state: 'DF', plan: 'GOLD', photo: 'https://picsum.photos/seed/r8/300/400', isOnline: true, score: 4.3 },
]

const INIT_FEATURED = ALL_MODELS.slice(0, 4)

const INIT_RANKING: RankEntry[] = ALL_MODELS.slice(0, 5).map((m, i) => ({
  ...m,
  position: i + 1,
  votes: [1842, 1678, 1523, 1390, 1210][i],
  locked: i < 2,
}))

const INIT_STORIES: StoryEntry[] = [
  { id: '1', modelName: 'Valentina Silva', photo: 'https://picsum.photos/seed/s1/300/500', expiresAt: '26/04 02:15', views: 284, isPinned: true },
  { id: '2', modelName: 'Bruna Lima', photo: 'https://picsum.photos/seed/s2/300/500', expiresAt: '26/04 08:30', views: 192, isPinned: true },
  { id: '3', modelName: 'Isabelle Costa', photo: 'https://picsum.photos/seed/s3/300/500', expiresAt: '25/04 22:00', views: 148, isPinned: false },
  { id: '4', modelName: 'Larissa Mendes', photo: 'https://picsum.photos/seed/s4/300/500', expiresAt: '25/04 20:45', views: 97, isPinned: false },
  { id: '5', modelName: 'Amanda Ferreira', photo: 'https://picsum.photos/seed/s5/300/500', expiresAt: '25/04 18:10', views: 63, isPinned: false },
]

const PLAN_COLOR: Record<string, string> = {
  ELITE: 'text-[#E91E8C]',
  GOLD: 'text-[#E8B84B]',
  SILVER: 'text-[#BFA0AB]',
  FREE: 'text-[#7A5665]',
}

export default function DestaquesPage() {
  const [tab, setTab] = useState<Tab>('destaques')

  // Destaques state
  const [featured, setFeatured] = useState<ModelEntry[]>(INIT_FEATURED)
  const [searchFeat, setSearchFeat] = useState('')
  const [savedFeat, setSavedFeat] = useState(false)

  // Ranking state
  const [ranking, setRanking] = useState<RankEntry[]>(INIT_RANKING)
  const [resetModal, setResetModal] = useState(false)
  const [resetDone, setResetDone] = useState(false)

  // Stories state
  const [stories, setStories] = useState<StoryEntry[]>(INIT_STORIES)

  // --- Featured logic ---
  const addToFeatured = (model: ModelEntry) => {
    if (featured.find((f) => f.id === model.id)) return
    if (featured.length >= 8) return
    setFeatured((prev) => [...prev, model])
  }
  const removeFromFeatured = (id: string) => setFeatured((prev) => prev.filter((f) => f.id !== id))
  const moveFeatured = (id: string, dir: -1 | 1) => {
    setFeatured((prev) => {
      const arr = [...prev]
      const idx = arr.findIndex((f) => f.id === id)
      const target = idx + dir
      if (target < 0 || target >= arr.length) return arr
      ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
      return arr
    })
  }

  const saveFeatured = async () => {
    await new Promise((r) => setTimeout(r, 600))
    setSavedFeat(true)
    setTimeout(() => setSavedFeat(false), 3000)
  }

  // --- Ranking logic ---
  const toggleLock = (id: string) => {
    setRanking((prev) => prev.map((r) => r.id === id ? { ...r, locked: !r.locked } : r))
  }
  const removeFromRanking = (id: string) => {
    setRanking((prev) =>
      prev.filter((r) => r.id !== id).map((r, i) => ({ ...r, position: i + 1 }))
    )
  }
  const addToRanking = (model: ModelEntry) => {
    if (ranking.find((r) => r.id === model.id)) return
    setRanking((prev) => [
      ...prev,
      { ...model, position: prev.length + 1, votes: 0, locked: false },
    ])
  }
  const adjustVotes = (id: string, delta: number) => {
    setRanking((prev) => {
      const updated = prev.map((r) =>
        r.id === id ? { ...r, votes: Math.max(0, r.votes + delta) } : r
      )
      return updated.sort((a, b) => b.votes - a.votes).map((r, i) => ({ ...r, position: i + 1 }))
    })
  }
  const confirmReset = async () => {
    await new Promise((r) => setTimeout(r, 800))
    setRanking((prev) => prev.map((r) => ({ ...r, votes: 0, locked: false })).map((r, i) => ({ ...r, position: i + 1 })))
    setResetModal(false)
    setResetDone(true)
    setTimeout(() => setResetDone(false), 3000)
  }

  // --- Stories logic ---
  const togglePin = (id: string) => {
    setStories((prev) => prev.map((s) => s.id === id ? { ...s, isPinned: !s.isPinned } : s))
  }
  const removeStory = (id: string) => setStories((prev) => prev.filter((s) => s.id !== id))

  const availableForFeat = ALL_MODELS.filter(
    (m) =>
      !featured.find((f) => f.id === m.id) &&
      m.name.toLowerCase().includes(searchFeat.toLowerCase())
  )

  const availableForRank = ALL_MODELS.filter((m) => !ranking.find((r) => r.id === m.id))

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-white mb-1">
          Gestão de <span className="italic text-[#E91E8C]">Destaques</span>
        </h1>
        <p className="text-sm text-[#7A5665]">Controle o que aparece em destaque no portal</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-7 p-1 bg-[#201519] rounded border border-[rgba(255,255,255,0.06)] w-fit">
        {([
          { value: 'destaques', label: 'Modelos em Destaque', icon: Sparkles },
          { value: 'ranking', label: 'Ranking Semanal', icon: Trophy },
          { value: 'stories', label: 'Stories em Destaque', icon: Star },
        ] as const).map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded text-sm font-semibold transition-all',
              tab === t.value ? 'bg-[#E91E8C] text-white' : 'text-[#BFA0AB] hover:text-white'
            )}
          >
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── DESTAQUES ── */}
      {tab === 'destaques' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Current featured */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#F8F0F4]">
                Modelos em destaque <span className="text-xs text-[#7A5665] font-normal ml-1">({featured.length}/8)</span>
              </h2>
              <button
                onClick={saveFeatured}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold transition-all',
                  savedFeat
                    ? 'bg-green-500/15 border border-green-500/30 text-green-400'
                    : 'btn-primary'
                )}
              >
                {savedFeat ? <><CheckCircle size={12} /> Salvo!</> : 'Salvar ordem'}
              </button>
            </div>

            <div className="space-y-2">
              {featured.map((model, idx) => (
                <div key={model.id} className="card p-3 flex items-center gap-3 group">
                  <GripVertical size={14} className="text-[#7A5665] shrink-0 cursor-grab" />
                  <span className="font-display text-lg font-black text-[#7A5665] w-6 text-center shrink-0">{idx + 1}</span>
                  <div className="w-10 h-10 rounded overflow-hidden shrink-0">
                    <Image src={model.photo} alt={model.name} width={40} height={40} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#F8F0F4] text-sm truncate">{model.name}</p>
                    <p className="text-xs text-[#7A5665]">{model.city}, {model.state} · <span className={PLAN_COLOR[model.plan]}>{model.plan}</span></p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => moveFeatured(model.id, -1)} disabled={idx === 0} className="p-1 text-[#7A5665] hover:text-white disabled:opacity-20 transition-colors">↑</button>
                    <button onClick={() => moveFeatured(model.id, 1)} disabled={idx === featured.length - 1} className="p-1 text-[#7A5665] hover:text-white disabled:opacity-20 transition-colors">↓</button>
                    <button onClick={() => removeFromFeatured(model.id)} className="p-1 text-[#7A5665] hover:text-red-400 transition-colors">
                      <X size={13} />
                    </button>
                  </div>
                </div>
              ))}

              {featured.length === 0 && (
                <div className="text-center py-10 card border-dashed">
                  <p className="text-sm text-[#7A5665]">Nenhuma modelo em destaque</p>
                </div>
              )}
            </div>
          </div>

          {/* Add models */}
          <div>
            <h2 className="font-semibold text-[#F8F0F4] mb-4">Adicionar ao destaque</h2>
            <div className="relative mb-3">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5665]" />
              <input
                value={searchFeat}
                onChange={(e) => setSearchFeat(e.target.value)}
                placeholder="Buscar modelo..."
                className="input-field pl-9 py-2 text-sm"
              />
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {availableForFeat.map((model) => (
                <button
                  key={model.id}
                  onClick={() => addToFeatured(model)}
                  disabled={featured.length >= 8}
                  className="w-full card p-3 flex items-center gap-3 hover:border-[rgba(233,30,140,0.25)] transition-all text-left disabled:opacity-40 group"
                >
                  <div className="w-10 h-10 rounded overflow-hidden shrink-0">
                    <Image src={model.photo} alt={model.name} width={40} height={40} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#F8F0F4] text-sm truncate">{model.name}</p>
                    <div className="flex items-center gap-2 text-xs text-[#7A5665]">
                      <span>{model.city}</span>
                      <span className={PLAN_COLOR[model.plan]}>{model.plan}</span>
                      <span className="flex items-center gap-0.5 text-[#E8B84B]"><Star size={9} className="fill-current" />{model.score}</span>
                    </div>
                  </div>
                  <Plus size={14} className="text-[#7A5665] group-hover:text-[#E91E8C] transition-colors shrink-0" />
                </button>
              ))}
              {availableForFeat.length === 0 && (
                <p className="text-sm text-[#7A5665] text-center py-6">Todas as modelos já estão em destaque</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── RANKING ── */}
      {tab === 'ranking' && (
        <div>
          {resetDone && (
            <div className="flex items-center gap-2 p-3 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-4">
              <CheckCircle size={14} /> Ranking resetado com sucesso!
            </div>
          )}

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-[#F8F0F4]">Ranking atual</h2>
              <span className="text-xs text-[#7A5665] bg-[#201519] px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)]">
                Reinicia segunda-feira às 00h
              </span>
            </div>
            <button
              onClick={() => setResetModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
            >
              <RotateCcw size={12} /> Resetar ranking
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Ranking list */}
            <div className="space-y-2">
              {ranking.map((entry) => (
                <div key={entry.id} className={cn('card p-4 flex items-center gap-3', entry.locked && 'border-[rgba(232,184,75,0.2)]')}>
                  <span className="font-display text-xl font-black text-[#7A5665] w-7 text-center shrink-0">
                    {entry.position}
                  </span>
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[rgba(233,30,140,0.2)]">
                    <Image src={entry.photo} alt={entry.name} width={40} height={40} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-[#F8F0F4] text-sm truncate">{entry.name}</p>
                      {entry.locked && <Crown size={11} className="text-[#E8B84B] shrink-0" />}
                    </div>
                    <p className="text-xs text-[#7A5665]">{entry.city}</p>
                  </div>
                  {/* Vote adjust */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => adjustVotes(entry.id, -50)} className="w-6 h-6 rounded bg-[#201519] text-[#7A5665] hover:text-red-400 text-xs font-bold transition-colors">−</button>
                    <span className="text-sm font-bold text-[#BFA0AB] w-16 text-center tabular-nums">
                      {entry.votes.toLocaleString('pt-BR')}
                    </span>
                    <button onClick={() => adjustVotes(entry.id, 50)} className="w-6 h-6 rounded bg-[#201519] text-[#7A5665] hover:text-green-400 text-xs font-bold transition-colors">+</button>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleLock(entry.id)}
                      title={entry.locked ? 'Desbloquear posição' : 'Fixar posição'}
                      className={cn(
                        'p-1.5 rounded text-xs transition-all',
                        entry.locked
                          ? 'text-[#E8B84B] bg-[rgba(232,184,75,0.1)]'
                          : 'text-[#7A5665] hover:text-[#E8B84B]'
                      )}
                    >
                      <Crown size={12} />
                    </button>
                    <button onClick={() => removeFromRanking(entry.id)} className="p-1.5 rounded text-[#7A5665] hover:text-red-400 transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add to ranking */}
            <div>
              <h3 className="font-semibold text-[#F8F0F4] mb-3 text-sm">Adicionar ao ranking</h3>
              <div className="space-y-2">
                {availableForRank.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => addToRanking(model)}
                    className="w-full card p-3 flex items-center gap-3 hover:border-[rgba(233,30,140,0.25)] transition-all text-left group"
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                      <Image src={model.photo} alt={model.name} width={36} height={36} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#F8F0F4] text-sm truncate">{model.name}</p>
                      <p className="text-xs text-[#7A5665]">{model.city} · <span className={PLAN_COLOR[model.plan]}>{model.plan}</span></p>
                    </div>
                    <Plus size={13} className="text-[#7A5665] group-hover:text-[#E91E8C] transition-colors shrink-0" />
                  </button>
                ))}
                {availableForRank.length === 0 && (
                  <p className="text-sm text-[#7A5665] text-center py-6">Todas as modelos já estão no ranking</p>
                )}
              </div>

              <div className="mt-4 p-3 rounded bg-[rgba(232,184,75,0.06)] border border-[rgba(232,184,75,0.15)]">
                <div className="flex items-start gap-2">
                  <AlertCircle size={13} className="text-[#E8B84B] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#BFA0AB] leading-relaxed">
                    <span className="text-[#E8B84B] font-semibold">Fixar posição</span> impede que a modelo seja ultrapassada pelos votos dos visitantes durante a semana.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STORIES ── */}
      {tab === 'stories' && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[#F8F0F4]">
              Stories ativos <span className="text-xs font-normal text-[#7A5665] ml-1">({stories.length} total · {stories.filter((s) => s.isPinned).length} fixados)</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stories.map((story) => (
              <div key={story.id} className={cn('card overflow-hidden group relative', story.isPinned && 'border-[rgba(233,30,140,0.3)]')}>
                <div className="aspect-[9/16] relative overflow-hidden">
                  <Image src={story.photo} alt={story.modelName} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {story.isPinned && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E91E8C] text-white text-[10px] font-bold">
                      <Star size={9} className="fill-current" /> Fixado
                    </div>
                  )}

                  <button
                    onClick={() => removeStory(story.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                  >
                    <X size={12} />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="font-semibold text-white text-sm">{story.modelName}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-white/60">Expira: {story.expiresAt}</p>
                      <p className="text-xs text-white/60">{story.views} views</p>
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <button
                    onClick={() => togglePin(story.id)}
                    className={cn(
                      'w-full flex items-center justify-center gap-1.5 py-2 rounded text-xs font-semibold border transition-all',
                      story.isPinned
                        ? 'bg-[rgba(233,30,140,0.15)] border-[rgba(233,30,140,0.3)] text-[#E91E8C]'
                        : 'bg-[#201519] border-[rgba(255,255,255,0.06)] text-[#BFA0AB] hover:border-[rgba(233,30,140,0.2)] hover:text-[#E91E8C]'
                    )}
                  >
                    <Star size={11} className={story.isPinned ? 'fill-current' : ''} />
                    {story.isPinned ? 'Fixado na home' : 'Fixar na home'}
                  </button>
                </div>
              </div>
            ))}

            {stories.length === 0 && (
              <div className="col-span-full text-center py-16">
                <Star size={36} className="mx-auto mb-3 text-[#7A5665] opacity-40" />
                <p className="text-sm text-[#7A5665]">Nenhum story ativo no momento</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reset modal */}
      {resetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded bg-red-500/10 flex items-center justify-center">
                <RotateCcw size={18} className="text-red-400" />
              </div>
              <h3 className="font-display text-lg font-bold text-white">Resetar ranking?</h3>
            </div>
            <p className="text-sm text-[#BFA0AB] mb-6 leading-relaxed">
              Todos os votos serão zerados e as posições fixadas serão liberadas. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setResetModal(false)} className="btn-secondary flex-1 py-2.5">Cancelar</button>
              <button
                onClick={confirmReset}
                className="flex-1 py-2.5 rounded text-sm font-semibold bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all"
              >
                Confirmar reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
