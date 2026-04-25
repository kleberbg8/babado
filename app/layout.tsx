import type { Metadata } from 'next'
import { Playfair_Display, Outfit } from 'next/font/google'
import './globals.css'
import AgeGate from '@/components/ui/AgeGate'
import { Toaster } from '@/components/ui/Toaster'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://gatadobabado.com.br'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Gatas do Babado — Acompanhantes Premium no Brasil',
    template: '%s | Gatas do Babado',
  },
  description:
    'Encontre as melhores acompanhantes premium em todo o Brasil. Perfis verificados, fotos reais, atendimento discreto. Site adulto +18.',
  keywords: [
    'acompanhantes', 'acompanhantes premium', 'escort brasil',
    'perfis verificados', 'acompanhantes sp', 'acompanhantes rj',
    'gatas do babado',
  ],
  authors: [{ name: 'Gatas do Babado' }],
  creator: 'Gatas do Babado',
  publisher: 'Gatas do Babado',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: BASE_URL,
    siteName: 'Gatas do Babado',
    title: 'Gatas do Babado — Acompanhantes Premium no Brasil',
    description: 'Perfis verificados, fotos reais. Site adulto +18.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Gatas do Babado' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gatas do Babado — Acompanhantes Premium',
    description: 'Perfis verificados, fotos reais. Site adulto +18.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${playfairDisplay.variable} ${outfit.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#0D0A0C] text-[#F8F0F4] font-sans antialiased">
        <AgeGate />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
