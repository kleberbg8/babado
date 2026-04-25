'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Edit, Clock, ShieldCheck, MapPin } from 'lucide-react'

interface PendingModel {
  id: string
  name: string
  city: string
  state: string
  submittedAt: string
  hoursAgo: number
  hasDoc: boolean
  photoCount: number
}

const MOCK_PENDING: PendingModel[] = [
  { id: '1', name: 'Jessica Lima', city: 'São Paulo', state: 'SP', submittedAt: '25/04/2026 08:15', hoursAgo: 18, hasDoc: true, photoCount: 8 },
  { id: '2', name: 'Rafaela Costa', city: 'Rio de Janeiro', state: 'RJ', submittedAt: '25/04/2026 14:30', hoursAgo: 12, hasDoc: true, photoCount: 12 },
  { id: '3', name: 'Bruna Martins', city: 'Curitiba', state: 'PR', submittedAt: '25/04/2026 20:00', hoursAgo: 6, hasDoc: false, photoCount: 5 },
  { id: '4', name: 'Amanda Ferreira', city: 'Belo Horizonte', state: 'MG', submittedAt: '25/04/2026 22:00', hoursAgo: 4, hasDoc: true, photoCount: 15 },
  { id: '5', name: 'Letícia Santos', city: 'Salvador', state: 'BA', submittedAt: '26/04/2026 00:30', hoursAgo: 2, hasDoc: true, photoCount: 7 },
]

type Action = 'approve' | 'reject' | 'review'

export default function AprovacoesPage() {
  const [profiles, setProfiles] = useState(MOCK_PENDING)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [rejectModal, setRejectModal] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [filter, setFilter] = useState<'all' | 'oldest' | 'no_doc'>('all')

  const handleAction = (id: string, action: Action) => {
    if (action === 'reject') { setRejectModal(id); return }
    setProfiles((prev) => prev.filter((p) => p.id !== id))
  }

  const handleBulkApprove = () => {
    setProfiles((prev) => prev.filter((p) => !selected.has(p.id)))
    setSelected(new Set())
  }

  const confirmReject = () => {
    if (rejectModal) setProfiles((prev) => prev.filter((p) => p.id !== rejectModal))
    setRejectModal(null)
    setRejectReason('')
  }

  const filteredProfiles = profiles.filter((p) => {
    if (filter === 'oldest') return p.hoursAgo > 12
    if (filter === 'no_doc') return !p.hasDoc
    return true
  })

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Fila de <span className="italic text-[#E91E8C]">Aprovação</span>
          </h1>
          <p className="text-sm text-[#7A5665]">{profiles.length} perfis aguardando análise</p>
        </div>
        {selected.size > 0 && (
          <button onClick={handleBulkApprove} className="flex items-center gap-2 px-4 py-2 rounded bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold hover:bg-green-500/30 transition-all">
            <CheckCircle size={14} />
            Aprovar {selected.size} selecionados
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { value: 'all', label: 'Todos' },
          { value: 'oldest', label: '⚠ Aguardando +12h' },
          { value: 'no_doc', label: 'Sem documento' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as typeof filter)}
            className={`px-3 py-1.5 rounded-sm text-xs font-semibold border transition-all ${filter === f.value ? 'bg-[rgba(233,30,140,0.15)] border-[#E91E8C] text-[#E91E8C]' : 'bg-[#201519] border-[rgba(255,255,255,0.06)] text-[#BFA0AB]'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredProfiles.length === 0 ? (
        <div className="text-center py-20">
          <CheckCircle size={48} className="mx-auto mb-4 text-green-400 opacity-50" />
          <p className="text-[#7A5665]">Nenhum perfil pendente. Tudo em dia!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className={`card p-5 flex flex-col md:flex-row items-start md:items-center gap-4 transition-all ${profile.hoursAgo > 12 ? 'border-[rgba(232,184,75,0.25)]' : ''} ${selected.has(profile.id) ? 'border-[rgba(233,30,140,0.3)] bg-[rgba(233,30,140,0.04)]' : ''}`}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                className="accent-[#E91E8C] w-4 h-4 shrink-0 mt-1 md:mt-0"
                checked={selected.has(profile.id)}
                onChange={(e) => {
                  const next = new Set(selected)
                  if (e.target.checked) next.add(profile.id)
                  else next.delete(profile.id)
                  setSelected(next)
                }}
              />

              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-[rgba(233,30,140,0.15)] flex items-center justify-center text-[#E91E8C] font-display font-bold text-lg shrink-0">
                {profile.name.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-[#F8F0F4]">{profile.name}</h3>
                  {profile.hasDoc ? (
                    <span className="badge badge-green">
                      <ShieldCheck size={10} /> Doc verificado
                    </span>
                  ) : (
                    <span className="badge bg-[rgba(255,59,48,0.1)] text-red-400 border-red-500/20">
                      Sem documento
                    </span>
                  )}
                  {profile.hoursAgo > 12 && (
                    <span className="badge badge-gold">
                      <Clock size={10} /> {profile.hoursAgo}h aguardando
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-[#7A5665]">
                    <MapPin size={10} /> {profile.city}, {profile.state}
                  </span>
                  <span className="text-xs text-[#7A5665]">{profile.photoCount} fotos</span>
                  <span className="text-xs text-[#7A5665]">Enviado: {profile.submittedAt}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0 w-full md:w-auto">
                <button
                  onClick={() => handleAction(profile.id, 'approve')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded text-sm font-semibold bg-green-500/15 border border-green-500/30 text-green-400 hover:bg-green-500/25 transition-all"
                >
                  <CheckCircle size={14} /> Aprovar
                </button>
                <button
                  onClick={() => handleAction(profile.id, 'review')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded text-sm font-semibold bg-[rgba(232,184,75,0.1)] border border-[rgba(232,184,75,0.2)] text-[#E8B84B] hover:bg-[rgba(232,184,75,0.2)] transition-all"
                >
                  <Edit size={14} /> Solicitar revisão
                </button>
                <button
                  onClick={() => handleAction(profile.id, 'reject')}
                  className="flex items-center justify-center px-3 py-2 rounded text-sm bg-[rgba(233,30,140,0.08)] border border-[rgba(233,30,140,0.2)] text-[#E91E8C] hover:bg-[rgba(233,30,140,0.15)] transition-all"
                >
                  <XCircle size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md card p-6 animate-scale-in">
            <h3 className="font-display text-lg font-bold text-white mb-2">Rejeitar perfil</h3>
            <p className="text-sm text-[#BFA0AB] mb-4">
              Informe o motivo da rejeição. A modelo receberá este feedback por e-mail e WhatsApp.
            </p>
            <textarea
              placeholder="Ex: Documentos ilegíveis, fotos de terceiros identificadas..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="input-field min-h-[100px] resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setRejectModal(null)} className="btn-secondary flex-1 py-2.5">Cancelar</button>
              <button
                onClick={confirmReject}
                disabled={!rejectReason.trim()}
                className="btn-primary flex-1 py-2.5 disabled:opacity-50 bg-[#E91E8C]"
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
