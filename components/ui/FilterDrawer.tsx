'use client'

import { useState } from 'react'
import { X, SlidersHorizontal, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FilterOptions, ServiceType } from '@/types'

const ETNIAS = ['Branca', 'Parda', 'Negra', 'Asiática', 'Latina', 'Outra']
const DISPONIBILIDADE = ['Agora', 'Hoje', 'Esta semana']
const ATENDIMENTO: { value: ServiceType; label: string }[] = [
  { value: 'LOCAL', label: 'Com local' },
  { value: 'OUTCALL', label: 'A domicílio' },
  { value: 'BOTH', label: 'Ambos' },
  { value: 'TRAVEL', label: 'Viagens' },
]

interface FilterDrawerProps {
  filters: FilterOptions
  onApply: (filters: FilterOptions) => void
  onClear: () => void
  isOpen?: boolean
  onClose?: () => void
}

export default function FilterDrawer({ filters, onApply, onClear, isOpen = true, onClose }: FilterDrawerProps) {
  const [local, setLocal] = useState<FilterOptions>({ ...filters })

  const toggle = <K extends keyof FilterOptions>(key: K, value: string) => {
    const current = (local[key] as string[]) ?? []
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    setLocal({ ...local, [key]: updated })
  }

  const content = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-5 border-b border-[rgba(233,30,140,0.15)]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#E91E8C]" />
          <h3 className="font-semibold text-[#F8F0F4]">Filtros</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-[#7A5665] hover:text-white transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Cidade */}
        <div>
          <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-2">
            Cidade / Estado
          </label>
          <input
            type="text"
            placeholder="Ex: São Paulo"
            className="input-field"
            value={local.city ?? ''}
            onChange={(e) => setLocal({ ...local, city: e.target.value })}
          />
        </div>

        {/* Faixa de preço */}
        <div>
          <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-3">
            Faixa de Preço
          </label>
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-xs text-[#7A5665] mb-1">Mínimo</p>
              <input
                type="number"
                placeholder="R$ 0"
                className="input-field"
                value={local.priceMin ?? ''}
                onChange={(e) => setLocal({ ...local, priceMin: Number(e.target.value) || undefined })}
              />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#7A5665] mb-1">Máximo</p>
              <input
                type="number"
                placeholder="R$ 999"
                className="input-field"
                value={local.priceMax ?? ''}
                onChange={(e) => setLocal({ ...local, priceMax: Number(e.target.value) || undefined })}
              />
            </div>
          </div>
        </div>

        {/* Idade */}
        <div>
          <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-3">
            Faixa de Idade
          </label>
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-xs text-[#7A5665] mb-1">De</p>
              <input
                type="number"
                placeholder="18"
                className="input-field"
                value={local.ageMin ?? ''}
                onChange={(e) => setLocal({ ...local, ageMin: Number(e.target.value) || undefined })}
              />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#7A5665] mb-1">Até</p>
              <input
                type="number"
                placeholder="60"
                className="input-field"
                value={local.ageMax ?? ''}
                onChange={(e) => setLocal({ ...local, ageMax: Number(e.target.value) || undefined })}
              />
            </div>
          </div>
        </div>

        {/* Etnia */}
        <div>
          <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-3">
            Etnia
          </label>
          <div className="flex flex-wrap gap-2">
            {ETNIAS.map((e) => {
              const selected = (local.ethnicity ?? []).includes(e)
              return (
                <button
                  key={e}
                  onClick={() => toggle('ethnicity', e)}
                  className={cn(
                    'px-3 py-1.5 rounded-sm text-xs font-medium border transition-all duration-150',
                    selected
                      ? 'bg-[rgba(233,30,140,0.15)] border-[#E91E8C] text-[#E91E8C]'
                      : 'bg-[#201519] border-[rgba(255,255,255,0.06)] text-[#BFA0AB] hover:border-[rgba(233,30,140,0.3)]'
                  )}
                >
                  {selected && <Check size={10} className="inline mr-1" />}
                  {e}
                </button>
              )
            })}
          </div>
        </div>

        {/* Disponibilidade */}
        <div>
          <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-3">
            Disponibilidade
          </label>
          <div className="flex flex-col gap-2">
            {DISPONIBILIDADE.map((d) => {
              const selected = (local.availability ?? []).includes(d)
              return (
                <button
                  key={d}
                  onClick={() => toggle('availability', d)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-sm border text-sm transition-all duration-150',
                    selected
                      ? 'bg-[rgba(233,30,140,0.1)] border-[#E91E8C] text-[#E91E8C]'
                      : 'bg-[#201519] border-[rgba(255,255,255,0.06)] text-[#BFA0AB]'
                  )}
                >
                  <div className={cn('w-4 h-4 rounded border flex items-center justify-center shrink-0', selected ? 'bg-[#E91E8C] border-[#E91E8C]' : 'border-[#7A5665]')}>
                    {selected && <Check size={10} className="text-white" />}
                  </div>
                  {d}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tipo de atendimento */}
        <div>
          <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-3">
            Tipo de Atendimento
          </label>
          <div className="flex flex-col gap-2">
            {ATENDIMENTO.map(({ value, label }) => {
              const selected = (local.serviceType ?? []).includes(value)
              return (
                <button
                  key={value}
                  onClick={() => toggle('serviceType', value)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-sm border text-sm transition-all duration-150',
                    selected
                      ? 'bg-[rgba(233,30,140,0.1)] border-[#E91E8C] text-[#E91E8C]'
                      : 'bg-[#201519] border-[rgba(255,255,255,0.06)] text-[#BFA0AB]'
                  )}
                >
                  <div className={cn('w-4 h-4 rounded border flex items-center justify-center shrink-0', selected ? 'bg-[#E91E8C] border-[#E91E8C]' : 'border-[#7A5665]')}>
                    {selected && <Check size={10} className="text-white" />}
                  </div>
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Somente verificadas */}
        <div>
          <button
            onClick={() => setLocal({ ...local, onlyVerified: !local.onlyVerified })}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2.5 rounded-sm border text-sm transition-all duration-150',
              local.onlyVerified
                ? 'bg-[rgba(37,211,102,0.1)] border-green-500/40 text-green-400'
                : 'bg-[#201519] border-[rgba(255,255,255,0.06)] text-[#BFA0AB]'
            )}
          >
            <div className={cn('w-4 h-4 rounded border flex items-center justify-center shrink-0', local.onlyVerified ? 'bg-green-500 border-green-500' : 'border-[#7A5665]')}>
              {local.onlyVerified && <Check size={10} className="text-white" />}
            </div>
            Somente verificadas
          </button>

          <button
            onClick={() => setLocal({ ...local, onlyOnline: !local.onlyOnline })}
            className={cn(
              'w-full mt-2 flex items-center gap-2 px-3 py-2.5 rounded-sm border text-sm transition-all duration-150',
              local.onlyOnline
                ? 'bg-[rgba(34,197,94,0.1)] border-green-500/40 text-green-400'
                : 'bg-[#201519] border-[rgba(255,255,255,0.06)] text-[#BFA0AB]'
            )}
          >
            <div className={cn('w-4 h-4 rounded border flex items-center justify-center shrink-0', local.onlyOnline ? 'bg-green-500 border-green-500' : 'border-[#7A5665]')}>
              {local.onlyOnline && <Check size={10} className="text-white" />}
            </div>
            Online agora
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="p-5 border-t border-[rgba(233,30,140,0.15)] flex gap-3">
        <button
          onClick={() => { setLocal({}); onClear() }}
          className="btn-secondary flex-1 text-sm"
        >
          Limpar tudo
        </button>
        <button
          onClick={() => { onApply(local); onClose?.() }}
          className="btn-primary flex-1 text-sm"
        >
          Aplicar filtros
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col h-full bg-[#130E11] border border-[rgba(233,30,140,0.15)] rounded-lg overflow-hidden">
        {content}
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <div className="relative ml-auto w-80 max-w-full h-full bg-[#130E11] border-l border-[rgba(233,30,140,0.15)] flex flex-col animate-slide-in-right">
            {content}
          </div>
        </div>
      )}
    </>
  )
}
