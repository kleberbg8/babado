import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Lazy singleton — only initializes when env vars are present
let _redis: Redis | null = null
let _ratelimitStrict: Ratelimit | null = null
let _ratelimitLoose: Ratelimit | null = null

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return _redis
}

// 10 requests / 10s — for auth endpoints (login, register)
export function getRatelimitStrict(): Ratelimit | null {
  const redis = getRedis()
  if (!redis) return null
  if (!_ratelimitStrict) {
    _ratelimitStrict = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'),
      analytics: false,
      prefix: 'rl:strict',
    })
  }
  return _ratelimitStrict
}

// 60 requests / 60s — for general API endpoints
export function getRatelimitLoose(): Ratelimit | null {
  const redis = getRedis()
  if (!redis) return null
  if (!_ratelimitLoose) {
    _ratelimitLoose = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, '60 s'),
      analytics: false,
      prefix: 'rl:loose',
    })
  }
  return _ratelimitLoose
}

export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string,
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  if (!limiter) return { allowed: true, remaining: 999, reset: 0 }
  const { success, remaining, reset } = await limiter.limit(identifier)
  return { allowed: success, remaining, reset }
}
