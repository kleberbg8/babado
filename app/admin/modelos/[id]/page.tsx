'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, CheckCircle, ShieldOff, Ban, Edit2, Save, X, Clock,
  User, Heart, DollarSign, Shield, Upload, Image as ImageIcon, Star, Trash2,
  RefreshCw, Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Status = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED'
type Plan = 'FREE' | 'SILVER' | 'GOLD' | 'ELITE'
type MediaStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

interface Media {
  id: string
  url: string
  type: 'PHOTO' | 'VIDEO' | 'STORY'
  isFace: boolean
  isPremium: boolean
  isMain: boolean
  status: MediaStatus
  rejectReason: string | null
  createdAt: string
}

interface Availability {
  id: string
  weekday: number
  startTime: string
  endTime: string
  isAvailable: boolean
}

interface ModelDetail {
  id: string
  stageName: string
  realName: string | null
  email: string | null
  whatsapp: string | null
  city: string
  state: string
  neighborhood: string | null
  bio: string | null
  age: number | null
  height: number | null
  weight: number | null
  ethnicity: string | null
  hairStyle: string | null
  hairSize: string | null
  eyeColor: string | null
  hasSilicone: boolean | null
  hasTattoo: boolean | null
  smokes: boolean | null
  languages: string[]
  serviceType: string
  priceMin: number | null
  priceTable: Record<string, number> | null
  status: Status
  plan: Plan
  verifiedAt: string | null
  score: number
  viewCount: number
  favoriteCount: number
  isOnline: boolean
  createdAt: string
  medias: Media[]
  availability: Availability[]
  services: { service: { name: string; category: string }; mode: string; isSpecialty: boolean }[]
  reviews: { id: string; rating: number; comment: string | null; createdAt: string }[]
}

const STATUS_CFG: Record<Status, { label: string; cls: string }> = {
  ACTIVE: { label: 'Ativa', cls: 'bg-green-500/10 text-green-400 border border-green-500/20' },
  PENDING: { label: 'Pendente', cls: 'badge-gold border' },
  SUSPENDED: { label: 'Suspensa', cls: 'bg-orange-500/10 text-orange-400 border border-orange-500/20' },
  BANNED: { label: 'Banida', cls: 'bg-red-500/10 text-red-400 border border-red-500/20' },
}

const PLAN_COLOR: Record<Plan, string> = {
  FREE: 'text-[#7A5665]', SILVER: 'text-[#BFA0AB]', GOLD: 'text-[#E8B84B]', ELITE: 'text-[#E91E8C]',
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

type Tab = 'perfil' | 'midias' | 'agenda' | 'avaliacoes'

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] text-[#7A5665] uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-[#F8F0F4] font-medium">{value ?? <span className="text-[#7A5665]">—</span>}</p>
    </div>
  )
}

