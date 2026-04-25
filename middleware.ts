import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getRatelimitStrict, getRatelimitLoose } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/security'

const PAINEL_PATHS = ['/painel']
const ADMIN_PATHS = ['/admin']
const STRICT_RL_PATHS = ['/api/auth', '/api/models']

const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-DNS-Prefetch-Control': 'off',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.mercadopago.com",
    "media-src 'self' https:",
    "frame-ancestors 'none'",
  ].join('; '),
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  let res = NextResponse.next()

  // ── 1. Security headers on every response ──
  Object.entries(SECURITY_HEADERS).forEach(([k, v]) => res.headers.set(k, v))

  // ── 2. Block known attack patterns ──
  const suspiciousPatterns = [
    /\.\.[/\\]/,
    /<script/i,
    /union.{0,20}select/i,
    /\/etc\/passwd/i,
    /\.php$/i,
    /wp-(?:admin|login)/i,
    /xmlrpc\.php/i,
  ]
  if (suspiciousPatterns.some((p) => p.test(req.url))) {
    console.warn(`[SECURITY] Blocked: ${req.url} ip=${getClientIp(req.headers)}`)
    return new NextResponse('Forbidden', { status: 403 })
  }

  // ── 3. Rate limiting on API routes ──
  const ip = getClientIp(req.headers)
  if (pathname.startsWith('/api/')) {
    const isStrict = STRICT_RL_PATHS.some((p) => pathname.startsWith(p))
    const limiter = isStrict ? getRatelimitStrict() : getRatelimitLoose()
    const { allowed, remaining } = await checkRateLimit(limiter, ip)
    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Muitas tentativas. Aguarde um momento.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }
    res.headers.set('X-RateLimit-Remaining', String(remaining))
  }

  // ── 4. Supabase session refresh ──
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return req.cookies.get(name)?.value },
        set(name, value, options) { res.cookies.set(name, value, options) },
        remove(name, options) { res.cookies.delete({ name, ...options }) },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // ── 5. Protect /painel/* ──
  const isPainel = PAINEL_PATHS.some((p) => pathname.startsWith(p))
  if (isPainel) {
    if (!session) {
      const url = new URL('/login', req.url)
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
    const role = session.user.user_metadata?.role ?? session.user.app_metadata?.role
    if (role !== 'MODEL' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // ── 6. Protect /admin/* ──
  const isAdmin = ADMIN_PATHS.some((p) => pathname.startsWith(p))
  if (isAdmin) {
    if (!session) {
      const url = new URL('/login', req.url)
      url.searchParams.set('next', pathname)
      url.searchParams.set('type', 'admin')
      return NextResponse.redirect(url)
    }
    const role = session.user.user_metadata?.role ?? session.user.app_metadata?.role
    if (role !== 'ADMIN' && role !== 'MODERATOR') {
      console.warn(`[SECURITY] Unauthorized admin access: user=${session.user.id} path=${pathname} ip=${ip}`)
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
}
