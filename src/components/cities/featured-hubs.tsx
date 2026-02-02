import Link from 'next/link'
import { getAllCitiesWithCounts } from '@/lib/data'

export async function FeaturedHubs() {
  const cities = await getAllCitiesWithCounts()

  // Featured cities matching the reference image
  const featuredCities = [
    { name: 'Karachi', tag: 'TOP DESTINATION', slug: 'karachi' },
    { name: 'Lahore', tag: 'CORPORATE HUB', slug: 'lahore' },
    { name: 'Islamabad', tag: 'CAPITAL CITY', slug: 'islamabad' },
  ]

  const featuredData = featuredCities.map(featured => {
    const city = cities.find(c => c.name.toLowerCase() === featured.name.toLowerCase())
    return {
      ...featured,
      vehicleCount: city?._count?.vehicles || 0,
      slug: city?.slug || featured.slug,
    }
  })

  return (
    <section className="py-12 lg:py-16 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
          Featured Hubs
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredData.map((city) => (
            <Link
              key={city.name}
              href={`/rent-a-car/${city.slug}`}
              className="group relative bg-primary rounded-xl p-8 hover:bg-primary/90 transition-all duration-300 overflow-hidden"
            >
              {/* Tag */}
              <div className="absolute top-4 right-4">
                <span className="bg-white/20 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  {city.tag}
                </span>
              </div>

              {/* City Name */}
              <h3 className="text-3xl lg:text-4xl font-bold text-black mb-2">
                {city.name}
              </h3>

              {/* Vehicle Count */}
              <p className="text-black/70 text-sm font-semibold">
                {city.vehicleCount}+ Verified Vehicles Available
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

