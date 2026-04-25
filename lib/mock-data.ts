import type { ModelCard, WeeklyRank, StoryItem, CityCard } from '@/types'

export const MOCK_MODELS: ModelCard[] = [
  { id: '1', slug: 'valentina-souza', stageName: 'Valentina Souza', city: 'São Paulo', state: 'SP', priceMin: 350, isOnline: true, isVerified: true, plan: 'ELITE', score: 4.9, reviewCount: 124, isFeatured: true },
  { id: '2', slug: 'isabelle-rio', stageName: 'Isabelle Rio', city: 'Rio de Janeiro', state: 'RJ', priceMin: 280, isOnline: true, isVerified: true, plan: 'GOLD', score: 4.7, reviewCount: 89, isFeatured: true },
  { id: '3', slug: 'camila-bh', stageName: 'Camila Santos', city: 'Belo Horizonte', state: 'MG', priceMin: 200, isOnline: false, isVerified: true, plan: 'SILVER', score: 4.5, reviewCount: 45 },
  { id: '4', slug: 'melissa-curitiba', stageName: 'Melissa Ferreira', city: 'Curitiba', state: 'PR', priceMin: 250, isOnline: true, isVerified: false, plan: 'GOLD', score: 4.3, reviewCount: 32 },
  { id: '5', slug: 'bianca-sp', stageName: 'Bianca Lima', city: 'São Paulo', state: 'SP', priceMin: 400, isOnline: false, isVerified: true, plan: 'ELITE', score: 5.0, reviewCount: 201, isFeatured: true },
  { id: '6', slug: 'larissa-salvador', stageName: 'Larissa Bahia', city: 'Salvador', state: 'BA', priceMin: 180, isOnline: true, isVerified: true, plan: 'SILVER', score: 4.6, reviewCount: 67 },
  { id: '7', slug: 'yasmin-poa', stageName: 'Yasmin Cardoso', city: 'Porto Alegre', state: 'RS', priceMin: 220, isOnline: false, isVerified: false, plan: 'FREE', score: 4.0, reviewCount: 12, isNew: true },
  { id: '8', slug: 'julia-fortaleza', stageName: 'Júlia Mendes', city: 'Fortaleza', state: 'CE', priceMin: 160, isOnline: true, isVerified: true, plan: 'GOLD', score: 4.8, reviewCount: 93, isNew: true },
]

export const MOCK_WEEKLY_RANK: WeeklyRank[] = [
  { position: 1, modelId: '5', stageName: 'Bianca Lima', city: 'São Paulo', state: 'SP', voteCount: 1842 },
  { position: 2, modelId: '1', stageName: 'Valentina Souza', city: 'São Paulo', state: 'SP', voteCount: 1327 },
  { position: 3, modelId: '2', stageName: 'Isabelle Rio', city: 'Rio de Janeiro', state: 'RJ', voteCount: 986 },
  { position: 4, modelId: '8', stageName: 'Júlia Mendes', city: 'Fortaleza', state: 'CE', voteCount: 754 },
  { position: 5, modelId: '6', stageName: 'Larissa Bahia', city: 'Salvador', state: 'BA', voteCount: 621 },
]

export const MOCK_STORIES: StoryItem[] = [
  { modelId: '1', stageName: 'Valentina Souza', isOnline: true, stories: [{ id: 's1', type: 'STORY', url: '', isFace: false, isPremium: false, isMain: false, orderIndex: 0, status: 'APPROVED' }] },
  { modelId: '2', stageName: 'Isabelle Rio', isOnline: true, stories: [{ id: 's2', type: 'STORY', url: '', isFace: false, isPremium: false, isMain: false, orderIndex: 0, status: 'APPROVED' }] },
  { modelId: '6', stageName: 'Larissa Bahia', isOnline: false, stories: [{ id: 's3', type: 'STORY', url: '', isFace: false, isPremium: false, isMain: false, orderIndex: 0, status: 'APPROVED' }] },
  { modelId: '8', stageName: 'Júlia Mendes', isOnline: true, stories: [{ id: 's4', type: 'STORY', url: '', isFace: false, isPremium: false, isMain: false, orderIndex: 0, status: 'APPROVED' }] },
  { modelId: '4', stageName: 'Melissa Ferreira', isOnline: true, stories: [{ id: 's5', type: 'STORY', url: '', isFace: false, isPremium: false, isMain: false, orderIndex: 0, status: 'APPROVED' }] },
]

export const MOCK_CITIES: CityCard[] = [
  { city: 'São Paulo', state: 'SP', modelCount: 1284, slug: 'sao-paulo-sp' },
  { city: 'Rio de Janeiro', state: 'RJ', modelCount: 876, slug: 'rio-de-janeiro-rj' },
  { city: 'Belo Horizonte', state: 'MG', modelCount: 412, slug: 'belo-horizonte-mg' },
  { city: 'Curitiba', state: 'PR', modelCount: 298, slug: 'curitiba-pr' },
  { city: 'Salvador', state: 'BA', modelCount: 267, slug: 'salvador-ba' },
  { city: 'Porto Alegre', state: 'RS', modelCount: 234, slug: 'porto-alegre-rs' },
]
