'use client'

import { useState } from 'react'
import { Save, CheckCircle, Info } from 'lucide-react'
import WeeklySchedule from '@/components/ui/WeeklySchedule'
import type { AvailabilityItem } from '@/types'

const DEFAULT_AVAILABILITY: AvailabilityItem[] = [
  { weekday: 0, startTime: '10:00', endTime: '22:00', isAvailable: false },
  { weekday: 1, startTime: '10:00', endTime: '22:00', isAvailable: true },
  { weekday: 2, startTime: '10:00', endTime: '22:00', isAvailable: true },
  { weekday: 3, startTime: '10:00', endTime: '22:00', isAvailable: true },
  { weekday: 4, startTime: '10:00', endTime: '22:00', isAvailable: true },
  { weekday: 5, startTime: '10:00', endTime: '22:00', isAvailable: true },
  { weekday: 6, startTime: '12:00', endTime: '20:00', isAvailable: true },
]

export default function AgendaPage() {
  const [availability, setAvailability] = useState<AvailabilityItem[]>(DEFAULT_AVAILABILITY)
  const [saved, setSaved] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const handleChange = (updated: AvailabilityItem[]) => {
    setAvailability(updated)
    setIsDirty(true)
  }

  const handleSave = async () => {
    await new Promise((r) => setTimeout(r, 600))
    setSaved(true)
    setIsDirty(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const availableDays = availability.filter((a) => a.isAvailable).length

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white mb-1">
          Minha <span className="italic text-[#E91E8C]">Agenda</span>
        </h1>
        <p className="text-sm text-[#7A5665]">Configure os dias e horários em que você está disponível</p>
      </div>

      <div className="flex items-center gap-3 p-4 rounded bg-[rgba(233,30,140,0.06)] border border-[rgba(233,30,140,0.15)] mb-6">
        <Info size={14} className="text-[#E91E8C] shrink-0" />
        <p className="text-sm text-[#BFA0AB]">
          Sua agenda é exibida no perfil público. Visitantes podem ver quando você está disponível.
        </p>
      </div>

      <div className="card p-6 mb-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-[#F8F0F4]">Disponibilidade semanal</h2>
          <span className="text-xs text-[#BFA0AB] bg-[#201519] px-3 py-1 rounded-full border border-[rgba(255,255,255,0.06)]">
            {availableDays} dias ativos
          </span>
        </div>
        <WeeklySchedule
          availability={availability}
          editable
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-50"
        >
          {saved ? (
            <>
              <CheckCircle size={16} />
              Salvo!
            </>
          ) : (
            <>
              <Save size={16} />
              Salvar agenda
            </>
          )}
        </button>
      </div>
    </div>
  )
}
