import { RouteHeroSection } from '@/components/routes/route-hero-section'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Building2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VehicleGrid } from '@/components/search/vehicle-grid'
import { getCityBySlug } from '@/lib/data'

const allRoutes = [
  { from: 'Lahore', to: 'Islamabad', fromSlug: 'lahore', toSlug: 'islamabad' },
  { from: 'Lahore', to: 'Karachi', fromSlug: 'lahore', toSlug: 'karachi' },
  { from: 'Lahore', to: 'Multan', fromSlug: 'lahore', toSlug: 'multan' },
  { from: 'Lahore', to: 'Faisalabad', fromSlug: 'lahore', toSlug: 'faisalabad' },
  { from: 'Lahore', to: 'Sialkot', fromSlug: 'lahore', toSlug: 'sialkot' },
  { from: 'Lahore', to: 'Gujranwala', fromSlug: 'lahore', toSlug: 'gujranwala' },
  { from: 'Lahore', to: 'Murree', fromSlug: 'lahore', toSlug: 'murree' },
  { from: 'Lahore', to: 'Bahawalpur', fromSlug: 'lahore', toSlug: 'bahawalpur' },
  { from: 'Lahore', to: 'Bahawalnagar', fromSlug: 'lahore', toSlug: 'bahawalnagar' },
  { from: 'Lahore', to: 'Skardu', fromSlug: 'lahore', toSlug: 'skardu' },
  { from: 'Karachi', to: 'Hyderabad', fromSlug: 'karachi', toSlug: 'hyderabad' },
  { from: 'Karachi', to: 'Sukkur', fromSlug: 'karachi', toSlug: 'sukkur' },
  { from: 'Karachi', to: 'Larkana', fromSlug: 'karachi', toSlug: 'larkana' },
  { from: 'Karachi', to: 'Gwadar', fromSlug: 'karachi', toSlug: 'gwadar' },
  { from: 'Karachi', to: 'Quetta', fromSlug: 'karachi', toSlug: 'quetta' },
  { from: 'Karachi', to: 'Multan', fromSlug: 'karachi', toSlug: 'multan' },
  { from: 'Karachi', to: 'Islamabad', fromSlug: 'karachi', toSlug: 'islamabad' },
  { from: 'Karachi', to: 'Lahore', fromSlug: 'karachi', toSlug: 'lahore' },
  { from: 'Karachi', to: 'Nawabshah', fromSlug: 'karachi', toSlug: 'nawabshah' },
  { from: 'Karachi', to: 'Mirpurkhas', fromSlug: 'karachi', toSlug: 'mirpurkhas' },
  { from: 'Islamabad', to: 'Murree', fromSlug: 'islamabad', toSlug: 'murree' },
  { from: 'Islamabad', to: 'Abbottabad', fromSlug: 'islamabad', toSlug: 'abbottabad' },
  { from: 'Islamabad', to: 'Mansehra', fromSlug: 'islamabad', toSlug: 'mansehra' },
  { from: 'Islamabad', to: 'Peshawar', fromSlug: 'islamabad', toSlug: 'peshawar' },
  { from: 'Islamabad', to: 'Skardu', fromSlug: 'islamabad', toSlug: 'skardu' },
  { from: 'Islamabad', to: 'Hunza', fromSlug: 'islamabad', toSlug: 'hunza' },
  { from: 'Islamabad', to: 'Gilgit', fromSlug: 'islamabad', toSlug: 'gilgit' },
  { from: 'Islamabad', to: 'Faisalabad', fromSlug: 'islamabad', toSlug: 'faisalabad' },
  { from: 'Islamabad', to: 'Sialkot', fromSlug: 'islamabad', toSlug: 'sialkot' },
  { from: 'Islamabad', to: 'Lahore', fromSlug: 'islamabad', toSlug: 'lahore' },
  { from: 'Multan', to: 'Bahawalpur', fromSlug: 'multan', toSlug: 'bahawalpur' },
  { from: 'Multan', to: 'Rahim Yar Khan', fromSlug: 'multan', toSlug: 'rahim-yar-khan' },
  { from: 'Multan', to: 'Dera Ghazi Khan', fromSlug: 'multan', toSlug: 'dera-ghazi-khan' },
  { from: 'Multan', to: 'Lahore', fromSlug: 'multan', toSlug: 'lahore' },
  { from: 'Multan', to: 'Karachi', fromSlug: 'multan', toSlug: 'karachi' },
  { from: 'Peshawar', to: 'Islamabad', fromSlug: 'peshawar', toSlug: 'islamabad' },
  { from: 'Peshawar', to: 'Swat', fromSlug: 'peshawar', toSlug: 'swat' },
  { from: 'Peshawar', to: 'Mardan', fromSlug: 'peshawar', toSlug: 'mardan' },
  { from: 'Peshawar', to: 'Abbottabad', fromSlug: 'peshawar', toSlug: 'abbottabad' },
  { from: 'Quetta', to: 'Gwadar', fromSlug: 'quetta', toSlug: 'gwadar' },
  { from: 'Quetta', to: 'Karachi', fromSlug: 'quetta', toSlug: 'karachi' },
  { from: 'Quetta', to: 'Turbat', fromSlug: 'quetta', toSlug: 'turbat' },
  { from: 'Skardu', to: 'Hunza', fromSlug: 'skardu', toSlug: 'hunza' },
  { from: 'Gilgit', to: 'Hunza', fromSlug: 'gilgit', toSlug: 'hunza' },
  { from: 'Gilgit', to: 'Skardu', fromSlug: 'gilgit', toSlug: 'skardu' },
  { from: 'Faisalabad', to: 'Lahore', fromSlug: 'faisalabad', toSlug: 'lahore' },
  { from: 'Faisalabad', to: 'Islamabad', fromSlug: 'faisalabad', toSlug: 'islamabad' },
  { from: 'Gujranwala', to: 'Sialkot', fromSlug: 'gujranwala', toSlug: 'sialkot' },
  { from: 'Sialkot', to: 'Lahore', fromSlug: 'sialkot', toSlug: 'lahore' },
  { from: 'Bahawalpur', to: 'Multan', fromSlug: 'bahawalpur', toSlug: 'multan' },
]

