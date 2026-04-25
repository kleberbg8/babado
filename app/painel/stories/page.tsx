'use client'

import { useState, useRef } from 'react'
import { Upload, Clock, Eye, Trash2, Play, ImagePlus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoryItem {
  id: string
  url: string
  type: 'image' | 'video'
  views: number
  expiresAt: Date
}

const MOCK_STORIES: StoryItem[] = [
  { id: '1', url: 'https://picsum.photos/seed/s1/400/700', type: 'image', views: 42, expiresAt: new Date(Date.now() + 18 * 3600000) },
  { id: '2', url: 'https://picsum.photos/seed/s2/400/700', type: 'image', views: 29, expiresAt: new Date(Date.now() + 6 * 3600000) },
]

function countdown(date: Date) {
  const diff = date.getTime() - Date.now()
  if (diff <= 0) return 'Expirado'
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  return `${h}h ${m}m`
}

function progressPercent(expiresAt: Date) {
  const total = 24 * 3600000
  const remaining = expiresAt.getTime() - Date.now()
  return Math.max(0, Math.min(100, (remaining / total) * 100))
}

export default function StoriesPage() {
  const [stories, setStories] = useState<StoryItem[]>(MOCK_STORIES)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const remove = (id: string) => setStories((prev) => prev.filter((s) => s.id !== id))

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white mb-1">
          Meus <span className="italic text-[#E91E8C]">Stories</span>
        </h1>
        <p className="text-sm text-[#7A5665]">Stories ficam visíveis por 24h e aparecem na tela inicial</p>
      </div>

      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false) }}
        onClick={() => fileRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-sm p-10 mb-8 text-center cursor-pointer transition-all',
          dragOver
            ? 'border-[#E91E8C] bg-[rgba(233,30,140,0.06)]'
            : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(233,30,140,0.3)] hover:bg-[rgba(233,30,140,0.03)]'
        )}
      >
        <div className="w-16 h-16 rounded-full bg-[rgba(233,30,140,0.12)] flex items-center justify-center mx-auto mb-4">
          <Upload size={28} className="text-[#E91E8C]" />
        </div>
        <p className="text-sm font-semibold text-[#F8F0F4] mb-1">Novo story</p>
        <p className="text-xs text-[#7A5665]">Foto ou vídeo curto (máx. 30s) — 9:16 recomendado</p>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); fileRef.current?.click() }}
          className="btn-primary mt-4 flex items-center gap-2 mx-auto px-5 py-2.5 text-sm"
        >
          <ImagePlus size={14} />
          Selecionar arquivo
        </button>
        <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" />
      </div>

      {/* Active stories */}
      <div>
        <h2 className="font-semibold text-[#F8F0F4] mb-4">Stories ativos ({stories.length})</h2>

        {stories.length === 0 ? (
          <div className="text-center py-12 card">
            <Play size={32} className="mx-auto mb-3 text-[#7A5665] opacity-50" />
            <p className="text-sm text-[#7A5665]">Nenhum story ativo no momento</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stories.map((story) => {
              const pct = progressPercent(story.expiresAt)
              const isExpiring = pct < 25

              return (
                <div key={story.id} className="card p-4 flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-14 h-20 rounded shrink-0 overflow-hidden bg-[#201519] relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={story.url} alt="" className="w-full h-full object-cover" />
                    {story.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Play size={16} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-[#F8F0F4]">
                        {story.type === 'video' ? 'Vídeo' : 'Foto'}
                      </span>
                      {isExpiring && (
                        <span className="badge bg-red-500/10 text-red-400 border-red-500/20 text-[10px]">
                          Expirando logo
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-[#201519] rounded-full h-1.5 mb-2">
                      <div
                        className={cn(
                          'h-1.5 rounded-full transition-all',
                          isExpiring ? 'bg-red-400' : 'bg-[#E91E8C]'
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#7A5665]">
                      <span className={cn('flex items-center gap-1', isExpiring && 'text-red-400')}>
                        <Clock size={10} />
                        {countdown(story.expiresAt)} restantes
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={10} />
                        {story.views} visualizações
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => remove(story.id)}
                    className="p-2 rounded text-[#7A5665] hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
