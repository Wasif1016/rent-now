import { notFound } from 'next/navigation'
import { getCityBySlug, searchVehicles } from '@/lib/data'
import { generateAirportPageMetadata, generateBreadcrumbs, generateStructuredData } from '@/lib/seo'
import { VehicleGrid } from '@/components/search/vehicle-grid'
import { EmptyState } from '@/components/search/empty-state'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { StructuredData } from '@/components/seo/structured-data'

interface PageProps {
  params: Promise<{ city: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { city: citySlug } = await params
  const city = await getCityBySlug(citySlug)

  if (!city) {
    return {
      title: 'Airport Transfer | Rent Now',
    }
  }

  return generateAirportPageMetadata({
    id: city.id,
    name: city.name,
    slug: city.slug,
  })
}

export default async function AirportTransferCityPage({ params }: PageProps) {
  const { city: citySlug } = await params

  const city = await getCityBySlug(citySlug)

  if (!city || !city.isActive) {
    notFound()
  }

  // Reuse existing search by city, but this page focuses on airport transfers,
  // so we simply highlight vehicles in this city.
  const { vehicles } = await searchVehicles({
    citySlug,
    page: 1,
    limit: 12,
  })

  const breadcrumbs = generateBreadcrumbs(city.name)
  const structuredData = generateStructuredData(
    city.name,
    vehicles.map(v => ({
      id: v.id,
      title: v.title,
      slug: v.slug,
      images: Array.isArray(v.images) ? (v.images as string[]) : null,
      vendor: { name: v.vendor.name },
    }))
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <StructuredData data={structuredData} />

        <h1 className="text-3xl font-bold mb-4">
          Airport Transfer in {city.name}
        </h1>
        <p className="text-muted-foreground mb-6">
          Book reliable airport pick &amp; drop in {city.name}. Professional drivers, clean vehicles,
          and a simple 2% advance to confirm your booking.
        </p>

        {vehicles.length > 0 ? (
          <VehicleGrid
            vehicles={vehicles.map(v => ({
              ...v,
              images: Array.isArray(v.images) ? (v.images as string[]) : null,
            }))}
          />
        ) : (
          <EmptyState city={city.name} />
        )}
      </div>
    </div>
  )
}


