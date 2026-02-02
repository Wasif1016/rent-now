import Link from 'next/link'
import { HeroSection } from '@/components/hero/hero-section'
import { SeoFooter } from '@/components/home/seo-footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, Car, ShieldCheck, HelpCircle } from 'lucide-react'
import type { getRouteBySlug } from '@/lib/data'

type RouteWithVehicles = Awaited<ReturnType<typeof getRouteBySlug>> extends infer R ? (R extends null ? never : R) : never

function toTitleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase())
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
  const h1 = `${brandName} ${modelName} Rent from ${origin} to ${destination}`
  const vehicles = route.vehicles ?? []
  const modelVehicles = vehicles.filter(
    (v) => v.vehicleModel?.slug === modelSlug || v.vehicleModel?.vehicleBrand?.slug === brandName.toLowerCase().replace(/\s+/g, '-')
  )

  const faqs = [
    {
      q: `Is ${brandName} ${modelName} available with a driver for ${origin} to ${destination}?`,
      a: 'Yes, many rental providers offer this model with driver for intercity trips. Confirm availability when booking.',
    },
    {
      q: 'Is advance payment required?',
      a: 'A small advance is required to confirm your booking. The remaining amount is paid directly to the rental company.',
    },
  ]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection heading={h1} />

      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_55%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl font-extrabold text-center mb-6">
            {brandName} {modelName} from {origin} to {destination}
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            Book {brandName} {modelName} for the {origin} to {destination} route. Compare verified rental options, seating for {seatingCapacity ?? 5} passengers, and driver options.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Button asChild variant="default">
              <Link href={`/rent-a-car/${route.slug}`}>Rent a car on this route</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/routes/${route.slug}`}>View route details</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="relative py-16 lg:py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-2xl font-bold text-white mb-6">Why {brandName} {modelName} for this route?</h2>
          <ul className="grid gap-3 text-gray-400">
            <li className="flex gap-3">
              <Check className="h-5 w-5 text-primary shrink-0" />
              Comfortable seating for up to {seatingCapacity ?? 5} passengers
            </li>
            <li className="flex gap-3">
              <Check className="h-5 w-5 text-primary shrink-0" />
              Suitable for intercity travel and long journeys
            </li>
            <li className="flex gap-3">
              <Check className="h-5 w-5 text-primary shrink-0" />
              Available with driver or self-drive depending on vendor
            </li>
          </ul>
        </div>
      </section>

      {(modelVehicles.length > 0 || vehicles.length > 0) && (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-2xl font-bold mb-6">Available vehicles</h2>
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

      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
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
        </div>
      </section>

      <SeoFooter />
    </main>
  )
}
