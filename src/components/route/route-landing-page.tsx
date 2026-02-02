import Link from 'next/link'
import { HeroSection } from '@/components/hero/hero-section'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MapPin, Clock, ArrowRight, Car, HelpCircle, Check, ShieldCheck, Sparkles, Bus, Truck, CarFront } from 'lucide-react'
import type { getRouteBySlug } from '@/lib/data'

type RouteWithVehicles = Awaited<ReturnType<typeof getRouteBySlug>> extends infer R ? (R extends null ? never : R) : never

export type RouteLandingPageProps = {
  route: RouteWithVehicles
}

export function RouteLandingPage({ route }: RouteLandingPageProps) {
  const origin = route.originCity.name
  const destination = route.destinationCity.name
  const h1 = `${origin} to ${destination} Car Rental Route`
  const vehicles = route.vehicles ?? []

  const vehicleTypes = [
    { icon: Car, label: 'Standard cars and sedans for personal travel' },
    { icon: Truck, label: 'Family cars and SUVs for comfortable long journeys' },
    { icon: CarFront, label: 'Hiace vans for group travel' },
    { icon: Bus, label: 'Coasters and buses for events and large groups' },
  ]

  const useCases = [
    'Intercity business travel',
    'Family visits and hometown travel',
    'Wedding and event transportation',
    'Group tours and travel',
    'Daily or scheduled long-distance transport',
  ]

  const trustItems = [
    'Business details and contact information',
    'Available vehicles',
    'Service coverage',
  ]

  const faqs = [
    {
      q: 'How can I book a car on this route?',
      a: 'You can browse available vehicles, submit a booking request, and confirm it with a small advance payment.',
    },
    {
      q: 'Are drivers included?',
      a: 'Most rental providers offer vehicles with drivers. Self-drive availability depends on the vendor.',
    },
    {
      q: 'Can I book a round trip?',
      a: 'Yes, many rental companies offer round-trip options.',
    },
    {
      q: 'Is advance payment required?',
      a: 'Yes, a small advance is required to confirm the booking.',
    },
    {
      q: 'Which vehicle is best for this route?',
      a: 'Sedans are suitable for small groups, while vans and buses are ideal for group travel.',
    },
  ]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection heading={h1} />

      {/* SEO Introduction */}
      <section className="relative py-16 lg:py-24 overflow-hidden flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(34,197,94,0.12),_transparent_55%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl flex justify-center">
          <div className="space-y-4 flex flex-col items-center text-center w-full max-w-2xl">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-foreground tracking-tight">
              {origin} to {destination} Car Rental
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              The {origin} to {destination} route is a commonly traveled intercity route in Pakistan.
              People frequently book rental vehicles on this route for family visits, business travel, events, and long-distance journeys.
            </p>
            <p className="text-normal md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Through our platform, you can explore trusted car rental services offering vehicles for travel from {origin} to {destination}.
              Compare available options and connect with reliable local rental providers for a comfortable and hassle-free journey.
            </p>
          </div>
        </div>
      </section>

      {/* Route Details */}
      <section className="relative py-16 lg:py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1),_transparent_70%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-background mb-4">
              Route Details: {origin} to {destination}
            </h2>
          </div>
          <div className="group relative bg-[#1a1a1a] rounded-2xl p-6 lg:p-8 border border-gray-800/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_theme(colors.primary/0.2)] max-w-3xl mx-auto">
            <div className="relative mb-4">
              <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-14 h-14 rounded-xl bg-[#0f0f0f] border border-gray-800/50 group-hover:border-primary/50 flex items-center justify-center transition-colors">
                <MapPin className="h-7 w-7 text-primary" />
              </div>
            </div>
            <ul className="grid gap-3 text-normal md:text-lg text-gray-400">
              {route.distanceKm != null && (
                <li className="flex gap-3">
                  <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                  <span>Approximate distance: {route.distanceKm} km</span>
                </li>
              )}
              {route.estimatedTime && (
                <li className="flex gap-3">
                  <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                  <span>Estimated travel time: {route.estimatedTime}</span>
                </li>
              )}
              {(route.oneWay || route.roundTrip) && (
                <li className="flex gap-3">
                  <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                  <span>Trip options: {route.oneWay && route.roundTrip ? 'One-way and round-trip available' : route.oneWay ? 'One-way available' : 'Round-trip available'}</span>
                </li>
              )}
            </ul>
            <p className="text-normal text-gray-400 mt-4">
              Travel time may vary depending on traffic conditions and road situation.
            </p>
          </div>
        </div>
      </section>

      {/* Vehicles Available + Use Cases */}
      <section className="relative py-16 lg:py-24 bg-background overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_55%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-800/50 bg-[#1a1a1a] p-8 space-y-5">
              <h3 className="text-xl font-bold text-white">
                Vehicles Available on This Route
              </h3>
              <p className="text-normal text-gray-400">
                Different types of vehicles are available for the {origin} to {destination} route, depending on the rental provider:
              </p>
              <div className="grid gap-3">
                {vehicleTypes.map(({ icon: Icon, label }, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-gray-800/50 bg-[#0f0f0f] px-4 py-3 flex items-center gap-3 text-gray-400"
                  >
                    <Icon className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-normal">{label}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Vehicle availability and pricing may vary by date and rental company.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800/50 bg-[#1a1a1a] p-8 space-y-5">
              <h3 className="text-xl font-bold text-white">
                Common Use Cases for This Route
              </h3>
              <p className="text-normal text-gray-400">
                This route is commonly booked for:
              </p>
              <ul className="mt-3 grid gap-2 text-normal text-gray-400">
                {useCases.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-normal md:text-lg text-muted-foreground mt-3 leading-relaxed">
                Rental vehicles provide flexibility and comfort for all travel purposes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Booking Works */}
      <section className="relative py-16 lg:py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1),_transparent_70%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="rounded-2xl border border-primary bg-foreground p-8 space-y-5 shadow-primary max-w-3xl mx-auto">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
              Simple booking steps
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              How Booking Works
            </h2>
            <p className="text-normal text-emerald-50/80">
              Booking a vehicle for this route is simple:
            </p>
            <ol className="mt-4 space-y-3 text-normal md:text-lg text-emerald-50/80">
              <li className="flex gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-normal shrink-0">1</span>
                <span className="flex-1 self-center">Browse available vehicles for this route</span>
              </li>
              <li className="flex gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-normal shrink-0">2</span>
                <span className="flex-1 self-center">Submit your booking request</span>
              </li>
              <li className="flex gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-normal shrink-0">3</span>
                <span className="flex-1 self-center">Pay a small advance to confirm</span>
              </li>
              <li className="flex gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-normal shrink-0">4</span>
                <span className="flex-1 self-center">Our team coordinates with the rental company</span>
              </li>
              <li className="flex gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-normal shrink-0">5</span>
                <span className="flex-1 self-center">Vehicle is arranged as per your travel plan</span>
              </li>
            </ol>
            <p className="text-normal md:text-lg text-emerald-50/80 mt-3 leading-relaxed">
              The remaining payment is made directly to the rental provider.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Rental Providers */}
      <section className="relative py-16 lg:py-24 bg-background overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_55%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="rounded-2xl border border-gray-800/50 bg-[#1a1a1a] p-6 lg:p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-3">
              Trust & Verified Rental Providers
            </h3>
            <p className="text-gray-400 text-normal mb-3">
              We focus on listing genuine and locally operating rental businesses.
            </p>
            <p className="text-gray-400 text-normal mb-3">
              Each provider profile includes:
            </p>
            <ul className="space-y-1 text-normal text-gray-400">
              {trustItems.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-gray-400 text-normal mt-3">
              This helps users make informed decisions and book with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Available Vehicles */}
      {vehicles.length > 0 && (
        <section className="py-16 lg:py-24 bg-[#0a0a0a]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-2xl font-bold mb-6 text-white">Available Vehicles</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((v) => {
                const img = Array.isArray(v.images) && v.images.length > 0 ? (v.images[0] as string) : null
                const price = v.priceOutOfCity ?? v.priceDaily ?? v.priceWithDriver ?? 0
                return (
                  <Card key={v.id} className="overflow-hidden bg-[#1a1a1a] border-gray-800/50">
                    {img && (
                      <div className="relative aspect-video bg-muted">
                        <img src={img} alt={v.title} className="object-cover w-full h-full" />
                      </div>
                    )}
                    <div className="p-4">
                      <Link href={`/listings/${v.slug}`}>
                        <h3 className="font-semibold hover:text-primary text-white">{v.title}</h3>
                      </Link>
                      {v.category && (
                        <Link href={`/vehicles/${v.category.slug}`} className="text-sm text-gray-400 hover:underline">
                          {v.category.name}
                        </Link>
                      )}
                      {price > 0 && (
                        <p className="mt-2 font-medium text-gray-300">From Rs. {price.toLocaleString()}/day</p>
                      )}
                      <Button asChild size="sm" className="mt-2">
                        <Link href={`/listings/${v.slug}`}>View & book</Link>
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {vehicles.length === 0 && (
        <section className="py-16 lg:py-24 bg-[#0a0a0a]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <Card className="p-8 text-center bg-[#1a1a1a] border-gray-800/50">
              <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-400">No vehicles linked to this route yet. Check back soon or browse by city.</p>
              <Button asChild className="mt-4">
                <Link href="/rent-a-car">Browse rent a car by city</Link>
              </Button>
            </Card>
          </div>
        </section>
      )}

      {/* Related Options */}
      <section className="relative py-16 lg:py-24 bg-background overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_55%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="rounded-2xl border border-gray-800/50 bg-[#1a1a1a] p-6 lg:p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-3">
              Related Options
            </h3>
            <ul className="space-y-2 text-normal text-gray-400">
              <li>
                <Link href={`/rent-a-car/${route.slug}`} className="hover:text-primary transition-colors">
                  • Rent a car from {origin} to {destination}
                </Link>
              </li>
              <li>
                <Link href={`/routes/${route.slug}`} className="hover:text-primary transition-colors">
                  • View all vehicles available for this route
                </Link>
              </li>
              <li>
                <Link href={`/rent-a-car/${route.originCity.slug}`} className="hover:text-primary transition-colors">
                  • Explore car rental services in {origin}
                </Link>
              </li>
              <li>
                <Link href={`/rent-a-car/${route.destinationCity.slug}`} className="hover:text-primary transition-colors">
                  • Explore car rental services in {destination}
                </Link>
              </li>
              <li>
                <Link href="/routes" className="hover:text-primary transition-colors">
                  • Browse all intercity routes
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="relative py-16 lg:py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-background mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="grid gap-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-gray-800/50 bg-[#1a1a1a] p-6 hover:border-primary/40 transition-colors"
              >
                <h3 className="flex items-start gap-3 text-lg font-semibold text-white mb-2">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-gray-400 text-normal pl-8 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Planning to travel from {origin} to {destination}?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Compare vehicles, connect with trusted rental providers, and book your journey today.
            </p>
            <Link href={`/view-all-vehicles`}>
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-8 py-6 text-lg"
              >
                View Available Vehicles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
