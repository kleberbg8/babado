import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { timeAgo } from '@/lib/utils'
import StarRating from './StarRating'
import type { ReviewItem } from '@/types'

interface ReviewCardProps {
  review: ReviewItem
  blurred?: boolean
}

export default function ReviewCard({ review, blurred = false }: ReviewCardProps) {
  return (
    <div className="card p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-[rgba(233,30,140,0.15)] flex items-center justify-center text-[#E91E8C] font-bold text-sm shrink-0">
          {review.userName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-[#F8F0F4]">{review.userName}</p>
            <span className="text-xs text-[#7A5665] shrink-0">{timeAgo(review.createdAt)}</span>
          </div>
          <StarRating value={review.rating} size="sm" className="mt-0.5" />
        </div>
      </div>

      {review.comment && (
        <div className={blurred ? 'relative' : ''}>
          <p className={`text-sm text-[#BFA0AB] leading-relaxed ${blurred ? 'blur-sm select-none' : ''}`}>
            {review.comment}
          </p>
          {blurred && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs text-[#E91E8C] font-medium bg-[#201519] px-3 py-1 rounded border border-[rgba(233,30,140,0.2)]">
                Faça login para ver
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[rgba(255,255,255,0.04)]">
        <button className="flex items-center gap-1.5 text-xs text-[#7A5665] hover:text-green-400 transition-colors">
          <ThumbsUp size={12} />
          Útil ({review.helpfulCount})
        </button>
        <button className="flex items-center gap-1.5 text-xs text-[#7A5665] hover:text-[#E91E8C] transition-colors">
          <ThumbsDown size={12} />
          Inútil
        </button>
      </div>
    </div>
  )
}
