import Link from 'next/link'
import { getPopularCities } from '@/lib/data'
import { ArrowRight, Landmark, Building2, Mountain, Factory, Building } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// City icon mapping - using landmarks/symbols for each city
const cityIcons: Record<string, LucideIcon> = {
  'Lahore': Landmark, // Minar-e-Pakistan (using Landmark as tower/monument icon)
  'Karachi': Building2, // Gateway/Port city
  'Islamabad': Building, // Faisal Mosque (using Building for mosque/architecture)
  'Peshawar': Building2,
  'Faisalabad': Factory, // Industrial city
  'Multan': Building2,
  'Quetta': Mountain, // Mountainous region
  'Sialkot': Building2,
  'Rawalpindi': Building2,
  'Gujranwala': Building2,
  'Hyderabad': Building2,
  'Bahawalpur': Building2,
}

// Default icon for cities not in the mapping
const DefaultCityIcon = Building2

export async function BrowseByCity() {
  const cities = await getPopularCities(8)

  // Priority cities matching the reference image
  const priorityCities = [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Peshawar',
    'Faisalabad',
    'Multan',
    'Quetta',
    'Sialkot',
  ]

  // Sort cities: priority first, then by vehicle count
  const sortedCities = [...cities].sort((a, b) => {
    const aIndex = priorityCities.indexOf(a.name)
    const bIndex = priorityCities.indexOf(b.name)
    
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    return (b._count?.vehicles || 0) - (a._count?.vehicles || 0)
  })

  // Take top 8 cities
  const displayCities = sortedCities.slice(0, 8)

  return (
    <section className="py-16 lg:py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white tracking-tight mb-2">
            Book Car Rentals in Your City
            </h2>
            <p className="text-base lg:text-lg text-gray-400">
              Available across all major transportation hubs
            </p>
          </div>
          <Link
            href="/cities"
            className="inline-flex items-center gap-1.5 text-primary font-semibold hover:text-primary/80 transition-colors text-sm lg:text-base mt-1"
          >
            View all cities
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* City Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6">
          {displayCities.map((city) => {
            const CityIcon = cityIcons[city.name] || DefaultCityIcon
            const vehicleCount = city._count?.vehicles || 0

            return (
              <Link
                key={city.id}
                href={`/rent-a-car/${city.slug}`}
                className="group relative bg-[#1a1a1a] rounded-xl p-6 hover:bg-[#1f1f1f] transition-all duration-300 border border-gray-800/50 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
              >
                {/* City Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-lg bg-[#0f0f0f] flex items-center justify-center border border-gray-800/50 group-hover:border-primary/30 transition-colors">
                    <CityIcon className="h-10 w-10 text-primary" />
                  </div>
                </div>

                {/* City Name */}
                <h3 className="text-lg font-bold text-white text-center mb-2 group-hover:text-primary transition-colors">
                  {city.name}
                </h3>

                {/* Vehicle Count */}
                <p className="text-sm font-semibold text-primary text-center uppercase tracking-wide">
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
