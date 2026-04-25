import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StoriesStrip from '@/components/sections/StoriesStrip'
import HeroBanner from '@/components/sections/HeroBanner'
import FeaturedModels from '@/components/sections/FeaturedModels'
import WeeklyRanking from '@/components/sections/WeeklyRanking'
import NewModels from '@/components/sections/NewModels'
import CitiesSection from '@/components/sections/CitiesSection'
import ModelCTABanner from '@/components/sections/ModelCTABanner'
import { MOCK_MODELS, MOCK_WEEKLY_RANK, MOCK_STORIES, MOCK_CITIES } from '@/lib/mock-data'

export default function HomePage() {
  const featured = MOCK_MODELS.filter((m) => m.isFeatured)
  const newest = MOCK_MODELS.slice(0, 5)

  return (
    <>
      <div className="page-bar" />
      <Navbar />
      <main className="pt-16">
        <StoriesStrip stories={MOCK_STORIES} />
        <HeroBanner />
        <FeaturedModels models={featured} />
        <WeeklyRanking rank={MOCK_WEEKLY_RANK} />
        <NewModels models={newest} />
        <CitiesSection cities={MOCK_CITIES} />
        <ModelCTABanner />
      </main>
      <Footer />
    </>
  )
}
