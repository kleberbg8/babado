'use client'

import { useEffect, useState, useCallback } from 'react'
import { Users, Clock, Image, TrendingUp, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Stats {
  totalModels: number
  activeModels: number
  pendingModels: number
  todayModels: number
  pendingMedia: number
  recentLogs: {
    id: string
    action: string
    targetType: string
    targetId: string
    reason: string | null
    createdAt: string
    moderator: { email: string }
  }[]
  pendingProfiles: {
    id: string
    stageName: string
    city: string
    state: string
    createdAt: string
    medias: { id: string }[]
  }[]
}

const ACTION_LABEL: Record<string, { label: string; cls: string }> = {
  APPROVE: { label: 'Aprovado', cls: 'badge-green' },
  REJECT: { label: 'Rejeitado', cls: 'badge-pink' },
  SUSPEND: { label: 'Suspenso', cls: 'badge-gold' },
  BAN: { label: 'Banido', cls: 'bg-red-500/10 text-red-400 border border-red-500/20' },
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor(diff / 60000)
  if (h >= 24) return `${Math.floor(h / 24)}d atrás`
  if (h >= 1) return `${h}h atrás`
  return `${m}min atrás`
}

function StatSkeleton() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="w-10 h-10 rounded-lg skeleton mb-3" />
      <div className="h-7 w-16 skeleton mb-1 rounded" />
      <div className="h-3 w-24 skeleton rounded" />
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [approvingId, setApprovingId] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch('/api/admin/stats')
      const json = await res.json()
      if (json.success) setStats(json.data)
      else setError(json.error)
    } catch {
      setError('Erro ao carregar estatísticas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchStats() }, [fetchStats])

  const handleApprove = async (id: string) => {
    setApprovingId(id)
    try {
      await fetch(`/api/admin/models/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACTIVE' }),
      })
      await fetchStats()
    } finally {
      setApprovingId(null)
    }
  }

  const METRICS = stats
    ? [
        { label: 'Total de Modelos', value: stats.totalModels.toLocaleString('pt-BR'), icon: Users, color: 'text-[#BFA0AB]', bg: 'bg-[rgba(255,255,255,0.06)]' },
        { label: 'Pendentes aprovação', value: stats.pendingModels, icon: Clock, color: 'text-[#E8B84B]', bg: 'bg-[rgba(232,184,75,0.12)]', alert: stats.pendingModels > 0 },
        { label: 'Modelos ativas', value: stats.activeModels.toLocaleString('pt-BR'), icon: TrendingUp, color: 'text-green-400', bg: 'bg-[rgba(34,197,94,0.12)]' },
        { label: 'Mídias pendentes', value: stats.pendingMedia, icon: Image, color: 'text-[#E91E8C]', bg: 'bg-[rgba(233,30,140,0.12)]', alert: stats.pendingMedia > 0 },
      ]
    : null

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Dashboard <span className="italic text-[#E91E8C]">Admin</span>
          </h1>
          <p className="text-sm text-[#7A5665]">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            {stats && <span className="ml-2 text-[#BFA0AB]">· {stats.todayModels} cadastros hoje</span>}
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#7A5665] hover:text-white hover:bg-[#201519] text-sm transition-all"
        >
          <RefreshCw size={14} className={cn(loading && 'animate-spin')} />
          <span className="hidden sm:inline">Atualizar</span>
        </button>
      </div>

      {/* Alert */}
      {stats && (stats.pendingModels > 0 || stats.pendingMedia > 0) && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-[rgba(232,184,75,0.07)] border border-[rgba(232,184,75,0.18)] mb-6">
          <AlertTriangle size={16} className="text-[#E8B84B] shrink-0" />
          <p className="text-sm text-[#BFA0AB] flex-1">
            {stats.pendingModels > 0 && (
              <><span className="font-semibold text-[#E8B84B]">{stats.pendingModels} perfil{stats.pendingModels > 1 ? 'is' : ''}</span> aguardando aprovação. </>
            )}
            {stats.pendingMedia > 0 && (
              <><span className="font-semibold text-[#E8B84B]">{stats.pendingMedia} mídia{stats.pendingMedia > 1 ? 's' : ''}</span> pendente{stats.pendingMedia > 1 ? 's' : ''} de revisão.</>
            )}
          </p>
          <Link href="/admin/aprovacoes" className="text-xs font-semibold text-[#E8B84B] hover:underline shrink-0">
            Revisar →
          </Link>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-6">
          <p className="text-sm text-red-400 flex-1">{error}</p>
          <button onClick={fetchStats} className="text-xs text-red-400 underline">Tentar novamente</button>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          : METRICS?.map((m) => {
              const Icon = m.icon
              return (
                <div key={m.label} className={cn('card p-4 md:p-5', m.alert && 'border-[rgba(232,184,75,0.25)]')}>
                  <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-3', m.bg)}>
                    <Icon size={17} className={m.color} />
                  </div>
                  <p className="font-display text-2xl font-black text-white mb-0.5">{m.value}</p>
                  <p className="text-xs text-[#7A5665]">{m.label}</p>
                </div>
              )
            })}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        {/* Approval queue */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#F8F0F4]">Fila de Aprovação</h2>
            <Link href="/admin/aprovacoes" className="text-xs text-[#E91E8C] hover:underline">
              Ver todas →
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 skeleton rounded-lg" />
              ))}
            </div>
          ) : stats?.pendingProfiles.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle size={32} className="mx-auto mb-2 text-green-400 opacity-40" />
              <p className="text-sm text-[#7A5665]">Tudo em dia!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stats?.pendingProfiles.map((p) => {
                const hoursAgo = Math.floor((Date.now() - new Date(p.createdAt).getTime()) / 3600000)
                return (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#1A1014] border border-[rgba(255,255,255,0.05)]">
                    <div className="w-9 h-9 rounded-full bg-[rgba(233,30,140,0.15)] flex items-center justify-center text-[#E91E8C] font-bold text-sm shrink-0">
                      {p.stageName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#F8F0F4] truncate">{p.stageName}</p>
                      <p className="text-xs text-[#7A5665]">{p.city}, {p.state} · {timeAgo(p.createdAt)}</p>
                    </div>
                    {hoursAgo > 12 && (
                      <span className="badge badge-gold shrink-0">{hoursAgo}h</span>
                    )}
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => handleApprove(p.id)}
                        disabled={approvingId === p.id}
                        className="w-7 h-7 rounded bg-green-500/15 border border-green-500/25 flex items-center justify-center text-green-400 hover:bg-green-500/25 transition-all disabled:opacity-50"
                      >
                        <CheckCircle size={13} />
                      </button>
                      <Link
                        href={`/admin/modelos/${p.id}`}
                        className="w-7 h-7 rounded bg-[rgba(233,30,140,0.1)] border border-[rgba(233,30,140,0.2)] flex items-center justify-center text-[#E91E8C] hover:bg-[rgba(233,30,140,0.2)] transition-all"
                      >
                        <XCircle size={13} />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Moderation log */}
        <div className="card p-5">
          <h2 className="font-semibold text-[#F8F0F4] mb-4">Ações Recentes</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 skeleton rounded" />
              ))}
            </div>
          ) : stats?.recentLogs.length === 0 ? (
            <p className="text-sm text-[#7A5665] text-center py-8">Nenhuma ação registrada.</p>
          ) : (
            <div className="space-y-2">
              {stats?.recentLogs.map((log) => {
                const cfg = ACTION_LABEL[log.action] ?? { label: log.action, cls: 'badge-pink' }
                return (
                  <div key={log.id} className="flex items-center gap-3 py-2 border-b border-[rgba(255,255,255,0.04)] last:border-0">
                    <span className={cn('badge shrink-0', cfg.cls)}>{cfg.label}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#BFA0AB] truncate">
                        {log.targetType} <span className="text-[#7A5665]">por</span> {log.moderator.email}
                      </p>
                      {log.reason && <p className="text-[10px] text-[#7A5665] truncate">{log.reason}</p>}
                    </div>
                    <span className="text-xs text-[#7A5665] shrink-0 whitespace-nowrap">{timeAgo(log.createdAt)}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 md:mt-6">
        {[
          { href: '/admin/modelos', label: 'Gestão de Modelos', icon: Users, color: 'text-[#BFA0AB]' },
          { href: '/admin/midias', label: 'Moderação de Mídias', icon: Image, color: 'text-[#E91E8C]' },
          { href: '/admin/financeiro', label: 'Financeiro', icon: TrendingUp, color: 'text-green-400' },
          { href: '/admin/logs', label: 'Logs de Auditoria', icon: Clock, color: 'text-[#E8B84B]' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="card p-4 flex items-center gap-3 hover:border-[rgba(233,30,140,0.3)] transition-all group"
            >
              <Icon size={18} className={item.color} />
              <span className="text-sm text-[#7A5665] group-hover:text-[#BFA0AB] transition-colors leading-tight">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
