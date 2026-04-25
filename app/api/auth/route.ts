import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { checkRateLimit, getRatelimitStrict } from '@/lib/rate-limit'
import { getClientIp, sanitize } from '@/lib/security'

function makeSupabase() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set(name, value, opts) { cookieStore.set(name, value, opts) },
        remove(name) { cookieStore.delete(name) },
      },
    }
  )
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers)

  const { allowed } = await checkRateLimit(getRatelimitStrict(), `auth:${ip}`)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Aguarde alguns instantes.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const action = sanitize(String(body.action ?? ''))
    const supabase = makeSupabase()

    // ── LOGIN ──
    if (action === 'login') {
      const email = sanitize(String(body.email ?? ''))
      const password = String(body.password ?? '')

      if (!email || !password) {
        return NextResponse.json({ error: 'E-mail e senha são obrigatórios.' }, { status: 400 })
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        // Generic message prevents email enumeration
        return NextResponse.json(
          { error: 'Credenciais inválidas. Verifique e-mail e senha.' },
          { status: 401 }
        )
      }

      const role = data.user?.user_metadata?.role ?? data.user?.app_metadata?.role ?? 'VISITOR'
      return NextResponse.json({
        success: true,
        role,
        user: { id: data.user?.id, email: data.user?.email },
      })
    }

    // ── REGISTER ──
    if (action === 'register') {
      const email = sanitize(String(body.email ?? ''))
      const password = String(body.password ?? '')
      const stageName = sanitize(String(body.stageName ?? ''))
      const whatsapp = sanitize(String(body.whatsapp ?? ''))

      if (!email || !password || !stageName) {
        return NextResponse.json({ error: 'Dados obrigatórios ausentes.' }, { status: 400 })
      }
      if (password.length < 8) {
        return NextResponse.json({ error: 'Senha mínima: 8 caracteres.' }, { status: 400 })
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: 'MODEL', stageName, whatsapp },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
        },
      })

      if (error) {
        if (error.message.includes('already registered')) {
          return NextResponse.json({ error: 'E-mail já cadastrado.' }, { status: 409 })
        }
        return NextResponse.json({ error: 'Erro ao criar conta.' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Conta criada! Verifique seu e-mail para ativar o acesso.',
        userId: data.user?.id,
      })
    }

    // ── LOGOUT ──
    if (action === 'logout') {
      await supabase.auth.signOut()
      return NextResponse.json({ success: true })
    }

    // ── FORGOT PASSWORD ──
    if (action === 'forgot') {
      const email = sanitize(String(body.email ?? ''))
      if (!email) return NextResponse.json({ error: 'E-mail obrigatório.' }, { status: 400 })

      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/redefinir-senha`,
      })
      // Always return 200 — prevents email enumeration
      return NextResponse.json({
        success: true,
        message: 'Se o e-mail existir, você receberá as instruções em breve.',
      })
    }

    return NextResponse.json({ error: 'Ação inválida.' }, { status: 400 })

  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
