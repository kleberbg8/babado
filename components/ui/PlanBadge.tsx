import { Crown, Star, Sparkles, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PlanType } from '@/types'

interface PlanBadgeProps {
  plan: PlanType
  showLabel?: boolean
  className?: string
}

const planConfig: Record<PlanType, { label: string; icon: typeof Crown; className: string }> = {
  FREE: {
    label: 'Grátis',
    icon: Zap,
    className: 'bg-[rgba(255,255,255,0.06)] text-[#7A5665] border-[rgba(255,255,255,0.08)]',
  },
  SILVER: {
    label: 'Silver',
    icon: Star,
    className: 'bg-[rgba(192,192,192,0.12)] text-[#C0C0C0] border-[rgba(192,192,192,0.2)]',
  },
  GOLD: {
    label: 'Gold',
    icon: Crown,
    className: 'bg-[rgba(232,184,75,0.12)] text-[#E8B84B] border-[rgba(232,184,75,0.2)]',
  },
  ELITE: {
    label: 'Elite',
    icon: Sparkles,
    className: 'bg-[rgba(233,30,140,0.12)] text-[#E91E8C] border-[rgba(233,30,140,0.2)]',
  },
}

export default function PlanBadge({ plan, showLabel = true, className }: PlanBadgeProps) {
  if (plan === 'FREE') return null

  const config = planConfig[plan]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold border',
        config.className,
        className
      )}
    >
      <Icon size={11} />
      {showLabel && config.label}
    </div>
  )
}
