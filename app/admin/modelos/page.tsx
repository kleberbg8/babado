'use client'

import { useState } from 'react'
import { Search, ShieldOff, Ban, Eye, ChevronDown, MapPin, Star, CheckCircle, Plus, X, Save, Edit2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useModelsStore, type Status } from '@/lib/models-store'

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  ACTIVE: { label: 'Ativa', className: 'badge-green' },
  PENDING: { label: 'Pendente', className: 'bg-[rgba(232,184,75,0.1)] text-[#E8B84B] border-[rgba(232,184,75,0.2)]' },
  SUSPENDED: { label: 'Suspensa', className: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  BANNED: { label: 'Banida', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

const PLAN_COLOR: Record<string, string> = {
  FREE: 'text-[#7A5665]',
  SILVER: 'text-[#BFA0AB]',
  GOLD: 'text-[#E8B84B]',
  ELITE: 'text-[#E91E8C]',
}

const EMPTY_FORM = { name: '', email: '', whatsapp: '', city: '', state: '', plan: 'FREE' as const }

export default function ModelosPage() {
  const { models, updateStatus, addModel } = useModelsStore()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | Status>('all')
  const [filterPlan, setFilterPlan] = useState<'all' | string>('all')
  const [actionMenu, setActionMenu] = useState<string | null>(null)
  const [showCadastro, setShowCadastro] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const filtered = models.filter((m) => {
    const matchSearch = m.stageName.toLowerCase().includes(search.toLowerCase()) ||
      m.city.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || m.status === filterStatus
    const matchPlan = filterPlan === 'all' || m.plan === filterPlan
    return matchSearch && matchStatus && matchPlan
  })

  const pendingCount = models.filter((m) => m.status === 'PENDING').length

  const handleCadastro = async () => {
    if (!form.name || !form.email || !form.city || !form.state) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    addModel({
      id: String(Date.now()),
      stageName: form.name,
      email: form.email,
      whatsapp: form.whatsapp,
      city: form.city,
      state: form.state,
      neighborhood: '',
      plan: form.plan,
      status: 'PENDING',
      score: 0,
      joinedAt: new Date().toLocaleDateString('pt-BR'),
      isVerified: false,
      views: 0,
      bio: '',
      age: 0,
      height: 0,
      weight: 0,
      ethnicity: '',
      hairStyle: '',
      hairSize: '',
      eyeColor: '',
      hasSilicone: false,
      hasTattoo: false,
      smokes: false,
      serviceType: 'LOCAL',
      priceMin: 0,
      priceTable: {},
      languages: ['Português'],
      photos: [],
      services: [],
      availability: [],
    })
    setForm(EMPTY_FORM)
    setShowCadastro(false)
    setSaving(false)
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Gestão de <span className="italic text-[#E91E8C]">Modelos</span>
          </h1>
          <p className="text-sm text-[#7A5665]">
            {models.length} modelos cadastradas
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-[rgba(232,184,75,0.15)] text-[#E8B84B] text-xs font-semibold">
                {pendingCount} pendentes
              </span>
            )}
          </p>
        </div>
        <button onClick={() => setShowCadastro(true)} className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <Plus size={15} /> Cadastrar Modelo
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-52">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5665]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome ou cidade..." className="input-field pl-9 py-2 text-sm" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)} className="input-field py-2 text-sm w-auto pr-8">
          <option value="all">Todos os status</option>
          <option value="ACTIVE">Ativas</option>
          <option value="PENDING">Pendentes</option>
          <option value="SUSPENDED">Suspensas</option>
          <option value="BANNED">Banidas</option>
        </select>
        <select value={filterPlan} onChange={(e) => setFilterPlan(e.target.value)} className="input-field py-2 text-sm w-auto pr-8">
          <option value="all">Todos os planos</option>
          <option value="FREE">Free</option>
          <option value="SILVER">Silver</option>
          <option value="GOLD">Gold</option>
          <option value="ELITE">Elite</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {['Modelo', 'Localização', 'Plano', 'Status', 'Avaliação', 'Fotos', 'Visualizações', 'Cadastro', 'Ações'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#7A5665] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
              {filtered.map((model) => {
                const S = STATUS_CONFIG[model.status]
                return (
                  <tr key={model.id} className="hover:bg-[rgba(233,30,140,0.03)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[rgba(233,30,140,0.15)] flex items-center justify-center text-[#E91E8C] font-bold text-sm shrink-0">
                          {model.stageName[0]}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-[#F8F0F4]">{model.stageName}</span>
                          {model.isVerified && <CheckCircle size={12} className="text-green-400" />}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-[#BFA0AB]"><MapPin size={11} />{model.city}, {model.state}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('font-semibold', PLAN_COLOR[model.plan])}>{model.plan}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${S.className}`}>{S.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      {model.score > 0
                        ? <span className="flex items-center gap-1 text-[#E8B84B]"><Star size={11} className="fill-current" />{model.score}</span>
                        : <span className="text-[#7A5665]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-[#BFA0AB]">{model.photos.length}</td>
                    <td className="px-4 py-3 text-[#BFA0AB]">{model.views.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 text-[#7A5665]">{model.joinedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/modelos/${model.id}`} className="flex items-center gap-1 px-2 py-1.5 rounded text-[#BFA0AB] hover:text-white hover:bg-[#201519] text-xs font-semibold transition-all">
                          <Eye size={13} /> Ver
                        </Link>
                        <div className="relative">
                          <button onClick={() => setActionMenu(actionMenu === model.id ? null : model.id)} className="flex items-center gap-1 px-2 py-1.5 rounded text-[#BFA0AB] hover:text-white hover:bg-[#201519] text-xs font-semibold transition-all">
                            Ações <ChevronDown size={11} />
                          </button>
                          {actionMenu === model.id && (
                            <div className="absolute right-0 top-full mt-1 z-20 w-44 card border border-[rgba(255,255,255,0.1)] shadow-xl">
                              <Link href={`/admin/modelos/${model.id}?tab=editar`} onClick={() => setActionMenu(null)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#BFA0AB] hover:bg-[#201519] transition-colors">
                                <Edit2 size={12} /> Editar Perfil
                              </Link>
                              {model.status !== 'ACTIVE' && (
                                <button onClick={() => updateStatus(model.id, 'ACTIVE')} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-green-400 hover:bg-[#201519] transition-colors text-left">
                                  <CheckCircle size={12} /> Ativar
                                </button>
                              )}
                              {model.status !== 'SUSPENDED' && (
                                <button onClick={() => updateStatus(model.id, 'SUSPENDED')} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-orange-400 hover:bg-[#201519] transition-colors text-left">
                                  <ShieldOff size={12} /> Suspender
                                </button>
                              )}
                              {model.status !== 'BANNED' && (
                                <button onClick={() => updateStatus(model.id, 'BANNED')} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-[#201519] transition-colors text-left">
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
        {filtered.length === 0 && <div className="text-center py-12 text-[#7A5665] text-sm">Nenhuma modelo encontrada</div>}
      </div>

      {/* Modal Cadastrar */}
      {showCadastro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="card w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-bold text-white">Cadastrar Nova Modelo</h2>
              <button onClick={() => setShowCadastro(false)} className="text-[#7A5665] hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Nome artístico *</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Nome que vai aparecer no perfil" className="input-field w-full py-2 text-sm" />
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
                <select value={form.plan} onChange={(e) => setForm((p) => ({ ...p, plan: e.target.value as typeof form.plan }))} className="input-field w-full py-2 text-sm">
                  <option value="FREE">Free</option>
                  <option value="SILVER">Silver</option>
                  <option value="GOLD">Gold</option>
                  <option value="ELITE">Elite</option>
                </select>
              </div>
              <p className="text-xs text-[#7A5665]">Cadastro criado como <strong className="text-[#E8B84B]">Pendente</strong>. Complete o perfil na tela de detalhes.</p>
              <div className="flex gap-3 pt-2">
                <button onClick={handleCadastro} disabled={saving || !form.name || !form.email || !form.city || !form.state} className="btn-primary flex items-center gap-2 text-sm py-2 px-5 disabled:opacity-50">
                  <Save size={14} />{saving ? 'Cadastrando...' : 'Cadastrar'}
                </button>
                <button onClick={() => setShowCadastro(false)} className="px-4 py-2 rounded-lg text-[#7A5665] hover:text-white hover:bg-[#201519] text-sm transition-all">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
