import { NextRequest, NextResponse } from 'next/server'
import { getClientIp } from '@/lib/security'
import { checkRateLimit, getRatelimitLoose } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  const ip = getClientIp(req.headers)

  const { allowed } = await checkRateLimit(getRatelimitLoose(), `models:${ip}`)
  if (!allowed) {
    return NextResponse.json({ error: 'Limite atingido.' }, { status: 429 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const city = searchParams.get('cidade')
    const state = searchParams.get('estado')
    const orderBy = searchParams.get('ordem') ?? 'featured'
    const page = Math.max(1, Number(searchParams.get('pagina') ?? '1'))
    const perPage = Math.min(50, Number(searchParams.get('por_pagina') ?? '12'))
    const onlyVerified = searchParams.get('verificadas') === 'true'
    const onlyOnline = searchParams.get('online') === 'true'
    const priceMin = searchParams.get('preco_min') ? Number(searchParams.get('preco_min')) : undefined
    const priceMax = searchParams.get('preco_max') ? Number(searchParams.get('preco_max')) : undefined

    // TODO: Connect to Prisma when DATABASE_URL is available in production
    // In production on Vercel, this will query the actual Supabase database
    const data: Record<string, unknown>[] = []
    const total = 0

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
      filters: { city, state, orderBy, onlyVerified, onlyOnline, priceMin, priceMax },
    })
  } catch (error) {
    console.error('[MODELS] Error:', error)
    return NextResponse.json({ error: 'Erro ao listar modelos.' }, { status: 500 })
  }
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
