import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  // In production: fetch from Supabase, increment view count
  return NextResponse.json({ id, message: 'Model profile endpoint' })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await req.json()
    const { id } = params
    // In production: update model, set status back to PENDING_REVIEW
    return NextResponse.json({ success: true, id })
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 400 })
  }
}
