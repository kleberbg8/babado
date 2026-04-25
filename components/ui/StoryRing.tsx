'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import OnlineBadge from './OnlineBadge'
import type { StoryItem } from '@/types'

interface StoryRingProps {
  story: StoryItem
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { outer: 'w-14 h-14', inner: 'w-12 h-12', text: 'text-xs' },
  md: { outer: 'w-16 h-16', inner: 'w-14 h-14', text: 'text-xs' },
  lg: { outer: 'w-20 h-20', inner: 'w-18 h-18', text: 'text-sm' },
}

export default function StoryRing({ story, onClick, size = 'md' }: StoryRingProps) {
  const sizes = sizeMap[size]

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 shrink-0 group"
      aria-label={`Story de ${story.stageName}`}
    >
      {/* Ring */}
      <div className={cn('story-ring p-[2px] rounded-full transition-transform duration-200 group-hover:scale-105', sizes.outer)}>
        <div className="w-full h-full rounded-full bg-[#0D0A0C] p-[2px]">
          <div className={cn('relative rounded-full overflow-hidden bg-[#201519]', sizes.inner)}>
            {story.mainPhoto ? (
              <Image
                src={story.mainPhoto}
                alt={story.stageName}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[#201519]">
                <span className="font-display font-bold text-[#E91E8C] text-lg">
                  {story.stageName.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Name + online */}
      <div className="flex flex-col items-center gap-0.5">
        <span className={cn('text-[#F8F0F4] font-medium truncate max-w-[70px]', sizes.text)}>
          {story.stageName.split(' ')[0]}
        </span>
        {story.isOnline && (
          <OnlineBadge isOnline showLabel size="sm" />
        )}
      </div>
    </button>
  )
}
