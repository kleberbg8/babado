'use client'

import { useState } from 'react'
import { Search, Shield, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

type ActionType = 'APPROVE' | 'REJECT' | 'SUSPEND' | 'BAN' | 'LOGIN' | 'MEDIA_APPROVE' | 'MEDIA_REJECT' | 'PLAN_CHANGE' | 'WITHDRAWAL'

interface LogEntry {
  id: string
  actor: string
  actorRole: 'ADMIN' | 'MODERATOR'
  action: ActionType
  target: string
  targetType: 'MODEL' | 'MEDIA' | 'USER' | 'PAYMENT'
  detail?: string
  ip: string
  timestamp: string
}

const ACTION_CONFIG: Record<ActionType, { label: string; className: string }> = {
  APPROVE: { label: 'Aprovação', className: 'badge-green' },
  REJECT: { label: 'Rejeição', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
  SUSPEND: { label: 'Suspensão', className: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  BAN: { label: 'Banimento', className: 'bg-red-700/20 text-red-300 border-red-700/30' },
  LOGIN: { label: 'Login', className: 'bg-[rgba(255,255,255,0.06)] text-[#BFA0AB] border-[rgba(255,255,255,0.1)]' },
  MEDIA_APPROVE: { label: 'Mídia aprovada', className: 'badge-green' },
  MEDIA_REJECT: { label: 'Mídia rejeitada', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
  PLAN_CHANGE: { label: 'Plano alterado', className: 'bg-[rgba(232,184,75,0.1)] text-[#E8B84B] border-[rgba(232,184,75,0.2)]' },
  WITHDRAWAL: { label: 'Saque pago', className: 'badge-green' },
}

const MOCK_LOGS: LogEntry[] = [
  { id: '1', actor: 'Admin Master', actorRole: 'ADMIN', action: 'APPROVE', target: 'Valentina Silva', targetType: 'MODEL', ip: '189.1.2.3', timestamp: '25/04/2026 14:32:11' },
  { id: '2', actor: 'Mod. João', actorRole: 'MODERATOR', action: 'MEDIA_APPROVE', target: 'foto_8293.jpg', targetType: 'MEDIA', detail: 'Isabelle Costa', ip: '201.5.6.7', timestamp: '25/04/2026 14:28:45' },
  { id: '3', actor: 'Mod. João', actorRole: 'MODERATOR', action: 'MEDIA_REJECT', target: 'foto_8291.jpg', targetType: 'MEDIA', detail: 'Conteúdo não permitido', ip: '201.5.6.7', timestamp: '25/04/2026 14:27:30' },
  { id: '4', actor: 'Admin Master', actorRole: 'ADMIN', action: 'SUSPEND', target: 'Melissa Santos', targetType: 'MODEL', detail: 'Violação dos termos', ip: '189.1.2.3', timestamp: '25/04/2026 13:15:00' },
  { id: '5', actor: 'Admin Master', actorRole: 'ADMIN', action: 'WITHDRAWAL', target: 'Isabelle Costa', targetType: 'PAYMENT', detail: 'R$ 150,00 via Pix', ip: '189.1.2.3', timestamp: '25/04/2026 12:00:00' },
  { id: '6', actor: 'Admin Master', actorRole: 'ADMIN', action: 'LOGIN', target: 'Painel Admin', targetType: 'USER', ip: '189.1.2.3', timestamp: '25/04/2026 08:01:22' },
  { id: '7', actor: 'Mod. Maria', actorRole: 'MODERATOR', action: 'APPROVE', target: 'Júlia Ferreira', targetType: 'MODEL', ip: '177.9.8.1', timestamp: '24/04/2026 22:45:10' },
  { id: '8', actor: 'Admin Master', actorRole: 'ADMIN', action: 'BAN', target: 'Fernanda Dias', targetType: 'MODEL', detail: 'Perfil fraudulento detectado', ip: '189.1.2.3', timestamp: '24/04/2026 18:30:00' },
  { id: '9', actor: 'Admin Master', actorRole: 'ADMIN', action: 'PLAN_CHANGE', target: 'Bruna Lima', targetType: 'MODEL', detail: 'FREE → ELITE', ip: '189.1.2.3', timestamp: '24/04/2026 15:00:00' },
  { id: '10', actor: 'Mod. João', actorRole: 'MODERATOR', action: 'REJECT', target: 'Candidata X', targetType: 'MODEL', detail: 'Documento ilegível', ip: '201.5.6.7', timestamp: '24/04/2026 11:22:55' },
]

export default function LogsPage() {
  const [search, setSearch] = useState('')
  const [filterAction, setFilterAction] = useState<'all' | ActionType>('all')

  const filtered = MOCK_LOGS.filter((l) => {
    const matchSearch =
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase()) ||
      l.detail?.toLowerCase().includes(search.toLowerCase())
    const matchAction = filterAction === 'all' || l.action === filterAction
    return matchSearch && matchAction
  })

  const exportCSV = () => {
    const header = 'ID,Ator,Role,Ação,Alvo,Tipo,Detalhe,IP,Timestamp'
    const rows = MOCK_LOGS.map((l) =>
      `${l.id},"${l.actor}",${l.actorRole},${l.action},"${l.target}",${l.targetType},"${l.detail ?? ''}",${l.ip},${l.timestamp}`
    )
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'audit_logs.csv'
    a.click()
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Logs de <span className="italic text-[#E91E8C]">Auditoria</span>
          </h1>
          <p className="text-sm text-[#7A5665]">Registro imutável de todas as ações administrativas</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded text-sm font-semibold bg-[#201519] border border-[rgba(255,255,255,0.08)] text-[#BFA0AB] hover:text-white transition-all"
        >
          <Download size={14} />
          Exportar CSV
        </button>
      </div>

      <div className="flex items-center gap-3 p-3 rounded bg-[rgba(232,184,75,0.06)] border border-[rgba(232,184,75,0.15)] mb-6">
        <Shield size={14} className="text-[#E8B84B] shrink-0" />
        <p className="text-xs text-[#BFA0AB]">
          Estes logs são imutáveis e registram todas as ações administrativas para fins de conformidade e auditoria.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-52">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5665]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por ator, alvo ou detalhe..."
            className="input-field pl-9 py-2 text-sm"
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value as typeof filterAction)}
          className="input-field py-2 text-sm w-auto pr-8"
        >
          <option value="all">Todas as ações</option>
          <option value="APPROVE">Aprovações</option>
          <option value="REJECT">Rejeições</option>
          <option value="SUSPEND">Suspensões</option>
          <option value="BAN">Banimentos</option>
          <option value="MEDIA_APPROVE">Mídia aprovada</option>
          <option value="MEDIA_REJECT">Mídia rejeitada</option>
          <option value="WITHDRAWAL">Saques</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {['Timestamp', 'Ator', 'Ação', 'Alvo', 'Detalhe', 'IP'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#7A5665] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
              {filtered.map((log) => {
                const A = ACTION_CONFIG[log.action]
                return (
                  <tr key={log.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[#7A5665] whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-[#F8F0F4] text-xs">{log.actor}</p>
                        <span className={cn('text-[10px] font-semibold', log.actorRole === 'ADMIN' ? 'text-[#E91E8C]' : 'text-[#E8B84B]')}>
                          {log.actorRole}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${A.className}`}>{A.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-[#BFA0AB] text-xs">{log.target}</p>
                        <p className="text-[10px] text-[#7A5665]">{log.targetType}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#7A5665] max-w-48 truncate">
                      {log.detail ?? '—'}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[#7A5665]">{log.ip}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#7A5665] text-sm">Nenhum log encontrado</div>
        )}
      </div>
    </div>
  )
}
