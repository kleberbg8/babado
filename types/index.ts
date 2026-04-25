export type UserRole = 'VISITOR' | 'MODEL' | 'MODERATOR' | 'ADMIN'
export type ModelStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'BANNED'
export type PlanType = 'FREE' | 'SILVER' | 'GOLD' | 'ELITE'
export type ServiceType = 'LOCAL' | 'OUTCALL' | 'BOTH' | 'TRAVEL'
export type MediaType = 'PHOTO' | 'VIDEO' | 'STORY' | 'COMPARISON'
export type MediaStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface ModelCard {
  id: string
  slug: string
  stageName: string
  city: string
  state: string
  priceMin?: number
  isOnline: boolean
  isVerified: boolean
  plan: PlanType
  score: number
  reviewCount: number
  mainPhoto?: string
  isNew?: boolean
  isFeatured?: boolean
}

export interface ModelProfile extends ModelCard {
  bio?: string
  age?: number
  weight?: number
  height?: number
  ethnicity?: string
  gender?: string
  genital?: string
  sexualPref?: string
  eyeColor?: string
  hairStyle?: string
  hairSize?: string
  hasSilicone?: boolean
  hasTattoo?: boolean
  smokes?: boolean
  languages?: string[]
  neighborhood?: string
  serviceType: ServiceType
  whatsapp?: string
  priceTable?: PriceTable
  viewCount: number
  favoriteCount: number
  medias: MediaItem[]
  services: ServiceItem[]
  availability: AvailabilityItem[]
  reviews: ReviewItem[]
  questions: QuestionItem[]
}

export interface MediaItem {
  id: string
  type: MediaType
  url: string
  thumbnailUrl?: string
  isFace: boolean
  isPremium: boolean
  isMain: boolean
  orderIndex: number
  status: MediaStatus
  expiresAt?: string
  durationSecs?: number
}

export interface ServiceItem {
  serviceId: string
  serviceName: string
  category: string
  mode: 'DO' | 'RECEIVE' | 'BOTH'
  isSpecialty: boolean
}

export interface AvailabilityItem {
  weekday: number
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface ReviewItem {
  id: string
  rating: number
  comment?: string
  userName: string
  createdAt: string
  helpfulCount: number
}

export interface QuestionItem {
  id: string
  question: string
  answer?: string
  helpfulCount: number
  createdAt: string
}

export interface PriceTable {
  [key: string]: number
}

export interface FilterOptions {
  city?: string
  state?: string
  priceMin?: number
  priceMax?: number
  ageMin?: number
  ageMax?: number
  ethnicity?: string[]
  serviceType?: ServiceType[]
  availability?: string[]
  onlyVerified?: boolean
  onlyOnline?: boolean
  orderBy?: 'featured' | 'newest' | 'rating' | 'price_asc' | 'online'
}

export interface WeeklyRank {
  position: number
  modelId: string
  stageName: string
  city: string
  state: string
  mainPhoto?: string
  voteCount: number
}

export interface StoryItem {
  modelId: string
  stageName: string
  mainPhoto?: string
  isOnline: boolean
  stories: MediaItem[]
}

export interface CityCard {
  city: string
  state: string
  modelCount: number
  coverPhoto?: string
  slug: string
}

export interface Plan {
  id: string
  name: string
  type: PlanType
  priceMonthly: number
  features: string[]
}
