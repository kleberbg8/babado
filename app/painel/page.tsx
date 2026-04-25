import { Eye, Heart, Star, TrendingUp, ArrowUpRight, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'

const METRICS = [
  { label: 'Visualizações hoje', value: '248', delta: '+12%', icon: Eye, color: 'text-[#E91E8C]', bg: 'bg-[rgba(233,30,140,0.12)]' },
  { label: 'Contatos recebidos', value: '17', delta: '+5', icon: TrendingUp, color: 'text-[#E8B84B]', bg: 'bg-[rgba(232,184,75,0.12)]' },
  { label: 'Favoritos', value: '312', delta: '+8', icon: Heart, color: 'text-red-400', bg: 'bg-[rgba(248,113,113,0.12)]' },
  { label: 'Nota média', value: '4.9', delta: '★★★★★', icon: Star, color: 'text-[#E8B84B]', bg: 'bg-[rgba(232,184,75,0.12)]' },
]

const ACTIVITIES = [
  { type: 'view', text: 'Novo visitante viu seu perfil', time: '2 min atrás', icon: Eye },
  { type: 'review', text: 'Nova avaliação 5★ publicada', time: '1h atrás', icon: Star },
  { type: 'favorite', text: 'Alguém favoritou seu perfil', time: '2h atrás', icon: Heart },
  { type: 'view', text: 'Seu perfil apareceu em 45 buscas', time: '3h atrás', icon: TrendingUp },
]

const CHART_DATA = [40, 65, 48, 72, 90, 55, 80, 95, 70, 88, 60, 75, 100, 82]

export default function PainelDashboard() {
  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white mb-1">
          Olá, <span className="italic text-[#E91E8C]">Valentina</span> 👋
        </h1>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-sm text-[#BFA0AB]">
            <CheckCircle size={13} className="text-green-400" />
            Perfil ativo
          </span>
          <span className="text-[#7A5665]">·</span>
          <span className="text-sm text-[#E8B84B] font-semibold">Plano Elite</span>
          <span className="text-[#7A5665]">·</span>
          <span className="text-sm text-[#7A5665]">Vence em 28 dias</span>
        </div>
      </div>

      {/* Status Alert */}
      <div className="flex items-center gap-3 p-4 rounded bg-[rgba(232,184,75,0.08)] border border-[rgba(232,184,75,0.2)] mb-6">
        <Clock size={16} className="text-[#E8B84B] shrink-0" />
        <p className="text-sm text-[#BFA0AB]">
          Você tem <span className="font-semibold text-[#E8B84B]">3 fotos</span> aguardando aprovação da moderação.
        </p>
        <Link href="/painel/fotos" className="ml-auto text-xs font-semibold text-[#E8B84B] hover:underline shrink-0">
          Ver fotos
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {METRICS.map((m) => {
          const Icon = m.icon
          return (
            <div key={m.label} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded ${m.bg} flex items-center justify-center`}>
                  <Icon size={18} className={m.color} />
                </div>
                <span className="text-xs text-green-400 font-semibold">{m.delta}</span>
              </div>
              <p className="font-display text-2xl font-black text-white mb-0.5">{m.value}</p>
              <p className="text-xs text-[#7A5665]">{m.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[#F8F0F4]">Visualizações</h2>
            <div className="flex gap-1">
              {['7d', '30d', '90d'].map((p) => (
                <button key={p} className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${p === '7d' ? 'bg-[rgba(233,30,140,0.15)] text-[#E91E8C]' : 'text-[#7A5665] hover:text-[#BFA0AB]'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-32">
            {CHART_DATA.map((val, i) => (
              <div
                key={i}
                className="flex-1 rounded-t transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${val}%`,
                  background: `linear-gradient(180deg, #E91E8C, rgba(233,30,140,0.3))`,
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((d) => (
              <span key={d} className="text-xs text-[#7A5665]">{d}</span>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="card p-5">
          <h2 className="font-semibold text-[#F8F0F4] mb-4">Atividade Recente</h2>
          <div className="space-y-3">
            {ACTIVITIES.map((a, i) => {
              const Icon = a.icon
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-[rgba(233,30,140,0.1)] flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-[#E91E8C]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#BFA0AB]">{a.text}</p>
                    <p className="text-xs text-[#7A5665] mt-0.5">{a.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          { href: '/painel/fotos', label: 'Adicionar fotos', color: 'text-[#E91E8C]' },
          { href: '/painel/stories', label: 'Criar story', color: 'text-[#E8B84B]' },
          { href: '/painel/agenda', label: 'Atualizar agenda', color: 'text-green-400' },
          { href: '/painel/planos', label: 'Upgrade de plano', color: 'text-[#BFA0AB]' },
        ].map((a) => (
          <Link key={a.href} href={a.href} className="card p-4 flex items-center justify-between hover:border-[#E91E8C] transition-all group">
            <span className="text-sm font-medium text-[#BFA0AB] group-hover:text-white transition-colors">{a.label}</span>
            <ArrowUpRight size={14} className={a.color} />
          </Link>
        ))}
      </div>
    </div>
  )
}
