import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [totalModels, activeModels, pendingModels, todayModels, pendingMedia, recentLogs, pendingProfiles] =
      await Promise.all([
        prisma.model.count(),
        prisma.model.count({ where: { status: 'ACTIVE' } }),
        prisma.model.count({ where: { status: 'PENDING' } }),
        prisma.model.count({ where: { createdAt: { gte: today } } }),
        prisma.media.count({ where: { status: 'PENDING' } }),
        prisma.moderationLog.findMany({
          take: 8,
          orderBy: { createdAt: 'desc' },
          include: { moderator: { select: { email: true } } },
        }),
        prisma.model.findMany({
          where: { status: 'PENDING' },
          take: 5,
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            stageName: true,
            city: true,
            state: true,
            createdAt: true,
            medias: { select: { id: true } },
          },
        }),
      ])

    return NextResponse.json({
      success: true,
      data: { totalModels, activeModels, pendingModels, todayModels, pendingMedia, recentLogs, pendingProfiles },
    })
  } catch (error) {
    console.error('[ADMIN STATS]', error)
    return NextResponse.json({ error: 'Erro ao buscar estatísticas.' }, { status: 500 })
  }
}
