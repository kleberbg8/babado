// Input sanitization — strips HTML tags and trims whitespace
export function sanitize(value: string): string {
  return value
    .replace(/<[^>]*>/g, '')     // strip HTML tags
    .replace(/[<>"'`]/g, '')     // strip remaining dangerous chars
    .trim()
    .slice(0, 5000)              // hard cap to prevent DoS via long strings
}

export function sanitizePhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, 15)
}

export function sanitizeUrl(value: string): string {
  try {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol)) return ''
    return url.toString()
  } catch {
    return ''
  }
}

// IP extraction — handles proxies/Cloudflare/Vercel
export function getClientIp(headers: Headers): string {
  return (
    headers.get('cf-connecting-ip') ??
    headers.get('x-real-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'unknown'
  )
}

// ALLOWED_CONTENT_TYPES for media uploads
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
]

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/webm',
]

export const MAX_IMAGE_SIZE = 20 * 1024 * 1024  // 20 MB
export const MAX_VIDEO_SIZE = 500 * 1024 * 1024 // 500 MB

export function isAllowedMediaType(contentType: string, kind: 'image' | 'video' | 'any'): boolean {
  if (kind === 'image') return ALLOWED_IMAGE_TYPES.includes(contentType)
  if (kind === 'video') return ALLOWED_VIDEO_TYPES.includes(contentType)
  return [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].includes(contentType)
}

// Generates a path-safe unique key for R2 storage
export function buildStorageKey(modelId: string, filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? 'bin'
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 60)
  const ts = Date.now()
  const rand = Math.random().toString(36).slice(2, 8)
  return `models/${modelId}/${ts}-${rand}-${safe}.${ext}`
}

// Constant-time string comparison — prevents timing attacks
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}
