import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json()
    const valid = ['ACTIVE', 'PENDING', 'SUSPENDED', 'BANNED']
    if (!valid.includes(status)) {
      return NextResponse.json({ error: 'Status inválido.' }, { status: 400 })
    }
    const model = await prisma.model.update({
      where: { id: params.id },
      data: {
        status,
        ...(status === 'ACTIVE' ? { verifiedAt: new Date() } : {}),
      },
    })
    return NextResponse.json({ success: true, data: model })
  } catch (error) {
    console.error('[ADMIN MODEL STATUS]', error)
    return NextResponse.json({ error: 'Erro ao atualizar status.' }, { status: 500 })
  }
}
