'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { WEEKDAYS_PT } from '@/lib/utils'
import type { AvailabilityItem } from '@/types'

interface WeeklyScheduleProps {
  availability: AvailabilityItem[]
  editable?: boolean
  onChange?: (updated: AvailabilityItem[]) => void
}

export default function WeeklySchedule({ availability, editable = false, onChange }: WeeklyScheduleProps) {
  const [items, setItems] = useState<AvailabilityItem[]>(() => {
    const days = WEEKDAYS_PT()
    return days.map((_, i) => {
      const existing = availability.find((a) => a.weekday === i)
      return existing ?? { weekday: i, startTime: '08:00', endTime: '22:00', isAvailable: false }
    })
  })

  const toggle = (weekday: number) => {
    if (!editable) return
    const updated = items.map((item) =>
      item.weekday === weekday ? { ...item, isAvailable: !item.isAvailable } : item
    )
    setItems(updated)
    onChange?.(updated)
  }

  const updateTime = (weekday: number, field: 'startTime' | 'endTime', value: string) => {
    if (!editable) return
    const updated = items.map((item) =>
      item.weekday === weekday ? { ...item, [field]: value } : item
    )
    setItems(updated)
    onChange?.(updated)
  }

  const days = WEEKDAYS_PT()

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.weekday}
          className={cn(
            'flex items-center gap-3 p-3 rounded-sm border transition-all duration-150',
            item.isAvailable
              ? 'bg-[rgba(233,30,140,0.06)] border-[rgba(233,30,140,0.2)]'
              : 'bg-[#201519] border-[rgba(255,255,255,0.04)]'
          )}
        >
          <button
            onClick={() => toggle(item.weekday)}
            className={cn(
              'w-5 h-5 rounded border shrink-0 flex items-center justify-center transition-all',
              item.isAvailable ? 'bg-[#E91E8C] border-[#E91E8C]' : 'border-[#7A5665]'
            )}
            disabled={!editable}
          >
            {item.isAvailable && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          <span className={cn('text-sm font-medium w-20 shrink-0', item.isAvailable ? 'text-[#F8F0F4]' : 'text-[#7A5665]')}>
            {days[item.weekday]}
          </span>

          {item.isAvailable ? (
            <div className="flex items-center gap-2 ml-auto">
              {editable ? (
                <>
                  <input
                    type="time"
                    value={item.startTime}
                    onChange={(e) => updateTime(item.weekday, 'startTime', e.target.value)}
                    className="input-field py-1.5 w-28 text-xs"
                  />
                  <span className="text-[#7A5665] text-xs">às</span>
                  <input
                    type="time"
                    value={item.endTime}
                    onChange={(e) => updateTime(item.weekday, 'endTime', e.target.value)}
                    className="input-field py-1.5 w-28 text-xs"
                  />
                </>
              ) : (
                <span className="text-sm text-[#BFA0AB]">
                  {item.startTime} – {item.endTime}
                </span>
              )}
            </div>
          ) : (
            <span className="ml-auto text-xs text-[#7A5665]">Indisponível</span>
          )}
        </div>
      ))}
    </div>
  )
}
