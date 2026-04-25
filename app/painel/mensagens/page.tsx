'use client'

import { useState } from 'react'
import { Search, MessageSquare, Phone, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  phone?: string
}

const MOCK: Conversation[] = [
  { id: '1', name: 'Carlos M.', avatar: 'C', lastMessage: 'Olá, gostaria de agendar para amanhã...', time: '14:32', unread: 2, phone: '11988887777' },
  { id: '2', name: 'Roberto S.', avatar: 'R', lastMessage: 'Perfeito! Até lá então.', time: '12:15', unread: 0, phone: '21977776666' },
  { id: '3', name: 'André L.', avatar: 'A', lastMessage: 'Qual é o seu endereço?', time: 'Ontem', unread: 1, phone: '31966665555' },
  { id: '4', name: 'Felipe T.', avatar: 'F', lastMessage: 'Obrigado pelo atendimento!', time: 'Ontem', unread: 0 },
  { id: '5', name: 'Marco P.', avatar: 'M', lastMessage: 'Você atende na zona sul?', time: 'Seg', unread: 0 },
]

const MESSAGES = [
  { from: 'them', text: 'Olá! Vi seu perfil e adorei. Gostaria de saber mais.', time: '14:20' },
  { from: 'me', text: 'Olá! Obrigada pelo contato. Como posso te ajudar?', time: '14:22' },
  { from: 'them', text: 'Gostaria de agendar um encontro para amanhã à tarde. Você tem disponibilidade?', time: '14:30' },
  { from: 'them', text: 'Olá, gostaria de agendar para amanhã...', time: '14:32' },
]

export default function MensagensPage() {
  const [selected, setSelected] = useState<string>('1')
  const [search, setSearch] = useState('')
  const [reply, setReply] = useState('')

  const filtered = MOCK.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const conv = MOCK.find((c) => c.id === selected)

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 shrink-0 border-r border-[rgba(233,30,140,0.12)] flex flex-col">
        <div className="p-4 border-b border-[rgba(233,30,140,0.12)]">
          <h1 className="font-display text-lg font-bold text-white mb-3">
            Mensagens
          </h1>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5665]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="input-field pl-9 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelected(conv.id)}
              className={cn(
                'w-full flex items-start gap-3 p-4 text-left transition-all border-b border-[rgba(255,255,255,0.04)]',
                selected === conv.id
                  ? 'bg-[rgba(233,30,140,0.08)] border-l-2 border-l-[#E91E8C]'
                  : 'hover:bg-[#201519]'
              )}
            >
              <div className="w-10 h-10 rounded-full bg-[rgba(233,30,140,0.15)] flex items-center justify-center text-[#E91E8C] font-bold shrink-0">
                {conv.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold text-[#F8F0F4] truncate">{conv.name}</span>
                  <span className="text-xs text-[#7A5665] shrink-0 ml-2">{conv.time}</span>
                </div>
                <p className="text-xs text-[#7A5665] truncate">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#E91E8C] text-white text-xs flex items-center justify-center font-bold shrink-0">
                  {conv.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {conv ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[rgba(233,30,140,0.12)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[rgba(233,30,140,0.15)] flex items-center justify-center text-[#E91E8C] font-bold text-sm">
                {conv.avatar}
              </div>
              <div>
                <p className="font-semibold text-[#F8F0F4] text-sm">{conv.name}</p>
                <p className="text-xs text-[#7A5665]">Contato via portal</p>
              </div>
            </div>
            {conv.phone && (
              <a
                href={`https://wa.me/55${conv.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded text-sm font-semibold bg-[rgba(37,211,102,0.1)] border border-[rgba(37,211,102,0.2)] text-[#25D366] hover:bg-[rgba(37,211,102,0.2)] transition-all"
              >
                <Phone size={14} />
                WhatsApp
              </a>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {MESSAGES.map((msg, i) => (
              <div
                key={i}
                className={cn('flex', msg.from === 'me' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-xs rounded-sm px-4 py-2.5',
                    msg.from === 'me'
                      ? 'bg-[#E91E8C] text-white'
                      : 'bg-[#201519] text-[#F8F0F4] border border-[rgba(255,255,255,0.06)]'
                  )}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className={cn('flex items-center gap-1 mt-1', msg.from === 'me' ? 'justify-end' : 'justify-start')}>
                    <Clock size={10} className={msg.from === 'me' ? 'text-white/50' : 'text-[#7A5665]'} />
                    <span className={cn('text-xs', msg.from === 'me' ? 'text-white/60' : 'text-[#7A5665]')}>{msg.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply */}
          <div className="p-4 border-t border-[rgba(233,30,140,0.12)] flex gap-3">
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Digite sua resposta..."
              className="input-field flex-1 py-2.5 text-sm"
              onKeyDown={(e) => { if (e.key === 'Enter') setReply('') }}
            />
            <button
              onClick={() => setReply('')}
              className="btn-primary px-4 flex items-center gap-2 text-sm"
            >
              <MessageSquare size={14} />
              Enviar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare size={40} className="mx-auto mb-3 text-[#7A5665] opacity-50" />
            <p className="text-sm text-[#7A5665]">Selecione uma conversa</p>
          </div>
        </div>
      )}
    </div>
  )
}
