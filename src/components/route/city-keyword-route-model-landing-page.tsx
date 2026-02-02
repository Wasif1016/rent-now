import Link from 'next/link'
import { HeroSection } from '@/components/hero/hero-section'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, Car, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react'
import type { getRouteBySlug } from '@/lib/data'

type RouteWithVehicles = Awaited<ReturnType<typeof getRouteBySlug>> extends infer R ? (R extends null ? never : R) : never

function toTitleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase())
}

function humanizeKeyword(keyword: string): string {
  return keyword.replace(/-/g, ' ')
}

export type CityKeywordRouteModelLandingPageProps = {
  keywordSlug: string
  route: RouteWithVehicles
  modelName: string
  brandName: string
  modelSlug: string
  seatingCapacity?: number | null
}

export function CityKeywordRouteModelLandingPage({
  keywordSlug,
  route,
  modelName,
  brandName,
  modelSlug,
  seatingCapacity,
}: CityKeywordRouteModelLandingPageProps) {
  const origin = route.originCity.name
  const destination = route.destinationCity.name
  const keywordNatural = toTitleCase(humanizeKeyword(keywordSlug))
  const vehicleModel = `${brandName} ${modelName}`
  const h1 = `${vehicleModel} ${keywordNatural} from ${origin} to ${destination}`
  const vehicles = route.vehicles ?? []
  const modelVehicles = vehicles.filter(
    (v) => v.vehicleModel?.slug === modelSlug || v.vehicleModel?.vehicleBrand?.slug === brandName.toLowerCase().replace(/\s+/g, '-')
  )

  const whyChooseItems = [
    `Comfortable seating for ${seatingCapacity ?? 5} passengers`,
    'Smooth performance on long routes',
    'Suitable for both family and business travel',
    'Availability with professional drivers',
    'Reliable ride quality for intercity journeys',
  ]

  const vehicleSuitability = [
    'Family visits and personal travel',
    'Business and official trips',
    'Long-distance intercity journeys',
    'Comfortable point-to-point transportation',
  ]

  const pricingFactors = [
    'Distance and route conditions',
    'One-way or round-trip booking',
    'Driver inclusion',
    'Rental company policies',
  ]

  const trustItems = [
    'Business information',
    'Vehicle details',
    'Service coverage',
  ]

  const faqs = [
    {
      q: `Is ${vehicleModel} suitable for long-distance travel?`,
      a: 'Yes, this model is commonly used for intercity travel and offers a comfortable ride.',
    },
    {
      q: 'Does this booking include a driver?',
      a: 'Most rental providers offer this vehicle with a professional driver. Availability may vary.',
    },
    {
      q: 'Can I book a round trip?',
      a: 'Yes, round-trip bookings are available depending on the rental provider.',
    },
    {
      q: 'Is advance payment required?',
      a: 'Yes, a small advance is required to confirm the booking.',
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
              {vehicleModel} {keywordNatural} from {origin} to {destination}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Looking to book a {vehicleModel} for {keywordNatural.toLowerCase()} from {origin} to {destination}?
              This option is widely preferred by travelers who want a comfortable, reliable, and smooth journey for intercity travel.
            </p>
            <p className="text-normal md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              The {vehicleModel} is suitable for family trips, business travel, and long-distance journeys, offering balanced performance and comfortable seating throughout the route.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="relative py-16 lg:py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1),_transparent_70%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-background mb-4">
              Why Choose {vehicleModel} for This Route?
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Choosing a {vehicleModel} for travel from {origin} to {destination} offers several advantages:
            </p>
          </div>
          <div className="grid gap-6 lg:gap-8 md:grid-cols-2">
            <div className="group relative bg-[#1a1a1a] rounded-2xl p-6 lg:p-8 border border-gray-800/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_theme(colors.primary/0.2)] hover:-translate-y-1">
              <div className="relative mb-4">
                <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-14 h-14 rounded-xl bg-[#0f0f0f] border border-gray-800/50 group-hover:border-primary/50 flex items-center justify-center transition-colors">
                  <ShieldCheck className="h-7 w-7 text-primary" />
                </div>
              </div>
              <ul className="grid gap-3 text-normal md:text-lg text-gray-400">
                {whyChooseItems.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-normal text-gray-400 mt-4">
                This makes it a practical and dependable option for this journey.
              </p>
            </div>

            <div className="group relative bg-[#1a1a1a] rounded-2xl p-6 lg:p-8 border border-gray-800/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_theme(colors.primary/0.2)] hover:-translate-y-1">
              <div className="relative mb-4">
                <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-14 h-14 rounded-xl bg-[#0f0f0f] border border-gray-800/50 group-hover:border-primary/50 flex items-center justify-center transition-colors">
                  <Car className="h-7 w-7 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                Vehicle Suitability & Use Cases
              </h3>
              <p className="text-gray-400 text-normal mb-4">
                This vehicle is commonly booked for:
              </p>
              <ul className="grid gap-2 text-normal text-gray-400">
                {vehicleSuitability.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-normal text-gray-400 mt-3">
                The {vehicleModel} provides a good balance of comfort, space, and fuel efficiency for this route.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Booking Information + How Booking Works */}
      <section className="relative py-16 lg:py-24 bg-background overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_55%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-800/50 bg-[#1a1a1a] p-8 space-y-5">
              <h3 className="text-xl font-bold text-white">
                Pricing & Payment Information
              </h3>
              <p className="text-normal text-gray-400">
                Rental pricing for {vehicleModel} from {origin} to {destination} depends on:
              </p>
              <ul className="mt-3 grid gap-2 text-normal text-gray-400">
                {pricingFactors.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-normal md:text-lg text-muted-foreground mt-3 leading-relaxed">
                A small advance payment is required to confirm the booking. The remaining amount is paid directly to the rental provider at the time of service.
              </p>
            </div>

            <div className="rounded-2xl border border-primary bg-foreground p-8 space-y-5 shadow-primary">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
                Simple booking steps
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold text-white">
                How the Booking Process Works
              </h2>
              <p className="text-normal text-emerald-50/80">
                Booking a {vehicleModel} for this route is simple:
              </p>
              <ol className="mt-4 space-y-3 text-normal md:text-lg text-emerald-50/80">
                <li className="flex gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-normal shrink-0">1</span>
                  <span className="flex-1 self-center">Select the {vehicleModel} for this route</span>
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
                  <span className="flex-1 self-center">Our team coordinates with the rental provider</span>
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-normal shrink-0">5</span>
                  <span className="flex-1 self-center">The vehicle is arranged as per your travel schedule</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Rental Providers */}
      <section className="relative py-16 lg:py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1),_transparent_70%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="rounded-2xl border border-gray-800/50 bg-[#1a1a1a] p-6 lg:p-8">
            <h3 className="text-xl font-bold text-white mb-3">
              Trust & Verified Rental Providers
            </h3>
            <p className="text-gray-400 text-normal mb-3">
              We work with genuine and locally operating rental businesses.
            </p>
            <p className="text-gray-400 text-normal mb-3">
              Each rental provider profile includes:
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
              This ensures transparency and helps users book with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Available Vehicles */}
      {(modelVehicles.length > 0 || vehicles.length > 0) && (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-2xl font-bold mb-6">Available Vehicles</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(modelVehicles.length > 0 ? modelVehicles : vehicles).slice(0, 6).map((v) => {
                const img = Array.isArray(v.images) && v.images.length > 0 ? (v.images[0] as string) : null
                const price = v.priceOutOfCity ?? v.priceDaily ?? v.priceWithDriver ?? 0
                return (
                  <Card key={v.id} className="overflow-hidden">
                    {img && (
                      <div className="relative aspect-video bg-muted">
                        <img src={img} alt={v.title} className="object-cover w-full h-full" />
                      </div>
                    )}
                    <div className="p-4">
                      <Link href={`/listings/${v.slug}`}>
                        <h3 className="font-semibold hover:text-primary">{v.title}</h3>
                      </Link>
                      {price > 0 && <p className="mt-1 font-medium">From Rs. {price.toLocaleString()}/day</p>}
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

      {/* Related Options */}
      <section className="relative py-16 lg:py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="rounded-2xl border border-gray-800/50 bg-[#1a1a1a] p-6 lg:p-8">
            <h3 className="text-xl font-bold text-white mb-3">
              Related Options
            </h3>
            <ul className="space-y-2 text-normal text-gray-400">
              <li>
                <Link href={`/routes/${route.slug}`} className="hover:text-primary transition-colors">
                  • View all vehicles available for {origin} to {destination}
                </Link>
              </li>
              <li>
                <Link href={`/rent-a-car/${route.slug}`} className="hover:text-primary transition-colors">
                  • Rent a car from {origin} to {destination}
                </Link>
              </li>
              <li>
                <Link href="/view-all-vehicles" className="hover:text-primary transition-colors">
                  • Browse car rental services in {origin}
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
              Planning to travel from {origin} to {destination} in a {vehicleModel}?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Compare options, connect with trusted rental providers, and book your ride today.
            </p>
            <Link href={`/routes/${route.slug}`}>
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
