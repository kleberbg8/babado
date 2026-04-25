import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ModelCard from '@/components/ui/ModelCard'
import type { ModelCard as ModelCardType } from '@/types'

interface NewModelsProps {
  models: ModelCardType[]
}

export default function NewModels({ models }: NewModelsProps) {
  return (
    <section className="py-12 border-t border-[rgba(233,30,140,0.08)]">
      <div className="max-content">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-[#E91E8C] uppercase tracking-widest mb-2 animate-pulse-slow">● Nova</p>
            <h2 className="section-title">
              Cadastros <span>Recentes</span>
            </h2>
          </div>
          <Link
            href="/acompanhantes?ordem=recentes"
            className="hidden sm:flex items-center gap-1.5 text-sm text-[#BFA0AB] hover:text-[#E91E8C] transition-colors"
          >
            Ver todas
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {models.map((model) => (
            <ModelCard key={model.id} model={{ ...model, isNew: true }} />
          ))}
        </div>
      </div>
    </section>
  )
}
