'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Eye, Filter, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MediaItem {
  id: string
  modelName: string
  url: string
  type: 'PHOTO' | 'VIDEO'
  isPremium: boolean
  isFace: boolean
  submittedAt: string
}

const MOCK: MediaItem[] = [
  { id: '1', modelName: 'Valentina Silva', url: 'https://picsum.photos/seed/m1/300/400', type: 'PHOTO', isPremium: false, isFace: false, submittedAt: '25/04 14:22' },
  { id: '2', modelName: 'Isabelle Costa', url: 'https://picsum.photos/seed/m2/300/400', type: 'PHOTO', isPremium: true, isFace: false, submittedAt: '25/04 13:45' },
  { id: '3', modelName: 'Larissa Mendes', url: 'https://picsum.photos/seed/m3/300/400', type: 'PHOTO', isPremium: false, isFace: true, submittedAt: '25/04 12:30' },
  { id: '4', modelName: 'Júlia Ferreira', url: 'https://picsum.photos/seed/m4/300/400', type: 'PHOTO', isPremium: true, isFace: false, submittedAt: '25/04 11:10' },
  { id: '5', modelName: 'Melissa Santos', url: 'https://picsum.photos/seed/m5/300/400', type: 'PHOTO', isPremium: false, isFace: false, submittedAt: '25/04 10:05' },
  { id: '6', modelName: 'Bruna Lima', url: 'https://picsum.photos/seed/m6/300/400', type: 'PHOTO', isPremium: false, isFace: true, submittedAt: '25/04 09:55' },
  { id: '7', modelName: 'Amanda Rocha', url: 'https://picsum.photos/seed/m7/300/400', type: 'PHOTO', isPremium: true, isFace: false, submittedAt: '25/04 09:20' },
  { id: '8', modelName: 'Fernanda Dias', url: 'https://picsum.photos/seed/m8/300/400', type: 'PHOTO', isPremium: false, isFace: false, submittedAt: '25/04 08:45' },
]

export default function MidiasPage() {
  const [items, setItems] = useState<MediaItem[]>(MOCK)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<'all' | 'premium' | 'face'>('all')
  const [preview, setPreview] = useState<string | null>(null)

  const filtered = items.filter((m) => {
    if (filter === 'premium') return m.isPremium
    if (filter === 'face') return m.isFace
    return true
  })

  const toggleSelect = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id); else next.add(id)
    setSelected(next)
  }

  const selectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map((m) => m.id)))
  }

  const approve = (id: string) => setItems((prev) => prev.filter((m) => m.id !== id))
  const reject = (id: string) => setItems((prev) => prev.filter((m) => m.id !== id))

  const bulkApprove = () => {
    setItems((prev) => prev.filter((m) => !selected.has(m.id)))
    setSelected(new Set())
  }

  const bulkReject = () => {
    setItems((prev) => prev.filter((m) => !selected.has(m.id)))
    setSelected(new Set())
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Moderação de <span className="italic text-[#E91E8C]">Mídias</span>
          </h1>
          <p className="text-sm text-[#7A5665]">{items.length} mídias aguardando revisão</p>
        </div>
        {selected.size > 0 && (
          <div className="flex gap-2">
            <button onClick={bulkReject} className="flex items-center gap-1.5 px-3 py-2 rounded bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/25 transition-all">
              <XCircle size={14} /> Rejeitar {selected.size}
            </button>
            <button onClick={bulkApprove} className="flex items-center gap-1.5 px-3 py-2 rounded bg-green-500/15 border border-green-500/30 text-green-400 text-sm font-semibold hover:bg-green-500/25 transition-all">
              <CheckCircle size={14} /> Aprovar {selected.size}
            </button>
          </div>
        )}
      </div>

      {/* Filters + bulk select */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button onClick={selectAll} className="flex items-center gap-1.5 text-xs font-semibold text-[#BFA0AB] border border-[rgba(255,255,255,0.08)] px-3 py-1.5 rounded hover:text-white transition-colors">
          <Filter size={12} />
          {selected.size === filtered.length && filtered.length > 0 ? 'Desmarcar todos' : 'Selecionar todos'}
        </button>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Todas' },
            { value: 'premium', label: 'Premium' },
            { value: 'face', label: 'Com rosto' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as typeof filter)}
              className={cn(
                'px-3 py-1.5 rounded text-xs font-semibold border transition-all',
                filter === f.value
                  ? 'bg-[rgba(233,30,140,0.15)] border-[#E91E8C] text-[#E91E8C]'
                  : 'bg-[#201519] border-[rgba(255,255,255,0.06)] text-[#BFA0AB]'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <CheckCircle size={48} className="mx-auto mb-4 text-green-400 opacity-50" />
          <p className="text-[#7A5665]">Nenhuma mídia pendente. Fila vazia!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={cn(
                'relative group rounded-sm overflow-hidden aspect-[3/4] bg-[#201519] cursor-pointer',
                selected.has(item.id) && 'ring-2 ring-[#E91E8C]'
              )}
              onClick={() => toggleSelect(item.id)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="" className="w-full h-full object-cover" />

              {/* Checkbox */}
              <div className={cn(
                'absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                selected.has(item.id) ? 'bg-[#E91E8C] border-[#E91E8C]' : 'border-white/60 bg-black/40'
              )}>
                {selected.has(item.id) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </div>

              {/* Badges */}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                {item.isPremium && (
                  <span className="text-[10px] font-bold bg-[#E91E8C] text-white px-1.5 py-0.5 rounded">
                    P
                  </span>
                )}
                {item.isFace && (
                  <span className="text-[10px] font-bold bg-[rgba(232,184,75,0.9)] text-black px-1.5 py-0.5 rounded">
                    R
                  </span>
                )}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div>
                  <p className="text-xs font-semibold text-white leading-tight">{item.modelName}</p>
                  <p className="text-[10px] text-white/60">{item.submittedAt}</p>
                </div>
                <div className="space-y-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); setPreview(item.url) }}
                    className="w-full flex items-center justify-center gap-1 text-[10px] font-semibold py-1 rounded bg-white/10 text-white hover:bg-white/20 transition-all"
                  >
                    <Eye size={9} /> Ver
                  </button>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); approve(item.id) }}
                      className="flex-1 text-[10px] font-semibold py-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all"
                    >
                      ✓ Aprovar
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); reject(item.id) }}
                      className="flex-1 text-[10px] font-semibold py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                    >
                      ✗ Rejeitar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-h-[90vh] max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="" className="w-full h-full object-contain rounded-sm" />
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-all"
            >
              ✕
            </button>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { approve(preview); setPreview(null) }} className="flex-1 btn-primary py-2.5 text-sm flex items-center justify-center gap-1.5">
                <CheckCircle size={14} /> Aprovar
              </button>
              <button onClick={() => { reject(preview); setPreview(null) }} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm rounded bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all">
                <AlertCircle size={14} /> Rejeitar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