export default function ModelDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [model, setModel] = useState<ModelDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('perfil')

  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<ModelDetail>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [statusLoading, setStatusLoading] = useState(false)
  const [mediaFilter, setMediaFilter] = useState<'all' | MediaStatus>('all')
  const [mediaLoading, setMediaLoading] = useState<string | null>(null)
  const [deletingMedia, setDeletingMedia] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const fetchModel = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/admin/models/${id}`)
      const json = await res.json()
      if (json.success) {
        setModel(json.data)
        setEditData(json.data)
      } else {
        setError(json.error)
      }
    } catch {
      setError('Erro ao carregar modelo')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchModel() }, [fetchModel])

  const handleStatusChange = async (status: Status) => {
    setStatusLoading(true)
    try {
      const res = await fetch(`/api/admin/models/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const json = await res.json()
      if (json.success) {
        setModel((m) => m ? { ...m, status, verifiedAt: status === 'ACTIVE' ? new Date().toISOString() : m.verifiedAt } : m)
      }
    } finally {
      setStatusLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch(`/api/admin/models/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      })
      const json = await res.json()
      if (json.success) {
        setModel((m) => m ? { ...m, ...json.data } : m)
        setEditing(false)
      } else {
        setSaveError(json.error)
      }
    } catch {
      setSaveError('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const handleMediaStatus = async (mediaId: string, status: MediaStatus) => {
    setMediaLoading(mediaId)
    try {
      const res = await fetch(`/api/admin/models/${id}/media/${mediaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const json = await res.json()
      if (json.success) {
        setModel((m) => m ? { ...m, medias: m.medias.map((med) => med.id === mediaId ? { ...med, status } : med) } : m)
      }
    } finally {
      setMediaLoading(null)
    }
  }

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm('Excluir esta mídia permanentemente?')) return
    setDeletingMedia(mediaId)
    try {
      await fetch(`/api/admin/models/${id}/media/${mediaId}`, { method: 'DELETE' })
      setModel((m) => m ? { ...m, medias: m.medias.filter((med) => med.id !== mediaId) } : m)
    } finally {
      setDeletingMedia(null)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const isVideo = file.type.startsWith('video/')
        const objectUrl = URL.createObjectURL(file)
        const res = await fetch(`/api/admin/models/${id}/media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: objectUrl, type: isVideo ? 'VIDEO' : 'PHOTO' }),
        })
        const json = await res.json()
        if (json.success) {
          setModel((m) => m ? { ...m, medias: [json.data, ...m.medias] } : m)
        }
      }
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 skeleton rounded-lg" />
          <div className="flex-1">
            <div className="h-6 skeleton rounded w-48 mb-2" />
            <div className="h-4 skeleton rounded w-32" />
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="card h-40 skeleton" />)}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => <div key={i} className="card h-32 skeleton" />)}
          </div>
        </div>
      </div>
    )
  }

  if (error || !model) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-400 mb-4">{error ?? 'Modelo não encontrada.'}</p>
        <button onClick={() => router.back()} className="text-[#E91E8C] text-sm hover:underline">Voltar</button>
      </div>
    )
  }

  const S = STATUS_CFG[model.status]
  const filteredMedia = model.medias.filter((m) => mediaFilter === 'all' || m.status === mediaFilter)
  const pendingMediaCount = model.medias.filter((m) => m.status === 'PENDING').length

  const ed = (field: keyof ModelDetail) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditData((p) => ({ ...p, [field]: e.target.value }))
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        <button onClick={() => router.back()} className="p-2 mt-0.5 rounded-lg text-[#7A5665] hover:text-white hover:bg-[#201519] transition-all shrink-0">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="font-display text-xl md:text-2xl font-bold text-white">{model.stageName}</h1>
            <span className={cn('badge', S.cls)}>{S.label}</span>
            {model.verifiedAt && <span className="badge badge-green"><CheckCircle size={9} /> Verificada</span>}
          </div>
          <p className="text-xs text-[#7A5665]">
            {model.city}, {model.state}
            {model.createdAt && <> · Cadastro: {new Date(model.createdAt).toLocaleDateString('pt-BR')}</>}
            {model.viewCount > 0 && <> · {model.viewCount.toLocaleString('pt-BR')} views</>}
          </p>
        </div>
        <button onClick={fetchModel} disabled={loading} className="p-2 rounded-lg text-[#7A5665] hover:text-white hover:bg-[#201519] transition-all shrink-0">
          <RefreshCw size={16} className={cn(loading && 'animate-spin')} />
        </button>
      </div>

      {/* Status actions */}
      <div className="flex flex-wrap gap-2 mb-5">
        {model.status === 'PENDING' && (
          <button
            onClick={() => handleStatusChange('ACTIVE')}
            disabled={statusLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 text-sm font-semibold transition-all disabled:opacity-50"
          >
            <CheckCircle size={14} /> Aprovar e Ativar
          </button>
        )}
        {model.status !== 'ACTIVE' && model.status !== 'PENDING' && (
          <button onClick={() => handleStatusChange('ACTIVE')} disabled={statusLoading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 text-sm font-semibold transition-all disabled:opacity-50">
            <CheckCircle size={14} /> Reativar
          </button>
        )}
        {model.status !== 'SUSPENDED' && (
          <button onClick={() => handleStatusChange('SUSPENDED')} disabled={statusLoading} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 text-xs font-semibold transition-all disabled:opacity-50">
            <ShieldOff size={12} /> Suspender
          </button>
        )}
        {model.status !== 'BANNED' && (
          <button onClick={() => handleStatusChange('BANNED')} disabled={statusLoading} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs font-semibold transition-all disabled:opacity-50">
            <Ban size={12} /> Banir
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 mb-5 border-b border-[rgba(255,255,255,0.06)] overflow-x-auto scrollbar-hide">
        {([
          { key: 'perfil', label: 'Perfil', icon: User },
          { key: 'midias', label: `Mídias${pendingMediaCount > 0 ? ` (${pendingMediaCount})` : model.medias.length > 0 ? ` (${model.medias.length})` : ''}`, icon: ImageIcon },
          { key: 'agenda', label: 'Agenda', icon: Clock },
          { key: 'avaliacoes', label: `Avaliações${model.reviews.length > 0 ? ` (${model.reviews.length})` : ''}`, icon: Star },
        ] as { key: Tab; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px whitespace-nowrap',
              activeTab === key ? 'text-[#E91E8C] border-[#E91E8C]' : 'text-[#7A5665] border-transparent hover:text-[#BFA0AB]'
            )}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ── PERFIL ── */}
      {activeTab === 'perfil' && (
        <div>
          {!editing ? (
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <div className="card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-[#E91E8C] flex items-center gap-2"><User size={14} /> Dados Pessoais</h2>
                    <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#BFA0AB] hover:text-white hover:bg-[#2A1C22] transition-all">
                      <Edit2 size={12} /> Editar
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Field label="Nome artístico" value={model.stageName} />
                    <Field label="Nome real" value={model.realName} />
                    <Field label="Email" value={model.email} />
                    <Field label="WhatsApp" value={model.whatsapp} />
                    <Field label="Cidade" value={`${model.city}, ${model.state}`} />
                    <Field label="Bairro" value={model.neighborhood} />
                    <Field label="Tipo de serviço" value={model.serviceType} />
                    <Field label="Idiomas" value={model.languages?.join(', ')} />
                  </div>
                  {model.bio && (
                    <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                      <p className="text-[10px] text-[#7A5665] uppercase tracking-wider mb-1">Apresentação</p>
                      <p className="text-sm text-[#BFA0AB] leading-relaxed">{model.bio}</p>
                    </div>
                  )}
                </div>

                <div className="card p-5">
                  <h2 className="text-sm font-semibold text-[#E91E8C] flex items-center gap-2 mb-4"><Heart size={14} /> Características Físicas</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Field label="Idade" value={model.age ? `${model.age} anos` : null} />
                    <Field label="Altura" value={model.height ? `${model.height}m` : null} />
                    <Field label="Peso" value={model.weight ? `${model.weight}kg` : null} />
                    <Field label="Etnia" value={model.ethnicity} />
                    <Field label="Cabelo" value={[model.hairStyle, model.hairSize].filter(Boolean).join(' / ') || null} />
                    <Field label="Olhos" value={model.eyeColor} />
                    <Field label="Silicone" value={model.hasSilicone === null ? null : model.hasSilicone ? 'Sim' : 'Não'} />
                    <Field label="Tatuagem" value={model.hasTattoo === null ? null : model.hasTattoo ? 'Sim' : 'Não'} />
                  </div>
                </div>

                {model.services.length > 0 && (
                  <div className="card p-5">
                    <h2 className="text-sm font-semibold text-[#E91E8C] mb-3">Serviços Oferecidos</h2>
                    <div className="flex flex-wrap gap-2">
                      {model.services.map((s, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-[rgba(233,30,140,0.1)] text-[#E91E8C] text-xs border border-[rgba(233,30,140,0.2)]">
                          {s.service.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="card p-5">
                  <h2 className="text-sm font-semibold text-[#E91E8C] flex items-center gap-2 mb-4"><Shield size={14} /> Plano & Stats</h2>
                  <div className="space-y-3">
                    <Field label="Plano" value={<span className={cn('font-bold', PLAN_COLOR[model.plan])}>{model.plan}</span>} />
                    <Field label="Avaliação" value={model.score > 0 ? <span className="flex items-center gap-1 text-[#E8B84B]"><Star size={12} className="fill-current" />{model.score.toFixed(1)}</span> : null} />
                    <Field label="Visualizações" value={model.viewCount.toLocaleString('pt-BR')} />
                    <Field label="Favoritos" value={model.favoriteCount.toLocaleString('pt-BR')} />
                    <Field label="Verificada" value={model.verifiedAt ? <span className="text-green-400">Sim</span> : <span className="text-[#7A5665]">Não</span>} />
                  </div>
                </div>

                <div className="card p-5">
                  <h2 className="text-sm font-semibold text-[#E91E8C] flex items-center gap-2 mb-4"><DollarSign size={14} /> Preços</h2>
                  {model.priceMin && <p className="text-sm text-[#BFA0AB] mb-2">A partir de <strong className="text-[#F8F0F4]">R$ {model.priceMin}</strong></p>}
                  {model.priceTable && Object.keys(model.priceTable).length > 0
                    ? <div className="space-y-1.5">
                      {Object.entries(model.priceTable).map(([k, v]) => (
                        <div key={k} className="flex justify-between text-sm">
                          <span className="text-[#7A5665] capitalize">{k}</span>
                          <span className="text-[#F8F0F4] font-semibold">R$ {v}</span>
                        </div>
                      ))}
                    </div>
                    : <p className="text-xs text-[#7A5665]">Sem tabela de preços</p>}
                </div>
              </div>
            </div>
          ) : (
            /* EDIT MODE */
            <div className="space-y-4">
              {saveError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">{saveError}</div>
              )}

              <div className="card p-5">
                <h2 className="text-sm font-semibold text-[#E91E8C] flex items-center gap-2 mb-4"><Edit2 size={14} /> Dados Básicos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { label: 'Nome artístico *', field: 'stageName' as const },
                    { label: 'Nome real', field: 'realName' as const },
                    { label: 'Email', field: 'email' as const },
                    { label: 'WhatsApp', field: 'whatsapp' as const },
                    { label: 'Cidade *', field: 'city' as const },
                    { label: 'Bairro', field: 'neighborhood' as const },
                  ].map(({ label, field }) => (
                    <div key={field}>
                      <label className="block text-xs text-[#7A5665] mb-1">{label}</label>
                      <input value={(editData[field] as string) ?? ''} onChange={ed(field)} className="input-field w-full py-2 text-sm" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs text-[#7A5665] mb-1">Estado *</label>
                    <input value={(editData.state as string) ?? ''} onChange={(e) => setEditData((p) => ({ ...p, state: e.target.value.toUpperCase() }))} maxLength={2} className="input-field w-full py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#7A5665] mb-1">Plano</label>
                    <select value={(editData.plan as string) ?? 'FREE'} onChange={ed('plan')} className="input-field w-full py-2 text-sm">
                      <option value="FREE">Free</option>
                      <option value="SILVER">Silver</option>
                      <option value="GOLD">Gold</option>
                      <option value="ELITE">Elite</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#7A5665] mb-1">Tipo de serviço</label>
                    <select value={(editData.serviceType as string) ?? 'LOCAL'} onChange={ed('serviceType')} className="input-field w-full py-2 text-sm">
                      <option value="LOCAL">Local</option>
                      <option value="OUTCALL">Outcall</option>
                      <option value="BOTH">Ambos</option>
                      <option value="TRAVEL">Viagens</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs text-[#7A5665] mb-1">Apresentação / Bio</label>
                  <textarea value={(editData.bio as string) ?? ''} onChange={ed('bio')} rows={4} className="input-field w-full py-2 text-sm resize-none" />
                </div>
              </div>

              <div className="card p-5">
                <h2 className="text-sm font-semibold text-[#E91E8C] flex items-center gap-2 mb-4"><Heart size={14} /> Características Físicas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Idade', field: 'age' as const, type: 'number' },
                    { label: 'Altura (m)', field: 'height' as const, type: 'number', step: '0.01' },
                    { label: 'Peso (kg)', field: 'weight' as const, type: 'number' },
                    { label: 'Preço mínimo (R$)', field: 'priceMin' as const, type: 'number' },
                  ].map(({ label, field, type, step }) => (
                    <div key={field}>
                      <label className="block text-xs text-[#7A5665] mb-1">{label}</label>
                      <input type={type} step={step} value={(editData[field] as number) ?? ''} onChange={(e) => setEditData((p) => ({ ...p, [field]: e.target.value ? Number(e.target.value) : null }))} className="input-field w-full py-2 text-sm" />
                    </div>
                  ))}
                  {[
                    { label: 'Etnia', field: 'ethnicity' as const },
                    { label: 'Estilo do cabelo', field: 'hairStyle' as const },
                    { label: 'Tamanho do cabelo', field: 'hairSize' as const },
                    { label: 'Cor dos olhos', field: 'eyeColor' as const },
                  ].map(({ label, field }) => (
                    <div key={field}>
                      <label className="block text-xs text-[#7A5665] mb-1">{label}</label>
                      <input value={(editData[field] as string) ?? ''} onChange={ed(field)} className="input-field w-full py-2 text-sm" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-5 mt-4">
                  {([
                    { label: 'Silicone', field: 'hasSilicone' as const },
                    { label: 'Tatuagem', field: 'hasTattoo' as const },
                    { label: 'Fuma', field: 'smokes' as const },
                  ] as { label: string; field: 'hasSilicone' | 'hasTattoo' | 'smokes' }[]).map(({ label, field }) => (
                    <label key={field} className="flex items-center gap-2 text-sm text-[#BFA0AB] cursor-pointer">
                      <input type="checkbox" checked={Boolean(editData[field])} onChange={(e) => setEditData((p) => ({ ...p, [field]: e.target.checked }))} className="accent-[#E91E8C]" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm py-2.5 px-6 disabled:opacity-50">
                  <Save size={14} />{saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <button onClick={() => { setEditing(false); setEditData(model); setSaveError(null) }} className="px-4 py-2.5 rounded-lg text-[#7A5665] hover:text-white hover:bg-[#201519] text-sm transition-all flex items-center gap-2">
                  <X size={14} /> Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── MÍDIAS ── */}
      {activeTab === 'midias' && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex gap-2">
              {(['all', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setMediaFilter(f)}
                  className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all', mediaFilter === f ? 'bg-[#E91E8C] text-white' : 'bg-[#201519] text-[#7A5665] hover:text-white')}
                >
                  {f === 'all' ? 'Todas' : f === 'PENDING' ? 'Pendentes' : f === 'APPROVED' ? 'Aprovadas' : 'Rejeitadas'}
                </button>
              ))}
            </div>
            <div>
              <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileUpload} />
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="btn-primary flex items-center gap-2 text-xs py-2 px-3 disabled:opacity-50">
                <Upload size={12} />{uploading ? 'Enviando...' : 'Upload'}
              </button>
            </div>
          </div>

          {filteredMedia.length === 0 ? (
            <div className="text-center py-16 card">
              <ImageIcon size={40} className="mx-auto mb-3 text-[#7A5665] opacity-40" />
              <p className="text-sm text-[#7A5665]">
                {model.medias.length === 0 ? 'Nenhuma mídia enviada ainda' : 'Nenhuma mídia neste filtro'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredMedia.map((media) => (
                <div key={media.id} className={cn('relative group rounded-xl overflow-hidden aspect-[3/4] bg-[#201519]', deletingMedia === media.id && 'opacity-50')}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={media.url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />

                  {/* Type & flags */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {media.type === 'VIDEO' && <span className="px-1.5 py-0.5 rounded text-[9px] bg-purple-600 text-white font-bold">VID</span>}
                    {media.isMain && <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#E91E8C] text-white font-bold">Principal</span>}
                    {media.isFace && <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-500 text-white font-bold">Rosto</span>}
                    {media.isPremium && <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#E8B84B] text-black font-bold">Premium</span>}
                  </div>

                  {/* Status badge */}
                  <div className={cn(
                    'absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold',
                    { 'bg-yellow-500 text-black': media.status === 'PENDING', 'bg-green-500 text-white': media.status === 'APPROVED', 'bg-red-500 text-white': media.status === 'REJECTED' }
                  )}>
                    {media.status === 'PENDING' ? 'Pend.' : media.status === 'APPROVED' ? 'Aprov.' : 'Rejeit.'}
                  </div>

                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 gap-1">
                    <div className="flex gap-1">
                      {media.status !== 'APPROVED' && (
                        <button
                          onClick={() => handleMediaStatus(media.id, 'APPROVED')}
                          disabled={mediaLoading === media.id}
                          className="flex-1 py-1.5 rounded bg-green-500 text-white text-[10px] font-bold hover:bg-green-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-0.5"
                        >
                          <CheckCircle size={10} /> Aprovar
                        </button>
                      )}
                      {media.status !== 'REJECTED' && (
                        <button
                          onClick={() => handleMediaStatus(media.id, 'REJECTED')}
                          disabled={mediaLoading === media.id}
                          className="flex-1 py-1.5 rounded bg-red-500 text-white text-[10px] font-bold hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-0.5"
                        >
                          <X size={10} /> Rejeitar
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteMedia(media.id)}
                      disabled={deletingMedia === media.id}
                      className="w-full py-1 rounded bg-black/50 text-white text-[9px] font-semibold hover:bg-red-600/80 transition-colors flex items-center justify-center gap-0.5"
                    >
                      <Trash2 size={9} /> Excluir
                    </button>
                  </div>
                </div>
              ))}

              {/* Upload button */}
              <button onClick={() => fileInputRef.current?.click()} className="aspect-[3/4] rounded-xl border-2 border-dashed border-[rgba(233,30,140,0.25)] flex flex-col items-center justify-center gap-2 text-[#7A5665] hover:text-[#E91E8C] hover:border-[#E91E8C] transition-all">
                <Plus size={20} />
                <span className="text-xs font-medium">Adicionar</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── AGENDA ── */}
      {activeTab === 'agenda' && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-[#E91E8C] flex items-center gap-2 mb-4"><Clock size={14} /> Disponibilidade Semanal</h2>
          {model.availability.length === 0 ? (
            <p className="text-sm text-[#7A5665]">Nenhuma disponibilidade cadastrada.</p>
          ) : (
            <div className="space-y-2">
              {model.availability.map((a) => (
                <div key={a.id} className="flex items-center gap-4 py-2.5 border-b border-[rgba(255,255,255,0.04)] last:border-0">
                  <span className="text-sm font-medium text-[#F8F0F4] w-20 shrink-0">{WEEKDAYS[a.weekday]}</span>
                  <span className="text-sm text-[#BFA0AB] flex-1">{a.startTime} — {a.endTime}</span>
                  <span className={cn('badge', a.isAvailable ? 'badge-green' : 'bg-red-500/10 text-red-400 border border-red-500/20')}>
                    {a.isAvailable ? 'Disponível' : 'Indisponível'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── AVALIAÇÕES ── */}
      {activeTab === 'avaliacoes' && (
        <div className="space-y-3">
          {model.reviews.length === 0 ? (
            <div className="card p-8 text-center">
              <Star size={32} className="mx-auto mb-3 text-[#7A5665] opacity-30" />
              <p className="text-sm text-[#7A5665]">Nenhuma avaliação aprovada ainda.</p>
            </div>
          ) : (
            model.reviews.map((review) => (
              <div key={review.id} className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className={cn(i < review.rating ? 'text-[#E8B84B] fill-current' : 'text-[#7A5665]')} />
                    ))}
                  </div>
                  <span className="text-xs text-[#7A5665]">{new Date(review.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
                {review.comment && <p className="text-sm text-[#BFA0AB] leading-relaxed">{review.comment}</p>}
              </div>
            ))
          )}
        </div>
      )}

    </div>
  )
}
