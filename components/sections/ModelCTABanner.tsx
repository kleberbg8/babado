import Link from 'next/link'
import { Check, Star, TrendingUp, Shield, DollarSign } from 'lucide-react'

const BENEFITS = [
  { icon: Shield, text: 'Perfil 100% verificado e seguro' },
  { icon: TrendingUp, text: 'Apareça para milhares de visitantes' },
  { icon: Star, text: 'Sistema de avaliações e destaque' },
  { icon: DollarSign, text: 'Controle total dos seus preços' },
]

export default function ModelCTABanner() {
  return (
    <section className="py-16 border-t border-[rgba(233,30,140,0.08)]">
      <div className="max-content">
        <div className="relative rounded-xl overflow-hidden border border-[rgba(233,30,140,0.2)] bg-[#130E11]">
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[rgba(233,30,140,0.08)] blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[rgba(232,184,75,0.05)] blur-2xl pointer-events-none" />

          <div className="relative p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(233,30,140,0.1)] border border-[rgba(233,30,140,0.2)] mb-5">
                  <span className="text-[#E91E8C] text-xs font-semibold">Para Modelos</span>
                </div>

                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
                  Seja uma modelo{' '}
                  <span className="italic text-[#E91E8C]">Gatas do Babado</span>
                </h2>
                <p className="text-[#BFA0AB] mb-8">
                  Cadastre seu perfil gratuitamente e alcance milhares de clientes em todo o Brasil.
                  Verificação de documentos, fotos reais e visibilidade máxima.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/cadastrar" className="btn-primary text-base py-3.5">
                    Cadastrar meu perfil
                  </Link>
                  <Link href="/planos" className="btn-secondary text-base py-3.5">
                    Ver planos premium
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {BENEFITS.map((b, i) => {
                  const Icon = b.icon
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded bg-[#201519] border border-[rgba(233,30,140,0.1)]">
                      <div className="w-8 h-8 rounded bg-[rgba(233,30,140,0.12)] flex items-center justify-center shrink-0">
                        <Icon size={14} className="text-[#E91E8C]" />
                      </div>
                      <span className="text-sm text-[#BFA0AB]">{b.text}</span>
                      <Check size={14} className="ml-auto text-green-400 shrink-0" />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
