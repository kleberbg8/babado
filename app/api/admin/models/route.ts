import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sanitize } from '@/lib/security'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const plan = searchParams.get('plan')
    const search = searchParams.get('search')
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
    const limit = Math.min(100, Number(searchParams.get('limit') ?? '50'))

    const where: Record<string, unknown> = {}
    if (status && status !== 'all') where.status = status
    if (plan && plan !== 'all') where.plan = plan
    if (search) {
      where.OR = [
        { stageName: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [models, total] = await Promise.all([
      prisma.model.findMany({
        where,
        include: {
          medias: { select: { id: true, url: true, type: true, status: true, isMain: true, isFace: true, isPremium: true } },
          availability: true,
          services: { include: { service: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.model.count({ where }),
    ])

    return NextResponse.json({ success: true, data: models, total, page, pages: Math.ceil(total / limit) })
  } catch (error) {
    console.error('[ADMIN MODELS GET]', error)
    return NextResponse.json({ error: 'Erro ao buscar modelos.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const stageName = sanitize(String(body.stageName ?? ''))
    const email = sanitize(String(body.email ?? ''))
    const whatsapp = sanitize(String(body.whatsapp ?? ''))
    const city = sanitize(String(body.city ?? ''))
    const state = sanitize(String(body.state ?? '')).toUpperCase()
    const plan = body.plan ?? 'FREE'

    if (!stageName || !email || !city || !state) {
      return NextResponse.json({ error: 'Campos obrigatórios: nome, email, cidade, estado.' }, { status: 400 })
    }

    const slug = `${stageName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${Date.now()}`

    // Create Supabase auth user then model record
    const model = await prisma.model.create({
      data: {
        slug,
        stageName,
        email,
        whatsapp,
        city,
        state,
        plan,
        status: 'PENDING',
        user: {
          create: {
            email,
            role: 'MODEL',
          }
        }
      },
    })

    return NextResponse.json({ success: true, data: model }, { status: 201 })
  } catch (error) {
    console.error('[ADMIN MODELS POST]', error)
    return NextResponse.json({ error: 'Erro ao criar modelo.' }, { status: 500 })
  }
}
