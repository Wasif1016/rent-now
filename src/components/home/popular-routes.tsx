import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const popularRoutes = [
  { from: 'Lahore', to: 'Islamabad', fromSlug: 'lahore', toSlug: 'islamabad' },
  { from: 'Karachi', to: 'Hyderabad', fromSlug: 'karachi', toSlug: 'hyderabad' },
  { from: 'Bahawalnagar', to: 'Lahore', fromSlug: 'bahawalnagar', toSlug: 'lahore' },
  { from: 'Multan', to: 'Faisalabad', fromSlug: 'multan', toSlug: 'faisalabad' },
  { from: 'Islamabad', to: 'Murree', fromSlug: 'islamabad', toSlug: 'murree' },
]

export function PopularRoutes() {
  return (
    <section className="py-16 lg:py-24 bg-soft-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Popular Car Rental Routes
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {popularRoutes.map((route, index) => (
            <Link
              key={index}
              href={`/routes/${route.fromSlug}-to-${route.toSlug}`}
              className="bg-white rounded-lg p-4 lg:p-6 hover:shadow-lg transition-all border border-gray-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="font-semibold text-gray-900 group-hover:text-green-accent transition-colors">
                    {route.from}
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div className="font-semibold text-gray-900 group-hover:text-green-accent transition-colors">
                    {route.to}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/routes"
            className="inline-flex items-center gap-2 text-green-accent font-semibold hover:underline"
          >
            View All Routes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

