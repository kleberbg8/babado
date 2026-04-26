'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, XCircle, Clock, ShieldCheck, MapPin, RefreshCw, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface PendingModel {
  id: string
  stageName: string
  city: string
  state: string
  createdAt: string
  medias: { id: string }[]
}

function timeAgo(date: string) {
  const h = Math.floor((Date.now() - new Date(date).getTime()) / 3600000)
  if (h < 1) return 'Agora há pouco'
  if (h < 24) return `${h}h atrás`
  return `${Math.floor(h / 24)}d atrás`
}

export default function AprovacoesPage() {
  const [profiles, setProfiles] = useState<PendingModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [bulkLoading, setBulkLoading] = useState(false)
  const [rejectModal, setRejectModal] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [filter, setFilter] = useState<'all' | 'oldest' | 'no_media'>('all')

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/admin/models?status=PENDING&limit=50')
      const json = await res.json()
      if (json.success) setProfiles(json.data)
      else setError(json.error)
    } catch {
      setError('Erro ao carregar aprovações')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPending() }, [fetchPending])

  const changeStatus = async (id: string, status: string) => {
    setActionLoading(id)
    try {
      await fetch(`/api/admin/models/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setProfiles((prev) => prev.filter((p) => p.id !== id))
      setSelected((s) => { const n = new Set(s); n.delete(id); return n })
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    if (!rejectModal) return
    await changeStatus(rejectModal, 'BANNED')
    setRejectModal(null)
    setRejectReason('')
  }

  const handleBulkApprove = async () => {
    setBulkLoading(true)
    try {
      await Promise.all(Array.from(selected).map((id) =>
        fetch(`/api/admin/models/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'ACTIVE' }),
        })
      ))
      setProfiles((prev) => prev.filter((p) => !selected.has(p.id)))
      setSelected(new Set())
    } finally {
      setBulkLoading(false)
    }
  }

  const filteredProfiles = profiles.filter((p) => {
    const hoursAgo = (Date.now() - new Date(p.createdAt).getTime()) / 3600000
    if (filter === 'oldest') return hoursAgo > 12
    if (filter === 'no_media') return p.medias.length === 0
    return true
  })

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Fila de <span className="italic text-[#E91E8C]">Aprovação</span>
          </h1>
          <p className="text-sm text-[#7A5665]">
            {loading ? '…' : `${profiles.length} perfil${profiles.length !== 1 ? 'is' : ''} aguardando`}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchPending} disabled={loading} className="p-2 rounded-lg text-[#7A5665] hover:text-white hover:bg-[#201519] transition-all">
            <RefreshCw size={16} className={cn(loading && 'animate-spin')} />
          </button>
          {selected.size > 0 && (
            <button
              onClick={handleBulkApprove}
              disabled={bulkLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/15 border border-green-500/25 text-green-400 text-sm font-semibold hover:bg-green-500/25 transition-all disabled:opacity-50"
            >
              <CheckCircle size={14} />
              {bulkLoading ? 'Aprovando...' : `Aprovar ${selected.size} selecionados`}
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          { value: 'all', label: 'Todos' },
          { value: 'oldest', label: 'Aguardando +12h' },
          { value: 'no_media', label: 'Sem fotos' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as typeof filter)}
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

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-4 text-sm text-red-400 flex justify-between">
          {error}
          <button onClick={fetchPending} className="underline text-xs">Tentar novamente</button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5 h-24 skeleton" />
          ))}
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="text-center py-20 card">
          <CheckCircle size={48} className="mx-auto mb-4 text-green-400 opacity-40" />
          <p className="text-[#7A5665]">
            {profiles.length === 0 ? 'Nenhum perfil pendente. Tudo em dia!' : 'Nenhum perfil neste filtro.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProfiles.map((profile) => {
            const hoursAgo = Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / 3600000)
            const isLoading = actionLoading === profile.id

            return (
              <div
                key={profile.id}
                className={cn(
                  'card p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center gap-4 transition-all',
                  hoursAgo > 12 && 'border-[rgba(232,184,75,0.25)]',
                  selected.has(profile.id) && 'border-[rgba(233,30,140,0.3)] bg-[rgba(233,30,140,0.03)]',
                  isLoading && 'opacity-50'
                )}
              >
                <input
                  type="checkbox"
                  className="accent-[#E91E8C] w-4 h-4 shrink-0"
                  checked={selected.has(profile.id)}
                  onChange={(e) => {
                    const next = new Set(selected)
                    if (e.target.checked) next.add(profile.id)
                    else next.delete(profile.id)
                    setSelected(next)
                  }}
                />

                <div className="w-11 h-11 rounded-full bg-[rgba(233,30,140,0.15)] flex items-center justify-center text-[#E91E8C] font-display font-bold text-lg shrink-0">
                  {profile.stageName.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[#F8F0F4]">{profile.stageName}</h3>
                    {profile.medias.length > 0
                      ? <span className="badge badge-green"><ShieldCheck size={9} /> {profile.medias.length} foto{profile.medias.length > 1 ? 's' : ''}</span>
                      : <span className="badge bg-red-500/10 text-red-400 border border-red-500/20"><ImageIcon size={9} /> Sem fotos</span>}
                    {hoursAgo > 12 && (
                      <span className="badge badge-gold"><Clock size={9} /> {hoursAgo}h aguardando</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-[#7A5665]">
                      <MapPin size={10} /> {profile.city}, {profile.state}
                    </span>
                    <span className="text-xs text-[#7A5665]">{timeAgo(profile.createdAt)}</span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => changeStatus(profile.id, 'ACTIVE')}
                    disabled={isLoading}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-green-500/12 border border-green-500/25 text-green-400 hover:bg-green-500/22 transition-all disabled:opacity-50"
                  >
                    <CheckCircle size={14} /> Aprovar
                  </button>
                  <Link
                    href={`/admin/modelos/${profile.id}`}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-[rgba(232,184,75,0.1)] border border-[rgba(232,184,75,0.2)] text-[#E8B84B] hover:bg-[rgba(232,184,75,0.18)] transition-all"
                  >
                    Ver perfil
                  </Link>
                  <button
                    onClick={() => setRejectModal(profile.id)}
                    disabled={isLoading}
                    className="flex items-center justify-center px-3 py-2 rounded-lg text-sm bg-[rgba(233,30,140,0.08)] border border-[rgba(233,30,140,0.2)] text-[#E91E8C] hover:bg-[rgba(233,30,140,0.15)] transition-all disabled:opacity-50"
                  >
                    <XCircle size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full sm:max-w-md card p-6 rounded-t-2xl sm:rounded-xl animate-scale-in">
            <h3 className="font-display text-lg font-bold text-white mb-2">Rejeitar perfil</h3>
            <p className="text-sm text-[#BFA0AB] mb-4">
              Informe o motivo da rejeição. O perfil será banido e o feedback será registrado.
            </p>
            <textarea
              placeholder="Ex: Documentos ilegíveis, fotos de terceiros identificadas..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="input-field min-h-[100px] resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => { setRejectModal(null); setRejectReason('') }} className="btn-secondary flex-1 py-2.5 text-sm">Cancelar</button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-50"
              >
                Confirmar rejeição
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
