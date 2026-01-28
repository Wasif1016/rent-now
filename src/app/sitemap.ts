import { MetadataRoute } from 'next'
import { getAllCitiesForStatic } from '@/lib/data'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rentnow.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cities = await getAllCitiesForStatic()

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  // Add city pages (canonical pattern)
  for (const city of cities) {
    sitemap.push({
      url: `${siteUrl}/rent-a-car/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    })
  }

  return sitemap
}
