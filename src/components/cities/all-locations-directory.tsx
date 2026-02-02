import Link from 'next/link'
import { getAllCitiesWithCounts } from '@/lib/data'
import { Compass, MapPin } from 'lucide-react'

export async function AllLocationsDirectory() {
  const cities = await getAllCitiesWithCounts()

  // Group cities by first letter
  const groupedCities = cities.reduce((acc, city) => {
    const firstLetter = city.name.charAt(0).toUpperCase()
    
    // Group letters: A, B, C-D, F-G, H-J, K-M, N-P, Q-S, T-Z
    let group: string
    if (firstLetter === 'A') group = 'A'
    else if (firstLetter === 'B') group = 'B'
    else if (['C', 'D'].includes(firstLetter)) group = 'C-D'
    else if (['F', 'G'].includes(firstLetter)) group = 'F-G'
    else if (['H', 'I', 'J'].includes(firstLetter)) group = 'H-J'
    else if (['K', 'L', 'M'].includes(firstLetter)) group = 'K-M'
    else if (['N', 'O', 'P'].includes(firstLetter)) group = 'N-P'
    else if (['Q', 'R', 'S'].includes(firstLetter)) group = 'Q-S'
    else group = 'T-Z'
    
    if (!acc[group]) {
      acc[group] = []
    }
    acc[group].push(city)
    return acc
  }, {} as Record<string, typeof cities>)

  // Sort cities within each group
  Object.keys(groupedCities).forEach(group => {
    groupedCities[group].sort((a, b) => a.name.localeCompare(b.name))
  })

  // Define group order
  const groupOrder = ['A', 'B', 'C-D', 'F-G', 'H-J', 'K-M', 'N-P', 'Q-S', 'T-Z']

  return (
    <section className="py-12 lg:py-16 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center gap-2 mb-8">
          <MapPin className="h-6 w-6 text-primary" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            All Locations Directory
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Cities Directory - 5 columns */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {groupOrder.map((group) => {
                const groupCities = groupedCities[group] || []
                if (groupCities.length === 0) return null

                return (
                  <div key={group} className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                      {group}
                    </h3>
                    <ul className="space-y-1.5">
                      {groupCities.map((city) => (
                        <li key={city.id}>
                          <Link
                            href={`/rent-a-car/${city.slug}`}
                            className="text-gray-300 hover:text-primary transition-colors text-sm"
                          >
                            {city.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>

        
        </div>
      </div>
    </section>
  )
}

