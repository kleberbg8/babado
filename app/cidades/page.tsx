import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { MapPin, Search } from 'lucide-react'

interface CityEntry {
  city: string
  state: string
  modelCount: number
  onlineCount: number
  coverPhoto: string
  slug: string
}

const CITIES: CityEntry[] = [
  { city: 'São Paulo', state: 'SP', modelCount: 842, onlineCount: 127, coverPhoto: 'https://picsum.photos/seed/sp/600/400', slug: 'sao-paulo-sp' },
  { city: 'Rio de Janeiro', state: 'RJ', modelCount: 614, onlineCount: 89, coverPhoto: 'https://picsum.photos/seed/rj/600/400', slug: 'rio-de-janeiro-rj' },
  { city: 'Belo Horizonte', state: 'MG', modelCount: 298, onlineCount: 42, coverPhoto: 'https://picsum.photos/seed/bh/600/400', slug: 'belo-horizonte-mg' },
  { city: 'Curitiba', state: 'PR', modelCount: 245, onlineCount: 38, coverPhoto: 'https://picsum.photos/seed/cwb/600/400', slug: 'curitiba-pr' },
  { city: 'Porto Alegre', state: 'RS', modelCount: 213, onlineCount: 31, coverPhoto: 'https://picsum.photos/seed/poa/600/400', slug: 'porto-alegre-rs' },
  { city: 'Salvador', state: 'BA', modelCount: 198, onlineCount: 27, coverPhoto: 'https://picsum.photos/seed/ssa/600/400', slug: 'salvador-ba' },
  { city: 'Fortaleza', state: 'CE', modelCount: 187, onlineCount: 24, coverPhoto: 'https://picsum.photos/seed/for/600/400', slug: 'fortaleza-ce' },
  { city: 'Brasília', state: 'DF', modelCount: 176, onlineCount: 21, coverPhoto: 'https://picsum.photos/seed/bsb/600/400', slug: 'brasilia-df' },
  { city: 'Recife', state: 'PE', modelCount: 154, onlineCount: 19, coverPhoto: 'https://picsum.photos/seed/rec/600/400', slug: 'recife-pe' },
  { city: 'Goiânia', state: 'GO', modelCount: 132, onlineCount: 17, coverPhoto: 'https://picsum.photos/seed/gyn/600/400', slug: 'goiania-go' },
  { city: 'Manaus', state: 'AM', modelCount: 98, onlineCount: 12, coverPhoto: 'https://picsum.photos/seed/mao/600/400', slug: 'manaus-am' },
  { city: 'Florianópolis', state: 'SC', modelCount: 87, onlineCount: 11, coverPhoto: 'https://picsum.photos/seed/fln/600/400', slug: 'florianopolis-sc' },
  { city: 'Campinas', state: 'SP', modelCount: 76, onlineCount: 10, coverPhoto: 'https://picsum.photos/seed/cps/600/400', slug: 'campinas-sp' },
  { city: 'Natal', state: 'RN', modelCount: 65, onlineCount: 8, coverPhoto: 'https://picsum.photos/seed/nat/600/400', slug: 'natal-rn' },
  { city: 'Maceió', state: 'AL', modelCount: 54, onlineCount: 7, coverPhoto: 'https://picsum.photos/seed/mcz/600/400', slug: 'maceio-al' },
  { city: 'Campo Grande', state: 'MS', modelCount: 48, onlineCount: 6, coverPhoto: 'https://picsum.photos/seed/cgr/600/400', slug: 'campo-grande-ms' },
]

export default function CidadesPage() {
  const top4 = CITIES.slice(0, 4)
  const rest = CITIES.slice(4)

  return (
    <>
      <div className="page-bar" />
      <Navbar />
      <main className="pt-20 pb-20">
        {/* Header */}
        <div className="max-content mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-2">
                Todas as <span className="italic text-[#E91E8C]">Cidades</span>
              </h1>
              <p className="text-[#7A5665]">{CITIES.reduce((s, c) => s + c.modelCount, 0).toLocaleString('pt-BR')} acompanhantes em {CITIES.length} cidades</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5665]" />
              <input
                placeholder="Buscar cidade..."
                className="input-field pl-9 py-2.5 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Featured cities */}
        <div className="max-content mb-10">
          <h2 className="section-title mb-5">
            Principais <span className="italic text-[#E91E8C]">destinos</span>
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {top4.map((city) => (
              <Link
                key={city.slug}
                href={`/acompanhantes?cidade=${city.slug}`}
                className="group relative rounded-sm overflow-hidden aspect-[4/5] block"
              >
                <Image
                  src={city.coverPhoto}
                  alt={city.city}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-green-400 font-semibold">{city.onlineCount} online</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white leading-tight">{city.city}</h3>
                  <p className="text-sm text-[#BFA0AB]">{city.modelCount} acompanhantes</p>
                </div>
                <div className="absolute inset-0 border border-[rgba(233,30,140,0)] group-hover:border-[rgba(233,30,140,0.3)] transition-all rounded-sm" />
              </Link>
            ))}
          </div>
        </div>

        {/* All cities grid */}
        <div className="max-content">
          <h2 className="section-title mb-5">
            Outras <span className="italic text-[#E91E8C]">cidades</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {rest.map((city) => (
              <Link
                key={city.slug}
                href={`/acompanhantes?cidade=${city.slug}`}
                className="card p-4 flex items-center gap-3 hover:border-[rgba(233,30,140,0.25)] transition-all group"
              >
                <div className="w-12 h-12 rounded-sm overflow-hidden shrink-0 relative">
                  <Image src={city.coverPhoto} alt={city.city} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-[#F8F0F4] group-hover:text-[#E91E8C] transition-colors truncate">{city.city}</p>
                    <span className="text-xs text-[#7A5665] shrink-0">{city.state}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#7A5665] flex items-center gap-1">
                      <MapPin size={9} /> {city.modelCount}
                    </span>
                    <span className="text-xs text-green-400">{city.onlineCount} online</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
