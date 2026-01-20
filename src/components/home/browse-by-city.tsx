import Link from 'next/link'
import { getPopularCities } from '@/lib/data'
import { ArrowRight } from 'lucide-react'

export async function BrowseByCity() {
  const cities = await getPopularCities(8)

  // Ensure we have the cities mentioned in the spec
  const priorityCities = [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Multan',
    'Faisalabad',
    'Bahawalnagar',
    'Sahiwal',
    'Rahim Yar Khan',
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

  return (
    <section className="py-16 lg:py-24 bg-soft-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Book Car Rentals in Your City
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">
          {sortedCities.map((city) => (
            <Link
              key={city.id}
              href={`/rent-cars/${city.slug}`}
              className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all hover:scale-105 border border-gray-200 group"
            >
              <div className="font-semibold text-gray-900 group-hover:text-green-accent transition-colors">
                {city.name}
              </div>
              {city.province && (
                <div className="text-sm text-gray-500 mt-1">{city.province}</div>
              )}
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/cities"
            className="inline-flex items-center gap-2 text-green-accent font-semibold hover:underline"
          >
            View All Cities
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

