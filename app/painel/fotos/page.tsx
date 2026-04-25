'use client'

import { useState, useRef } from 'react'
import { Upload, Star, Lock, Smile, Trash2, CheckCircle, ImagePlus, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Photo {
  id: string
  url: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  isMain: boolean
  isPremium: boolean
  isFace: boolean
}

const MOCK_PHOTOS: Photo[] = [
  { id: '1', url: 'https://picsum.photos/seed/p1/400/500', status: 'APPROVED', isMain: true, isPremium: false, isFace: false },
  { id: '2', url: 'https://picsum.photos/seed/p2/400/500', status: 'APPROVED', isMain: false, isPremium: false, isFace: true },
  { id: '3', url: 'https://picsum.photos/seed/p3/400/500', status: 'APPROVED', isMain: false, isPremium: true, isFace: false },
  { id: '4', url: 'https://picsum.photos/seed/p4/400/500', status: 'PENDING', isMain: false, isPremium: false, isFace: false },
  { id: '5', url: 'https://picsum.photos/seed/p5/400/500', status: 'PENDING', isMain: false, isPremium: true, isFace: false },
  { id: '6', url: 'https://picsum.photos/seed/p6/400/500', status: 'REJECTED', isMain: false, isPremium: false, isFace: false },
]

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  APPROVED: { label: 'Aprovada', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
  PENDING: { label: 'Aguardando', className: 'bg-[rgba(232,184,75,0.1)] text-[#E8B84B] border-[rgba(232,184,75,0.2)]' },
  REJECTED: { label: 'Rejeitada', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

export default function FotosPage() {
  const [photos, setPhotos] = useState<Photo[]>(MOCK_PHOTOS)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const toggle = (id: string, field: 'isMain' | 'isPremium' | 'isFace') => {
    setPhotos((prev) => prev.map((p) => {
      if (field === 'isMain') return { ...p, isMain: p.id === id }
      return p.id === id ? { ...p, [field]: !p[field] } : p
    }))
  }

  const remove = (id: string) => setPhotos((prev) => prev.filter((p) => p.id !== id))

  const approved = photos.filter((p) => p.status === 'APPROVED').length
  const pending = photos.filter((p) => p.status === 'PENDING').length

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Fotos e <span className="italic text-[#E91E8C]">Vídeos</span>
          </h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-green-400">{approved} aprovadas</span>
            {pending > 0 && (
              <>
                <span className="text-[#7A5665]">·</span>
                <span className="text-[#E8B84B]">{pending} aguardando</span>
              </>
            )}
            <span className="text-[#7A5665]">·</span>
            <span className="text-[#7A5665]">{photos.length}/30 fotos</span>
          </div>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="btn-primary flex items-center gap-2 px-4 py-2.5"
        >
          <ImagePlus size={16} />
          Adicionar fotos
        </button>
        <input ref={fileRef} type="file" multiple accept="image/*,video/*" className="hidden" />
      </div>

      {pending > 0 && (
        <div className="flex items-center gap-3 p-4 rounded bg-[rgba(232,184,75,0.08)] border border-[rgba(232,184,75,0.2)] mb-6">
          <AlertCircle size={14} className="text-[#E8B84B] shrink-0" />
          <p className="text-sm text-[#BFA0AB]">
            <span className="font-semibold text-[#E8B84B]">{pending} foto{pending > 1 ? 's' : ''}</span> aguardando aprovação da moderação. Pode levar até 24h.
          </p>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false) }}
        onClick={() => fileRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-sm p-8 mb-6 text-center cursor-pointer transition-all',
          dragOver
            ? 'border-[#E91E8C] bg-[rgba(233,30,140,0.06)]'
            : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(233,30,140,0.3)] hover:bg-[rgba(233,30,140,0.03)]'
        )}
      >
        <Upload size={24} className="mx-auto mb-2 text-[#7A5665]" />
        <p className="text-sm text-[#BFA0AB] font-medium">Arraste fotos ou clique para selecionar</p>
        <p className="text-xs text-[#7A5665] mt-1">JPG, PNG, WebP, MP4 — máx. 20MB por arquivo</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        {[
          { icon: Star, label: 'Principal', color: 'text-[#E8B84B]' },
          { icon: Lock, label: 'Premium', color: 'text-[#E91E8C]' },
          { icon: Smile, label: 'Rosto', color: 'text-green-400' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5 text-xs text-[#7A5665]">
            <l.icon size={12} className={l.color} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {photos.map((photo) => {
          const badge = STATUS_BADGE[photo.status]
          return (
            <div key={photo.id} className="relative group rounded-sm overflow-hidden aspect-[3/4] bg-[#201519]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt="" className="w-full h-full object-cover" />

              {/* Status overlay */}
              {photo.status !== 'APPROVED' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className={`badge border ${badge.className}`}>{badge.label}</span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {photo.isMain && (
                  <span className="badge badge-gold py-0.5 px-1.5 text-[10px]">
                    <Star size={9} /> Principal
                  </span>
                )}
                {photo.isPremium && (
                  <span className="badge bg-[rgba(233,30,140,0.2)] text-[#E91E8C] border-[rgba(233,30,140,0.3)] py-0.5 px-1.5 text-[10px]">
                    <Lock size={9} /> Premium
                  </span>
                )}
                {photo.isFace && (
                  <span className="badge badge-green py-0.5 px-1.5 text-[10px]">
                    <Smile size={9} /> Rosto
                  </span>
                )}
              </div>

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 gap-1">
                <button
                  onClick={() => toggle(photo.id, 'isMain')}
                  className={cn(
                    'flex items-center gap-1 text-[10px] font-semibold py-1 px-2 rounded transition-all',
                    photo.isMain ? 'bg-[#E8B84B] text-black' : 'bg-[#201519] text-[#E8B84B]'
                  )}
                >
                  <Star size={9} /> {photo.isMain ? 'É principal' : 'Marcar principal'}
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => toggle(photo.id, 'isPremium')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1 text-[10px] font-semibold py-1 rounded transition-all',
                      photo.isPremium ? 'bg-[#E91E8C] text-white' : 'bg-[#201519] text-[#E91E8C]'
                    )}
                  >
                    <Lock size={9} /> Premium
                  </button>
                  <button
                    onClick={() => toggle(photo.id, 'isFace')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1 text-[10px] font-semibold py-1 rounded transition-all',
                      photo.isFace ? 'bg-green-500 text-white' : 'bg-[#201519] text-green-400'
                    )}
                  >
                    <Smile size={9} /> Rosto
                  </button>
                </div>
                <button
                  onClick={() => remove(photo.id)}
                  className="flex items-center justify-center gap-1 text-[10px] font-semibold py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                >
                  <Trash2 size={9} /> Excluir
                </button>
              </div>

              {/* Approved check */}
              {photo.status === 'APPROVED' && (
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CheckCircle size={14} className="text-green-400" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
