'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Status = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED'
export type Plan = 'FREE' | 'SILVER' | 'GOLD' | 'ELITE'

export interface ModelPhoto {
  id: string
  url: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  isMain: boolean
  isFace: boolean
  isPremium: boolean
  type: 'PHOTO' | 'VIDEO' | 'STORY'
}

export interface Model {
  id: string
  stageName: string
  email: string
  whatsapp: string
  city: string
  state: string
  neighborhood: string
  plan: Plan
  status: Status
  score: number
  joinedAt: string
  isVerified: boolean
  views: number
  bio: string
  age: number
  height: number
  weight: number
  ethnicity: string
  hairStyle: string
  hairSize: string
  eyeColor: string
  hasSilicone: boolean
  hasTattoo: boolean
  smokes: boolean
  serviceType: string
  priceMin: number
  priceTable: Record<string, number>
  languages: string[]
  photos: ModelPhoto[]
  services: string[]
  availability: { weekday: string; start: string; end: string }[]
}

const INITIAL_MODELS: Model[] = [
  {
    id: '1', stageName: 'Valentina Silva', email: 'valentina@email.com', whatsapp: '(11) 99999-0001',
    city: 'São Paulo', state: 'SP', neighborhood: 'Jardins', plan: 'ELITE', status: 'ACTIVE',
    score: 4.9, joinedAt: '10/01/2026', isVerified: true, views: 4820,
    bio: 'Modelo profissional com experiência em eventos de alto padrão. Discreta e elegante.',
    age: 25, height: 1.72, weight: 56, ethnicity: 'Branca', hairStyle: 'Liso', hairSize: 'Longo',
    eyeColor: 'Verdes', hasSilicone: true, hasTattoo: false, smokes: false, serviceType: 'BOTH',
    priceMin: 600, priceTable: { '1h': 600, '2h': 1000, 'diaria': 3000 },
    languages: ['Português', 'Inglês', 'Espanhol'],
    photos: [
      { id: 'p1', url: 'https://placehold.co/300x400/1a0d12/E91E8C?text=Foto+1', status: 'APPROVED', isMain: true, isFace: false, isPremium: false, type: 'PHOTO' },
      { id: 'p2', url: 'https://placehold.co/300x400/1a0d12/E91E8C?text=Foto+2', status: 'APPROVED', isMain: false, isFace: false, isPremium: true, type: 'PHOTO' },
    ],
    services: ['Jantar', 'Viagens', 'Eventos', 'Girlfriend Experience', 'Massagem'],
    availability: [
      { weekday: 'Quinta', start: '18:00', end: '00:00' },
      { weekday: 'Sexta', start: '14:00', end: '02:00' },
      { weekday: 'Sábado', start: '12:00', end: '02:00' },
    ],
  },
  {
    id: '2', stageName: 'Isabelle Costa', email: 'isabelle@email.com', whatsapp: '(21) 99999-0002',
    city: 'Rio de Janeiro', state: 'RJ', neighborhood: 'Ipanema', plan: 'GOLD', status: 'ACTIVE',
    score: 4.7, joinedAt: '15/01/2026', isVerified: true, views: 3210,
    bio: 'Carioca apaixonada pela vida, ofereço experiências únicas e inesquecíveis.',
    age: 23, height: 1.68, weight: 54, ethnicity: 'Parda', hairStyle: 'Ondulado', hairSize: 'Médio',
    eyeColor: 'Castanhos', hasSilicone: false, hasTattoo: true, smokes: false, serviceType: 'LOCAL',
    priceMin: 400, priceTable: { '1h': 400, '2h': 700, 'diaria': 2000 },
    languages: ['Português', 'Inglês'],
    photos: [
      { id: 'p3', url: 'https://placehold.co/300x400/1a0d12/E91E8C?text=Foto+1', status: 'APPROVED', isMain: true, isFace: false, isPremium: false, type: 'PHOTO' },
    ],
    services: ['Jantar', 'Praia', 'Passeios', 'Girlfriend Experience'],
    availability: [
      { weekday: 'Segunda', start: '14:00', end: '22:00' },
      { weekday: 'Terça', start: '14:00', end: '22:00' },
      { weekday: 'Sexta', start: '12:00', end: '02:00' },
    ],
  },
  {
    id: '3', stageName: 'Larissa Mendes', email: 'larissa@email.com', whatsapp: '(41) 99999-0003',
    city: 'Curitiba', state: 'PR', neighborhood: 'Batel', plan: 'SILVER', status: 'ACTIVE',
    score: 4.5, joinedAt: '20/01/2026', isVerified: false, views: 1980,
    bio: 'Curitibana refinada, adoro arte e cultura.',
    age: 27, height: 1.65, weight: 58, ethnicity: 'Branca', hairStyle: 'Liso', hairSize: 'Curto',
    eyeColor: 'Azuis', hasSilicone: false, hasTattoo: false, smokes: true, serviceType: 'BOTH',
    priceMin: 300, priceTable: { '1h': 300, '2h': 500, 'diaria': 1500 },
    languages: ['Português'],
    photos: [
      { id: 'p4', url: 'https://placehold.co/300x400/1a0d12/E91E8C?text=Foto+1', status: 'APPROVED', isMain: true, isFace: false, isPremium: false, type: 'PHOTO' },
    ],
    services: ['Jantar', 'Teatro', 'Massagem'],
    availability: [
      { weekday: 'Quarta', start: '16:00', end: '23:00' },
      { weekday: 'Sábado', start: '14:00', end: '02:00' },
    ],
  },
  {
    id: '4', stageName: 'Júlia Ferreira', email: 'julia@email.com', whatsapp: '(31) 99999-1234',
    city: 'Belo Horizonte', state: 'MG', neighborhood: 'Savassi', plan: 'GOLD', status: 'PENDING',
    score: 0, joinedAt: '24/04/2026', isVerified: false, views: 0,
    bio: 'Sou uma modelo profissional com 5 anos de experiência. Discreta e elegante, ofereço serviços de alta qualidade para cavalheiros exigentes.',
    age: 26, height: 1.68, weight: 58, ethnicity: 'Branca', hairStyle: 'Liso', hairSize: 'Longo',
    eyeColor: 'Castanhos', hasSilicone: true, hasTattoo: false, smokes: false, serviceType: 'BOTH',
    priceMin: 300, priceTable: { '1h': 300, '2h': 500, 'diaria': 1500 },
    languages: ['Português', 'Inglês'],
    photos: [
      { id: 'ph1', url: 'https://placehold.co/300x400/1a0d12/E91E8C?text=Foto+1', status: 'PENDING', isMain: true, isFace: false, isPremium: false, type: 'PHOTO' },
      { id: 'ph2', url: 'https://placehold.co/300x400/1a0d12/E91E8C?text=Foto+2', status: 'PENDING', isMain: false, isFace: false, isPremium: true, type: 'PHOTO' },
      { id: 'ph3', url: 'https://placehold.co/300x400/1a0d12/E91E8C?text=Foto+3', status: 'PENDING', isMain: false, isFace: true, isPremium: false, type: 'PHOTO' },
      { id: 'ph4', url: 'https://placehold.co/300x400/1a0d12/E91E8C?text=Vídeo+1', status: 'PENDING', isMain: false, isFace: false, isPremium: false, type: 'VIDEO' },
    ],
    services: ['Massagem', 'Jantar', 'Viagens', 'Festas', 'Girlfriend Experience'],
    availability: [
      { weekday: 'Segunda', start: '14:00', end: '22:00' },
      { weekday: 'Terça', start: '14:00', end: '22:00' },
      { weekday: 'Sexta', start: '12:00', end: '02:00' },
      { weekday: 'Sábado', start: '12:00', end: '02:00' },
    ],
  },
  {
    id: '5', stageName: 'Melissa Santos', email: 'melissa@email.com', whatsapp: '(71) 99999-0005',
    city: 'Salvador', state: 'BA', neighborhood: 'Barra', plan: 'FREE', status: 'SUSPENDED',
    score: 3.2, joinedAt: '05/02/2026', isVerified: false, views: 540,
    bio: 'Baiana cheia de energia e alegria.',
    age: 24, height: 1.62, weight: 55, ethnicity: 'Negra', hairStyle: 'Cacheado', hairSize: 'Médio',
    eyeColor: 'Castanhos', hasSilicone: false, hasTattoo: true, smokes: false, serviceType: 'LOCAL',
    priceMin: 200, priceTable: { '1h': 200, '2h': 350 },
    languages: ['Português'],
    photos: [],
    services: ['Festas', 'Passeios'],
    availability: [{ weekday: 'Sábado', start: '14:00', end: '02:00' }],
  },
  {
    id: '6', stageName: 'Bruna Lima', email: 'bruna@email.com', whatsapp: '(85) 99999-0006',
    city: 'Fortaleza', state: 'CE', neighborhood: 'Meireles', plan: 'ELITE', status: 'ACTIVE',
    score: 4.8, joinedAt: '12/02/2026', isVerified: true, views: 6100,
    bio: 'Fortalezense apaixonada pelo mar. Refinada e sofisticada.',
    age: 28, height: 1.70, weight: 57, ethnicity: 'Branca', hairStyle: 'Ondulado', hairSize: 'Longo',
    eyeColor: 'Mel', hasSilicone: true, hasTattoo: false, smokes: false, serviceType: 'BOTH',
    priceMin: 500, priceTable: { '1h': 500, '2h': 850, 'diaria': 2500 },
    languages: ['Português', 'Inglês'],
    photos: [
      { id: 'pb1', url: 'https://placehold.co/300x400/1a0d12/E91E8C?text=Foto+1', status: 'APPROVED', isMain: true, isFace: false, isPremium: false, type: 'PHOTO' },
      { id: 'pb2', url: 'https://placehold.co/300x400/1a0d12/E91E8C?text=Foto+2', status: 'APPROVED', isMain: false, isFace: false, isPremium: true, type: 'PHOTO' },
    ],
    services: ['Praia', 'Viagens', 'Jantar', 'Eventos', 'Girlfriend Experience'],
    availability: [
      { weekday: 'Quinta', start: '16:00', end: '00:00' },
      { weekday: 'Sexta', start: '12:00', end: '02:00' },
      { weekday: 'Sábado', start: '10:00', end: '02:00' },
    ],
  },
  {
    id: '7', stageName: 'Amanda Rocha', email: 'amanda@email.com', whatsapp: '(51) 99999-0007',
    city: 'Porto Alegre', state: 'RS', neighborhood: 'Moinhos de Vento', plan: 'SILVER', status: 'ACTIVE',
    score: 4.3, joinedAt: '01/03/2026', isVerified: true, views: 2300,
    bio: 'Gaúcha elegante, adoro vinho e boa conversa.',
    age: 29, height: 1.66, weight: 59, ethnicity: 'Branca', hairStyle: 'Liso', hairSize: 'Médio',
    eyeColor: 'Verdes', hasSilicone: false, hasTattoo: false, smokes: false, serviceType: 'LOCAL',
    priceMin: 350, priceTable: { '1h': 350, '2h': 600, 'diaria': 1800 },
    languages: ['Português', 'Espanhol'],
    photos: [
      { id: 'pa1', url: 'https://placehold.co/300x400/1a0d12/E91E8C?text=Foto+1', status: 'APPROVED', isMain: true, isFace: false, isPremium: false, type: 'PHOTO' },
    ],
    services: ['Jantar', 'Degustação', 'Viagens'],
    availability: [{ weekday: 'Sexta', start: '18:00', end: '02:00' }, { weekday: 'Sábado', start: '14:00', end: '02:00' }],
  },
  {
    id: '8', stageName: 'Fernanda Dias', email: 'fernanda@email.com', whatsapp: '(61) 99999-0008',
    city: 'Brasília', state: 'DF', neighborhood: 'Asa Sul', plan: 'FREE', status: 'BANNED',
    score: 1.0, joinedAt: '15/02/2026', isVerified: false, views: 200,
    bio: '',
    age: 22, height: 1.60, weight: 52, ethnicity: 'Parda', hairStyle: 'Cacheado', hairSize: 'Curto',
    eyeColor: 'Castanhos', hasSilicone: false, hasTattoo: false, smokes: false, serviceType: 'LOCAL',
    priceMin: 150, priceTable: { '1h': 150 },
    languages: ['Português'],
    photos: [],
    services: [],
    availability: [],
  },
]

