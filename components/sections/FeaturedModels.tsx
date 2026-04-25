import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ModelCard from '@/components/ui/ModelCard'
import type { ModelCard as ModelCardType } from '@/types'

interface FeaturedModelsProps {
  models: ModelCardType[]
}

export default function FeaturedModels({ models }: FeaturedModelsProps) {
  return (
    <section className="py-12 border-t border-[rgba(233,30,140,0.08)]">
      <div className="max-content">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-[#E91E8C] uppercase tracking-widest mb-2">✦ Destaque</p>
            <h2 className="section-title">
              Destaques da <span>Semana</span>
            </h2>
          </div>
          <Link
            href="/acompanhantes?ordem=destaque"
            className="hidden sm:flex items-center gap-1.5 text-sm text-[#BFA0AB] hover:text-[#E91E8C] transition-colors"
          >
            Ver todas
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {models.map((model, i) => (
            <ModelCard key={model.id} model={model} priority={i < 2} />
          ))}
        </div>

        <div className="mt-6 sm:hidden text-center">
          <Link href="/acompanhantes?ordem=destaque" className="btn-secondary text-sm">
            Ver todas as destaques
          </Link>
        </div>
      </div>
    </section>
  )
}
