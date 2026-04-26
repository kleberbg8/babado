'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, XCircle, Eye, Filter, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface MediaItem {
  id: string
  url: string
  type: 'PHOTO' | 'VIDEO' | 'STORY'
  isPremium: boolean
  isFace: boolean
  isMain: boolean
  createdAt: string
  model: { id: string; stageName: string }
}

export default function MidiasPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<'all' | 'PHOTO' | 'VIDEO' | 'STORY'>('all')
  const [preview, setPreview] = useState<MediaItem | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [bulkLoading, setBulkLoading] = useState(false)

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams({ page: String(page), limit: '24' })
      if (filter !== 'all') params.set('type', filter)
      const res = await fetch(`/api/admin/media/pending?${params}`)
      const json = await res.json()
      if (json.success) {
        setItems(json.data)
        setTotal(json.total)
        setPages(json.pages)
      } else {
        setError(json.error)
      }
    } catch {
      setError('Erro ao carregar mídias')
    } finally {
      setLoading(false)
    }
  }, [page, filter])

  useEffect(() => { fetchMedia() }, [fetchMedia])

  const toggleSelect = (id: string) => {
    setSelected((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id); else n.add(id)
      return n
    })
  }

  const selectAll = () => {
    setSelected(selected.size === items.length ? new Set() : new Set(items.map((m) => m.id)))
  }

  const handleSingle = async (mediaItem: MediaItem, status: 'APPROVED' | 'REJECTED') => {
    setActionLoading(mediaItem.id)
    try {
      await fetch(`/api/admin/models/${mediaItem.model.id}/media/${mediaItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setItems((prev) => prev.filter((m) => m.id !== mediaItem.id))
      setTotal((t) => t - 1)
      setPreview(null)
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulk = async (status: 'APPROVED' | 'REJECTED') => {
    const ids = Array.from(selected)
    if (ids.length === 0) return
    setBulkLoading(true)
    try {
      await fetch('/api/admin/media/pending', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status }),
      })
      setItems((prev) => prev.filter((m) => !selected.has(m.id)))
      setTotal((t) => t - ids.length)
      setSelected(new Set())
    } finally {
      setBulkLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Moderação de <span className="italic text-[#E91E8C]">Mídias</span>
          </h1>
          <p className="text-sm text-[#7A5665]">
            {loading ? '…' : `${total} mídia${total !== 1 ? 's' : ''} pendente${total !== 1 ? 's' : ''} de revisão`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={fetchMedia} disabled={loading} className="p-2 rounded-lg text-[#7A5665] hover:text-white hover:bg-[#201519] transition-all">
            <RefreshCw size={16} className={cn(loading && 'animate-spin')} />
          </button>
          {selected.size > 0 && (
            <>
              <button
                onClick={() => handleBulk('REJECTED')}
                disabled={bulkLoading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/12 border border-red-500/25 text-red-400 text-sm font-semibold hover:bg-red-500/22 transition-all disabled:opacity-50"
              >
                <XCircle size={14} /> Rejeitar {selected.size}
              </button>
              <button
                onClick={() => handleBulk('APPROVED')}
                disabled={bulkLoading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/12 border border-green-500/25 text-green-400 text-sm font-semibold hover:bg-green-500/22 transition-all disabled:opacity-50"
              >
                <CheckCircle size={14} /> Aprovar {selected.size}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <button
          onClick={selectAll}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#BFA0AB] border border-[rgba(255,255,255,0.08)] px-3 py-1.5 rounded-lg hover:text-white transition-colors"
        >
          <Filter size={12} />
          {selected.size === items.length && items.length > 0 ? 'Desmarcar todos' : 'Selecionar todos'}
        </button>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Todas' },
            { value: 'PHOTO', label: 'Fotos' },
            { value: 'VIDEO', label: 'Vídeos' },
            { value: 'STORY', label: 'Stories' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => { setFilter(f.value as typeof filter); setPage(1) }}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                filter === f.value
                  ? 'bg-[rgba(233,30,140,0.15)] border-[#E91E8C] text-[#E91E8C]'
                  : 'bg-[#201519] border-[rgba(255,255,255,0.06)] text-[#BFA0AB] hover:text-white'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-4 text-sm text-red-400 flex justify-between">
          {error}
          <button onClick={fetchMedia} className="underline text-xs">Tentar novamente</button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] skeleton rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 card">
          <CheckCircle size={48} className="mx-auto mb-4 text-green-400 opacity-40" />
          <p className="text-[#7A5665]">Fila vazia! Nenhuma mídia pendente.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'relative group rounded-xl overflow-hidden aspect-[3/4] bg-[#201519] cursor-pointer select-none',
                  selected.has(item.id) && 'ring-2 ring-[#E91E8C]',
                  actionLoading === item.id && 'opacity-50'
                )}
                onClick={() => toggleSelect(item.id)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />

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
                  {item.type === 'VIDEO' && <span className="text-[9px] font-bold bg-purple-600 text-white px-1.5 py-0.5 rounded">VID</span>}
                  {item.isPremium && <span className="text-[9px] font-bold bg-[#E91E8C] text-white px-1.5 py-0.5 rounded">P</span>}
                  {item.isFace && <span className="text-[9px] font-bold bg-[rgba(232,184,75,0.9)] text-black px-1.5 py-0.5 rounded">R</span>}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div>
                    <Link
                      href={`/admin/modelos/${item.model.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] font-semibold text-white truncate block hover:underline"
                    >
                      {item.model.stageName}
                    </Link>
                    <p className="text-[9px] text-white/60">{new Date(item.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setPreview(item) }}
                      className="w-full flex items-center justify-center gap-1 text-[10px] font-semibold py-1 rounded bg-white/10 text-white hover:bg-white/20 transition-all"
                    >
                      <Eye size={9} /> Ver
                    </button>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSingle(item, 'APPROVED') }}
                        className="flex-1 text-[10px] font-semibold py-1 rounded bg-green-500/25 text-green-400 hover:bg-green-500/40 transition-all"
                      >
                        ✓ Aprovar
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSingle(item, 'REJECTED') }}
                        className="flex-1 text-[10px] font-semibold py-1 rounded bg-red-500/25 text-red-400 hover:bg-red-500/40 transition-all"
                      >
                        ✗ Rejeitar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)]">
              <p className="text-xs text-[#7A5665]">{(page - 1) * 24 + 1}–{Math.min(page * 24, total)} de {total}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded text-[#7A5665] hover:text-white hover:bg-[#201519] disabled:opacity-30 transition-all">
                  <ChevronLeft size={16} />
                </button>
                <span className="px-3 py-2 text-xs text-[#BFA0AB]">{page} / {pages}</span>
                <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="p-2 rounded text-[#7A5665] hover:text-white hover:bg-[#201519] disabled:opacity-30 transition-all">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Preview modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-h-[90vh] max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview.url} alt="" className="w-full h-full object-contain rounded-xl" />
            <div className="mt-2 mb-3">
              <Link href={`/admin/modelos/${preview.model.id}`} className="text-sm font-semibold text-[#E91E8C] hover:underline">
                {preview.model.stageName}
              </Link>
              <p className="text-xs text-[#7A5665]">{new Date(preview.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSingle(preview, 'APPROVED')}
                disabled={actionLoading === preview.id}
                className="flex-1 btn-primary py-2.5 text-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle size={14} /> Aprovar
              </button>
              <button
                onClick={() => handleSingle(preview, 'REJECTED')}
                disabled={actionLoading === preview.id}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm rounded-sm bg-red-500/12 border border-red-500/25 text-red-400 hover:bg-red-500/22 transition-all disabled:opacity-50"
              >
                <XCircle size={14} /> Rejeitar
              </button>
            </div>
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-white hover:bg-[#E91E8C] transition-all"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
