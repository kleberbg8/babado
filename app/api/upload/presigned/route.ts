import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import {
  getClientIp,
  isAllowedMediaType,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  buildStorageKey,
  sanitize,
} from '@/lib/security'
import { checkRateLimit, getRatelimitLoose } from '@/lib/rate-limit'

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

function makeS3() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ?? '',
    },
  })
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers)

  const { allowed } = await checkRateLimit(getRatelimitLoose(), `upload:${ip}`)
  if (!allowed) {
    return NextResponse.json({ error: 'Limite de uploads atingido.' }, { status: 429 })
  }

  // Require authenticated session
  const supabase = makeSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const userId = session.user.id

  try {
    const body = await req.json()
    const filename = sanitize(String(body.filename ?? ''))
    const contentType = sanitize(String(body.contentType ?? ''))
    const fileSize = Number(body.fileSize ?? 0)

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'filename e contentType são obrigatórios.' }, { status: 400 })
    }

    const isImage = isAllowedMediaType(contentType, 'image')
    const isVideo = isAllowedMediaType(contentType, 'video')

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Tipo não permitido. Use JPG, PNG, WebP, MP4 ou WebM.' },
        { status: 415 }
      )
    }

    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE
    if (fileSize > maxSize) {
      return NextResponse.json(
        { error: `Arquivo muito grande. Máximo: ${isVideo ? '500MB' : '20MB'}.` },
        { status: 413 }
      )
    }

    // modelId must equal authenticated user — prevents uploading to other profiles
    const modelId = userId
    const key = buildStorageKey(modelId, filename)
    const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME ?? 'gatas-do-babado-media'

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      ContentLength: fileSize || undefined,
      Metadata: { 'uploaded-by': userId, 'model-id': modelId },
    })

    const s3 = makeS3()
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 })
    const cdnUrl = `${process.env.NEXT_PUBLIC_CDN_URL}/${key}`

    return NextResponse.json({ uploadUrl, cdnUrl, key })

  } catch (err) {
    console.error('[UPLOAD] presigned URL error:', err)
    return NextResponse.json({ error: 'Erro ao gerar URL de upload.' }, { status: 500 })
  }
}
