import { HeroSearchForm } from './hero-search-form'
import { getCitiesWithVehicles, getVehicleFilters } from '@/lib/data'
import { Check, Globe, Wallet } from 'lucide-react'

export async function HeroSection() {
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
    <section className="relative bg-white px-4 sm:px-6 lg:px-16 py-12 lg:py-20">
      <div className="container mx-auto max-w-7xl">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6 lg:space-y-8">
            {/* Trust Badge */}
            <div className="inline-block">
              <div className="bg-[#E8F5E9] px-4 py-2 rounded-md">
                <p className="text-sm font-semibold text-gray-800">
                  TRUSTED BY 50,000+ TRAVELERS
                </p>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Book Verified Car Rentals Across{' '}
                <span className="text-[#10b981]">Pakistan</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 max-w-2xl">
                Experience the gold standard in rentals with verified providers, secure advance payments, and nationwide support. From luxury sedans to transport vans.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-800 font-medium">Verified Companies</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-800 font-medium">Nationwide Coverage</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-800 font-medium">Secure Payments</span>
              </div>
            </div>
          </div>

          {/* Right Column - Search Form */}
          <div className="w-full">
            <HeroSearchForm cities={citiesData} vehicleModels={vehicleModelsData} />
          </div>
        </div>
      </div>
    </section>
  )
}