// Group routes by departure city
const groupedRoutes = allRoutes.reduce((acc, route) => {
  if (!acc[route.from]) {
    acc[route.from] = []
  }
  acc[route.from].push(route)
  return acc
}, {} as Record<string, typeof allRoutes>)

// Priority cities for display order
const priorityCities = ['Lahore', 'Islamabad', 'Karachi', 'Multan', 'Peshawar', 'Quetta']

// Sort cities: priority first, then alphabetically
const sortedCities = Object.keys(groupedRoutes).sort((a, b) => {
  const aIndex = priorityCities.indexOf(a)
  const bIndex = priorityCities.indexOf(b)
  
  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
  if (aIndex !== -1) return -1
  if (bIndex !== -1) return 1
  return a.localeCompare(b)
})

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function RoutesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const fromCitySlug = params.fromCity as string | undefined
  const toCitySlug = params.toCity as string | undefined

  let vehicles: any[] = []
  let fromCityName = ''
  let toCityName = ''

  // If route search is performed, fetch vehicles for that route
  if (fromCitySlug && toCitySlug) {
    const fromCity = await getCityBySlug(fromCitySlug)
    const toCity = await getCityBySlug(toCitySlug)

    if (fromCity && toCity) {
      fromCityName = fromCity.name
      toCityName = toCity.name

      // Find routes matching the cities
      const routes = await prisma.route.findMany({
        where: {
          fromCityId: fromCity.id,
          toCityId: toCity.id,
          isActive: true,
        },
        include: {
          vehicle: {
            select: {
              id: true,
              title: true,
              slug: true,
              description: true,
              year: true,
              mileage: true,
              fuelType: true,
              transmission: true,
              seats: true,
              color: true,
              features: true,
              images: true,
              views: true,
              featured: true,
              isAvailable: true,
              city: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
              town: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
              vendor: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  verificationStatus: true,
                },
              },
              vehicleModel: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  capacity: true,
                  vehicleBrand: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
        },
      })

      // Extract unique vehicles from routes (filter out routes with unavailable vehicles)
      const vehicleMap = new Map()
      routes.forEach(route => {
        if (route.vehicle && route.vehicle.isAvailable) {
          vehicleMap.set(route.vehicle.id, route.vehicle)
        }
      })
      vehicles = Array.from(vehicleMap.values())
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <RouteHeroSection />
      
      {/* Show vehicles if route search is performed */}
      {fromCitySlug && toCitySlug && vehicles.length > 0 && (
        <section className="py-8 lg:py-12 bg-[#0a0a0a]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                Available Vehicles for {fromCityName} to {toCityName}
              </h2>
              <p className="text-gray-400">
                {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} available for this route
              </p>
            </div>
            <VehicleGrid vehicles={vehicles.map(v => ({
              ...v,
              images: Array.isArray(v.images) ? (v.images as string[]) : null,
            }))} />
          </div>
        </section>
      )}

      {/* Show "No vehicles found" message if route search but no vehicles */}
      {fromCitySlug && toCitySlug && vehicles.length === 0 && (
        <section className="py-8 lg:py-12 bg-[#0a0a0a]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center py-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                No vehicles found for {fromCityName} to {toCityName}
              </h2>
              <p className="text-gray-400 mb-6">
                We don't have any vehicles available for this route at the moment.
              </p>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Link href="/routes">
                  Browse All Routes
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Show routes grid if no search is performed */}
      {(!fromCitySlug || !toCitySlug) && (
        <section className="py-8 lg:py-12 bg-[#0a0a0a]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Routes Grid by City */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCities.map((city) => {
                const routes = groupedRoutes[city]
                return (
                  <div
                    key={city}
                    className="bg-[#1a1a1a] rounded-xl border border-gray-800/50 overflow-hidden hover:border-primary/30 transition-all duration-300"
                  >
                    {/* City Header */}
                    <div className="bg-[#0f0f0f] px-6 py-4 border-b border-gray-800/50 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center border border-gray-800/50">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-white">From {city}</h3>
                    </div>

                    {/* Routes List */}
                    <div className="p-6">
                      <div className="space-y-2">
                        {routes.map((route, index) => (
                          <Link
                            key={index}
                            href={`/routes/${route.fromSlug}-to-${route.toSlug}`}
                            className="block text-gray-400 hover:text-primary transition-colors py-2"
                          >
                            {route.to}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Can't find your route? Section */}
      <section className="py-12 lg:py-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-[#1a1a1a] rounded-2xl p-8 lg:p-12 border border-gray-800/50">
            <div className="text-center mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Can't find your route?
              </h2>
              <p className="text-gray-400 text-base lg:text-lg max-w-2xl mx-auto">
                We offer custom inter-city car rentals tailored to your specific travel needs across Pakistan. Tell us your departure and destination, and we'll handle the rest.
              </p>
            </div>
            <div className="text-center">
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
              >
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || '923001234567'}?text=${encodeURIComponent('Hi, I would like to request a custom route. Please provide details about your departure and destination cities.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Request Custom Route
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
