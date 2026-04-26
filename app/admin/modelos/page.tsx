'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, ShieldOff, Ban, Eye, ChevronDown, MapPin, Star, CheckCircle, Plus, X, Save, Edit2, RefreshCw, ChevronLeft, ChevronRight as ChevRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Status = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED'
type Plan = 'FREE' | 'SILVER' | 'GOLD' | 'ELITE'

interface ModelRow {
  id: string
  stageName: string
  email: string | null
  city: string
  state: string
  plan: Plan
  status: Status
  score: number
  viewCount: number
  verifiedAt: string | null
  createdAt: string
  medias: { id: string }[]
}

const STATUS_CFG: Record<Status, { label: string; cls: string }> = {
  ACTIVE: { label: 'Ativa', cls: 'badge-green' },
  PENDING: { label: 'Pendente', cls: 'badge-gold' },
  SUSPENDED: { label: 'Suspensa', cls: 'bg-orange-500/10 text-orange-400 border border-orange-500/20' },
  BANNED: { label: 'Banida', cls: 'bg-red-500/10 text-red-400 border border-red-500/20' },
}

const PLAN_COLOR: Record<Plan, string> = {
  FREE: 'text-[#7A5665]',
  SILVER: 'text-[#BFA0AB]',
  GOLD: 'text-[#E8B84B]',
  ELITE: 'text-[#E91E8C]',
}

const EMPTY_FORM = { name: '', email: '', whatsapp: '', city: '', state: '', plan: 'FREE' as Plan }

