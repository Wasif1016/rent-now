import Link from 'next/link'

type CityLandingTemplateProps = {
  city: {
    id: string
    name: string
    slug: string
    province?: string | null
  }
  vehiclesCount: number
  vendorsCount: number
  routesCount: number
  vendors: Array<{
    id: string
    name: string
    slug: string
    verificationStatus?: string | null
  }>
  routes: Array<
    | { id: string; fromCity: { slug: string; name: string }; toCity: { slug: string; name: string } }
    | { slug: string; originCity: { slug: string; name: string }; destinationCity: { slug: string; name: string } }
  >
  topVehicleTypes?: Array<{
    id: string
    name: string
    slug: string
  }>
}

function applyTemplate(template: string, variables: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = variables[key]
    return value !== undefined && value !== null ? String(value) : ''
  })
}

export function CityLandingTemplate({
  city,
  vehiclesCount,
  vendorsCount,
  routesCount,
  vendors,
  routes,
  topVehicleTypes = [],
}: CityLandingTemplateProps) {
  const vars = {
    city_name: city.name,
    city_slug: city.slug,
    vehicles_count: vehiclesCount,
    vendors_count: vendorsCount,
    routes_count: routesCount,
  }

  const heroTitle = applyTemplate(
    'Rent a Car in {city_name} – Trusted Car Rental Services Near You',
    vars
  )

  const introText = applyTemplate(
    'Looking for a reliable car on rent in {city_name}? Our platform connects you with verified rental companies offering a wide range of vehicles with professional drivers. Compare options, check prices, and book your ride in minutes.',
    vars
  )

  const localSeoParagraph = applyTemplate(
    'Whether you need to rent a car in {city_name} for a family trip, business meeting, or airport transfer, our car rental service in {city_name} makes booking simple. Browse cars with drivers, compare car rental prices, and choose from affordable, cheap, and premium options depending on your budget.',
    vars
  )

  const finalCtaText = applyTemplate(
    'Ready to book a car in {city_name}? Share your trip details and we will connect you with a verified rental company for instant confirmation.',
    vars
  )

  const hasVendors = vendorsCount > 0 && vendors.length > 0

  return (
    <section className="space-y-10 mb-10">
      {/* 1. Hero section */}
      <div className="space-y-3">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
          {heroTitle}
        </h1>
        <p className="text-muted-foreground">
          {introText}
        </p>
      </div>

      {/* 3. Why rent from us */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-semibold mb-2">Verified rental companies</h2>
          <p className="text-sm text-muted-foreground">
            Book with vendors that have been screened for documentation, service quality, and response time.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-semibold mb-2">Vehicles for every journey</h2>
          <p className="text-sm text-muted-foreground">
            From small cars to Hiace, coasters, and luxury options, choose what fits your route and group size.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-semibold mb-2">Transparent pricing</h2>
          <p className="text-sm text-muted-foreground">
            Discuss fuel, tolls, and driver arrangements upfront so there are no surprises on the travel day.
          </p>
        </div>
      </section>

      {/* 4. Available vehicle types */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          Popular vehicle types available in {city.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose from trusted vehicle categories depending on your group size and trip type.
        </p>
        <div className="flex flex-wrap gap-2">
          {topVehicleTypes.length > 0 ? (
            topVehicleTypes.map((type) => (
              <Link
                key={type.id}
                href={`/${type.slug}/${city.slug}`}
                className="inline-flex items-center rounded-full border px-3 py-1 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {type.name} in {city.name}
              </Link>
            ))
          ) : (
            <>
              {['Cars', 'Hiace', 'Coasters', 'Vans', 'SUVs'].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground"
                >
                  {label}
                </span>
              ))}
            </>
          )}
        </div>
      </section>

      {/* 5. Use cases */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Popular ways people use car rental in {city.name}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Wedding events',
              body: 'Book clean, decorated vehicles for barat, walima, mehndi and guest movement across the city.',
            },
            {
              title: 'Tours & sightseeing',
              body: 'Plan day trips and multi-day tours to nearby destinations with experienced local drivers.',
            },
            {
              title: 'Airport transfers',
              body: 'Reliable pick and drop for airport runs, late-night arrivals, and corporate guests.',
            },
            {
              title: 'Intercity travel',
              body: 'Point-to-point service for routes starting from your city to major destinations nationwide.',
            },
            {
              title: 'Daily office commute',
              body: 'Hire a dedicated car with driver for your daily office and business travel needs.',
            },
            {
              title: 'Family & group trips',
              body: 'Spacious vehicles for family vacations, picnics, and weekend getaways.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Intercity routes from city */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          Intercity routes starting from {city.name}
        </h2>
        {routes.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {routes.map((route) => {
              const isNewShape = 'slug' in route && 'originCity' in route
              const href = isNewShape ? `/routes/${route.slug}` : `/routes/${route.fromCity.slug}-to-${route.toCity.slug}`
              const fromName = isNewShape ? route.originCity.name : route.fromCity.name
              const toName = isNewShape ? route.destinationCity.name : route.toCity.name
              const key = isNewShape ? route.slug : (route as { id: string }).id
              return (
                <Link
                  key={key}
                  href={href}
                  className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <span>
                    {fromName} to {toName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    View route
                  </span>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Routes originating from {city.name} will be listed here as soon as partner vendors publish them.
          </p>
        )}
      </section>

      {/* 7. Verified rental companies */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          Verified rental companies in {city.name}
        </h2>
        {hasVendors ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="rounded-lg border bg-card p-4 space-y-1">
                <p className="font-semibold">{vendor.name}</p>
                {vendor.verificationStatus === 'VERIFIED' && (
                  <p className="text-xs text-emerald-600 font-medium">
                    Verified vendor
                  </p>
                )}
                <Link
                  href={`/vendors/${vendor.slug}`}
                  className="text-xs text-primary hover:underline"
                >
                  View profile
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Vendors in {city.name} are onboarding soon. You can still explore vehicles and submit booking requests which will be routed to the nearest active partners.
          </p>
        )}
      </section>

      {/* 8. Booking process */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          How booking works
        </h2>
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>Search for available vehicles in {city.name} using filters like town, brand, and vehicle type.</li>
          <li>Open a vehicle listing to review pictures, seating capacity, and pricing details.</li>
          <li>Share your trip dates, pickup location, route, and any special requirements.</li>
          <li>Vendor confirms availability, final pricing, and booking terms over call or WhatsApp.</li>
          <li>Pay a small advance (if required) to lock your booking and keep the driver reserved.</li>
        </ol>
      </section>

      {/* 9. Local SEO paragraph */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">
          Local car rental options in {city.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          {localSeoParagraph}
        </p>
      </section>

      {/* 10. FAQ section */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          Frequently asked questions about car rental in {city.name}
        </h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <details className="rounded-lg border bg-card p-3">
            <summary className="cursor-pointer font-medium text-foreground">
              How much does it cost to rent a car in {city.name}?
            </summary>
            <p className="mt-2">
              Pricing depends on vehicle type, distance, and duration. Within city, small cars usually start from daily packages, while intercity routes are priced per trip or per kilometer.
            </p>
          </details>
          <details className="rounded-lg border bg-card p-3">
            <summary className="cursor-pointer font-medium text-foreground">
              Can I book a car with driver in {city.name}?
            </summary>
            <p className="mt-2">
              Yes, most listings offer cars with professional drivers who know local routes, traffic patterns, and highway safety requirements.
            </p>
          </details>
          <details className="rounded-lg border bg-card p-3">
            <summary className="cursor-pointer font-medium text-foreground">
              Do I need to pay advance for booking?
            </summary>
            <p className="mt-2">
              Many vendors ask for a small advance amount to confirm the booking, especially for outstation trips and peak dates.
            </p>
          </details>
          <details className="rounded-lg border bg-card p-3">
            <summary className="cursor-pointer font-medium text-foreground">
              Which cities can I travel to from {city.name}?
            </summary>
            <p className="mt-2">
              You can usually book intercity routes from {city.name} to major cities and tourist destinations across Pakistan. Check available routes or share your destination while booking.
            </p>
          </details>
        </div>
      </section>

      {/* 11. Final CTA */}
      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-xl font-semibold">
          Book your next ride in {city.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          {finalCtaText}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/rent-a-car/${city.slug}`}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Browse available cars
          </Link>
          <Link
            href="/routes"
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Explore popular routes
          </Link>
        </div>
      </section>
    </section>
  )
}


