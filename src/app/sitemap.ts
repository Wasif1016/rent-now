import { MetadataRoute } from 'next'
import { KEYWORDS } from '@/lib/routes-config'
import {
  getAllCitiesForStatic,
  getCategorySlugs,
  getModelSlugs,
  getRoutesForSitemap,
} from '@/lib/data'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'www.rentnowpk.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const keywordSlugs = Object.keys(KEYWORDS)
  const [cities, categorySlugs, modelSlugs, routeSlugs] = await Promise.all([
    getAllCitiesForStatic(),
    getCategorySlugs(),
    getModelSlugs(),
    getRoutesForSitemap(),
  ])

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  // Keyword-only pages
  for (const slug of keywordSlugs) {
    sitemap.push({
      url: `${siteUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  // Keyword + city pages
  for (const keyword of keywordSlugs) {
    for (const city of cities) {
      sitemap.push({
        url: `${siteUrl}/${keyword}/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      })
    }
  }

  // Vehicle category pages
  for (const slug of categorySlugs) {
    sitemap.push({
      url: `${siteUrl}/vehicles/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  // Vehicle model pages
  for (const slug of modelSlugs) {
    sitemap.push({
      url: `${siteUrl}/vehicles/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  // Route pages (only routes with vehicles)
  for (const r of routeSlugs) {
    sitemap.push({
      url: `${siteUrl}/routes/${r.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }

  // Keyword + route pages (e.g. rent-a-car/lahore-to-islamabad)
  const rentACarSlug = keywordSlugs.includes('rent-a-car') ? 'rent-a-car' : keywordSlugs[0]
  for (const r of routeSlugs) {
    sitemap.push({
      url: `${siteUrl}/${rentACarSlug}/${r.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }

  return sitemap
}