interface ModelsStore {
  models: Model[]
  updateStatus: (id: string, status: Status) => void
  updateModel: (id: string, data: Partial<Model>) => void
  addModel: (model: Model) => void
  updatePhoto: (modelId: string, photoId: string, status: 'APPROVED' | 'REJECTED') => void
  addPhoto: (modelId: string, photo: ModelPhoto) => void
}

export const useModelsStore = create<ModelsStore>()(
  persist(
    (set) => ({
      models: INITIAL_MODELS,
      updateStatus: (id, status) =>
        set((s) => ({ models: s.models.map((m) => m.id === id ? { ...m, status } : m) })),
      updateModel: (id, data) =>
        set((s) => ({ models: s.models.map((m) => m.id === id ? { ...m, ...data } : m) })),
      addModel: (model) =>
        set((s) => ({ models: [model, ...s.models] })),
      updatePhoto: (modelId, photoId, status) =>
        set((s) => ({
          models: s.models.map((m) =>
            m.id === modelId
              ? { ...m, photos: m.photos.map((p) => p.id === photoId ? { ...p, status } : p) }
              : m
          ),
        })),
      addPhoto: (modelId, photo) =>
        set((s) => ({
          models: s.models.map((m) =>
            m.id === modelId ? { ...m, photos: [...m.photos, photo], photoCount: m.photos.length + 1 } : m
          ),
        })),
    }),
    { name: 'babado-admin-models' }
  )
)
