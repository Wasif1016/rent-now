import { HeroSearchForm } from '@/components/hero/hero-search-form'
import { getCitiesWithVehicles, getVehicleFilters } from '@/lib/data'

export async function CitiesHeroSection() {
  // Fetch cities and vehicle models in parallel using Server Components
  const [cities, vehicleFilters] = await Promise.all([
    getCitiesWithVehicles(),
    getVehicleFilters(),
  ])

  // Transform data to minimize serialization
  const citiesData = cities.map(city => ({
    id: city.id,
    name: city.name,
    slug: city.slug,
    province: city.province,
  }))

  const vehicleModelsData = vehicleFilters.map(model => ({
    id: model.id,
    name: model.name,
    slug: model.slug,
    brand: {
      id: model.brand.id,
      name: model.brand.name,
      slug: model.brand.slug,
    },
  }))

  return (
    <section className="relative bg-background min-h-[60vh] px-6 py-12 lg:py-20 overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#1a1a1a]" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 mt-20">
            Car Rental Services in 100+ Cities Across Pakistan
          </h1>
          <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto">
            From major metropolitan hubs to remote scenic towns, book verified vehicles with professional drivers for every journey. Discover the luxury of convenience nationwide.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <HeroSearchForm cities={citiesData} vehicleModels={vehicleModelsData} />
        </div>
      </div>
    </section>
  )
}

