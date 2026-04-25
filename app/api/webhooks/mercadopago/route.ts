import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-signature') ?? ''
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET ?? ''

    // Validate Mercado Pago signature
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
    if (signature !== expected) {
      return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 })
    }

    const event = JSON.parse(body)

    if (event.type === 'payment') {
      const paymentId = event.data?.id
      // In production:
      // 1. Fetch payment details from Mercado Pago API
      // 2. Update payment status in DB
      // 3. If SUBSCRIPTION: activate plan, set expires_at
      // 4. If COINS: add coins to balance
      // 5. Send WhatsApp notification
      console.log('Payment webhook received:', paymentId)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Erro no processamento' }, { status: 500 })
  }
}
