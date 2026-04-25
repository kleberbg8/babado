import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { filename, contentType, modelId } = await req.json()

    if (!filename || !contentType || !modelId) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })
    }

    // In production:
    // 1. Validate user session + model ownership
    // 2. Generate Cloudflare R2 presigned PUT URL
    // 3. Return URL + final CDN URL

    const key = `models/${modelId}/${Date.now()}-${filename}`
    const fakePresignedUrl = `https://r2.example.com/${key}?presigned=true`
    const cdnUrl = `https://cdn.example.com/${key}`

    return NextResponse.json({ uploadUrl: fakePresignedUrl, cdnUrl, key })
  } catch {
    return NextResponse.json({ error: 'Erro ao gerar URL de upload' }, { status: 500 })
  }
}
