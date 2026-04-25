import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://gatadobabado.com.br'

// Static pages that should always be in the sitemap
const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  { url: `${BASE_URL}/acompanhantes`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
  { url: `${BASE_URL}/gatas-da-semana`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/cidades`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/planos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE_URL}/cadastrar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // In production: fetch active model profiles from DB and add their URLs
  // const models = await prisma.escort.findMany({
  //   where: { status: 'ACTIVE' },
  //   select: { id: true, slug: true, updatedAt: true },
  // })
  //
  // const modelPages: MetadataRoute.Sitemap = models.map((m) => ({
  //   url: `${BASE_URL}/acompanhante/${m.id}/${m.slug}`,
  //   lastModified: m.updatedAt,
  //   changeFrequency: 'daily',
  //   priority: 0.8,
  // }))
  //
  // return [...STATIC_PAGES, ...modelPages]

  return STATIC_PAGES
}
