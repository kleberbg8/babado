'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number
  max?: number
  interactive?: boolean
  size?: 'sm' | 'md' | 'lg'
  onChange?: (value: number) => void
  className?: string
}

export default function StarRating({
  value,
  max = 5,
  interactive = false,
  size = 'md',
  onChange,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const iconSize = { sm: 12, md: 14, lg: 18 }[size]

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1
        const filled = interactive ? starValue <= (hovered || value) : starValue <= value

        return (
          <button
            key={i}
            type={interactive ? 'button' : undefined}
            className={cn(
              'transition-transform duration-100',
              interactive && 'hover:scale-110 cursor-pointer',
              !interactive && 'cursor-default'
            )}
            onClick={() => interactive && onChange?.(starValue)}
            onMouseEnter={() => interactive && setHovered(starValue)}
            onMouseLeave={() => interactive && setHovered(0)}
            aria-label={interactive ? `${starValue} estrelas` : undefined}
          >
            <Star
              size={iconSize}
              className={cn(
                'transition-colors duration-100',
                filled ? 'text-[#E8B84B] fill-[#E8B84B]' : 'text-[#7A5665]'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
