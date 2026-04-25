'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Heart, Flag, Share2, ShieldCheck, MapPin,
  Lock, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown,
  MessageCircle, Star as StarIcon, Eye, Users, Camera, Video,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import OnlineBadge from '@/components/ui/OnlineBadge'
import VerifiedBadge from '@/components/ui/VerifiedBadge'
import PlanBadge from '@/components/ui/PlanBadge'
import StarRating from '@/components/ui/StarRating'
import ReviewCard from '@/components/ui/ReviewCard'
import WeeklySchedule from '@/components/ui/WeeklySchedule'
import ModelCard from '@/components/ui/ModelCard'
import { formatCurrency } from '@/lib/utils'
import { MOCK_MODELS } from '@/lib/mock-data'

const MOCK_PROFILE = {
  id: '1',
  slug: 'valentina-souza',
  stageName: 'Valentina',
  lastName: 'Souza',
  city: 'São Paulo',
  state: 'SP',
  neighborhood: 'Jardins',
  age: 26,
  height: 1.68,
  weight: 55,
  ethnicity: 'Branca',
  eyeColor: 'Castanhos',
  hairStyle: 'Liso',
  hairSize: 'Longo',
  hasSilicone: true,
  hasTattoo: false,
  smokes: false,
  languages: ['Português', 'Inglês', 'Espanhol'],
  gender: 'Feminino',
  genital: 'Vaginal',
  sexualPref: 'Heterossexual',
  serviceType: 'BOTH' as const,
  plan: 'ELITE' as const,
  isOnline: true,
  isVerified: true,
  score: 4.9,
  reviewCount: 124,
  viewCount: 8420,
  favoriteCount: 312,
  priceMin: 350,
  whatsapp: '11999999999',
  bio: 'Olá, sou a Valentina, uma mulher sensual e elegante que sabe como fazer você se sentir especial. Ofereço uma experiência única e inesquecível, com total discrição e profissionalismo. Adoro conversar e criar uma conexão genuína antes de qualquer encontro. Falo inglês e espanhol fluentemente.',
  services: [
    { serviceId: '1', serviceName: 'Massagem', category: 'Relaxamento', mode: 'DO' as const, isSpecialty: true },
    { serviceId: '2', serviceName: 'Jantar', category: 'Acompanhamento', mode: 'BOTH' as const, isSpecialty: false },
    { serviceId: '3', serviceName: 'Viagens', category: 'Acompanhamento', mode: 'BOTH' as const, isSpecialty: false },
    { serviceId: '4', serviceName: 'Eventos', category: 'Acompanhamento', mode: 'BOTH' as const, isSpecialty: false },
  ],
  priceTable: {
    '30min': 350,
    '1hora': 600,
    '2horas': 1000,
    'pernoite': 2500,
  },
  availability: [
    { weekday: 1, startTime: '09:00', endTime: '23:00', isAvailable: true },
    { weekday: 2, startTime: '09:00', endTime: '23:00', isAvailable: true },
    { weekday: 3, startTime: '09:00', endTime: '23:00', isAvailable: true },
    { weekday: 4, startTime: '09:00', endTime: '23:00', isAvailable: true },
    { weekday: 5, startTime: '09:00', endTime: '00:00', isAvailable: true },
    { weekday: 6, startTime: '12:00', endTime: '00:00', isAvailable: true },
    { weekday: 0, startTime: '12:00', endTime: '22:00', isAvailable: false },
  ],
  reviews: [
    { id: 'r1', rating: 5, comment: 'Experiência incrível, muito atenciosa e profissional. Com certeza voltarei!', userName: 'Cliente VIP', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), helpfulCount: 14 },
    { id: 'r2', rating: 5, comment: 'Superou todas as minhas expectativas. Altamente recomendada.', userName: 'M.S.', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), helpfulCount: 9 },
    { id: 'r3', rating: 4, comment: 'Muito linda e simpática, ótima companhia para eventos.', userName: 'André', createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), helpfulCount: 6 },
  ],
  questions: [
    { id: 'q1', question: 'Faz atendimentos no bairro X?', answer: 'Sim, atendo em toda a região de SP com local próprio.', helpfulCount: 7, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  ],
  medias: [
    { id: 'm1', type: 'PHOTO' as const, url: '', isFace: false, isPremium: false, isMain: true, orderIndex: 0, status: 'APPROVED' as const },
    { id: 'm2', type: 'PHOTO' as const, url: '', isFace: true, isPremium: false, isMain: false, orderIndex: 1, status: 'APPROVED' as const },
    { id: 'm3', type: 'PHOTO' as const, url: '', isFace: false, isPremium: true, isMain: false, orderIndex: 2, status: 'APPROVED' as const },
    { id: 'm4', type: 'VIDEO' as const, url: '', isFace: false, isPremium: false, isMain: false, orderIndex: 3, status: 'APPROVED' as const },
    { id: 'm5', type: 'PHOTO' as const, url: '', isFace: false, isPremium: true, isMain: false, orderIndex: 4, status: 'APPROVED' as const },
    { id: 'm6', type: 'PHOTO' as const, url: '', isFace: false, isPremium: false, isMain: false, orderIndex: 5, status: 'APPROVED' as const },
  ],
}

