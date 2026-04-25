'use client'

import { useState } from 'react'
import { ChevronLeft, Check, Upload, ShieldCheck } from 'lucide-react'

const SERVICES_BY_CATEGORY: Record<string, string[]> = {
  'Acompanhamento': ['Jantar', 'Eventos', 'Viagens', 'Teatro/Shows', 'Corporativo'],
  'Relaxamento': ['Massagem', 'Banho de espuma', 'Jacuzzi'],
  'Fantasias': ['Fantasia de enfermeira', 'Fantasia de professora', 'Cosplay'],
  'Especial': ['Domínio suave', 'Submissão', 'Tantrica'],
}

interface ServiceSelection {
  mode: 'DO' | 'RECEIVE' | 'BOTH'
  isSpecialty: boolean
}

interface Props {
  onNext: (data: Record<string, unknown>) => void
  onBack: () => void
  defaultValues?: Record<string, unknown>
}

export default function RegisterStep4({ onNext, onBack }: Props) {
  const [services, setServices] = useState<Record<string, ServiceSelection>>({})
  const [docUploaded, setDocUploaded] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [adultConfirmed, setAdultConfirmed] = useState(false)
  const [expandedCat, setExpandedCat] = useState<string | null>('Acompanhamento')

  const toggleService = (name: string) => {
    setServices((prev) => {
      if (prev[name]) {
        const next = { ...prev }
        delete next[name]
        return next
      }
      return { ...prev, [name]: { mode: 'DO', isSpecialty: false } }
    })
  }

  const updateService = (name: string, updates: Partial<ServiceSelection>) => {
    setServices((prev) => ({
      ...prev,
      [name]: { ...prev[name], ...updates },
    }))
  }

  const handleSubmit = () => {
    if (!docUploaded || !agreed || !adultConfirmed) return
    onNext({ services, docUploaded, agreed, adultConfirmed })
  }

  return (
    <div className="space-y-6">
      {/* Document upload */}
      <div>
        <h3 className="text-sm font-semibold text-[#BFA0AB] uppercase tracking-wider mb-3">
          Verificação de Identidade
        </h3>
        <div className="p-4 rounded bg-[rgba(37,211,102,0.06)] border border-green-500/20 mb-3">
          <div className="flex items-start gap-2">
            <ShieldCheck size={16} className="text-green-400 shrink-0 mt-0.5" />
            <p className="text-xs text-[#BFA0AB]">
              Envie uma selfie segurando seu documento (RG ou CNH). Isso garante autenticidade do perfil e protege você.
              Os dados pessoais são confidenciais.
            </p>
          </div>
        </div>
        <label className={`flex flex-col items-center gap-2 p-6 rounded border-2 border-dashed cursor-pointer transition-all ${docUploaded ? 'border-green-500 bg-[rgba(37,211,102,0.06)]' : 'border-[rgba(255,255,255,0.1)] bg-[#201519] hover:border-[rgba(233,30,140,0.3)]'}`}>
          {docUploaded ? (
            <>
              <Check size={28} className="text-green-400" />
              <p className="text-sm text-green-400 font-semibold">Documento enviado!</p>
            </>
          ) : (
            <>
              <Upload size={28} className="text-[#7A5665]" />
              <p className="text-sm text-[#BFA0AB] font-semibold">Enviar selfie com documento</p>
              <p className="text-xs text-[#7A5665]">JPG ou PNG, máx. 10MB</p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={() => setDocUploaded(true)}
          />
        </label>
      </div>

      {/* Services */}
      <div>
        <h3 className="text-sm font-semibold text-[#BFA0AB] uppercase tracking-wider mb-3">
          Serviços Oferecidos
        </h3>
        {Object.entries(SERVICES_BY_CATEGORY).map(([cat, items]) => (
          <div key={cat} className="border border-[rgba(255,255,255,0.06)] rounded-sm mb-2 overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedCat(expandedCat === cat ? null : cat)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#201519] hover:bg-[#2A1C22] transition-colors text-sm font-medium text-[#BFA0AB]"
            >
              {cat}
              <span className="text-xs text-[#7A5665]">{items.filter((i) => services[i]).length} selecionados</span>
            </button>
            {expandedCat === cat && (
              <div className="p-3 bg-[#130E11] space-y-2">
                {items.map((item) => {
                  const selected = !!services[item]
                  return (
                    <div key={item} className="space-y-2">
                      <label className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${selected ? 'bg-[rgba(233,30,140,0.08)]' : 'hover:bg-[#201519]'}`}>
                        <div
                          onClick={() => toggleService(item)}
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selected ? 'bg-[#E91E8C] border-[#E91E8C]' : 'border-[#7A5665]'}`}
                        >
                          {selected && <Check size={10} className="text-white" />}
                        </div>
                        <span className="text-sm text-[#BFA0AB]">{item}</span>
                      </label>
                      {selected && (
                        <div className="pl-6 flex gap-2 flex-wrap">
                          {(['DO', 'RECEIVE', 'BOTH'] as const).map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => updateService(item, { mode })}
                              className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all ${services[item]?.mode === mode ? 'bg-[rgba(233,30,140,0.15)] border-[#E91E8C] text-[#E91E8C]' : 'border-[rgba(255,255,255,0.06)] text-[#7A5665] hover:border-[rgba(233,30,140,0.3)]'}`}
                            >
                              {mode === 'DO' ? 'Faço' : mode === 'RECEIVE' ? 'Recebo' : 'Ambos'}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => updateService(item, { isSpecialty: !services[item]?.isSpecialty })}
                            className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all ${services[item]?.isSpecialty ? 'bg-[rgba(232,184,75,0.12)] border-[#E8B84B] text-[#E8B84B]' : 'border-[rgba(255,255,255,0.06)] text-[#7A5665]'}`}
                          >
                            ★ Especialidade
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Agreements */}
      <div className="space-y-3">
        {[
          { state: adultConfirmed, setter: setAdultConfirmed, text: 'Confirmo que tenho 18 anos ou mais e que todas as modelos em meu perfil são maiores de idade.' },
          { state: agreed, setter: setAgreed, text: 'Aceito os Termos de Uso e a Política de Privacidade do Gatas do Babado.' },
        ].map(({ state, setter, text }, i) => (
          <label key={i} className="flex items-start gap-3 cursor-pointer">
            <div
              onClick={() => setter(!state)}
              className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${state ? 'bg-[#E91E8C] border-[#E91E8C]' : 'border-[#7A5665] hover:border-[#E91E8C]'}`}
            >
              {state && <Check size={12} className="text-white" />}
            </div>
            <span className="text-sm text-[#BFA0AB] leading-relaxed">{text}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onBack} className="btn-secondary flex-1 py-3">
          <ChevronLeft size={16} /> Voltar
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!docUploaded || !agreed || !adultConfirmed}
          className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar Cadastro <Check size={16} />
        </button>
      </div>
    </div>
  )
}
