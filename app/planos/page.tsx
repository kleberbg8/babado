import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CheckCircle, XCircle, Star, Zap, Crown, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Plan {
  id: string
  name: string
  price: number
  priceYearly?: number
  badge?: string
  icon: typeof Star
  iconColor: string
  cardClass: string
  features: { label: string; included: boolean }[]
  cta: string
  ctaClass: string
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'FREE',
    price: 0,
    icon: Star,
    iconColor: 'text-[#7A5665]',
    cardClass: '',
    cta: 'Começar grátis',
    ctaClass: 'btn-secondary',
    features: [
      { label: '5 fotos no perfil', included: true },
      { label: 'Perfil público básico', included: true },
      { label: 'Aparece nas buscas', included: true },
      { label: 'WhatsApp no perfil', included: false },
      { label: 'Stories', included: false },
      { label: 'Destaque nas buscas', included: false },
      { label: 'Badge verificada', included: false },
      { label: 'Analytics avançado', included: false },
      { label: 'Fotos premium (desbloqueadas)', included: false },
      { label: 'Suporte prioritário', included: false },
    ],
  },
  {
    id: 'silver',
    name: 'SILVER',
    price: 99.90,
    icon: Zap,
    iconColor: 'text-[#BFA0AB]',
    cardClass: 'border-[rgba(191,160,171,0.25)]',
    cta: 'Assinar Silver',
    ctaClass: 'btn-secondary',
    features: [
      { label: '15 fotos no perfil', included: true },
      { label: 'Perfil público completo', included: true },
      { label: 'Aparece nas buscas', included: true },
      { label: 'WhatsApp no perfil', included: true },
      { label: 'Stories (5/mês)', included: true },
      { label: 'Destaque nas buscas', included: false },
      { label: 'Badge verificada', included: false },
      { label: 'Analytics avançado', included: false },
      { label: 'Fotos premium (desbloqueadas)', included: false },
      { label: 'Suporte prioritário', included: false },
    ],
  },
  {
    id: 'gold',
    name: 'GOLD',
    price: 199.90,
    badge: 'Mais popular',
    icon: Crown,
    iconColor: 'text-[#E8B84B]',
    cardClass: 'border-[rgba(232,184,75,0.3)] shadow-[0_0_30px_rgba(232,184,75,0.08)]',
    cta: 'Assinar Gold',
    ctaClass: 'bg-[#E8B84B] hover:bg-[#F5C842] text-black font-bold px-6 py-3 rounded text-sm transition-all',
    features: [
      { label: '30 fotos no perfil', included: true },
      { label: 'Perfil público completo', included: true },
      { label: 'Aparece nas buscas', included: true },
      { label: 'WhatsApp no perfil', included: true },
      { label: 'Stories ilimitados', included: true },
      { label: 'Destaque nas buscas', included: true },
      { label: 'Badge verificada', included: true },
      { label: 'Analytics avançado', included: true },
      { label: 'Fotos premium (desbloqueadas)', included: false },
      { label: 'Suporte prioritário', included: false },
    ],
  },
  {
    id: 'elite',
    name: 'ELITE',
    price: 349.90,
    badge: 'Tudo incluso',
    icon: Sparkles,
    iconColor: 'text-[#E91E8C]',
    cardClass: 'border-[rgba(233,30,140,0.3)] shadow-[0_0_40px_rgba(233,30,140,0.1)]',
    cta: 'Assinar Elite',
    ctaClass: 'btn-primary',
    features: [
      { label: 'Fotos ilimitadas', included: true },
      { label: 'Perfil público completo', included: true },
      { label: 'Aparece nas buscas', included: true },
      { label: 'WhatsApp no perfil', included: true },
      { label: 'Stories ilimitados', included: true },
      { label: 'Destaque máximo nas buscas', included: true },
      { label: 'Badge verificada', included: true },
      { label: 'Analytics avançado', included: true },
      { label: 'Fotos premium (desbloqueadas)', included: true },
      { label: 'Suporte prioritário', included: true },
    ],
  },
]

export default function PlanosPage() {
  return (
    <>
      <div className="page-bar" />
      <Navbar />
      <main className="pt-20 pb-20">
        {/* Header */}
        <div className="max-content mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(233,30,140,0.1)] border border-[rgba(233,30,140,0.2)] mb-4">
            <Crown size={14} className="text-[#E91E8C]" />
            <span className="text-sm font-semibold text-[#E91E8C]">Planos Premium</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-3">
            Escolha seu <span className="italic text-[#E91E8C]">plano</span>
          </h1>
          <p className="text-[#7A5665] max-w-lg mx-auto">
            Aumente sua visibilidade e conquiste mais clientes com os planos premium do Gatas do Babado.
          </p>
        </div>

        {/* Plans grid */}
        <div className="max-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLANS.map((plan) => {
              const Icon = plan.icon
              return (
                <div
                  key={plan.id}
                  className={cn('card p-6 flex flex-col relative', plan.cardClass)}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className={cn(
                        'px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap',
                        plan.id === 'elite'
                          ? 'bg-[#E91E8C] text-white'
                          : 'bg-[#E8B84B] text-black'
                      )}>
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className={cn('w-10 h-10 rounded flex items-center justify-center mb-4', {
                    'bg-[#201519]': plan.id === 'free',
                    'bg-[rgba(191,160,171,0.1)]': plan.id === 'silver',
                    'bg-[rgba(232,184,75,0.12)]': plan.id === 'gold',
                    'bg-[rgba(233,30,140,0.12)]': plan.id === 'elite',
                  })}>
                    <Icon size={20} className={plan.iconColor} />
                  </div>

                  <h3 className="font-display text-lg font-bold text-white mb-1">{plan.name}</h3>

                  <div className="mb-5">
                    {plan.price === 0 ? (
                      <span className="font-display text-3xl font-black text-white">Grátis</span>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm text-[#7A5665]">R$</span>
                          <span className="font-display text-3xl font-black text-white">
                            {plan.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                        <p className="text-xs text-[#7A5665]">/mês</p>
                      </>
                    )}
                  </div>

                  <ul className="space-y-2.5 flex-1 mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        {f.included ? (
                          <CheckCircle size={14} className="text-green-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle size={14} className="text-[#7A5665] shrink-0 mt-0.5 opacity-40" />
                        )}
                        <span className={cn('text-xs leading-snug', f.included ? 'text-[#BFA0AB]' : 'text-[#7A5665] opacity-40')}>
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/cadastrar" className={cn('w-full text-center', plan.ctaClass)}>
                    {plan.cta}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-content mt-16 max-w-2xl mx-auto">
          <h2 className="section-title text-center mb-8">
            Perguntas <span className="italic text-[#E91E8C]">frequentes</span>
          </h2>
          <div className="space-y-4">
            {[
              { q: 'Posso cancelar a qualquer momento?', a: 'Sim! Você pode cancelar sua assinatura a qualquer momento. Ela continuará ativa até o fim do período pago.' },
              { q: 'Como funciona o pagamento?', a: 'Aceitamos Pix, cartão de crédito e débito. O pagamento é processado de forma segura pelo Mercado Pago.' },
              { q: 'As fotos são aprovadas automaticamente?', a: 'Não. Toda foto passa por moderação humana em até 24h para garantir a segurança e qualidade do portal.' },
              { q: 'Posso mudar de plano depois?', a: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento pelo painel.' },
            ].map((faq, i) => (
              <div key={i} className="card p-5">
                <p className="font-semibold text-[#F8F0F4] text-sm mb-2">{faq.q}</p>
                <p className="text-sm text-[#7A5665] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
