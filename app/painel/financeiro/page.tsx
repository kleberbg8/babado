'use client'

import { useState } from 'react'
import { DollarSign, TrendingUp, ArrowDownRight, ArrowUpRight, Wallet, Clock, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = 'historico' | 'saque'

interface Transaction {
  id: string
  type: 'credit' | 'debit'
  description: string
  amount: number
  date: string
  status: 'PAID' | 'PENDING' | 'CANCELLED'
}

const TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'credit', description: 'Renovação plano Gold', amount: 299.9, date: '25/04/2026', status: 'PAID' },
  { id: '2', type: 'debit', description: 'Saque solicitado', amount: -200, date: '22/04/2026', status: 'PAID' },
  { id: '3', type: 'credit', description: 'Destaque no ranking — Abril', amount: 50, date: '20/04/2026', status: 'PAID' },
  { id: '4', type: 'credit', description: 'Bônus de indicação — Bruna M.', amount: 25, date: '18/04/2026', status: 'PAID' },
  { id: '5', type: 'debit', description: 'Saque solicitado', amount: -150, date: '15/04/2026', status: 'PENDING' },
  { id: '6', type: 'credit', description: 'Renovação plano Gold', amount: 299.9, date: '25/03/2026', status: 'PAID' },
]

const STATUS_MAP: Record<string, { icon: typeof CheckCircle; className: string; label: string }> = {
  PAID: { icon: CheckCircle, className: 'text-green-400', label: 'Pago' },
  PENDING: { icon: Clock, className: 'text-[#E8B84B]', label: 'Pendente' },
  CANCELLED: { icon: XCircle, className: 'text-red-400', label: 'Cancelado' },
}

export default function FinanceiroPage() {
  const [tab, setTab] = useState<Tab>('historico')
  const [pixKey, setPixKey] = useState('')
  const [amount, setAmount] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const balance = 324.90
  const totalEarned = 1248.70
  const pending = 150

  const handleWithdraw = async () => {
    await new Promise((r) => setTimeout(r, 800))
    setSubmitted(true)
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white mb-1">
          Meu <span className="italic text-[#E91E8C]">Financeiro</span>
        </h1>
        <p className="text-sm text-[#7A5665]">Acompanhe seu saldo e movimentações</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Saldo disponível', value: `R$ ${balance.toFixed(2).replace('.', ',')}`, icon: Wallet, color: 'text-[#E91E8C]', bg: 'bg-[rgba(233,30,140,0.12)]', highlight: true },
          { label: 'Total ganho', value: `R$ ${totalEarned.toFixed(2).replace('.', ',')}`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10', highlight: false },
          { label: 'Saques pendentes', value: `R$ ${pending.toFixed(2).replace('.', ',')}`, icon: Clock, color: 'text-[#E8B84B]', bg: 'bg-[rgba(232,184,75,0.12)]', highlight: false },
        ].map((m) => (
          <div key={m.label} className={cn('card p-5', m.highlight && 'border-[rgba(233,30,140,0.2)]')}>
            <div className={`w-10 h-10 rounded ${m.bg} flex items-center justify-center mb-3`}>
              <m.icon size={18} className={m.color} />
            </div>
            <p className={cn('font-display text-xl font-black', m.highlight ? 'text-[#E91E8C]' : 'text-white')}>{m.value}</p>
            <p className="text-xs text-[#7A5665] mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-[#201519] rounded-sm border border-[rgba(255,255,255,0.06)] w-fit">
        {([
          { value: 'historico', label: 'Histórico' },
          { value: 'saque', label: 'Solicitar Saque' },
        ] as const).map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              'px-4 py-2 rounded text-sm font-semibold transition-all',
              tab === t.value
                ? 'bg-[#E91E8C] text-white'
                : 'text-[#BFA0AB] hover:text-white'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'historico' && (
        <div className="card divide-y divide-[rgba(255,255,255,0.04)]">
          {TRANSACTIONS.map((tx) => {
            const S = STATUS_MAP[tx.status]
            const StatusIcon = S.icon
            return (
              <div key={tx.id} className="flex items-center gap-4 p-4">
                <div className={cn(
                  'w-9 h-9 rounded shrink-0 flex items-center justify-center',
                  tx.type === 'credit' ? 'bg-green-500/10' : 'bg-[rgba(233,30,140,0.1)]'
                )}>
                  {tx.type === 'credit'
                    ? <ArrowDownRight size={16} className="text-green-400" />
                    : <ArrowUpRight size={16} className="text-[#E91E8C]" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#F8F0F4] truncate">{tx.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-[#7A5665]">{tx.date}</p>
                    <span className={cn('flex items-center gap-1 text-xs', S.className)}>
                      <StatusIcon size={10} />
                      {S.label}
                    </span>
                  </div>
                </div>
                <span className={cn('font-semibold text-sm', tx.type === 'credit' ? 'text-green-400' : 'text-[#E91E8C]')}>
                  {tx.type === 'credit' ? '+' : ''}R$ {Math.abs(tx.amount).toFixed(2).replace('.', ',')}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'saque' && (
        <div className="card p-6">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
              <h3 className="font-display text-lg font-bold text-white mb-2">Saque solicitado!</h3>
              <p className="text-sm text-[#BFA0AB]">Seu saque será processado em até 2 dias úteis via Pix.</p>
              <button onClick={() => { setSubmitted(false); setAmount(''); setPixKey('') }} className="btn-secondary mt-4 px-6 py-2.5 text-sm">
                Nova solicitação
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="p-4 rounded bg-[rgba(233,30,140,0.06)] border border-[rgba(233,30,140,0.15)]">
                <p className="text-xs text-[#BFA0AB]">Saldo disponível para saque</p>
                <p className="font-display text-2xl font-black text-[#E91E8C] mt-1">
                  R$ {balance.toFixed(2).replace('.', ',')}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">
                  Valor do saque (R$)
                </label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5665]" />
                  <input
                    type="number"
                    min={50}
                    max={balance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Mínimo R$ 50,00"
                    className="input-field pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">
                  Chave Pix
                </label>
                <input
                  type="text"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder="CPF, e-mail, telefone ou chave aleatória"
                  className="input-field"
                />
              </div>

              <div className="p-3 rounded bg-[#201519] border border-[rgba(255,255,255,0.06)]">
                <p className="text-xs text-[#7A5665] leading-relaxed">
                  Saques são processados em até 2 dias úteis. Valor mínimo: R$ 50,00. Taxa: R$ 0,00.
                </p>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={!amount || !pixKey || Number(amount) < 50 || Number(amount) > balance}
                className="btn-primary w-full py-3.5 disabled:opacity-50"
              >
                Solicitar saque
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
