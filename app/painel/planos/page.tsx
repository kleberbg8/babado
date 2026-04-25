import { Check, Crown, Zap, Star, Sparkles } from 'lucide-react'

const PLANS = [
  {
    type: 'FREE',
    name: 'Básico',
    price: 0,
    icon: Zap,
    color: 'text-[#7A5665]',
    border: 'border-[rgba(255,255,255,0.08)]',
    badge: null,
    features: [
      'Perfil público',
      '5 fotos',
      'Aparece nas buscas',
      'Avaliações',
      'WhatsApp link',
    ],
    missing: ['Destaque na home', 'Stories', 'Badge especial', 'Topo das buscas'],
  },
  {
    type: 'SILVER',
    name: 'Silver',
    price: 49,
    icon: Star,
    color: 'text-[#C0C0C0]',
    border: 'border-[rgba(192,192,192,0.25)]',
    badge: null,
    features: [
      'Tudo do Básico',
      '15 fotos',
      'Destaque nas buscas',
      'Badge Silver',
      'Estatísticas básicas',
    ],
    missing: ['Destaque na home', 'Stories', 'Topo das buscas'],
  },
  {
    type: 'GOLD',
    name: 'Gold',
    price: 99,
    icon: Crown,
    color: 'text-[#E8B84B]',
    border: 'border-[rgba(232,184,75,0.3)]',
    badge: 'Mais popular',
    features: [
      'Tudo do Silver',
      '30 fotos + 5 vídeos',
      'Destaque na home',
      'Stories (24h)',
      'Badge Gold ✦',
      'Estatísticas avançadas',
    ],
    missing: ['Topo das buscas'],
  },
  {
    type: 'ELITE',
    name: 'Elite',
    price: 199,
    icon: Sparkles,
    color: 'text-[#E91E8C]',
    border: 'border-[rgba(233,30,140,0.35)]',
    badge: 'Premium máximo',
    features: [
      'Tudo do Gold',
      'Fotos ilimitadas',
      'Topo das buscas garantido',
      'Badge Elite especial',
      'Suporte prioritário',
      'API WhatsApp automático',
      'Relatórios completos',
    ],
    missing: [],
  },
]

export default function PlanosPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white mb-1">
          Planos & <span className="italic text-[#E91E8C]">Assinaturas</span>
        </h1>
        <p className="text-sm text-[#7A5665]">Plano atual: <span className="text-[#E8B84B] font-semibold">Elite</span> — Vence em 28 dias</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {PLANS.map((plan) => {
          const Icon = plan.icon
          const isCurrent = plan.type === 'ELITE'

          return (
            <div
              key={plan.type}
              className={`relative card flex flex-col p-6 border-2 transition-all ${plan.border} ${isCurrent ? 'ring-1 ring-[rgba(233,30,140,0.3)]' : ''}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${plan.type === 'ELITE' ? 'bg-[#E91E8C] border-[#E91E8C] text-white' : 'bg-[rgba(232,184,75,0.15)] border-[#E8B84B] text-[#E8B84B]'}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <Icon size={20} className={plan.color} />
                <span className={`font-bold text-lg ${plan.color}`}>{plan.name}</span>
              </div>

              <div className="mb-5">
                {plan.price === 0 ? (
                  <span className="font-display text-3xl font-black text-white">Grátis</span>
                ) : (
                  <div>
                    <span className="font-display text-3xl font-black text-white">R${plan.price}</span>
                    <span className="text-sm text-[#7A5665]">/mês</span>
                  </div>
                )}
              </div>

              <ul className="space-y-2 flex-1 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#BFA0AB]">
                    <Check size={13} className="text-green-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#7A5665] line-through">
                    <span className="w-3.5 h-3.5 shrink-0 mt-0.5 flex items-center justify-center">–</span>
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full py-2.5 text-center rounded-sm text-sm font-semibold bg-[rgba(233,30,140,0.1)] text-[#E91E8C] border border-[rgba(233,30,140,0.2)]">
                  ✓ Plano atual
                </div>
              ) : (
                <button className="btn-primary w-full py-2.5 text-sm">
                  {plan.price === 0 ? 'Fazer downgrade' : `Assinar ${plan.name}`}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 rounded bg-[#201519] border border-[rgba(255,255,255,0.06)]">
        <p className="text-xs text-[#7A5665] text-center">
          Pagamentos via PIX ou cartão de crédito · Cancele a qualquer momento · Sem fidelidade
        </p>
      </div>
    </div>
  )
}
