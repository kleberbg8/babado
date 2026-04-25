import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VerifiedBadgeProps {
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function VerifiedBadge({ showLabel = false, size = 'md', className }: VerifiedBadgeProps) {
  const iconSize = { sm: 12, md: 14, lg: 16 }[size]

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold',
        'bg-[rgba(37,211,102,0.12)] text-green-400 border border-[rgba(37,211,102,0.2)]',
        className
      )}
    >
      <ShieldCheck size={iconSize} />
      {showLabel && <span>Verificada</span>}
    </div>
  )
}
