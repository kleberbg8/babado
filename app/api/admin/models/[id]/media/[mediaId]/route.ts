import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: { id: string; mediaId: string } }

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json()
    const validStatus = ['APPROVED', 'REJECTED', 'PENDING']
    if (body.status && !validStatus.includes(body.status)) {
      return NextResponse.json({ error: 'Status inválido.' }, { status: 400 })
    }
    const data: Record<string, unknown> = {}
    if (body.status !== undefined) data.status = body.status
    if (body.rejectReason !== undefined) data.rejectReason = body.rejectReason || null
    if (body.isMain !== undefined) data.isMain = Boolean(body.isMain)
    if (body.isFace !== undefined) data.isFace = Boolean(body.isFace)
    if (body.isPremium !== undefined) data.isPremium = Boolean(body.isPremium)

    const media = await prisma.media.update({ where: { id: params.mediaId }, data })
    return NextResponse.json({ success: true, data: media })
  } catch (error) {
    console.error('[ADMIN MEDIA PATCH]', error)
    return NextResponse.json({ error: 'Erro ao atualizar mídia.' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    await prisma.media.delete({ where: { id: params.mediaId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[ADMIN MEDIA DELETE]', error)
    return NextResponse.json({ error: 'Erro ao excluir mídia.' }, { status: 500 })
  }
}
