'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, CheckCircle, ShieldOff, Ban, Edit2, Save, X,
  Clock, User, Heart, DollarSign, Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Status = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED'

const MOCK_MODEL = {
  id: '4',
  name: 'Júlia Ferreira',
  stageName: 'Júlia Ferreira',
  email: 'julia@email.com',
  whatsapp: '(31) 99999-1234',
  city: 'Belo Horizonte',
  state: 'MG',
  neighborhood: 'Savassi',
  plan: 'GOLD',
  status: 'PENDING' as Status,
  score: 0,
  joinedAt: '24/04/2026',
  isVerified: false,
  views: 0,
  bio: 'Sou uma modelo profissional com 5 anos de experiência. Discreta e elegante, ofereço serviços de alta qualidade para cavalheiros exigentes.',
  age: 26,
  height: 1.68,
  weight: 58,
  ethnicity: 'Branca',
  hairStyle: 'Liso',
  hairSize: 'Longo',
  eyeColor: 'Castanhos',
  hasSilicone: true,
  hasTattoo: false,
  smokes: false,
  serviceType: 'BOTH',
  priceMin: 300,
  priceTable: { '1h': 300, '2h': 500, 'diaria': 1500 },
  languages: ['Português', 'Inglês'],
  photos: [
    { id: '1', url: 'https://placehold.co/300x400/1a0d12/E91E8C?text=Foto+1', status: 'PENDING', isMain: true, isFace: false, isPremium: false },
    { id: '2', url: 'https://placehold.co/300x400/1a0d12/E91E8C?text=Foto+2', status: 'PENDING', isMain: false, isFace: false, isPremium: true },
    { id: '3', url: 'https://placehold.co/300x400/1a0d12/E91E8C?text=Foto+3', status: 'PENDING', isMain: false, isFace: true, isPremium: false },
    { id: '4', url: 'https://placehold.co/300x400/1a0d12/E91E8C?text=Foto+4', status: 'PENDING', isMain: false, isFace: false, isPremium: false },
    { id: '5', url: 'https://placehold.co/300x400/1a0d12/E91E8C?text=Foto+5', status: 'PENDING', isMain: false, isFace: false, isPremium: true },
    { id: '6', url: 'https://placehold.co/300x400/1a0d12/E91E8C?text=Vídeo+1', status: 'PENDING', isMain: false, isFace: false, isPremium: false },
  ],
  services: ['Massagem', 'Jantar', 'Viagens', 'Festas', 'Girlfriend Experience'],
  availability: [
    { weekday: 'Segunda', start: '14:00', end: '22:00' },
    { weekday: 'Terça', start: '14:00', end: '22:00' },
    { weekday: 'Quarta', start: '14:00', end: '22:00' },
    { weekday: 'Quinta', start: '14:00', end: '00:00' },
    { weekday: 'Sexta', start: '12:00', end: '02:00' },
    { weekday: 'Sábado', start: '12:00', end: '02:00' },
  ],
}

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  ACTIVE: { label: 'Ativa', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
  PENDING: { label: 'Pendente', className: 'bg-[rgba(232,184,75,0.1)] text-[#E8B84B] border-[rgba(232,184,75,0.2)]' },
  SUSPENDED: { label: 'Suspensa', className: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  BANNED: { label: 'Banida', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-[#7A5665] mb-0.5">{label}</p>
      <p className="text-sm text-[#F8F0F4] font-medium">{value ?? '—'}</p>
    </div>
  )
}

export default function ModelDetailPage() {
  const router = useRouter()
  const [model, setModel] = useState(MOCK_MODEL)
  const [activeTab, setActiveTab] = useState<'perfil' | 'fotos' | 'agenda' | 'editar'>('perfil')
  const [photoFilter, setPhotoFilter] = useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED'>('all')
  const [editData, setEditData] = useState({ ...MOCK_MODEL })
  const [saving, setSaving] = useState(false)

  const updateStatus = (status: Status) => {
    setModel((p) => ({ ...p, status }))
  }

  const approvePhoto = (id: string) => {
    setModel((p) => ({ ...p, photos: p.photos.map((ph) => ph.id === id ? { ...ph, status: 'APPROVED' } : ph) }))
  }

  const rejectPhoto = (id: string) => {
    setModel((p) => ({ ...p, photos: p.photos.map((ph) => ph.id === id ? { ...ph, status: 'REJECTED' } : ph) }))
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setModel({ ...model, ...editData })
    setSaving(false)
    setActiveTab('perfil')
  }

  const filteredPhotos = model.photos.filter((p) => photoFilter === 'all' || p.status === photoFilter)

  const S = STATUS_CONFIG[model.status]

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-lg text-[#7A5665] hover:text-white hover:bg-[#201519] transition-all">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-white">{model.stageName}</h1>
          <p className="text-sm text-[#7A5665]">Cadastrado em {model.joinedAt}</p>
        </div>
        <span className={cn('badge border', S.className)}>{S.label}</span>
      </div>

      {/* Status actions */}
      {model.status === 'PENDING' && (
        <div className="mb-6 p-4 rounded-xl bg-[rgba(232,184,75,0.08)] border border-[rgba(232,184,75,0.2)]">
          <p className="text-sm text-[#E8B84B] font-semibold mb-3">⏳ Cadastro pendente de aprovação</p>
          <div className="flex gap-2">
            <button onClick={() => updateStatus('ACTIVE')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 text-sm font-semibold transition-all">
              <CheckCircle size={14} /> Aprovar Cadastro
            </button>
            <button onClick={() => updateStatus('SUSPENDED')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 text-sm font-semibold transition-all">
              <ShieldOff size={14} /> Rejeitar
            </button>
          </div>
        </div>
      )}

      {model.status === 'ACTIVE' && (
        <div className="mb-6 flex gap-2">
          <button onClick={() => updateStatus('SUSPENDED')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 text-xs font-semibold transition-all">
            <ShieldOff size={12} /> Suspender
          </button>
          <button onClick={() => updateStatus('BANNED')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs font-semibold transition-all">
            <Ban size={12} /> Banir
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
              'px-4 py-2 text-sm font-semibold capitalize transition-all border-b-2 -mb-px',
              activeTab === tab
                ? 'text-[#E91E8C] border-[#E91E8C]'
                : 'text-[#7A5665] border-transparent hover:text-white'
            )}
          >
            {tab === 'fotos' ? `Fotos (${model.photos.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ── TAB: PERFIL ── */}
      {activeTab === 'perfil' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Dados pessoais */}
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

            {/* Características */}
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-[#E91E8C] flex items-center gap-2 mb-4"><Heart size={14} /> Características Físicas</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Field label="Idade" value={`${model.age} anos`} />
                <Field label="Altura" value={`${model.height}m`} />
                <Field label="Peso" value={`${model.weight}kg`} />
                <Field label="Etnia" value={model.ethnicity} />
                <Field label="Cabelo" value={`${model.hairStyle} / ${model.hairSize}`} />
                <Field label="Olhos" value={model.eyeColor} />
                <Field label="Silicone" value={model.hasSilicone ? 'Sim' : 'Não'} />
                <Field label="Tatuagem" value={model.hasTattoo ? 'Sim' : 'Não'} />
              </div>
            </div>

            {/* Bio */}
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-[#E91E8C] mb-3">Apresentação</h2>
              <p className="text-sm text-[#BFA0AB] leading-relaxed">{model.bio}</p>
            </div>

            {/* Serviços */}
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-[#E91E8C] mb-3">Serviços Oferecidos</h2>
              <div className="flex flex-wrap gap-2">
                {model.services.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-[rgba(233,30,140,0.1)] text-[#E91E8C] text-xs border border-[rgba(233,30,140,0.2)]">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-[#E91E8C] flex items-center gap-2 mb-4"><DollarSign size={14} /> Preços</h2>
              <div className="space-y-2">
                {Object.entries(model.priceTable).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-[#7A5665] capitalize">{k}</span>
                    <span className="text-[#F8F0F4] font-semibold">R$ {v}</span>
                  </div>
                ))}
              </div>
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

      {/* ── TAB: FOTOS ── */}
      {activeTab === 'fotos' && (
        <div>
          <div className="flex gap-2 mb-5">
            {(['all', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setPhotoFilter(f)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  photoFilter === f ? 'bg-[#E91E8C] text-white' : 'bg-[#201519] text-[#7A5665] hover:text-white'
                )}
              >
                {f === 'all' ? 'Todas' : f === 'PENDING' ? 'Pendentes' : f === 'APPROVED' ? 'Aprovadas' : 'Rejeitadas'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-[3/4] bg-[#201519]">
                <img src={photo.url} alt="" className="w-full h-full object-cover" />

                {/* badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {photo.isMain && <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#E91E8C] text-white font-bold">Principal</span>}
                  {photo.isFace && <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500 text-white font-bold">Rosto</span>}
                  {photo.isPremium && <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#E8B84B] text-black font-bold">Premium</span>}
                </div>

                {/* status badge */}
                <div className={cn('absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold', {
                  'bg-yellow-500 text-black': photo.status === 'PENDING',
                  'bg-green-500 text-white': photo.status === 'APPROVED',
                  'bg-red-500 text-white': photo.status === 'REJECTED',
                })}>
                  {photo.status === 'PENDING' ? 'Pendente' : photo.status === 'APPROVED' ? 'Aprovada' : 'Rejeitada'}
                </div>

                {/* action overlay */}
                {photo.status === 'PENDING' && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 gap-2">
                    <button
                      onClick={() => approvePhoto(photo.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle size={12} /> Aprovar
                    </button>
                    <button
                      onClick={() => rejectPhoto(photo.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors"
                    >
                      <X size={12} /> Rejeitar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {filteredPhotos.length === 0 && (
            <div className="text-center py-12 text-[#7A5665] text-sm">Nenhuma foto encontrada</div>
          )}
        </div>
      )}

      {/* ── TAB: AGENDA ── */}
      {activeTab === 'agenda' && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-[#E91E8C] flex items-center gap-2 mb-4"><Clock size={14} /> Disponibilidade Semanal</h2>
          <div className="space-y-3">
            {model.availability.map((a) => (
              <div key={a.weekday} className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.04)]">
                <span className="text-sm text-[#F8F0F4] w-24">{a.weekday}</span>
                <span className="text-sm text-[#BFA0AB]">{a.start} — {a.end}</span>
                <span className="px-2 py-0.5 rounded text-xs bg-green-500/10 text-green-400">Disponível</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: EDITAR ── */}
      {activeTab === 'editar' && (
        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-[#E91E8C] flex items-center gap-2 mb-4"><Edit2 size={14} /> Dados Básicos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Nome artístico</label>
                <input value={editData.stageName} onChange={(e) => setEditData((p) => ({ ...p, stageName: e.target.value }))} className="input-field w-full py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Email</label>
                <input value={editData.email} onChange={(e) => setEditData((p) => ({ ...p, email: e.target.value }))} className="input-field w-full py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">WhatsApp</label>
                <input value={editData.whatsapp} onChange={(e) => setEditData((p) => ({ ...p, whatsapp: e.target.value }))} className="input-field w-full py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Cidade</label>
                <input value={editData.city} onChange={(e) => setEditData((p) => ({ ...p, city: e.target.value }))} className="input-field w-full py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Estado</label>
                <input value={editData.state} onChange={(e) => setEditData((p) => ({ ...p, state: e.target.value }))} className="input-field w-full py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Plano</label>
                <select value={editData.plan} onChange={(e) => setEditData((p) => ({ ...p, plan: e.target.value }))} className="input-field w-full py-2 text-sm">
                  <option value="FREE">Free</option>
                  <option value="SILVER">Silver</option>
                  <option value="GOLD">Gold</option>
                  <option value="ELITE">Elite</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Status</label>
                <select value={editData.status} onChange={(e) => setEditData((p) => ({ ...p, status: e.target.value as Status }))} className="input-field w-full py-2 text-sm">
                  <option value="PENDING">Pendente</option>
                  <option value="ACTIVE">Ativa</option>
                  <option value="SUSPENDED">Suspensa</option>
                  <option value="BANNED">Banida</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#7A5665] mb-1">Preço mínimo (R$)</label>
                <input type="number" value={editData.priceMin} onChange={(e) => setEditData((p) => ({ ...p, priceMin: Number(e.target.value) }))} className="input-field w-full py-2 text-sm" />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs text-[#7A5665] mb-1">Apresentação / Bio</label>
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData((p) => ({ ...p, bio: e.target.value }))}
                rows={4}
                className="input-field w-full py-2 text-sm resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2 text-sm py-2 px-5"
            >
              <Save size={14} />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button
              onClick={() => { setEditData({ ...model }); setActiveTab('perfil') }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#7A5665] hover:text-white hover:bg-[#201519] text-sm transition-all"
            >
              <X size={14} /> Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
