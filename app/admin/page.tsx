import { Users, Clock, DollarSign, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

const METRICS = [
  { label: 'Novos cadastros hoje', value: '23', delta: '+4 vs ontem', icon: Users, color: 'text-[#E91E8C]', bg: 'bg-[rgba(233,30,140,0.12)]' },
  { label: 'Pendentes aprovação', value: '8', delta: 'Mais antigo: 18h', icon: Clock, color: 'text-[#E8B84B]', bg: 'bg-[rgba(232,184,75,0.12)]', alert: true },
  { label: 'Faturamento hoje', value: 'R$1.840', delta: '+12% vs ontem', icon: DollarSign, color: 'text-green-400', bg: 'bg-[rgba(34,197,94,0.12)]' },
  { label: 'Modelos ativas', value: '3.847', delta: '+17 esta semana', icon: TrendingUp, color: 'text-[#BFA0AB]', bg: 'bg-[rgba(255,255,255,0.08)]' },
]

const PENDING_PROFILES = [
  { id: '1', name: 'Jessica Lima', city: 'São Paulo, SP', submittedAt: '18h atrás', hasDoc: true },
  { id: '2', name: 'Rafaela Costa', city: 'Rio de Janeiro, RJ', submittedAt: '12h atrás', hasDoc: true },
  { id: '3', name: 'Bruna Martins', city: 'Curitiba, PR', submittedAt: '6h atrás', hasDoc: false },
]

const RECENT_ACTIONS = [
  { action: 'Aprovado', target: 'Perfil Valentina Souza', admin: 'Admin', time: '10 min atrás', type: 'approve' },
  { action: 'Rejeitado', target: 'Foto ID:m_892', admin: 'Moderador1', time: '22 min atrás', type: 'reject' },
  { action: 'Suspenso', target: 'Perfil XYZ (spam)', admin: 'Admin', time: '1h atrás', type: 'suspend' },
  { action: 'Aprovado', target: 'Perfil Camila Santos', admin: 'Moderador2', time: '2h atrás', type: 'approve' },
]

const REVENUE_BARS = [65, 80, 55, 90, 72, 88, 95]
const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

export default function AdminDashboard() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white mb-1">
          Dashboard <span className="italic text-[#E91E8C]">Admin</span>
        </h1>
        <p className="text-sm text-[#7A5665]">Visão geral do sistema — {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      {/* Alert */}
      <div className="flex items-center gap-3 p-4 rounded bg-[rgba(232,184,75,0.08)] border border-[rgba(232,184,75,0.2)] mb-6">
        <AlertTriangle size={16} className="text-[#E8B84B] shrink-0" />
        <p className="text-sm text-[#BFA0AB]">
          <span className="font-semibold text-[#E8B84B]">8 perfis</span> aguardando aprovação — O mais antigo foi enviado há 18 horas.
        </p>
        <Link href="/admin/aprovacoes" className="ml-auto text-xs font-semibold text-[#E8B84B] hover:underline shrink-0">
          Revisar agora →
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {METRICS.map((m) => {
          const Icon = m.icon
          return (
            <div key={m.label} className={`card p-5 ${m.alert ? 'border-[rgba(232,184,75,0.25)]' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded ${m.bg} flex items-center justify-center`}>
                  <Icon size={18} className={m.color} />
                </div>
              </div>
              <p className="font-display text-2xl font-black text-white mb-0.5">{m.value}</p>
              <p className="text-xs text-[#7A5665] mb-0.5">{m.label}</p>
              <p className={`text-xs font-medium ${m.alert ? 'text-[#E8B84B]' : 'text-green-400'}`}>{m.delta}</p>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue chart */}
        <div className="card p-5">
          <h2 className="font-semibold text-[#F8F0F4] mb-5">Receita da Semana</h2>
          <div className="flex items-end gap-2 h-28">
            {REVENUE_BARS.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t transition-all"
                  style={{ height: `${val}%`, background: `linear-gradient(180deg, #E91E8C, rgba(233,30,140,0.3))` }}
                />
                <span className="text-xs text-[#7A5665]">{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending profiles */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#F8F0F4]">Fila de Aprovação</h2>
            <Link href="/admin/aprovacoes" className="text-xs text-[#E91E8C] hover:underline">
              Ver todas ({PENDING_PROFILES.length})
            </Link>
          </div>
          <div className="space-y-3">
            {PENDING_PROFILES.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded bg-[#2A1C22] border border-[rgba(233,30,140,0.1)]">
                <div className="w-9 h-9 rounded-full bg-[rgba(233,30,140,0.15)] flex items-center justify-center text-[#E91E8C] font-bold text-sm shrink-0">
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#F8F0F4] truncate">{p.name}</p>
                  <p className="text-xs text-[#7A5665]">{p.city} · {p.submittedAt}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button className="w-7 h-7 rounded bg-[rgba(34,197,94,0.12)] border border-green-500/20 flex items-center justify-center text-green-400 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all" aria-label="Aprovar">
                    <CheckCircle size={13} />
                  </button>
                  <button className="w-7 h-7 rounded bg-[rgba(233,30,140,0.1)] border border-[rgba(233,30,140,0.2)] flex items-center justify-center text-[#E91E8C] hover:bg-[#E91E8C] hover:text-white hover:border-[#E91E8C] transition-all" aria-label="Rejeitar">
                    <XCircle size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit log */}
      <div className="card p-5">
        <h2 className="font-semibold text-[#F8F0F4] mb-4">Ações Recentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {['Ação', 'Alvo', 'Admin', 'Data/Hora'].map((h) => (
                  <th key={h} className="text-left py-2 pr-4 text-xs font-semibold text-[#7A5665] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_ACTIONS.map((a, i) => (
                <tr key={i} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="py-3 pr-4">
                    <span className={`badge ${a.type === 'approve' ? 'badge-green' : a.type === 'reject' ? 'badge-pink' : 'bg-[rgba(232,184,75,0.1)] text-[#E8B84B] border border-[rgba(232,184,75,0.2)]'}`}>
                      {a.action}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-[#BFA0AB]">{a.target}</td>
                  <td className="py-3 pr-4 text-[#7A5665]">{a.admin}</td>
                  <td className="py-3 text-[#7A5665]">{a.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