type Tab = 'fotos' | 'sobre' | 'avaliacoes'

const PRICE_LABELS: Record<string, string> = {
  '30min': '30 minutos',
  '1hora': '1 hora',
  '2horas': '2 horas',
  pernoite: 'Pernoite',
}

export default function ModelProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('fotos')
  const [mediaFilter, setMediaFilter] = useState<string>('all')
  const [favorited, setFavorited] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [expandedService, setExpandedService] = useState<string | null>(null)
  const [mediaPage, setMediaPage] = useState(6)

  const profile = MOCK_PROFILE
  const similar = MOCK_MODELS.filter((m) => m.id !== profile.id).slice(0, 5)

  const filteredMedias = profile.medias.filter((m) => {
    if (mediaFilter === 'fotos') return m.type === 'PHOTO'
    if (mediaFilter === 'rosto') return m.type === 'PHOTO' && m.isFace
    if (mediaFilter === 'videos') return m.type === 'VIDEO'
    if (mediaFilter === 'exclusivo') return m.isPremium
    return true
  })

  return (
    <>
      <div className="page-bar" />
      <Navbar />
      <main className="pt-16 min-h-screen">
        {/* Cover */}
        <div className="relative h-64 md:h-80 bg-[#201519] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0A0C]/20 via-transparent to-[#0D0A0C]" />
          {/* Decorative bg */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="font-display text-[20rem] font-black text-[#E91E8C] leading-none">V</span>
          </div>

          {/* Action pills */}
          <div className="absolute top-4 left-0 right-0">
            <div className="max-content flex items-center justify-between">
              <Link href="/acompanhantes" className="glass flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-[#BFA0AB] hover:text-white transition-colors">
                <ArrowLeft size={14} />
                Voltar
              </Link>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFavorited(!favorited)}
                  className={`glass flex items-center gap-1.5 px-3 py-2 rounded-sm text-sm transition-all ${favorited ? 'text-[#E91E8C]' : 'text-[#BFA0AB] hover:text-[#E91E8C]'}`}
                >
                  <Heart size={14} fill={favorited ? '#E91E8C' : 'none'} />
                  {favorited ? 'Favoritada' : 'Favoritar'}
                </button>
                <button className="glass p-2 rounded-sm text-[#BFA0AB] hover:text-white transition-colors">
                  <Share2 size={14} />
                </button>
                <button className="glass p-2 rounded-sm text-[#BFA0AB] hover:text-[#E91E8C] transition-colors">
                  <Flag size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile identity */}
        <div className="max-content">
          <div className="relative -mt-16 mb-6 flex flex-col md:flex-row items-start md:items-end gap-4">
            {/* Avatar */}
            <div className="story-ring p-[3px] rounded-full shrink-0">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-[#201519] border-2 border-[#0D0A0C] overflow-hidden flex items-center justify-center">
                <span className="font-display text-5xl font-black text-[#E91E8C] opacity-40">V</span>
              </div>
            </div>

            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <OnlineBadge isOnline={profile.isOnline} showLabel />
                <VerifiedBadge showLabel />
                <PlanBadge plan={profile.plan} />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
                {profile.stageName}{' '}
                <span className="italic text-[#E91E8C]">{profile.lastName}</span>
              </h1>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <span className="flex items-center gap-1 text-sm text-[#BFA0AB]">
                  <MapPin size={13} className="text-[#E91E8C]" />
                  {profile.neighborhood}, {profile.city} – {profile.state}
                </span>
                <span className="text-sm text-[#7A5665]">{profile.age} anos</span>
                <span className="flex items-center gap-1 text-sm text-[#7A5665]">
                  <Eye size={13} />
                  {profile.viewCount.toLocaleString('pt-BR')} visualizações
                </span>
              </div>
            </div>
          </div>

          {/* Main layout */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12">
            {/* Sidebar */}
            <aside className="w-full lg:w-72 shrink-0 space-y-4">
              {/* Stats */}
              <div className="card p-4 grid grid-cols-3 gap-3">
                {[
                  { icon: Camera, label: 'Mídias', value: profile.medias.length },
                  { icon: StarIcon, label: 'Avaliações', value: profile.reviewCount },
                  { icon: Users, label: 'Seguidores', value: profile.favoriteCount },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="text-center">
                    <Icon size={16} className="mx-auto mb-1 text-[#E91E8C]" />
                    <p className="font-display font-bold text-lg text-white">{value}</p>
                    <p className="text-xs text-[#7A5665]">{label}</p>
                  </div>
                ))}
              </div>

              {/* Valores */}
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-[#BFA0AB] mb-3 uppercase tracking-wider">Valores</h3>
                <div className="space-y-2">
                  {Object.entries(profile.priceTable).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-[#7A5665]">{PRICE_LABELS[key] || key}</span>
                      <span className="font-display font-bold text-[#E8B84B]">{formatCurrency(value)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.04)] text-xs text-[#7A5665]">
                  Atendimento: {profile.serviceType === 'BOTH' ? 'Com local e a domicílio' : profile.serviceType === 'LOCAL' ? 'Com local' : 'A domicílio'}
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/55${profile.whatsapp}?text=Olá ${profile.stageName}, vi seu perfil no Gatas do Babado!`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-sm font-bold text-white text-sm transition-all duration-200 bg-[#25D366] hover:bg-[#1dbd5a] hover:shadow-[0_0_20px_rgba(37,211,102,0.3)]"
              >
                <MessageCircle size={16} />
                Chamar no WhatsApp
              </a>

              {/* Rating summary */}
              <div className="card p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-display text-4xl font-black text-[#E91E8C]">{profile.score}</span>
                  <div>
                    <StarRating value={profile.score} size="md" />
                    <p className="text-xs text-[#7A5665] mt-0.5">{profile.reviewCount} avaliações</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-[#7A5665] w-2">{star}</span>
                      <div className="flex-1 h-1.5 bg-[#2A1C22] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#E8B84B] rounded-full"
                          style={{ width: star === 5 ? '75%' : star === 4 ? '18%' : '7%' }}
                        />
                      </div>
                      <StarIcon size={10} className="text-[#E8B84B] fill-[#E8B84B]" />
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.04)]">
                  <div className="blur-sm select-none space-y-2">
                    {profile.reviews.slice(0, 2).map((r) => (
                      <div key={r.id} className="text-xs text-[#BFA0AB] line-clamp-1">{r.comment}</div>
                    ))}
                  </div>
                  <Link href="#avaliacoes" className="block text-xs text-center text-[#E91E8C] mt-2 hover:underline" onClick={() => setActiveTab('avaliacoes')}>
                    Ver todas as avaliações
                  </Link>
                </div>
              </div>
            </aside>

            {/* Content with tabs */}
            <div className="flex-1 min-w-0">
              {/* Sticky tabs */}
              <div className="sticky top-16 z-30 bg-[#0D0A0C]/90 backdrop-blur border-b border-[rgba(233,30,140,0.1)] mb-6 -mx-0">
                <div className="flex">
                  {(['fotos', 'sobre', 'avaliacoes'] as Tab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 text-sm font-semibold capitalize transition-all border-b-2 ${
                        activeTab === tab
                          ? 'text-[#E91E8C] border-[#E91E8C]'
                          : 'text-[#7A5665] border-transparent hover:text-[#BFA0AB]'
                      }`}
                    >
                      {tab === 'fotos' ? 'Fotos & Vídeos' : tab === 'sobre' ? 'Sobre Mim' : 'Avaliações'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab: Fotos */}
              {activeTab === 'fotos' && (
                <div>
                  {/* Filters */}
                  <div className="flex gap-2 mb-5 flex-wrap">
                    {['all', 'fotos', 'rosto', 'videos', 'exclusivo'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setMediaFilter(f)}
                        className={`px-3 py-1.5 rounded-sm text-xs font-medium border transition-all ${
                          mediaFilter === f
                            ? 'bg-[rgba(233,30,140,0.15)] border-[#E91E8C] text-[#E91E8C]'
                            : 'bg-[#201519] border-[rgba(255,255,255,0.06)] text-[#BFA0AB] hover:border-[rgba(233,30,140,0.3)]'
                        }`}
                      >
                        {f === 'all' ? 'Todas' : f === 'fotos' ? 'Fotos' : f === 'rosto' ? 'Rosto' : f === 'videos' ? 'Vídeos' : 'Exclusivo 🔒'}
                      </button>
                    ))}
                  </div>

                  {/* Verified badge */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-sm bg-[rgba(37,211,102,0.06)] border border-[rgba(37,211,102,0.15)] mb-5 text-xs text-green-400">
                    <ShieldCheck size={13} />
                    Mídias verificadas — fotos autênticas desta modelo
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
                    {filteredMedias.slice(0, mediaPage).map((media) => (
                      <div key={media.id} className="relative aspect-[3/4] rounded-sm overflow-hidden bg-[#201519] group cursor-pointer">
                        {media.isPremium ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#130E11]">
                            <div className="w-12 h-12 rounded-full bg-[rgba(233,30,140,0.15)] flex items-center justify-center mb-2">
                              <Lock size={18} className="text-[#E91E8C]" />
                            </div>
                            <p className="text-xs text-[#BFA0AB] font-semibold">Premium</p>
                            <p className="text-xs text-[#7A5665]">Use VIP Coins</p>
                          </div>
                        ) : media.type === 'VIDEO' ? (
                          <div className="absolute inset-0 bg-[#0D0A0C]/60 flex items-center justify-center group-hover:bg-[#0D0A0C]/40 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                              <Video size={20} className="text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-[rgba(233,30,140,0.15)] group-hover:bg-transparent transition-colors" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-display text-4xl font-black text-[#E91E8C] opacity-20">G</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredMedias.length > mediaPage && (
                    <div className="mt-6 text-center">
                      <button onClick={() => setMediaPage((p) => p + 6)} className="btn-primary px-8">
                        Carregar mais mídias
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Sobre */}
              {activeTab === 'sobre' && (
                <div className="space-y-6">
                  {/* Bio */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#BFA0AB] uppercase tracking-wider mb-3">Descrição</h3>
                    <div className="border-l-[3px] border-[#E91E8C] pl-4">
                      <p className="text-[#BFA0AB] leading-relaxed text-sm">{profile.bio}</p>
                    </div>
                  </div>

                  {/* Características */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#BFA0AB] uppercase tracking-wider mb-3">Características Físicas</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Gênero', value: profile.gender },
                        { label: 'Preferência', value: profile.sexualPref },
                        { label: 'Idade', value: `${profile.age} anos` },
                        { label: 'Altura', value: `${profile.height}m` },
                        { label: 'Peso', value: `${profile.weight}kg` },
                        { label: 'Etnia', value: profile.ethnicity },
                        { label: 'Olhos', value: profile.eyeColor },
                        { label: 'Cabelo', value: `${profile.hairStyle}, ${profile.hairSize}` },
                        { label: 'Silicone', value: profile.hasSilicone ? 'Sim' : 'Não' },
                        { label: 'Tatuagens', value: profile.hasTattoo ? 'Sim' : 'Não' },
                        { label: 'Fumante', value: profile.smokes ? 'Sim' : 'Não' },
                        { label: 'Idiomas', value: profile.languages.join(', ') },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between p-2.5 rounded-sm bg-[#201519] border border-[rgba(255,255,255,0.04)]">
                          <span className="text-xs text-[#7A5665]">{label}</span>
                          <span className="text-xs font-medium text-[#BFA0AB]">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Serviços */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#BFA0AB] uppercase tracking-wider mb-3">Serviços Oferecidos</h3>
                    <div className="space-y-2">
                      {profile.services.map((s) => (
                        <div key={s.serviceId} className="border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden">
                          <button
                            onClick={() => setExpandedService(expandedService === s.serviceId ? null : s.serviceId)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-[#201519] hover:bg-[#2A1C22] transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-[#F8F0F4]">{s.serviceName}</span>
                              {s.isSpecialty && (
                                <span className="badge badge-pink text-xs">Especialidade</span>
                              )}
                            </div>
                            {expandedService === s.serviceId ? <ChevronUp size={14} className="text-[#7A5665]" /> : <ChevronDown size={14} className="text-[#7A5665]" />}
                          </button>
                          {expandedService === s.serviceId && (
                            <div className="px-4 py-3 bg-[#130E11] flex gap-2">
                              {(['DO', 'BOTH'] as string[]).includes(s.mode) && (
                                <span className="badge badge-pink">Faço</span>
                              )}
                              {(['RECEIVE', 'BOTH'] as string[]).includes(s.mode) && (
                                <span className="badge badge-pink">Recebo</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Agenda */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#BFA0AB] uppercase tracking-wider mb-3">Disponibilidade</h3>
                    <WeeklySchedule availability={profile.availability} />
                  </div>

                  {/* Q&A */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#BFA0AB] uppercase tracking-wider mb-3">Perguntas e Respostas</h3>
                    {profile.questions.map((q) => (
                      <div key={q.id} className="card p-4 mb-3">
                        <p className="text-sm font-medium text-[#F8F0F4] mb-2">{q.question}</p>
                        <div className="relative">
                          <p className="text-sm text-[#BFA0AB] blur-sm select-none">{q.answer}</p>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Link href="/login" className="text-xs text-[#E91E8C] font-medium bg-[#201519] px-3 py-1 rounded border border-[rgba(233,30,140,0.2)] hover:bg-[rgba(233,30,140,0.1)] transition-colors">
                              Ver resposta
                            </Link>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          <button className="flex items-center gap-1 text-xs text-[#7A5665] hover:text-green-400 transition-colors">
                            <ThumbsUp size={11} /> Útil ({q.helpfulCount})
                          </button>
                          <button className="flex items-center gap-1 text-xs text-[#7A5665] hover:text-[#E91E8C] transition-colors">
                            <ThumbsDown size={11} /> Inútil
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="btn-secondary w-full text-sm py-2.5 mt-2">
                      Tire suas dúvidas
                    </button>
                  </div>
                </div>
              )}

              {/* Tab: Avaliações */}
              {activeTab === 'avaliacoes' && (
                <div id="avaliacoes" className="space-y-5">
                  {/* Write review */}
                  <div className="card p-5">
                    <h3 className="text-sm font-semibold text-[#BFA0AB] mb-3">Deixar Avaliação</h3>
                    <StarRating value={reviewRating} interactive onChange={setReviewRating} size="lg" className="mb-3" />
                    <textarea
                      placeholder="Compartilhe sua experiência..."
                      className="input-field min-h-[80px] resize-none mb-3"
                    />
                    <button className="btn-primary text-sm py-2.5">Publicar avaliação</button>
                  </div>

                  {/* Reviews list */}
                  {profile.reviews.map((review, i) => (
                    <ReviewCard key={review.id} review={review} blurred={i > 0} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Similar profiles */}
          <div className="border-t border-[rgba(233,30,140,0.08)] py-10">
            <h2 className="section-title mb-6">
              Acompanhantes <span>Similares</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {similar.map((m) => (
                <ModelCard key={m.id} model={m} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
