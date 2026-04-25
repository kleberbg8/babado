import { cn } from '@/lib/utils'

interface OnlineBadgeProps {
  isOnline: boolean
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function OnlineBadge({ isOnline, showLabel = false, size = 'md', className }: OnlineBadgeProps) {
  const dotSize = { sm: 'w-2 h-2', md: 'w-2.5 h-2.5', lg: 'w-3 h-3' }[size]

  if (!isOnline && !showLabel) return null

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span
        className={cn(
          'rounded-full shrink-0',
          dotSize,
          isOnline
            ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.7)] animate-pulse'
            : 'bg-[#7A5665]'
        )}
      />
      {showLabel && (
        <span className={cn('text-xs font-medium', isOnline ? 'text-green-400' : 'text-[#7A5665]')}>
          {isOnline ? 'Online agora' : 'Offline'}
        </span>
      )}
    </div>
  )
}
