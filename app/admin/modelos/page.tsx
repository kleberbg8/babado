'use client'

import { useState } from 'react'
import { Search, ShieldOff, Ban, Eye, ChevronDown, MapPin, Star, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Status = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED'

interface Model {
  id: string
  name: string
  city: string
  state: string
  plan: 'FREE' | 'SILVER' | 'GOLD' | 'ELITE'
  status: Status
  score: number
  joinedAt: string
  isVerified: boolean
  photoCount: number
  views: number
}

const MOCK: Model[] = [
  { id: '1', name: 'Valentina Silva', city: 'São Paulo', state: 'SP', plan: 'ELITE', status: 'ACTIVE', score: 4.9, joinedAt: '10/01/2026', isVerified: true, photoCount: 22, views: 4820 },
  { id: '2', name: 'Isabelle Costa', city: 'Rio de Janeiro', state: 'RJ', plan: 'GOLD', status: 'ACTIVE', score: 4.7, joinedAt: '15/01/2026', isVerified: true, photoCount: 18, views: 3210 },
  { id: '3', name: 'Larissa Mendes', city: 'Curitiba', state: 'PR', plan: 'SILVER', status: 'ACTIVE', score: 4.5, joinedAt: '20/01/2026', isVerified: false, photoCount: 10, views: 1980 },
  { id: '4', name: 'Júlia Ferreira', city: 'Belo Horizonte', state: 'MG', plan: 'GOLD', status: 'PENDING', score: 0, joinedAt: '24/04/2026', isVerified: false, photoCount: 8, views: 0 },
  { id: '5', name: 'Melissa Santos', city: 'Salvador', state: 'BA', plan: 'FREE', status: 'SUSPENDED', score: 3.2, joinedAt: '05/02/2026', isVerified: false, photoCount: 5, views: 540 },
  { id: '6', name: 'Bruna Lima', city: 'Fortaleza', state: 'CE', plan: 'ELITE', status: 'ACTIVE', score: 4.8, joinedAt: '12/02/2026', isVerified: true, photoCount: 28, views: 6100 },
  { id: '7', name: 'Amanda Rocha', city: 'Porto Alegre', state: 'RS', plan: 'SILVER', status: 'ACTIVE', score: 4.3, joinedAt: '01/03/2026', isVerified: true, photoCount: 12, views: 2300 },
  { id: '8', name: 'Fernanda Dias', city: 'Brasília', state: 'DF', plan: 'FREE', status: 'BANNED', score: 1.0, joinedAt: '15/02/2026', isVerified: false, photoCount: 3, views: 200 },
]

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  ACTIVE: { label: 'Ativa', className: 'badge-green' },
  PENDING: { label: 'Pendente', className: 'bg-[rgba(232,184,75,0.1)] text-[#E8B84B] border-[rgba(232,184,75,0.2)]' },
  SUSPENDED: { label: 'Suspensa', className: 'bg-[rgba(255,165,0,0.1)] text-orange-400 border-orange-500/20' },
  BANNED: { label: 'Banida', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

const PLAN_COLOR: Record<string, string> = {
  FREE: 'text-[#7A5665]',
  SILVER: 'text-[#BFA0AB]',
  GOLD: 'text-[#E8B84B]',
  ELITE: 'text-[#E91E8C]',
}

export default function ModelosPage() {
  const [models, setModels] = useState<Model[]>(MOCK)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | Status>('all')
  const [filterPlan, setFilterPlan] = useState<'all' | string>('all')
  const [actionMenu, setActionMenu] = useState<string | null>(null)

  const filtered = models.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.city.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || m.status === filterStatus
    const matchPlan = filterPlan === 'all' || m.plan === filterPlan
    return matchSearch && matchStatus && matchPlan
  })

  const updateStatus = (id: string, status: Status) => {
    setModels((prev) => prev.map((m) => m.id === id ? { ...m, status } : m))
    setActionMenu(null)
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-white mb-1">
          Gestão de <span className="italic text-[#E91E8C]">Modelos</span>
        </h1>
        <p className="text-sm text-[#7A5665]">{models.length} modelos cadastradas</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-52">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5665]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou cidade..."
            className="input-field pl-9 py-2 text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          className="input-field py-2 text-sm w-auto pr-8"
        >
          <option value="all">Todos os status</option>
          <option value="ACTIVE">Ativas</option>
          <option value="PENDING">Pendentes</option>
          <option value="SUSPENDED">Suspensas</option>
          <option value="BANNED">Banidas</option>
        </select>
        <select
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value)}
          className="input-field py-2 text-sm w-auto pr-8"
        >
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
                {['Modelo', 'Localização', 'Plano', 'Status', 'Avaliação', 'Fotos', 'Visualizações', 'Cadastro', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#7A5665] uppercase tracking-wider">
                    {h}
                  </th>
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
                          {model.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-[#F8F0F4]">{model.name}</span>
                            {model.isVerified && <CheckCircle size={12} className="text-green-400" />}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-[#BFA0AB]">
                        <MapPin size={11} />
                        {model.city}, {model.state}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('font-semibold', PLAN_COLOR[model.plan])}>{model.plan}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${S.className}`}>{S.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      {model.score > 0 ? (
                        <span className="flex items-center gap-1 text-[#E8B84B]">
                          <Star size={11} className="fill-current" />
                          {model.score}
                        </span>
                      ) : (
                        <span className="text-[#7A5665]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#BFA0AB]">{model.photoCount}</td>
                    <td className="px-4 py-3 text-[#BFA0AB]">{model.views.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 text-[#7A5665]">{model.joinedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 relative">
                        <Link
                          href={`/acompanhante/${model.id}/${model.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="p-1.5 rounded text-[#7A5665] hover:text-white hover:bg-[#201519] transition-all"
                        >
                          <Eye size={14} />
                        </Link>
                        <div className="relative">
                          <button
                            onClick={() => setActionMenu(actionMenu === model.id ? null : model.id)}
                            className="flex items-center gap-1 px-2 py-1.5 rounded text-[#BFA0AB] hover:text-white hover:bg-[#201519] text-xs font-semibold transition-all"
                          >
                            Ações <ChevronDown size={11} />
                          </button>
                          {actionMenu === model.id && (
                            <div className="absolute right-0 top-full mt-1 z-20 w-40 card border border-[rgba(255,255,255,0.1)] shadow-xl">
                              <button
                                onClick={() => updateStatus(model.id, 'ACTIVE')}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-green-400 hover:bg-[#201519] transition-colors text-left"
                              >
                                <CheckCircle size={12} /> Ativar
                              </button>
                              <button
                                onClick={() => updateStatus(model.id, 'SUSPENDED')}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-orange-400 hover:bg-[#201519] transition-colors text-left"
                              >
                                <ShieldOff size={12} /> Suspender
                              </button>
                              <button
                                onClick={() => updateStatus(model.id, 'BANNED')}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-[#201519] transition-colors text-left"
                              >
                                <Ban size={12} /> Banir
                              </button>
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
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#7A5665] text-sm">Nenhuma modelo encontrada</div>
        )}
      </div>
    </div>
  )
}
