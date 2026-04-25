'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'
import OnlineBadge from './OnlineBadge'
import VerifiedBadge from './VerifiedBadge'
import PlanBadge from './PlanBadge'
import StarRating from './StarRating'
import type { ModelCard as ModelCardType } from '@/types'

interface ModelCardProps {
  model: ModelCardType
  className?: string
  priority?: boolean
}

export default function ModelCard({ model, className, priority = false }: ModelCardProps) {
  const href = `/acompanhante/${model.id}/${model.slug}`

  return (
    <Link href={href} className={cn('group relative block', className)}>
      <div className="card card-hover overflow-hidden h-full">
        {/* Photo */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#201519]">
          {model.mainPhoto ? (
            <Image
              src={model.mainPhoto}
              alt={model.stageName}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#201519]">
              <span className="text-4xl font-display font-bold text-[#E91E8C] opacity-30">
                {model.stageName.charAt(0)}
              </span>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0A0C] via-transparent to-transparent opacity-60" />
          <div className="absolute inset-0 bg-[#0D0A0C]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="px-4 py-2 rounded-sm bg-[#E91E8C] text-white text-sm font-semibold shadow-pink-glow">
              Ver perfil
            </span>
          </div>

          {/* Top badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {model.isFeatured && (
              <span className="badge badge-gold text-xs">✦ Destaque</span>
            )}
            {model.isNew && (
              <span className="badge badge-pink animate-pulse-slow text-xs">Nova</span>
            )}
          </div>

          {/* Online badge */}
          <div className="absolute top-2 right-2">
            <OnlineBadge isOnline={model.isOnline} />
          </div>

          {/* Favorite button */}
          <button
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-[#0D0A0C]/70 backdrop-blur-sm flex items-center justify-center text-[#BFA0AB] hover:text-[#E91E8C] hover:bg-[#0D0A0C]/90 transition-all duration-200 opacity-0 group-hover:opacity-100"
            onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
            aria-label="Favoritar"
          >
            <Heart size={14} />
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-display font-semibold text-sm text-[#F8F0F4] line-clamp-1 group-hover:text-[#E91E8C] transition-colors">
              {model.stageName}
            </h3>
            <PlanBadge plan={model.plan} showLabel={false} />
          </div>

          <p className="text-xs text-[#7A5665] mb-2">
            {model.city}, {model.state}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <StarRating value={model.score} size="sm" />
              <span className="text-xs text-[#7A5665]">({model.reviewCount})</span>
            </div>
            {model.isVerified && <VerifiedBadge />}
          </div>

          {model.priceMin && (
            <div className="mt-2 pt-2 border-t border-[rgba(233,30,140,0.1)]">
              <p className="text-xs text-[#7A5665]">A partir de</p>
              <p className="text-sm font-bold text-[#E8B84B]">{formatCurrency(model.priceMin)}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
