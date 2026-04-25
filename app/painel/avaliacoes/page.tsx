'use client'

import { useState } from 'react'
import { Star, MessageSquare, ThumbsUp, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Review {
  id: string
  rating: number
  comment: string
  userName: string
  createdAt: string
  helpfulCount: number
  reply?: string
}

const MOCK_REVIEWS: Review[] = [
  { id: '1', rating: 5, comment: 'Incrível! Muito elegante, pontual e simpática. Experiência perfeita, recomendo muito!', userName: 'C***s', createdAt: '22/04/2026', helpfulCount: 12, reply: 'Muito obrigada! Foi um prazer enorme. Até a próxima! 💕' },
  { id: '2', rating: 5, comment: 'Atendimento de altíssimo nível. Discrição total. Voltarei com certeza.', userName: 'R***o', createdAt: '20/04/2026', helpfulCount: 8 },
  { id: '3', rating: 4, comment: 'Ótima experiência. Apenas chegou um pouco atrasada, mas compensou com seu carisma.', userName: 'A***l', createdAt: '18/04/2026', helpfulCount: 5 },
  { id: '4', rating: 5, comment: 'Simplesmente perfeita. Classe, beleza e inteligência em uma só pessoa.', userName: 'M***o', createdAt: '15/04/2026', helpfulCount: 19 },
]

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={13} className={i <= rating ? 'fill-[#E8B84B] text-[#E8B84B]' : 'text-[#7A5665]'} />
      ))}
    </div>
  )
}

export default function AvaliacoesPage() {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const submitReply = (id: string) => {
    if (!replyText.trim()) return
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, reply: replyText } : r))
    setReplyingTo(null)
    setReplyText('')
  }

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
  const dist = [5, 4, 3, 2, 1].map((n) => ({
    n,
    count: reviews.filter((r) => r.rating === n).length,
    pct: Math.round((reviews.filter((r) => r.rating === n).length / reviews.length) * 100),
  }))

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white mb-1">
          Minhas <span className="italic text-[#E91E8C]">Avaliações</span>
        </h1>
        <p className="text-sm text-[#7A5665]">{reviews.length} avaliações recebidas</p>
      </div>

      {/* Summary */}
      <div className="card p-6 mb-6 flex flex-col md:flex-row items-center gap-6">
        <div className="text-center shrink-0">
          <p className="font-display text-5xl font-black text-white">{avg}</p>
          <Stars rating={Math.round(Number(avg))} />
          <p className="text-xs text-[#7A5665] mt-1">{reviews.length} avaliações</p>
        </div>
        <div className="flex-1 w-full space-y-2">
          {dist.map((d) => (
            <div key={d.n} className="flex items-center gap-2">
              <span className="text-xs text-[#BFA0AB] w-6 text-right">{d.n}</span>
              <Star size={10} className="fill-[#E8B84B] text-[#E8B84B] shrink-0" />
              <div className="flex-1 bg-[#201519] rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-[#E8B84B]"
                  style={{ width: `${d.pct}%` }}
                />
              </div>
              <span className="text-xs text-[#7A5665] w-8">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[rgba(233,30,140,0.15)] flex items-center justify-center text-[#E91E8C] font-bold text-sm">
                  {review.userName[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-[#F8F0F4] text-sm">{review.userName}</p>
                  <p className="text-xs text-[#7A5665]">{review.createdAt}</p>
                </div>
              </div>
              <Stars rating={review.rating} />
            </div>

            <p className="text-sm text-[#BFA0AB] leading-relaxed mb-3">{review.comment}</p>

            <div className="flex items-center gap-1 text-xs text-[#7A5665] mb-3">
              <ThumbsUp size={11} />
              {review.helpfulCount} acharam útil
            </div>

            {review.reply ? (
              <div className="p-3 rounded bg-[rgba(233,30,140,0.06)] border border-[rgba(233,30,140,0.12)]">
                <p className="text-xs font-semibold text-[#E91E8C] mb-1">Sua resposta</p>
                <p className="text-xs text-[#BFA0AB]">{review.reply}</p>
                <button
                  onClick={() => { setReplyingTo(review.id); setReplyText(review.reply ?? '') }}
                  className="text-xs text-[#7A5665] hover:text-[#E91E8C] mt-2 flex items-center gap-1 transition-colors"
                >
                  <ChevronDown size={10} /> Editar resposta
                </button>
              </div>
            ) : (
              <button
                onClick={() => setReplyingTo(review.id === replyingTo ? null : review.id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#E91E8C] hover:underline"
              >
                <MessageSquare size={12} />
                {replyingTo === review.id ? (
                  <><ChevronUp size={10} /> Cancelar</>
                ) : (
                  'Responder avaliação'
                )}
              </button>
            )}

            {replyingTo === review.id && (
              <div className={cn('mt-3 space-y-2', review.reply && 'mt-2')}>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                  className="input-field resize-none text-sm"
                  placeholder="Escreva sua resposta..."
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setReplyingTo(null)} className="btn-secondary text-xs px-3 py-1.5">Cancelar</button>
                  <button
                    onClick={() => submitReply(review.id)}
                    disabled={!replyText.trim()}
                    className="btn-primary text-xs px-3 py-1.5 disabled:opacity-50"
                  >
                    Publicar resposta
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
