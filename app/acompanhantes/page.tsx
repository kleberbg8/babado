'use client'

import { useState } from 'react'
import { SlidersHorizontal, ArrowUpDown, ChevronDown } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ModelCard from '@/components/ui/ModelCard'
import FilterDrawer from '@/components/ui/FilterDrawer'
import { MOCK_MODELS } from '@/lib/mock-data'
import type { FilterOptions } from '@/types'

const ORDER_OPTIONS = [
  { value: 'featured', label: 'Destaques primeiro' },
  { value: 'newest', label: 'Mais recentes' },
  { value: 'rating', label: 'Melhor avaliadas' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'online', label: 'Online agora' },
]

export default function AcompanhantesPage() {
  const [filters, setFilters] = useState<FilterOptions>({})
  const [orderBy, setOrderBy] = useState<string>('featured')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [orderOpen, setOrderOpen] = useState(false)
  const [page, setPage] = useState(1)
  const PER_PAGE = 8

  const models = MOCK_MODELS
  const displayed = models.slice(0, page * PER_PAGE)
  const hasMore = displayed.length < models.length

  const activeFiltersCount = Object.values(filters).filter((v) =>
    Array.isArray(v) ? v.length > 0 : v !== undefined && v !== ''
  ).length

  return (
    <>
      <div className="page-bar" />
      <Navbar />
      <main className="pt-16 min-h-screen">
        {/* Header */}
        <div className="border-b border-[rgba(233,30,140,0.1)] bg-[#130E11]">
          <div className="max-content py-6">
            <h1 className="font-display text-2xl font-bold text-white mb-1">
              Acompanhantes <span className="italic text-[#E91E8C]">Premium</span>
            </h1>
            <p className="text-sm text-[#7A5665]">
              {models.length} perfis encontrados
            </p>
          </div>
        </div>

        <div className="max-content py-6">
          {/* Mobile toolbar */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-sm border border-[rgba(233,30,140,0.2)] bg-[#201519] text-sm font-medium text-[#BFA0AB] hover:border-[#E91E8C] transition-all"
            >
              <SlidersHorizontal size={15} />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#E91E8C] text-white text-xs flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <div className="relative ml-auto">
              <button
                onClick={() => setOrderOpen(!orderOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-sm border border-[rgba(255,255,255,0.06)] bg-[#201519] text-sm text-[#BFA0AB] hover:border-[rgba(233,30,140,0.2)] transition-all"
              >
                <ArrowUpDown size={14} />
                {ORDER_OPTIONS.find((o) => o.value === orderBy)?.label}
                <ChevronDown size={14} />
              </button>
              {orderOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-[#201519] border border-[rgba(233,30,140,0.15)] rounded shadow-card z-20">
                  {ORDER_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => { setOrderBy(o.value); setOrderOpen(false) }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${orderBy === o.value ? 'text-[#E91E8C] bg-[rgba(233,30,140,0.08)]' : 'text-[#BFA0AB] hover:text-white hover:bg-[#2A1C22]'}`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-6">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-72 shrink-0">
              <FilterDrawer
                filters={filters}
                onApply={setFilters}
                onClear={() => setFilters({})}
              />
            </aside>

            {/* Grid */}
            <div className="flex-1 min-w-0">
              {/* Desktop toolbar */}
              <div className="hidden lg:flex items-center justify-between mb-5">
                <p className="text-sm text-[#7A5665]">
                  Mostrando <span className="text-[#BFA0AB] font-medium">{displayed.length}</span> de{' '}
                  <span className="text-[#BFA0AB] font-medium">{models.length}</span> perfis
                </p>

                <div className="relative">
                  <button
                    onClick={() => setOrderOpen(!orderOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-sm border border-[rgba(255,255,255,0.06)] bg-[#201519] text-sm text-[#BFA0AB] hover:border-[rgba(233,30,140,0.2)] transition-all"
                  >
                    <ArrowUpDown size={14} />
                    {ORDER_OPTIONS.find((o) => o.value === orderBy)?.label}
                    <ChevronDown size={14} />
                  </button>
                  {orderOpen && (
                    <div className="absolute right-0 top-full mt-1 w-44 bg-[#201519] border border-[rgba(233,30,140,0.15)] rounded shadow-card z-20">
                      {ORDER_OPTIONS.map((o) => (
                        <button
                          key={o.value}
                          onClick={() => { setOrderBy(o.value); setOrderOpen(false) }}
                          className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${orderBy === o.value ? 'text-[#E91E8C] bg-[rgba(233,30,140,0.08)]' : 'text-[#BFA0AB] hover:text-white hover:bg-[#2A1C22]'}`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayed.map((model, i) => (
                  <ModelCard key={model.id} model={model} priority={i < 4} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="btn-secondary px-10 py-3"
                  >
                    Carregar mais perfis
                  </button>
                </div>
              )}

              {displayed.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-[#7A5665] text-lg">Nenhum perfil encontrado com esses filtros.</p>
                  <button onClick={() => setFilters({})} className="btn-primary mt-4">
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <FilterDrawer
          filters={filters}
          onApply={setFilters}
          onClear={() => setFilters({})}
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      )}

      <Footer />
    </>
  )
}
