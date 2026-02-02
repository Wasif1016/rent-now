import Link from 'next/link'
import { HeroSection } from '@/components/hero/hero-section'
import { SeoFooter } from '@/components/home/seo-footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MapPin, Clock, ArrowRight, Car, HelpCircle } from 'lucide-react'
import type { getRouteBySlug } from '@/lib/data'

type RouteWithVehicles = Awaited<ReturnType<typeof getRouteBySlug>> extends infer R ? (R extends null ? never : R) : never

export type RouteLandingPageProps = {
  route: RouteWithVehicles
}

export function RouteLandingPage({ route }: RouteLandingPageProps) {
  const origin = route.originCity.name
  const destination = route.destinationCity.name
  const h1 = `${origin} to ${destination} Car Rental`
  const vehicles = route.vehicles ?? []

  const faqs = [
    {
      q: `What is included in the fare from ${origin} to ${destination}?`,
      a: 'Quoted prices usually include fuel, driver, and basic tolls unless clearly mentioned otherwise by the vendor. Always confirm inclusions on your confirmation call.',
    },
    {
      q: `Can I make stops on the way between ${origin} and ${destination}?`,
      a: 'Short refreshment and prayer stops are normally included. For longer detours or sightseeing, discuss the route with your vendor so they can adjust pricing if needed.',
    },
    {
      q: 'Is advance payment required?',
      a: 'A small advance is required to confirm your booking. The remaining amount is paid directly to the rental company.',
    },
  ]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection heading={h1} />

      <section className="relative py-12 lg:py-16 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground mb-6">
            <MapPin className="h-5 w-5 shrink-0" />
            <span>
              {origin}
              <ArrowRight className="inline h-4 w-4 mx-1" />
              {destination}
            </span>
            {route.distanceKm != null && (
              <>
                <span className="opacity-60">·</span>
                <span>{route.distanceKm} km</span>
              </>
            )}
            {route.estimatedTime && (
              <>
                <span className="opacity-60">·</span>
                <Clock className="h-4 w-4 inline shrink-0" />
                <span>{route.estimatedTime}</span>
              </>
            )}
            {(route.oneWay || route.roundTrip) && (
              <>
                <span className="opacity-60">·</span>
                <span>{route.oneWay && route.roundTrip ? 'One-way & round trip' : route.oneWay ? 'One-way' : 'Round trip'}</span>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mb-10">
            <Button asChild variant="default">
              <Link href={`/rent-a-car/${route.slug}`}>Rent a car on this route</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/vehicles/car">Browse cars</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/vehicles/suv">Browse SUVs</Link>
            </Button>
          </div>

          {vehicles.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mb-6">Available vehicles</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((v) => {
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
                        {v.category && (
                          <Link href={`/vehicles/${v.category.slug}`} className="text-sm text-muted-foreground hover:underline">
                            {v.category.name}
                          </Link>
                        )}
                        {price > 0 && (
                          <p className="mt-2 font-medium">From Rs. {price.toLocaleString()}/day</p>
                        )}
                        <Button asChild size="sm" className="mt-2">
                          <Link href={`/listings/${v.slug}`}>View & book</Link>
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </>
          )}

          {vehicles.length === 0 && (
            <Card className="p-8 text-center">
              <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No vehicles linked to this route yet. Check back soon or browse by city.</p>
              <Button asChild className="mt-4">
                <Link href="/rent-a-car">Browse rent a car by city</Link>
              </Button>
            </Card>
          )}

          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="h-6 w-6" />
              FAQs
            </h2>
            <ul className="space-y-4">
              {faqs.map((faq, i) => (
                <li key={i}>
                  <p className="font-medium">{faq.q}</p>
                  <p className="text-muted-foreground text-sm mt-1">{faq.a}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>

      <SeoFooter />
    </main>
  )
}
