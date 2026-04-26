'use client'

import { useState, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft, CheckCircle, ShieldOff, Ban, Edit2, Save, X,
  Clock, User, Heart, DollarSign, Shield, Upload, Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useModelsStore, type Status } from '@/lib/models-store'

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  ACTIVE: { label: 'Ativa', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
  PENDING: { label: 'Pendente', className: 'bg-[rgba(232,184,75,0.1)] text-[#E8B84B] border-[rgba(232,184,75,0.2)]' },
  SUSPENDED: { label: 'Suspensa', className: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  BANNED: { label: 'Banida', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

const ALL_SERVICES = [
  'Massagem', 'Jantar', 'Viagens', 'Festas', 'Girlfriend Experience',
  'Eventos', 'Praia', 'Teatro', 'Degustação', 'Passeios', 'Pernoite',
  'Natação', 'Yoga', 'Spa', 'Dominação', 'Submissão',
]

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-[#7A5665] mb-0.5">{label}</p>
      <p className="text-sm text-[#F8F0F4] font-medium">{value ?? '—'}</p>
    </div>
  )
}

export default function ModelDetailPage() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { models, updateStatus, updateModel, updatePhoto, addPhoto } = useModelsStore()
  const model = models.find((m) => m.id === id)

  const initialTab = (searchParams.get('tab') as 'perfil' | 'fotos' | 'agenda' | 'editar') || 'perfil'
  const [activeTab, setActiveTab] = useState<'perfil' | 'fotos' | 'agenda' | 'editar'>(initialTab)
  const [photoFilter, setPhotoFilter] = useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED'>('all')
  const [saving, setSaving] = useState(false)
  const [newService, setNewService] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [editData, setEditData] = useState(model ? { ...model } : null)

  if (!model || !editData) {
    return (
      <div className="p-8 text-center">
        <p className="text-[#7A5665]">Modelo não encontrada.</p>
        <button onClick={() => router.back()} className="mt-4 text-[#E91E8C] text-sm hover:underline">Voltar</button>
      </div>
    )
  }

  const S = STATUS_CONFIG[model.status]
  const filteredPhotos = model.photos.filter((p) => photoFilter === 'all' || p.status === photoFilter)

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    updateModel(id, editData)
    setSaving(false)
    setActiveTab('perfil')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      const isVideo = file.type.startsWith('video/')
      addPhoto(id, {
        id: String(Date.now() + Math.random()),
        url,
        status: 'PENDING',
        isMain: model.photos.length === 0,
        isFace: false,
        isPremium: false,
        type: isVideo ? 'VIDEO' : 'PHOTO',
      })
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const toggleService = (service: string) => {
    if (!editData) return
    const has = editData.services.includes(service)
    setEditData({ ...editData, services: has ? editData.services.filter((s) => s !== service) : [...editData.services, service] })
  }

  const addCustomService = () => {
    if (!editData) return
    const s = newService.trim()
    if (!s || editData.services.includes(s)) return
    setEditData({ ...editData, services: [...editData.services, s] })
    setNewService('')
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-lg text-[#7A5665] hover:text-white hover:bg-[#201519] transition-all">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-white">{model.stageName}</h1>
          <p className="text-sm text-[#7A5665]">{model.city}, {model.state} · Cadastrado em {model.joinedAt}</p>
        </div>
        <span className={cn('badge border', S.className)}>{S.label}</span>
      </div>

      {/* Aprovação pendente */}
      {model.status === 'PENDING' && (
        <div className="mb-6 p-4 rounded-xl bg-[rgba(232,184,75,0.08)] border border-[rgba(232,184,75,0.2)]">
          <p className="text-sm text-[#E8B84B] font-semibold mb-3">⏳ Cadastro pendente de aprovação</p>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => updateStatus(id, 'ACTIVE')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 text-sm font-semibold transition-all">
              <CheckCircle size={14} /> Aprovar e Ativar
            </button>
            <button onClick={() => updateStatus(id, 'SUSPENDED')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-sm font-semibold transition-all">
              <X size={14} /> Rejeitar Cadastro
            </button>
          </div>
        </div>
      )}

      {model.status === 'ACTIVE' && (
        <div className="mb-4 flex gap-2">
          <button onClick={() => updateStatus(id, 'SUSPENDED')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold transition-all hover:bg-orange-500/20">
            <ShieldOff size={12} /> Suspender
          </button>
          <button onClick={() => updateStatus(id, 'BANNED')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold transition-all hover:bg-red-500/20">
            <Ban size={12} /> Banir
          </button>
        </div>
      )}

      {(model.status === 'SUSPENDED' || model.status === 'BANNED') && (
        <div className="mb-4">
          <button onClick={() => updateStatus(id, 'ACTIVE')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-semibold transition-all hover:bg-green-500/20">
            <CheckCircle size={14} /> Reativar Modelo
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[rgba(255,255,255,0.06)]">
        {(['perfil', 'fotos', 'agenda', 'editar'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 text-sm font-semibold transition-all border-b-2 -mb-px',
              activeTab === tab ? 'text-[#E91E8C] border-[#E91E8C]' : 'text-[#7A5665] border-transparent hover:text-white'
            )}
          >
            {tab === 'fotos' ? `Fotos/Vídeos (${model.photos.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ── PERFIL ── */}
      {activeTab === 'perfil' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-[#E91E8C] flex items-center gap-2 mb-4"><User size={14} /> Dados Pessoais</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Field label="Nome artístico" value={model.stageName} />
                <Field label="Email" value={model.email} />
                <Field label="WhatsApp" value={model.whatsapp} />
                <Field label="Cidade" value={`${model.city}, ${model.state}`} />
                <Field label="Bairro" value={model.neighborhood} />
                <Field label="Idiomas" value={model.languages.join(', ')} />
              </div>
            </div>
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-[#E91E8C] flex items-center gap-2 mb-4"><Heart size={14} /> Características Físicas</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Field label="Idade" value={model.age ? `${model.age} anos` : '—'} />
                <Field label="Altura" value={model.height ? `${model.height}m` : '—'} />
                <Field label="Peso" value={model.weight ? `${model.weight}kg` : '—'} />
                <Field label="Etnia" value={model.ethnicity} />
                <Field label="Cabelo" value={model.hairStyle && model.hairSize ? `${model.hairStyle} / ${model.hairSize}` : '—'} />
                <Field label="Olhos" value={model.eyeColor} />
                <Field label="Silicone" value={model.hasSilicone ? 'Sim' : 'Não'} />
                <Field label="Tatuagem" value={model.hasTattoo ? 'Sim' : 'Não'} />
              </div>
            </div>
            {model.bio && (
              <div className="card p-5">
                <h2 className="text-sm font-semibold text-[#E91E8C] mb-3">Apresentação</h2>
                <p className="text-sm text-[#BFA0AB] leading-relaxed">{model.bio}</p>
              </div>
            )}
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-[#E91E8C] mb-3">Serviços Oferecidos</h2>
              {model.services.length > 0
                ? <div className="flex flex-wrap gap-2">{model.services.map((s) => <span key={s} className="px-3 py-1 rounded-full bg-[rgba(233,30,140,0.1)] text-[#E91E8C] text-xs border border-[rgba(233,30,140,0.2)]">{s}</span>)}</div>
                : <p className="text-sm text-[#7A5665]">Nenhum serviço cadastrado</p>}
            </div>
          </div>
          <div className="space-y-4">
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-[#E91E8C] flex items-center gap-2 mb-4"><DollarSign size={14} /> Preços</h2>
              {Object.keys(model.priceTable).length > 0
                ? <div className="space-y-2">{Object.entries(model.priceTable).map(([k, v]) => <div key={k} className="flex justify-between text-sm"><span className="text-[#7A5665] capitalize">{k}</span><span className="text-[#F8F0F4] font-semibold">R$ {v}</span></div>)}</div>
                : <p className="text-sm text-[#7A5665]">Sem tabela de preços</p>}
            </div>
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-[#E91E8C] flex items-center gap-2 mb-4"><Shield size={14} /> Plano & Stats</h2>
              <div className="space-y-3">
                <Field label="Plano atual" value={model.plan} />
                <Field label="Avaliação" value={model.score > 0 ? `⭐ ${model.score}` : 'Sem avaliações'} />
                <Field label="Visualizações" value={model.views.toLocaleString('pt-BR')} />
                <Field label="Verificada" value={model.isVerified ? '✅ Sim' : '❌ Não'} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FOTOS ── */}
      {activeTab === 'fotos' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {(['all', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
                <button key={f} onClick={() => setPhotoFilter(f)} className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all', photoFilter === f ? 'bg-[#E91E8C] text-white' : 'bg-[#201519] text-[#7A5665] hover:text-white')}>
                  {f === 'all' ? 'Todas' : f === 'PENDING' ? 'Pendentes' : f === 'APPROVED' ? 'Aprovadas' : 'Rejeitadas'}
                </button>
              ))}
            </div>
            <div>
              <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileUpload} />
              <button onClick={() => fileInputRef.current?.click()} className="btn-primary flex items-center gap-2 text-xs py-2 px-3">
                <Upload size={13} /> Upload Admin
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-[3/4] bg-[#201519]">
                <img src={photo.url} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {photo.type === 'VIDEO' && <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500 text-white font-bold">Vídeo</span>}
                  {photo.isMain && <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#E91E8C] text-white font-bold">Principal</span>}
                  {photo.isFace && <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500 text-white font-bold">Rosto</span>}
                  {photo.isPremium && <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#E8B84B] text-black font-bold">Premium</span>}
                </div>
                <div className={cn('absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold', { 'bg-yellow-500 text-black': photo.status === 'PENDING', 'bg-green-500 text-white': photo.status === 'APPROVED', 'bg-red-500 text-white': photo.status === 'REJECTED' })}>
                  {photo.status === 'PENDING' ? 'Pendente' : photo.status === 'APPROVED' ? 'Aprovada' : 'Rejeitada'}
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 gap-2">
                  {photo.status !== 'APPROVED' && (
                    <button onClick={() => updatePhoto(id, photo.id, 'APPROVED')} className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-colors">
                      <CheckCircle size={12} className="inline mr-1" />Aprovar
                    </button>
                  )}
                  {photo.status !== 'REJECTED' && (
                    <button onClick={() => updatePhoto(id, photo.id, 'REJECTED')} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors">
                      <X size={12} className="inline mr-1" />Rejeitar
                    </button>
                  )}
                </div>
              </div>
            ))}
            {/* Botão adicionar */}
            <button onClick={() => fileInputRef.current?.click()} className="aspect-[3/4] rounded-xl border-2 border-dashed border-[rgba(233,30,140,0.3)] flex flex-col items-center justify-center gap-2 text-[#7A5665] hover:text-[#E91E8C] hover:border-[#E91E8C] transition-all">
              <Upload size={20} />
              <span className="text-xs">Adicionar</span>
            </button>
          </div>
          {filteredPhotos.length === 0 && model.photos.length > 0 && (
            <div className="text-center py-12 text-[#7A5665] text-sm">Nenhuma foto neste filtro</div>
          )}
          {model.photos.length === 0 && (
            <div className="text-center py-12 text-[#7A5665] text-sm">Nenhuma foto enviada ainda</div>
          )}
        </div>
      )}

      {/* ── AGENDA ── */}
      {activeTab === 'agenda' && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-[#E91E8C] flex items-center gap-2 mb-4"><Clock size={14} /> Disponibilidade Semanal</h2>
          {model.availability.length > 0
            ? <div className="space-y-3">{model.availability.map((a) => (
              <div key={a.weekday} className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.04)]">
                <span className="text-sm text-[#F8F0F4] w-24">{a.weekday}</span>
                <span className="text-sm text-[#BFA0AB]">{a.start} — {a.end}</span>
                <span className="px-2 py-0.5 rounded text-xs bg-green-500/10 text-green-400">Disponível</span>
              </div>
            ))}</div>
            : <p className="text-sm text-[#7A5665]">Sem disponibilidade cadastrada</p>}
        </div>
      )}

      {/* ── EDITAR ── */}
      {activeTab === 'editar' && (
        <div className="space-y-6">
          {/* Dados básicos */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-[#E91E8C] flex items-center gap-2 mb-4"><Edit2 size={14} /> Dados Básicos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Nome artístico</label>
                <input value={editData.stageName} onChange={(e) => setEditData({ ...editData, stageName: e.target.value })} className="input-field w-full py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Email</label>
                <input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="input-field w-full py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">WhatsApp</label>
                <input value={editData.whatsapp} onChange={(e) => setEditData({ ...editData, whatsapp: e.target.value })} className="input-field w-full py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Cidade</label>
                <input value={editData.city} onChange={(e) => setEditData({ ...editData, city: e.target.value })} className="input-field w-full py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Estado</label>
                <input value={editData.state} onChange={(e) => setEditData({ ...editData, state: e.target.value.toUpperCase() })} maxLength={2} className="input-field w-full py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Bairro</label>
                <input value={editData.neighborhood} onChange={(e) => setEditData({ ...editData, neighborhood: e.target.value })} className="input-field w-full py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Plano</label>
                <select value={editData.plan} onChange={(e) => setEditData({ ...editData, plan: e.target.value as typeof editData.plan })} className="input-field w-full py-2 text-sm">
                  <option value="FREE">Free</option>
                  <option value="SILVER">Silver</option>
                  <option value="GOLD">Gold</option>
                  <option value="ELITE">Elite</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Status</label>
                <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value as Status })} className="input-field w-full py-2 text-sm">
                  <option value="PENDING">Pendente</option>
                  <option value="ACTIVE">Ativa</option>
                  <option value="SUSPENDED">Suspensa</option>
                  <option value="BANNED">Banida</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs text-[#7A5665] mb-1">Apresentação / Bio</label>
              <textarea value={editData.bio} onChange={(e) => setEditData({ ...editData, bio: e.target.value })} rows={4} className="input-field w-full py-2 text-sm resize-none" />
            </div>
          </div>

          {/* Características */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-[#E91E8C] flex items-center gap-2 mb-4"><Heart size={14} /> Características Físicas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Idade</label>
                <input type="number" value={editData.age || ''} onChange={(e) => setEditData({ ...editData, age: Number(e.target.value) })} className="input-field w-full py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Altura (m)</label>
                <input type="number" step="0.01" value={editData.height || ''} onChange={(e) => setEditData({ ...editData, height: Number(e.target.value) })} className="input-field w-full py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Peso (kg)</label>
                <input type="number" value={editData.weight || ''} onChange={(e) => setEditData({ ...editData, weight: Number(e.target.value) })} className="input-field w-full py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Etnia</label>
                <input value={editData.ethnicity} onChange={(e) => setEditData({ ...editData, ethnicity: e.target.value })} className="input-field w-full py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Estilo do cabelo</label>
                <input value={editData.hairStyle} onChange={(e) => setEditData({ ...editData, hairStyle: e.target.value })} className="input-field w-full py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Tamanho do cabelo</label>
                <input value={editData.hairSize} onChange={(e) => setEditData({ ...editData, hairSize: e.target.value })} className="input-field w-full py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Cor dos olhos</label>
                <input value={editData.eyeColor} onChange={(e) => setEditData({ ...editData, eyeColor: e.target.value })} className="input-field w-full py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Preço mínimo (R$)</label>
                <input type="number" value={editData.priceMin || ''} onChange={(e) => setEditData({ ...editData, priceMin: Number(e.target.value) })} className="input-field w-full py-2 text-sm" />
              </div>
            </div>
            <div className="flex gap-6 mt-4">
              <label className="flex items-center gap-2 text-sm text-[#BFA0AB] cursor-pointer">
                <input type="checkbox" checked={editData.hasSilicone} onChange={(e) => setEditData({ ...editData, hasSilicone: e.target.checked })} className="accent-[#E91E8C]" /> Silicone
              </label>
              <label className="flex items-center gap-2 text-sm text-[#BFA0AB] cursor-pointer">
                <input type="checkbox" checked={editData.hasTattoo} onChange={(e) => setEditData({ ...editData, hasTattoo: e.target.checked })} className="accent-[#E91E8C]" /> Tatuagem
              </label>
              <label className="flex items-center gap-2 text-sm text-[#BFA0AB] cursor-pointer">
                <input type="checkbox" checked={editData.smokes} onChange={(e) => setEditData({ ...editData, smokes: e.target.checked })} className="accent-[#E91E8C]" /> Fuma
              </label>
              <label className="flex items-center gap-2 text-sm text-[#BFA0AB] cursor-pointer">
                <input type="checkbox" checked={editData.isVerified} onChange={(e) => setEditData({ ...editData, isVerified: e.target.checked })} className="accent-[#E91E8C]" /> Verificada ✅
              </label>
            </div>
          </div>

          {/* Serviços */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-[#E91E8C] mb-4">Serviços Oferecidos</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {ALL_SERVICES.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleService(s)}
                  className={cn('px-3 py-1.5 rounded-full text-xs font-semibold border transition-all', editData.services.includes(s)
                    ? 'bg-[#E91E8C] text-white border-[#E91E8C]'
                    : 'bg-transparent text-[#7A5665] border-[rgba(255,255,255,0.1)] hover:text-white hover:border-white')}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomService()}
                placeholder="Adicionar serviço personalizado..."
                className="input-field flex-1 py-2 text-sm"
              />
              <button onClick={addCustomService} className="px-3 py-2 rounded-lg bg-[rgba(233,30,140,0.1)] text-[#E91E8C] hover:bg-[rgba(233,30,140,0.2)] transition-all">
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm py-2 px-5">
              <Save size={14} />{saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button onClick={() => { setEditData({ ...model }); setActiveTab('perfil') }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#7A5665] hover:text-white hover:bg-[#201519] text-sm transition-all">
              <X size={14} /> Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
