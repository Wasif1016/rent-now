import type { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  city?: string
  path: string
  vehicleCount?: number
}

const siteName = 'Rent Now'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rentnow.com'

export function generateMetadata(config: SEOConfig): Metadata {
  const { title, description, path } = config
  
  const canonical = `${siteUrl}${path}`
  
  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function generateCityPageMetadata(city: string, vehicleCount: number): Metadata {
  return generateMetadata({
    title: `Rent Cars in ${city} | Best Car Rental Deals | ${siteName}`,
    description: `Find the best car rental deals in ${city}. Browse ${vehicleCount}+ vehicles from trusted vendors. Compare features and book instantly.`,
    city,
    path: `/rent-cars/${city.toLowerCase().replace(/\s+/g, '-')}`,
    vehicleCount,
  })
}

export function generateBreadcrumbs(city?: string) {
  const items = [
    {
      name: 'Home',
      url: '/',
    },
  ]

  if (city) {
    items.push({
      name: `Rent Cars in ${city}`,
      url: `/rent-cars/${city.toLowerCase().replace(/\s+/g, '-')}`,
    })
  }

  return items
}

export function generateStructuredData(
  city?: string,
  vehicles?: Array<{
    id: string
    title: string
    slug: string
    images: string[] | null
    vendor: { name: string }
  }>
) {
  const structuredData: any[] = []

  // BreadcrumbList
  const breadcrumbs = generateBreadcrumbs(city)
  structuredData.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  })

  // ItemList for search results
  if (vehicles && vehicles.length > 0) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Cars for Rent in ${city}`,
      description: `Browse available cars for rent in ${city}`,
      numberOfItems: vehicles.length,
      itemListElement: vehicles.map((vehicle, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: vehicle.title,
          description: `${vehicle.title} available for rent`,
          url: `${siteUrl}/vehicles/${vehicle.slug}`,
          image: vehicle.images?.[0] || '',
          brand: {
            '@type': 'Brand',
            name: vehicle.vendor.name,
          },
        },
      })),
    })
  }

  return structuredData
}
