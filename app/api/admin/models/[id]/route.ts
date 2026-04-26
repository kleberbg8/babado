import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sanitize } from '@/lib/security'

type Params = { params: { id: string } }

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const model = await prisma.model.findUnique({
      where: { id: params.id },
      include: {
        medias: { orderBy: { createdAt: 'desc' } },
        availability: { orderBy: { weekday: 'asc' } },
        services: { include: { service: true } },
        user: { select: { email: true, createdAt: true, role: true } },
        reviews: { where: { status: 'APPROVED' }, take: 5, orderBy: { createdAt: 'desc' } },
      },
    })
    if (!model) return NextResponse.json({ error: 'Modelo não encontrada.' }, { status: 404 })
    return NextResponse.json({ success: true, data: model })
  } catch (error) {
    console.error('[ADMIN MODEL GET]', error)
    return NextResponse.json({ error: 'Erro ao buscar modelo.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json()
    const data: Record<string, unknown> = {}

    if (body.stageName !== undefined) data.stageName = sanitize(String(body.stageName))
    if (body.email !== undefined) data.email = sanitize(String(body.email))
    if (body.whatsapp !== undefined) data.whatsapp = sanitize(String(body.whatsapp))
    if (body.city !== undefined) data.city = sanitize(String(body.city))
    if (body.state !== undefined) data.state = sanitize(String(body.state)).toUpperCase()
    if (body.neighborhood !== undefined) data.neighborhood = body.neighborhood || null
    if (body.bio !== undefined) data.bio = sanitize(String(body.bio))
    if (body.age !== undefined) data.age = body.age ? Number(body.age) : null
    if (body.height !== undefined) data.height = body.height ? Number(body.height) : null
    if (body.weight !== undefined) data.weight = body.weight ? Number(body.weight) : null
    if (body.ethnicity !== undefined) data.ethnicity = body.ethnicity || null
    if (body.hairStyle !== undefined) data.hairStyle = body.hairStyle || null
    if (body.hairSize !== undefined) data.hairSize = body.hairSize || null
    if (body.eyeColor !== undefined) data.eyeColor = body.eyeColor || null
    if (body.hasSilicone !== undefined) data.hasSilicone = Boolean(body.hasSilicone)
    if (body.hasTattoo !== undefined) data.hasTattoo = Boolean(body.hasTattoo)
    if (body.smokes !== undefined) data.smokes = Boolean(body.smokes)
    if (body.serviceType !== undefined) data.serviceType = body.serviceType
    if (body.priceMin !== undefined) data.priceMin = body.priceMin ? Number(body.priceMin) : null
    if (body.priceTable !== undefined) data.priceTable = body.priceTable
    if (body.languages !== undefined) data.languages = body.languages
    if (body.plan !== undefined) data.plan = body.plan
    if (body.status !== undefined) {
      data.status = body.status
      if (body.status === 'ACTIVE' && !body._skipVerify) data.verifiedAt = new Date()
    }
    if (body.isOnline !== undefined) data.isOnline = Boolean(body.isOnline)
    if (body.realName !== undefined) data.realName = body.realName || null
    if (body.gender !== undefined) data.gender = body.gender || null

    const model = await prisma.model.update({ where: { id: params.id }, data })
    return NextResponse.json({ success: true, data: model })
  } catch (error) {
    console.error('[ADMIN MODEL PATCH]', error)
    return NextResponse.json({ error: 'Erro ao atualizar modelo.' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    await prisma.model.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[ADMIN MODEL DELETE]', error)
    return NextResponse.json({ error: 'Erro ao excluir modelo.' }, { status: 500 })
  }
}
