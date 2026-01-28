import { notFound } from 'next/navigation'
import {
  getCityStatsBySlug,
  getCityVendors,
  getCityRoutes,
  searchVehicles,
  getAllCitiesForStatic,
  getTownsByCity,
  getVehicleBrandsWithVehicles,
  getVehicleFilters,
} from '@/lib/data'
import { generateCityPageMetadata, generateBreadcrumbs, generateStructuredData, generateCityFaqSchema } from '@/lib/seo'
import { VehicleGrid } from '@/components/search/vehicle-grid'
import { SearchResultsHeader } from '@/components/search/search-results-header'
import { EmptyState } from '@/components/search/empty-state'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { StructuredData } from '@/components/seo/structured-data'
import { SearchFilters } from '@/components/search/search-filters'
import { Pagination } from '@/components/search/pagination'
import { Suspense } from 'react'
import { CityLandingTemplate } from '@/components/cities/city-landing-template'

interface PageProps {
  params: Promise<{ city: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  isKeywordRoute?: boolean
}

export async function generateStaticParams() {
  const cities = await getAllCitiesForStatic()
  return cities.map((city) => ({
    city: city.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { city: citySlug } = await params
  const stats = await getCityStatsBySlug(citySlug)

  if (!stats || !stats.city) {
    return {
      title: 'City Not Found | Rent Now',
    }
  }

  return generateCityPageMetadata(
    { id: stats.city.id, name: stats.city.name, slug: stats.city.slug },
    stats.vehiclesCount
  )
}

export default async function CityPage({ params, searchParams, isKeywordRoute = false }: PageProps) {
  const { city: citySlug } = await params
  const resolvedSearchParams = await searchParams

  const stats = await getCityStatsBySlug(citySlug)

  if (!stats || !stats.city || !stats.city.isActive) {
    notFound()
  }

  const city = stats.city


  // Parse search params
  const page = parseInt(resolvedSearchParams.page as string) || 1
  const townSlug = resolvedSearchParams.town as string | undefined
  const brandSlug = resolvedSearchParams.brand as string | undefined
  const vehicleSlug = resolvedSearchParams.vehicle as string | undefined
  const vehicleTypeSlug = resolvedSearchParams.vehicleType as string | undefined
  const fuelType = resolvedSearchParams.fuelType as string | undefined
  const transmission = resolvedSearchParams.transmission as string | undefined

  // Fetch towns, brands, and vehicle filters for dropdowns
  const [towns, brands, vehicleFilters] = await Promise.all([
    getTownsByCity(city.id),
    getVehicleBrandsWithVehicles(),
    getVehicleFilters(),
  ])

  // Filter towns to only show those with available vehicles
  const townsWithVehicles = towns.filter(t => t._count.vehicles > 0)

  // Search vehicles
  const { vehicles, total, totalPages } = await searchVehicles({
    citySlug,
    townSlug,
    brandSlug,
    vehicleSlug,
    vehicleTypeSlug,
    fuelType,
    transmission,
    page,
    limit: 12,
  })

  // Generate SEO data
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
  const faqSchema = generateCityFaqSchema(city.name)

  const [vendors, routes] = await Promise.all([
    getCityVendors(citySlug, 6),
    getCityRoutes(citySlug, 6),
  ])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <StructuredData data={[...structuredData, faqSchema]} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 lg:sticky lg:top-8 lg:self-start">
            <Suspense fallback={<div>Loading filters...</div>}>
              <SearchFilters
                citySlug={citySlug}
                townSlug={townSlug}
                brandSlug={brandSlug}
                vehicleSlug={vehicleSlug}
                fuelType={fuelType}
                transmission={transmission}
                towns={townsWithVehicles.map(t => ({ id: t.id, name: t.name, slug: t.slug }))}
                brands={brands.map(b => ({ id: b.id, name: b.name, slug: b.slug }))}
                vehicleModels={vehicleFilters.map(vm => ({ 
                  id: vm.id, 
                  name: `${vm.brand.name} ${vm.name}`, 
                  slug: vm.slug,
                  brandSlug: vm.brand.slug,
                }))}
              />
            </Suspense>
          </aside>

          <main className="lg:col-span-3">
            <SearchResultsHeader
              city={city.name}
              total={total}
              showing={vehicles.length}
            />

            {vehicles.length > 0 ? (
              <>
                <VehicleGrid
                  vehicles={vehicles.map(v => ({
                    ...v,
                    images: Array.isArray(v.images) ? (v.images as string[]) : null,
                  }))}
                />
                {totalPages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    // Use the keyword-friendly `/rent-a-car/{city}` pattern for pagination links
                    basePath={`/rent-a-car/${citySlug}`}
                  />
                )}
              </>
            ) : !isKeywordRoute ? (
              <EmptyState city={city.name} />
            ) : null}
          </main>
        </div>

        <CityLandingTemplate
          city={city}
          vehiclesCount={stats.vehiclesCount}
          vendorsCount={stats.vendorsCount}
          routesCount={stats.routesCount}
          vendors={vendors}
          routes={routes}
        />
      </div>
    </div>
  )
}
