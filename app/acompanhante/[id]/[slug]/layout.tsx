import { Metadata } from 'next'

interface Props {
  params: { id: string; slug: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // In production: fetch from DB
  // const profile = await prisma.escort.findUnique({ where: { id: params.id } })
  // if (!profile) return { title: 'Perfil não encontrado' }

  // Derive a readable name from slug for now
  const name = params.slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://gatadobabado.com.br'
  const url = `${BASE_URL}/acompanhante/${params.id}/${params.slug}`

  const title = `${name} — Acompanhante Premium`
  const description = `Conheça o perfil de ${name} no Gatas do Babado. Fotos reais, perfil verificado, atendimento discreto. Site adulto +18.`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'profile',
      // images: [{ url: profile.mainPhoto, width: 800, height: 1000 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    // JSON-LD structured data for Person schema
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name,
        url,
        description,
      }),
    },
  }
}

export default function ProfileLayout({ children }: Props) {
  return <>{children}</>
}
