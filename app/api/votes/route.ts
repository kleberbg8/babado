import { NextRequest, NextResponse } from 'next/server'
import { getWeekNumber } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { modelId } = await req.json()

    if (!modelId) {
      return NextResponse.json({ error: 'modelId obrigatório' }, { status: 400 })
    }

    const now = new Date()
    const weekNumber = getWeekNumber(now)
    const year = now.getFullYear()

    // In production:
    // 1. Get userId from session
    // 2. Check if user already voted this week (weekly_votes table)
    // 3. If not voted: insert vote, increment model weekly votes
    // 4. Return new vote count via Supabase Realtime

    return NextResponse.json({ success: true, weekNumber, year })
  } catch {
    return NextResponse.json({ error: 'Erro ao registrar voto' }, { status: 500 })
  }
}
