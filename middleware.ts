import { NextRequest, NextResponse } from 'next/server'

// ── Security headers applied to every response ──
const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-DNS-Prefetch-Control': 'off',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
}

// ── Routes that need authentication ──
const PAINEL_PREFIX = '/painel'
const ADMIN_PREFIX = '/admin'

// ── Known scanner/attack patterns to block immediately ──
const ATTACK_PATTERNS = [
  /\.\.[\\/]/,
  /<script/i,
  /union[\s\S]{0,20}select/i,
  /\/etc\/passwd/i,
  /wp-(?:admin|login)/i,
  /xmlrpc\.php/i,
]

function applySecurityHeaders(res: NextResponse) {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(k, v)
  }
  return res
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  )
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const res = NextResponse.next()

  // 1. Security headers on every response
  applySecurityHeaders(res)

  // 2. Block attack patterns in URL
  const rawUrl = req.nextUrl.pathname + req.nextUrl.search
  if (ATTACK_PATTERNS.some((p) => p.test(rawUrl))) {
    console.warn(`[SECURITY] Blocked suspicious request: ${rawUrl} ip=${getIp(req)}`)
    return new NextResponse('Forbidden', { status: 403 })
  }

  // 3. Route protection — only runs if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const needsAuth =
    pathname.startsWith(PAINEL_PREFIX) || pathname.startsWith(ADMIN_PREFIX)

  if (needsAuth && supabaseUrl && supabaseKey) {
    try {
      // Dynamically import to avoid Edge Runtime issues at module load time
      const { createServerClient } = await import('@supabase/auth-helpers-nextjs')

      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          get(name) { return req.cookies.get(name)?.value },
          set(name, value, opts) { res.cookies.set(name, value, opts) },
          remove(name) { res.cookies.delete(name) },
        },
      })

      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('[MIDDLEWARE] Supabase getSession error:', error.message)
        // On auth service error, redirect to login rather than crash
        const loginUrl = new URL('/login', req.url)
        loginUrl.searchParams.set('next', pathname)
        return NextResponse.redirect(loginUrl)
      }

      // /painel/* — requires MODEL or ADMIN role
      if (pathname.startsWith(PAINEL_PREFIX)) {
        if (!session) {
          const loginUrl = new URL('/login', req.url)
          loginUrl.searchParams.set('next', pathname)
          return NextResponse.redirect(loginUrl)
        }
        const role =
          session.user.user_metadata?.role ?? session.user.app_metadata?.role
        if (role !== 'MODEL' && role !== 'ADMIN') {
          return NextResponse.redirect(new URL('/', req.url))
        }
      }

      // /admin/* — requires ADMIN or MODERATOR role
      if (pathname.startsWith(ADMIN_PREFIX)) {
        if (!session) {
          const loginUrl = new URL('/login', req.url)
          loginUrl.searchParams.set('next', pathname)
          loginUrl.searchParams.set('type', 'admin')
          return NextResponse.redirect(loginUrl)
        }
        const role =
          session.user.user_metadata?.role ?? session.user.app_metadata?.role
        if (role !== 'ADMIN' && role !== 'MODERATOR') {
          console.warn(
            `[SECURITY] Unauthorized admin attempt user=${session.user.id} path=${pathname} ip=${getIp(req)}`
          )
          return NextResponse.redirect(new URL('/', req.url))
        }
      }
    } catch (err) {
      // Never let middleware crash the entire request — log and continue
      console.error('[MIDDLEWARE] Unexpected error:', err)

      if (needsAuth) {
        // If Supabase itself throws, redirect to login as safe fallback
        const loginUrl = new URL('/login', req.url)
        loginUrl.searchParams.set('next', pathname)
        return NextResponse.redirect(loginUrl)
      }
    }
  } else if (needsAuth && (!supabaseUrl || !supabaseKey)) {
    // Supabase not configured yet (local dev without .env.local)
    // Allow access so development isn't blocked, but log a warning
    console.warn('[MIDDLEWARE] Supabase env vars not set — skipping auth check for', pathname)
  }

  return res
}

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and images
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
