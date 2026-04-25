import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json()

    if (action === 'login') {
      // In production: use Supabase Auth
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      return NextResponse.json({ success: true, message: 'Login realizado' })
    }

    if (action === 'logout') {
      // const { error } = await supabase.auth.signOut()
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Erro de autenticação' }, { status: 500 })
  }
}
