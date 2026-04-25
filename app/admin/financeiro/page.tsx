'use client'

import { useState } from 'react'
import { DollarSign, TrendingUp, Clock, Download, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = 'receita' | 'saques'

interface Withdrawal {
  id: string
  modelName: string
  amount: number
  pixKey: string
  requestedAt: string
  status: 'PENDING' | 'PAID' | 'REJECTED'
}

const WITHDRAWALS: Withdrawal[] = [
  { id: '1', modelName: 'Valentina Silva', amount: 200, pixKey: 'valentina@email.com', requestedAt: '25/04/2026 08:30', status: 'PENDING' },
  { id: '2', modelName: 'Bruna Lima', amount: 350, pixKey: '11999888777', requestedAt: '25/04/2026 07:15', status: 'PENDING' },
  { id: '3', modelName: 'Isabelle Costa', amount: 150, pixKey: 'isabelle@email.com', requestedAt: '24/04/2026 22:00', status: 'PAID' },
  { id: '4', modelName: 'Larissa Mendes', amount: 80, pixKey: '21988777666', requestedAt: '24/04/2026 18:45', status: 'PAID' },
  { id: '5', modelName: 'Amanda Rocha', amount: 500, pixKey: 'amanda@email.com', requestedAt: '23/04/2026 14:20', status: 'REJECTED' },
]

const CHART_MONTHS = ['Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr']
const CHART_VALUES = [4200, 5800, 6100, 7300, 6800, 9200]

export default function AdminFinanceiroPage() {
  const [tab, setTab] = useState<Tab>('receita')
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(WITHDRAWALS)

  const pending = withdrawals.filter((w) => w.status === 'PENDING')
  const totalPending = pending.reduce((s, w) => s + w.amount, 0)

  const updateStatus = (id: string, status: 'PAID' | 'REJECTED') => {
    setWithdrawals((prev) => prev.map((w) => w.id === id ? { ...w, status } : w))
  }

  const exportCSV = () => {
    const header = 'Modelo,Valor,Chave Pix,Data,Status'
    const rows = withdrawals.map((w) =>
      `${w.modelName},${w.amount},${w.pixKey},${w.requestedAt},${w.status}`
    )
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'saques.csv'
    a.click()
  }

  const maxVal = Math.max(...CHART_VALUES)

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Financeiro <span className="italic text-[#E91E8C]">Admin</span>
          </h1>
          <p className="text-sm text-[#7A5665]">Visão geral da receita e saques</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded text-sm font-semibold bg-[#201519] border border-[rgba(255,255,255,0.08)] text-[#BFA0AB] hover:text-white hover:border-[rgba(233,30,140,0.3)] transition-all"
        >
          <Download size={14} />
          Exportar CSV
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Receita mensal', value: 'R$ 9.200', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Saques pendentes', value: `R$ ${totalPending}`, icon: Clock, color: 'text-[#E8B84B]', bg: 'bg-[rgba(232,184,75,0.12)]' },
          { label: 'Total acumulado', value: 'R$ 39.400', icon: DollarSign, color: 'text-[#E91E8C]', bg: 'bg-[rgba(233,30,140,0.12)]' },
          { label: 'Saques este mês', value: 'R$ 1.280', icon: CheckCircle, color: 'text-[#BFA0AB]', bg: 'bg-[#201519]' },
        ].map((m) => (
          <div key={m.label} className="card p-5">
            <div className={`w-10 h-10 rounded ${m.bg} flex items-center justify-center mb-3`}>
              <m.icon size={18} className={m.color} />
            </div>
            <p className="font-display text-xl font-black text-white">{m.value}</p>
            <p className="text-xs text-[#7A5665] mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-[#201519] rounded border border-[rgba(255,255,255,0.06)] w-fit">
        {([
          { value: 'receita', label: 'Receita' },
          { value: 'saques', label: `Saques (${pending.length} pendentes)` },
        ] as const).map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              'px-4 py-2 rounded text-sm font-semibold transition-all',
              tab === t.value ? 'bg-[#E91E8C] text-white' : 'text-[#BFA0AB] hover:text-white'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'receita' && (
        <div className="card p-6">
          <h2 className="font-semibold text-[#F8F0F4] mb-5">Receita mensal (R$)</h2>
          <div className="flex items-end gap-3 h-40">
            {CHART_VALUES.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs text-[#7A5665]">
                  {(val / 1000).toFixed(1)}k
                </span>
                <div
                  className="w-full rounded-t transition-all duration-500 hover:opacity-80"
                  style={{
                    height: `${(val / maxVal) * 100}%`,
                    background: i === CHART_VALUES.length - 1
                      ? 'linear-gradient(180deg, #E91E8C, rgba(233,30,140,0.4))'
                      : 'linear-gradient(180deg, rgba(233,30,140,0.5), rgba(233,30,140,0.15))',
                  }}
                />
                <span className="text-xs text-[#7A5665]">{CHART_MONTHS[i]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'saques' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)]">
                  {['Modelo', 'Valor', 'Chave Pix', 'Solicitado em', 'Status', 'Ações'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#7A5665] uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-[rgba(233,30,140,0.03)] transition-colors">
                    <td className="px-4 py-3 font-medium text-[#F8F0F4]">{w.modelName}</td>
                    <td className="px-4 py-3 font-semibold text-green-400">R$ {w.amount}</td>
                    <td className="px-4 py-3 text-[#BFA0AB] font-mono text-xs">{w.pixKey}</td>
                    <td className="px-4 py-3 text-[#7A5665]">{w.requestedAt}</td>
                    <td className="px-4 py-3">
                      <span className={cn('badge', {
                        'badge-green': w.status === 'PAID',
                        'bg-[rgba(232,184,75,0.1)] text-[#E8B84B] border-[rgba(232,184,75,0.2)]': w.status === 'PENDING',
                        'bg-red-500/10 text-red-400 border-red-500/20': w.status === 'REJECTED',
                      })}>
                        {w.status === 'PAID' ? 'Pago' : w.status === 'PENDING' ? 'Pendente' : 'Rejeitado'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {w.status === 'PENDING' && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateStatus(w.id, 'PAID')}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25 transition-all"
                          >
                            <CheckCircle size={11} /> Pagar
                          </button>
                          <button
                            onClick={() => updateStatus(w.id, 'REJECTED')}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                          >
                            <XCircle size={11} /> Rejeitar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
