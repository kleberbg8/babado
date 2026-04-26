import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const media = await prisma.media.findMany({
      where: { modelId: params.id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ success: true, data: media })
  } catch (error) {
    console.error('[ADMIN MEDIA GET]', error)
    return NextResponse.json({ error: 'Erro ao buscar mídias.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    if (!body.url) return NextResponse.json({ error: 'URL é obrigatória.' }, { status: 400 })
    const media = await prisma.media.create({
      data: {
        modelId: params.id,
        url: String(body.url),
        type: body.type || 'PHOTO',
        isFace: Boolean(body.isFace),
        isPremium: Boolean(body.isPremium),
        isMain: Boolean(body.isMain),
        status: 'PENDING',
      },
    })
    return NextResponse.json({ success: true, data: media }, { status: 201 })
  } catch (error) {
    console.error('[ADMIN MEDIA POST]', error)
    return NextResponse.json({ error: 'Erro ao criar mídia.' }, { status: 500 })
  }
}
