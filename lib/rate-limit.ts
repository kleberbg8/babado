import { RateLimiterRedis, RateLimiterMemory } from 'rate-limiter-flexible'

let _redisClient: import('ioredis').Redis | null = null
let _strictLimiter: RateLimiterRedis | RateLimiterMemory | null = null
let _looseLimiter: RateLimiterRedis | RateLimiterMemory | null = null

async function getRedisClient() {
  if (_redisClient) return _redisClient
  const url = process.env.REDIS_URL
  if (!url) return null
  try {
    const { default: Redis } = await import('ioredis')
    _redisClient = new Redis(url, { lazyConnect: true, enableReadyCheck: false })
    return _redisClient
  } catch {
    return null
  }
}

async function getStrictLimiter() {
  if (_strictLimiter) return _strictLimiter
  const redis = await getRedisClient()
  if (redis) {
    _strictLimiter = new RateLimiterRedis({
      storeClient: redis,
      keyPrefix: 'rl:strict',
      points: 10,
      duration: 10,
    })
  } else {
    _strictLimiter = new RateLimiterMemory({ keyPrefix: 'rl:strict', points: 10, duration: 10 })
  }
  return _strictLimiter
}

async function getLooseLimiter() {
  if (_looseLimiter) return _looseLimiter
  const redis = await getRedisClient()
  if (redis) {
    _looseLimiter = new RateLimiterRedis({
      storeClient: redis,
      keyPrefix: 'rl:loose',
      points: 60,
      duration: 60,
    })
  } else {
    _looseLimiter = new RateLimiterMemory({ keyPrefix: 'rl:loose', points: 60, duration: 60 })
  }
  return _looseLimiter
}

// Keep these for backwards compatibility
export function getRatelimitStrict() { return null }
export function getRatelimitLoose() { return null }

export async function checkRateLimit(
  _limiter: null,
  identifier: string,
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  try {
    const isStrict = identifier.startsWith('auth:')
    const limiter = isStrict ? await getStrictLimiter() : await getLooseLimiter()
    const result = await limiter.consume(identifier)
    return { allowed: true, remaining: result.remainingPoints ?? 0, reset: result.msBeforeNext ?? 0 }
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'remainingPoints' in err) {
      return { allowed: false, remaining: 0, reset: (err as { msBeforeNext?: number }).msBeforeNext ?? 0 }
    }
    return { allowed: true, remaining: 999, reset: 0 }
  }
}
