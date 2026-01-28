import { RouteSearchForm } from './route-search-form'
import { getCitiesWithVehicles } from '@/lib/data'

export async function RouteHeroSection() {
  const cities = await getCitiesWithVehicles()

  const citiesData = cities.map(city => ({
    id: city.id,
    name: city.name,
    slug: city.slug,
    province: city.province,
  }))

  return (
    <section className="relative bg-background min-h-[60vh] px-6 py-12 lg:py-20 overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#1a1a1a]" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 mt-20">
            Popular Car Rental Routes Across Pakistan
          </h1>
          <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto">
            Affordable one-way and round-trip rentals between 50+ cities with professional drivers and premium comfort.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <RouteSearchForm cities={citiesData} />
        </div>
      </div>
    </section>
  )
}

