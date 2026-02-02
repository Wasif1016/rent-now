import type { Metadata } from 'next'
import { prisma } from './prisma'

interface SEOConfig {
  title: string
  description: string
  city?: string
  path: string
  vehicleCount?: number
}

const siteName = 'Rent Now'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rentnow.com'

function applyTemplate(template: string, variables: Record<string, string | number | undefined | null>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = variables[key]
    return value !== undefined && value !== null ? String(value) : ''
  })
}

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

export async function generateCityPageMetadata(
  city: { id: string; name: string; slug: string },
  vehicleCount: number
): Promise<Metadata> {
  // Try to resolve DB-driven SEO templates first
  try {
    const seoDimension = await (prisma as any).seoDimension.findFirst({
      where: {
        slug: 'rent-a-car-city',
        type: 'keyword_city',
      },
      include: {
        cityOverrides: {
          where: {
            cityId: city.id,
          },
          take: 1,
        },
        faqGroup: {
          include: {
            faqs: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
        },
      },
    })

    if (seoDimension) {
      const override = seoDimension.cityOverrides[0]

      const titleTemplate = override?.titleTemplate || seoDimension.defaultTitleTemplate
      const descriptionTemplate = override?.metaDescriptionTemplate || seoDimension.defaultMetaDescriptionTemplate

      const variables = {
        city_name: city.name,
        city_slug: city.slug,
        vehicles_count: vehicleCount,
      }

      const title = applyTemplate(titleTemplate, variables)
      const description = applyTemplate(descriptionTemplate, variables)

      return generateMetadata({
        title,
        description,
        city: city.name,
        // Canonical city rental URL uses the `/rent-a-car/{city}` keyword pattern
        path: `/rent-a-car/${city.slug}`,
        vehicleCount,
      })
    }
  } catch (error) {
    // Fail gracefully and fall back to simple template
    console.error('Error generating city SEO metadata from DB templates', error)
  }

  // Fallback: simple programmatic template
  return generateMetadata({
    title: `Rent a Car in ${city.name} | Best Car Rental Deals | ${siteName}`,
    description: `Find the best car rental deals in ${city.name}. Browse ${vehicleCount}+ vehicles from trusted vendors. Compare vehicles, routes, and prices before booking.`,
    city: city.name,
    path: `/rent-a-car/${city.slug}`,
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
      name: `Rent a Car in ${city}`,
      // Keep breadcrumb URLs aligned with the `/rent-a-car/{city}` keyword pattern
      url: `/rent-a-car/${city.toLowerCase().replace(/\s+/g, '-')}`,
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
          url: `${siteUrl}/listings/${vehicle.slug}`,
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

export function generateCityFaqSchema(city: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How much does it cost to rent a car in ${city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Prices vary by vehicle type, distance, and duration. Within city, daily packages are common, while intercity trips from ${city} are usually priced per trip or per kilometer.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I book a car with driver in ${city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, most listings in ${city} include a professional driver who is familiar with local routes and highway safety requirements.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is advance payment required for car rental in ${city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Many vendors ask for a small advance to confirm bookings from ${city}, especially for outstation trips and busy dates.`,
        },
      },
      {
        '@type': 'Question',
        name: `Which cities can I travel to from ${city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You can usually book intercity routes from ${city} to major cities and tourist destinations across Pakistan. Ask your vendor for route-specific pricing and options.`,
        },
      },
    ],
  }
}

export async function generateRoutePageMetadata(params: {
  fromCity: { id: string; name: string; slug: string }
  toCity: { id: string; name: string; slug: string }
}): Promise<Metadata> {
  const { fromCity, toCity } = params

  try {
    const seoDimension = await (prisma as any).seoDimension.findFirst({
      where: {
        slug: 'route-rent-a-car',
        type: 'route',
      },
      include: {
        faqGroup: {
          include: {
            faqs: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
        },
      },
    })

    if (seoDimension) {
      const variables = {
        from_city: fromCity.name,
        to_city: toCity.name,
        from_slug: fromCity.slug,
        to_slug: toCity.slug,
      }

      const title = applyTemplate(seoDimension.defaultTitleTemplate, variables)
      const description = applyTemplate(seoDimension.defaultMetaDescriptionTemplate, variables)

      return generateMetadata({
        title,
        description,
        path: `/routes/${fromCity.slug}-to-${toCity.slug}`,
      })
    }
  } catch (error) {
    console.error('Error generating route SEO metadata from DB templates', error)
  }

  return generateMetadata({
    title: `Rent a Car from ${fromCity.name} to ${toCity.name} | Intercity Route | ${siteName}`,
    description: `Book reliable vehicles with drivers for the ${fromCity.name} to ${toCity.name} route. Compare vendors, capacity, and prices before confirming your booking.`,
    path: `/routes/${fromCity.slug}-to-${toCity.slug}`,
  })
}

export async function generateAirportPageMetadata(city: {
  id: string
  name: string
  slug: string
}): Promise<Metadata> {
  try {
    const seoDimension = await (prisma as any).seoDimension.findFirst({
      where: {
        slug: 'airport-transfer-city',
        type: 'airport_transfer',
      },
      include: {
        faqGroup: {
          include: {
            faqs: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
        },
      },
    })

    if (seoDimension) {
      const variables = {
        city_name: city.name,
        city_slug: city.slug,
      }

      const title = applyTemplate(seoDimension.defaultTitleTemplate, variables)
      const description = applyTemplate(seoDimension.defaultMetaDescriptionTemplate, variables)

      return generateMetadata({
        
        title,
        description,
        path: `/airport-transfer/${city.slug}`,
      })
    }
  } catch (error) {
    console.error('Error generating airport SEO metadata from DB templates', error)
  }

  return generateMetadata({
    title: `Airport Transfer in ${city.name} | Reliable Pick & Drop | ${siteName}`,
    description: `Book airport transfers in ${city.name} with professional drivers and clean vehicles. Perfect for business trips, family arrivals, and late-night flights.`,
    path: `/airport-transfer/${city.slug}`,
  })
}
