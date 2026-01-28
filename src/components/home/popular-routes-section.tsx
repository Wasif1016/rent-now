import Link from 'next/link'
import { ArrowRight, Route } from 'lucide-react'

const featuredRoutes = [
  { from: 'Lahore', to: 'Islamabad', fromSlug: 'lahore', toSlug: 'islamabad' },
  { from: 'Lahore', to: 'Multan', fromSlug: 'lahore', toSlug: 'multan' },
  { from: 'Faisalabad', to: 'Lahore', fromSlug: 'faisalabad', toSlug: 'lahore' },
  { from: 'Lahore', to: 'Gujranwala', fromSlug: 'lahore', toSlug: 'gujranwala' },
]

export function PopularRoutesSection() {
  return (
    <section className="py-16 lg:py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white tracking-tight mb-2">
              Popular Routes
            </h2>
            <p className="text-base lg:text-lg text-gray-400">
              Book your intercity travel with trusted rental services
            </p>
          </div>
          <Link
            href="/routes"
            className="inline-flex items-center gap-1.5 text-primary font-semibold hover:text-primary/80 transition-colors text-sm lg:text-base mt-1"
          >
            See all routes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Routes Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6">
          {featuredRoutes.map((route, index) => (
            <Link
              key={index}
              href={`/routes/${route.fromSlug}-to-${route.toSlug}`}
              className="group relative bg-[#1a1a1a] rounded-xl p-6 hover:bg-[#1f1f1f] transition-all duration-300 border border-gray-800/50 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
            >
              {/* Route Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-lg bg-[#0f0f0f] flex items-center justify-center border border-gray-800/50 group-hover:border-primary/30 transition-colors">
                  <Route className="h-10 w-10 text-primary" />
                </div>
              </div>

              {/* Route Name */}
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">
                  {route.from}
                </h3>
                <ArrowRight className="h-4 w-4 text-gray-500 mx-auto" />
                <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">
                  {route.to}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

