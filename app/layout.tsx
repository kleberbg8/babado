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

export const metadata: Metadata = {
  title: {
    default: 'Gatas do Babado — Acompanhantes Premium no Brasil',
    template: '%s | Gatas do Babado',
  },
  description:
    'Encontre as melhores acompanhantes premium em todo o Brasil. Perfis verificados, fotos reais, atendimento discreto. Site adulto +18.',
  keywords: ['acompanhantes', 'escort', 'premium', 'brasil', 'perfis verificados'],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Gatas do Babado',
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
