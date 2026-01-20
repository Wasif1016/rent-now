import { redirect } from 'next/navigation'
import { getCityBySlug, searchVehicles, getTownsByCity, getVehicleBrandsWithVehicles, getVehicleFilters } from '@/lib/data'
import { VehicleGrid } from '@/components/search/vehicle-grid'
import { SearchResultsHeader } from '@/components/search/search-results-header'
import { EmptyState } from '@/components/search/empty-state'
import { SearchFilters } from '@/components/search/search-filters'
import { Pagination } from '@/components/search/pagination'
import { Suspense } from 'react'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams
  const citySlug = params.city as string | undefined

  // If we have city, redirect to canonical URL
  if (citySlug) {
    const city = await getCityBySlug(citySlug)
    if (city) {
      // Redirect to city-only page
      const canonicalUrl = `/rent-cars/${citySlug}`
      const queryParams = new URLSearchParams()
      if (params.town) queryParams.set('town', params.town as string)
      if (params.brand) queryParams.set('brand', params.brand as string)
      if (params.fuelType) queryParams.set('fuelType', params.fuelType as string)
      if (params.transmission) queryParams.set('transmission', params.transmission as string)
      if (params.page && params.page !== '1') queryParams.set('page', params.page as string)
      
      const fullUrl = canonicalUrl + (queryParams.toString() ? `?${queryParams.toString()}` : '')
      redirect(fullUrl)
    }
  }

  // Fallback: show search results with query params
  const page = parseInt(params.page as string) || 1
  const townSlug = params.town as string | undefined
  const brandSlug = params.brand as string | undefined
  const vehicleSlug = params.vehicle as string | undefined
  const fuelType = params.fuelType as string | undefined
  const transmission = params.transmission as string | undefined

  // Fetch towns, brands, and vehicle models for filters (if city is selected)
  let towns: Array<{ id: string; name: string; slug: string }> = []
  let brands: Array<{ id: string; name: string; slug: string }> = []
  let vehicleModels: Array<{ id: string; name: string; slug: string; brandSlug: string }> = []
  
  const [brandsData, vehicleFilters] = await Promise.all([
    getVehicleBrandsWithVehicles(),
    getVehicleFilters(),
  ])
  brands = brandsData.map(b => ({ id: b.id, name: b.name, slug: b.slug }))
  vehicleModels = vehicleFilters.map(vm => ({ 
    id: vm.id, 
    name: `${vm.brand.name} ${vm.name}`, 
    slug: vm.slug,
    brandSlug: vm.brand.slug,
  }))
  
  if (citySlug) {
    const city = await getCityBySlug(citySlug)
    if (city) {
      const townsData = await getTownsByCity(city.id)
      towns = townsData.filter(t => t._count.vehicles > 0).map(t => ({ id: t.id, name: t.name, slug: t.slug }))
    }
  }

  const { vehicles, total, totalPages } = await searchVehicles({
    citySlug,
    townSlug,
    brandSlug,
    vehicleSlug,
    fuelType,
    transmission,
    page,
    limit: 12,
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
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
                towns={towns}
                brands={brands}
                vehicleModels={vehicleModels}
              />
            </Suspense>
          </aside>

          <main className="lg:col-span-3">
            <SearchResultsHeader total={total} showing={vehicles.length} />

            {vehicles.length > 0 ? (
              <>
                <VehicleGrid vehicles={vehicles.map(v => ({
                  ...v,
                  images: Array.isArray(v.images) ? (v.images as string[]) : null,
                }))} />
                {totalPages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    basePath="/search"
                  />
                )}
              </>
            ) : (
              <EmptyState />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
