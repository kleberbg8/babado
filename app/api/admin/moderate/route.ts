import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { getClientIp, sanitize } from '@/lib/security'
import { checkRateLimit, getRatelimitLoose } from '@/lib/rate-limit'

const ALLOWED_ACTIONS = ['APPROVE', 'REJECT', 'SUSPEND', 'BAN'] as const
const ALLOWED_TARGET_TYPES = ['MODEL', 'MEDIA', 'REVIEW', 'USER'] as const
type AllowedAction = typeof ALLOWED_ACTIONS[number]
type AllowedTargetType = typeof ALLOWED_TARGET_TYPES[number]

function makeSupabase() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set(name, value, options) { cookieStore.set(name, value, options) },
        remove(name) { cookieStore.delete(name) },
      },
    }
  )
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers)

  const { allowed } = await checkRateLimit(getRatelimitLoose(), `mod:${ip}`)
  if (!allowed) {
    return NextResponse.json({ error: 'Limite atingido.' }, { status: 429 })
  }

  const supabase = makeSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const role = session.user.user_metadata?.role ?? session.user.app_metadata?.role
  if (role !== 'ADMIN' && role !== 'MODERATOR') {
    console.warn(`[SECURITY] Unauthorized moderation: user=${session.user.id} ip=${ip}`)
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const targetType = sanitize(String(body.targetType ?? '')) as AllowedTargetType
    const targetId = sanitize(String(body.targetId ?? ''))
    const action = sanitize(String(body.action ?? '')) as AllowedAction
    const reason = body.reason ? sanitize(String(body.reason)) : undefined

    if (!targetType || !targetId || !action) {
      return NextResponse.json({ error: 'Parâmetros obrigatórios ausentes.' }, { status: 400 })
    }
    if (!ALLOWED_ACTIONS.includes(action)) {
      return NextResponse.json({ error: 'Ação inválida.' }, { status: 400 })
    }
    if (!ALLOWED_TARGET_TYPES.includes(targetType)) {
      return NextResponse.json({ error: 'Tipo de alvo inválido.' }, { status: 400 })
    }
    if (action === 'BAN' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Apenas administradores podem banir.' }, { status: 403 })
    }

    // TODO (production): DB update + audit log + notification
    // await prisma.$transaction([
    //   prisma.escort.update({ where: { id: targetId }, data: { status: mapAction(action) } }),
    //   prisma.auditLog.create({ data: { actorId: session.user.id, action, targetType, targetId, reason, ip } }),
    // ])

    return NextResponse.json({
      success: true,
      action,
      targetType,
      targetId,
      reason,
      performedBy: session.user.id,
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
