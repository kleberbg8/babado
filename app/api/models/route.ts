import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get('cidade')
  const state = searchParams.get('estado')
  const orderBy = searchParams.get('ordem') ?? 'featured'
  const page = Number(searchParams.get('pagina') ?? '1')
  const perPage = Number(searchParams.get('por_pagina') ?? '12')
  const onlyVerified = searchParams.get('verificadas') === 'true'
  const onlyOnline = searchParams.get('online') === 'true'
  const priceMin = searchParams.get('preco_min') ? Number(searchParams.get('preco_min')) : undefined
  const priceMax = searchParams.get('preco_max') ? Number(searchParams.get('preco_max')) : undefined

  // In production: query Supabase/Prisma with these filters
  // For now, return mock structure
  return NextResponse.json({
    data: [],
    pagination: {
      page,
      perPage,
      total: 0,
      totalPages: 0,
    },
    filters: { city, state, orderBy, onlyVerified, onlyOnline, priceMin, priceMax },
  })
}

export async function POST(req: NextRequest) {
  try {
    await req.json()
    // In production: create model profile in Supabase
    // 1. Create user in Supabase Auth
    // 2. Create model record with status PENDING
    // 3. Send confirmation email + WhatsApp
    // 4. Return model ID
    return NextResponse.json({ success: true, message: 'Cadastro recebido. Aguarde aprovação.' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro ao processar cadastro' }, { status: 400 })
  }
}
