import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
    const limit = Math.min(50, Number(searchParams.get('limit') ?? '24'))
    const type = searchParams.get('type')

    const validTypes = ['PHOTO', 'VIDEO', 'STORY']
    const where = {
      status: 'PENDING' as const,
      ...(type && validTypes.includes(type) ? { type: type as 'PHOTO' | 'VIDEO' | 'STORY' } : {}),
    }

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        include: { model: { select: { id: true, stageName: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.media.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: media,
      total,
      page,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('[ADMIN MEDIA PENDING GET]', error)
    return NextResponse.json({ error: 'Erro ao buscar mídias.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { ids, status } = await req.json()
    if (!Array.isArray(ids) || ids.length === 0 || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
    }
    await prisma.media.updateMany({ where: { id: { in: ids } }, data: { status } })
    return NextResponse.json({ success: true, updated: ids.length })
  } catch (error) {
    console.error('[ADMIN MEDIA PENDING PATCH]', error)
    return NextResponse.json({ error: 'Erro ao atualizar mídias.' }, { status: 500 })
  }
}
