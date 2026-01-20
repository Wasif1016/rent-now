import Link from 'next/link'
import { getCitiesWithVehicles, getVehicleTypes } from '@/lib/data'

export async function SeoFooter() {
  const [cities, vehicleTypes] = await Promise.all([
    getCitiesWithVehicles(),
    getVehicleTypes(),
  ])

  // Popular cities for footer links
  const popularCities = cities.slice(0, 12)

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Cities Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Cities
            </h3>
            <ul className="space-y-2 text-sm">
              {popularCities.map((city) => (
                <li key={city.id}>
                  <Link
                    href={`/rent-cars/${city.slug}`}
                    className="hover:text-green-accent transition-colors"
                  >
                    Rent a Car in {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vehicle Types Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Vehicle Types
            </h3>
            <ul className="space-y-2 text-sm">
              {vehicleTypes.map((type) => (
                <li key={type.id}>
                  <Link
                    href={`/rent-a-car/${type.slug}`}
                    className="hover:text-green-accent transition-colors"
                  >
                    {type.name} Rental
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Routes Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Popular Routes
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/routes/lahore-to-islamabad"
                  className="hover:text-green-accent transition-colors"
                >
                  Lahore to Islamabad
                </Link>
              </li>
              <li>
                <Link
                  href="/routes/karachi-to-hyderabad"
                  className="hover:text-green-accent transition-colors"
                >
                  Karachi to Hyderabad
                </Link>
              </li>
              <li>
                <Link
                  href="/routes/multan-to-faisalabad"
                  className="hover:text-green-accent transition-colors"
                >
                  Multan to Faisalabad
                </Link>
              </li>
              <li>
                <Link
                  href="/routes"
                  className="hover:text-green-accent transition-colors"
                >
                  View All Routes
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-green-accent transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-green-accent transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/list-your-car"
                  className="hover:text-green-accent transition-colors"
                >
                  List Your Car
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Rent Now. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