export default function ModelosPage() {
  const [models, setModels] = useState<ModelRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | Status>('all')
  const [filterPlan, setFilterPlan] = useState<'all' | Plan>('all')

  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const [showCadastro, setShowCadastro] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const actionMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const fetchModels = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (search) params.set('search', search)
      if (filterStatus !== 'all') params.set('status', filterStatus)
      if (filterPlan !== 'all') params.set('plan', filterPlan)

      const res = await fetch(`/api/admin/models?${params}`)
      const json = await res.json()
      if (json.success) {
        setModels(json.data)
        setTotal(json.total)
        setPages(json.pages)
      } else {
        setError(json.error)
      }
    } catch {
      setError('Erro ao carregar modelos')
    } finally {
      setLoading(false)
    }
  }, [page, search, filterStatus, filterPlan])

  useEffect(() => { fetchModels() }, [fetchModels])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) {
        setActionMenu(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleStatusChange = async (id: string, status: Status) => {
    setActionLoading(id)
    setActionMenu(null)
    try {
      await fetch(`/api/admin/models/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      await fetchModels()
    } finally {
      setActionLoading(null)
    }
  }

  const handleCadastro = async () => {
    if (!form.name || !form.email || !form.city || !form.state) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stageName: form.name,
          email: form.email,
          whatsapp: form.whatsapp,
          city: form.city,
          state: form.state,
          plan: form.plan,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setForm(EMPTY_FORM)
        setShowCadastro(false)
        await fetchModels()
      } else {
        alert(json.error ?? 'Erro ao cadastrar')
      }
    } finally {
      setSaving(false)
    }
  }

  const pendingCount = models.filter((m) => m.status === 'PENDING').length

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Gestão de <span className="italic text-[#E91E8C]">Modelos</span>
          </h1>
          <p className="text-sm text-[#7A5665]">
            {loading ? '…' : `${total} modelos no total`}
            {!loading && pendingCount > 0 && (
              <span className="ml-2 badge badge-gold">{pendingCount} pendentes</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchModels} disabled={loading} className="p-2 rounded-lg text-[#7A5665] hover:text-white hover:bg-[#201519] transition-all">
            <RefreshCw size={16} className={cn(loading && 'animate-spin')} />
          </button>
          <button onClick={() => setShowCadastro(true)} className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
            <Plus size={15} /> Cadastrar Modelo
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5665]" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar nome, cidade, email..."
            className="input-field pl-9 py-2 text-sm"
          />
        </div>
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value as typeof filterStatus); setPage(1) }} className="input-field py-2 text-sm w-auto pr-8">
          <option value="all">Todos os status</option>
          <option value="ACTIVE">Ativas</option>
          <option value="PENDING">Pendentes</option>
          <option value="SUSPENDED">Suspensas</option>
          <option value="BANNED">Banidas</option>
        </select>
        <select value={filterPlan} onChange={(e) => { setFilterPlan(e.target.value as typeof filterPlan); setPage(1) }} className="input-field py-2 text-sm w-auto pr-8">
          <option value="all">Todos os planos</option>
          <option value="FREE">Free</option>
          <option value="SILVER">Silver</option>
          <option value="GOLD">Gold</option>
          <option value="ELITE">Elite</option>
        </select>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-4 text-sm text-red-400 flex justify-between items-center">
          {error}
          <button onClick={fetchModels} className="underline text-xs">Tentar novamente</button>
        </div>
      )}

      {/* Table — desktop */}
      <div className="card overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {['Modelo', 'Localização', 'Plano', 'Status', 'Score', 'Fotos', 'Views', 'Cadastro', 'Ações'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#7A5665] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-4 skeleton rounded" /></td>
                    ))}
                  </tr>
                ))
                : models.map((model) => {
                  const S = STATUS_CFG[model.status]
                  const isLoading = actionLoading === model.id
                  return (
                    <tr key={model.id} className={cn('hover:bg-[rgba(233,30,140,0.03)] transition-colors', isLoading && 'opacity-50')}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[rgba(233,30,140,0.15)] flex items-center justify-center text-[#E91E8C] font-bold text-sm shrink-0">
                            {model.stageName[0]}
                          </div>
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-medium text-[#F8F0F4] truncate">{model.stageName}</span>
                            {model.verifiedAt && <CheckCircle size={12} className="text-green-400 shrink-0" />}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="flex items-center gap-1 text-[#BFA0AB] text-xs"><MapPin size={10} />{model.city}, {model.state}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('font-bold text-xs', PLAN_COLOR[model.plan])}>{model.plan}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('badge', S.cls)}>{S.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        {model.score > 0
                          ? <span className="flex items-center gap-1 text-[#E8B84B] text-xs"><Star size={10} className="fill-current" />{model.score.toFixed(1)}</span>
                          : <span className="text-[#7A5665] text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3 text-[#BFA0AB] text-xs">{model.medias?.length ?? 0}</td>
                      <td className="px-4 py-3 text-[#BFA0AB] text-xs">{model.viewCount.toLocaleString('pt-BR')}</td>
                      <td className="px-4 py-3 text-[#7A5665] text-xs whitespace-nowrap">
                        {new Date(model.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link href={`/admin/modelos/${model.id}`} className="flex items-center gap-1 px-2 py-1.5 rounded text-[#BFA0AB] hover:text-white hover:bg-[#201519] text-xs font-semibold transition-all whitespace-nowrap">
                            <Eye size={12} /> Ver
                          </Link>
                          <div className="relative" ref={actionMenu === model.id ? actionMenuRef : null}>
                            <button
                              onClick={() => setActionMenu(actionMenu === model.id ? null : model.id)}
                              className="flex items-center gap-1 px-2 py-1.5 rounded text-[#BFA0AB] hover:text-white hover:bg-[#201519] text-xs font-semibold transition-all whitespace-nowrap"
                            >
                              Ações <ChevronDown size={11} />
                            </button>
                            {actionMenu === model.id && (
                              <div className="absolute right-0 top-full mt-1 z-20 w-44 bg-[#201519] border border-[rgba(255,255,255,0.1)] rounded-lg shadow-xl overflow-hidden">
                                <Link href={`/admin/modelos/${model.id}`} onClick={() => setActionMenu(null)} className="flex items-center gap-2 px-3 py-2.5 text-xs text-[#BFA0AB] hover:bg-[#2A1C22] transition-colors">
                                  <Edit2 size={12} /> Editar Perfil
                                </Link>
                                {model.status !== 'ACTIVE' && (
                                  <button onClick={() => handleStatusChange(model.id, 'ACTIVE')} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-green-400 hover:bg-[#2A1C22] transition-colors text-left">
                                    <CheckCircle size={12} /> Ativar
                                  </button>
                                )}
                                {model.status !== 'SUSPENDED' && (
                                  <button onClick={() => handleStatusChange(model.id, 'SUSPENDED')} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-orange-400 hover:bg-[#2A1C22] transition-colors text-left">
                                    <ShieldOff size={12} /> Suspender
                                  </button>
                                )}
                                {model.status !== 'BANNED' && (
                                  <button onClick={() => handleStatusChange(model.id, 'BANNED')} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-400 hover:bg-[#2A1C22] transition-colors text-left">
                                    <Ban size={12} /> Banir
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
        {!loading && models.length === 0 && (
          <div className="text-center py-12 text-[#7A5665] text-sm">Nenhuma modelo encontrada</div>
        )}
      </div>

      {/* Cards — mobile */}
      <div className="md:hidden space-y-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="card p-4 h-24 skeleton rounded-xl" />)
          : models.map((model) => {
            const S = STATUS_CFG[model.status]
            return (
              <div key={model.id} className="card p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[rgba(233,30,140,0.15)] flex items-center justify-center text-[#E91E8C] font-bold shrink-0">
                    {model.stageName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#F8F0F4] flex items-center gap-1.5 truncate">
                      {model.stageName}
                      {model.verifiedAt && <CheckCircle size={11} className="text-green-400 shrink-0" />}
                    </p>
                    <p className="text-xs text-[#7A5665] flex items-center gap-1"><MapPin size={10} />{model.city}, {model.state}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={cn('badge', S.cls)}>{S.label}</span>
                    <span className={cn('text-[10px] font-bold', PLAN_COLOR[model.plan])}>{model.plan}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/modelos/${model.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-[rgba(233,30,140,0.1)] text-[#E91E8C] border border-[rgba(233,30,140,0.2)]">
                    <Eye size={12} /> Ver perfil
                  </Link>
                  {model.status !== 'ACTIVE' && (
                    <button onClick={() => handleStatusChange(model.id, 'ACTIVE')} disabled={actionLoading === model.id} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 disabled:opacity-50">
                      <CheckCircle size={12} /> Ativar
                    </button>
                  )}
                  {model.status === 'ACTIVE' && (
                    <button onClick={() => handleStatusChange(model.id, 'SUSPENDED')} disabled={actionLoading === model.id} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 disabled:opacity-50">
                      <ShieldOff size={12} /> Suspender
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        {!loading && models.length === 0 && (
          <div className="text-center py-12 text-[#7A5665] text-sm">Nenhuma modelo encontrada</div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
          <p className="text-xs text-[#7A5665]">
            {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} de {total}
          </p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded text-[#7A5665] hover:text-white hover:bg-[#201519] disabled:opacity-30 transition-all">
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-2 text-xs text-[#BFA0AB]">{page} / {pages}</span>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="p-2 rounded text-[#7A5665] hover:text-white hover:bg-[#201519] disabled:opacity-30 transition-all">
              <ChevRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modal Cadastrar */}
      {showCadastro && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
          <div className="card w-full sm:max-w-lg p-6 rounded-t-2xl sm:rounded-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-bold text-white">Cadastrar Nova Modelo</h2>
              <button onClick={() => setShowCadastro(false)} className="text-[#7A5665] hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Nome artístico *</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Ex: Valentina Silva" className="input-field w-full py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="email@exemplo.com" className="input-field w-full py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">WhatsApp</label>
                <input value={form.whatsapp} onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))} placeholder="(11) 99999-9999" className="input-field w-full py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#7A5665] mb-1">Cidade *</label>
                  <input value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} placeholder="São Paulo" className="input-field w-full py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-[#7A5665] mb-1">Estado *</label>
                  <input value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value.toUpperCase() }))} placeholder="SP" maxLength={2} className="input-field w-full py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Plano inicial</label>
                <select value={form.plan} onChange={(e) => setForm((p) => ({ ...p, plan: e.target.value as Plan }))} className="input-field w-full py-2 text-sm">
                  <option value="FREE">Free</option>
                  <option value="SILVER">Silver</option>
                  <option value="GOLD">Gold</option>
                  <option value="ELITE">Elite</option>
                </select>
              </div>
              <p className="text-xs text-[#7A5665]">Cadastro criado como <strong className="text-[#E8B84B]">Pendente</strong>. Complete o perfil na tela de detalhes.</p>
              <div className="flex gap-3 pt-1">
                <button onClick={handleCadastro} disabled={saving || !form.name || !form.email || !form.city || !form.state} className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5 disabled:opacity-50">
                  <Save size={14} />{saving ? 'Cadastrando...' : 'Cadastrar'}
                </button>
                <button onClick={() => setShowCadastro(false)} className="px-4 py-2.5 rounded-lg text-[#7A5665] hover:text-white hover:bg-[#201519] text-sm transition-all">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
