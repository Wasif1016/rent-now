import Link from 'next/link'
import { HeroSection } from '@/components/hero/hero-section'
import { Button } from '@/components/ui/button'
import {
  Check,
  Car,
  ShieldCheck,
  Search,
  CreditCard,
  Phone,
  FileCheck,
  HelpCircle,
  ArrowRight,
} from 'lucide-react'

export type KeywordModelLandingPageProps = {
  keywordSlug: string
  modelSlug: string
  modelName: string
  brandName: string
  vehicleCategory?: string | null
  seatingCapacity?: number | null
  driverOption?: string
}

function toTitleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase())
}

function humanizeKeyword(slug: string): string {
  return toTitleCase(slug.replace(/-/g, ' '))
}

const USE_CASES = [
  'Daily transportation',
  'Office and business travel',
  'Family trips and tours',
  'Airport pick & drop',
  'Intercity journeys',
]

const TRUST_ITEMS = ['Business details', 'Available vehicles', 'Service areas', 'Contact information']

export function KeywordModelLandingPage({
  keywordSlug,
  modelSlug,
  modelName,
  brandName,
  vehicleCategory,
  seatingCapacity,
  driverOption = 'With Driver / Without Driver / Both',
}: KeywordModelLandingPageProps) {
  const keywordNatural = humanizeKeyword(keywordSlug)
  const vehicleBrand = brandName
  const vehicleModel = modelName
  const seating_capacity = seatingCapacity != null ? String(seatingCapacity) : '5'
  const driver_option = driverOption

  // e.g. "Rent A Car Toyota Corolla" -> "Toyota Corolla Rent A Car"
  const h1 = `${vehicleBrand} ${vehicleModel} ${keywordNatural}`

  const whyChooseItems = [
    `Comfortable seating for up to ${seating_capacity} passengers`,
    'Suitable for city and intercity travel',
    'Fuel-efficient and reliable',
    `Available ${driver_option}`,
    'Ideal for families, professionals, and tourists',
  ]

  const faqs = [
    {
      q: `Is ${vehicleBrand} ${vehicleModel} available with a driver?`,
      a: `Yes, many rental providers offer ${vehicleModel} with driver, depending on availability.`,
    },
    {
      q: `Can I book ${vehicleModel} for long-term use?`,
      a: 'Yes, both short-term and long-term rental options are available from selected providers.',
    },
    {
      q: 'Is advance payment required?',
      a: 'A small advance is required to confirm your booking. The remaining amount is paid directly to the rental company.',
    },
  ]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection heading={h1} />

      {/* Intro section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(34,197,94,0.12),_transparent_55%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-foreground tracking-tight text-center">
              Looking for {vehicleBrand} {vehicleModel}?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Our platform helps you find trusted {vehicleModel} rental options near you.
            </p>
            <p className="text-normal md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Whether you need {vehicleBrand} {vehicleModel} for daily use, family travel, tours, business trips, or special occasions, you can compare verified rental companies and book with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose + Vehicles */}
      <section className="relative py-16 lg:py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1),_transparent_70%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-background mb-4">
              Why Choose Our {vehicleBrand} {vehicleModel}?
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Verified partners, transparent pricing, and support every step of the way.
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
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                Trust &amp; choice
              </h3>
              <ul className="grid gap-3 text-normal md:text-lg text-gray-400">
                {whyChooseItems.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="group relative bg-[#1a1a1a] rounded-2xl p-6 lg:p-8 border border-gray-800/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_theme(colors.primary/0.2)] hover:-translate-y-1">
              <div className="relative mb-4">
                <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-14 h-14 rounded-xl bg-[#0f0f0f] border border-gray-800/50 group-hover:border-primary/50 flex items-center justify-center transition-colors">
                  <Car className="h-7 w-7 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                Available vehicles
              </h3>
              <p className="text-gray-400 text-normal mb-4">
                You can book {vehicleBrand} {vehicleModel} and similar options depending on availability:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {USE_CASES.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-gray-800/50 bg-[#0f0f0f] px-4 py-3 flex items-center gap-3 text-gray-400"
                  >
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-normal">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases + How booking works */}
      <section className="relative py-16 lg:py-24 bg-background overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-800/50 bg-[#1a1a1a] p-8 space-y-5">
              <h3 className="text-xl font-bold text-white">Use cases &amp; purposes</h3>
              <p className="text-normal text-gray-400">
                People choose {vehicleBrand} {vehicleModel} for many reasons:
              </p>
              <ul className="mt-3 grid gap-2 text-normal text-gray-400">
                {USE_CASES.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-primary bg-foreground p-8 space-y-5 shadow-primary">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
                Simple booking steps
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold text-white">
                How booking works
              </h2>
              <ol className="mt-4 space-y-3 text-normal md:text-lg text-emerald-50/80">
                <li className="flex gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-normal">
                    <Search className="h-5 w-5 text-primary" />
                  </span>
                  <span className="flex-1 self-center">
                    Browse available vehicles
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-normal">
                    <FileCheck className="h-5 w-5 text-primary" />
                  </span>
                  <span className="flex-1 self-center">
                    Submit your booking request
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-normal">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </span>
                  <span className="flex-1 self-center">
                    Pay a small advance to confirm
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-normal">
                    <Phone className="h-5 w-5 text-primary" />
                  </span>
                  <span className="flex-1 self-center">
                    Our team coordinates with the rental company
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-normal">
                    <Car className="h-5 w-5 text-primary" />
                  </span>
                  <span className="flex-1 self-center">
                    Vehicle is arranged as per your requirement
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Trust + Find */}
      <section className="relative py-16 lg:py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-800/50 bg-[#1a1a1a] p-6 lg:p-8">
              <h3 className="text-xl font-bold text-white mb-3">Trust &amp; verification</h3>
              <p className="text-gray-400 text-normal mb-3">
                We focus on listing genuine rental businesses. Each profile includes:
              </p>
              <ul className="space-y-1 text-normal text-gray-400">
                {TRUST_ITEMS.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-800/50 bg-[#1a1a1a] p-6 lg:p-8">
              <h3 className="text-xl font-bold text-white mb-3">Find {vehicleBrand} {vehicleModel}</h3>
              <p className="text-gray-400 text-normal">
                Searching for {vehicleModel} rent, {vehicleModel} with driver, or affordable {vehicleModel} rental? This page helps you find reliable vehicle rental options quickly and easily.
              </p>
            </div>
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
            <p className="text-muted-foreground">
              Quick answers about {vehicleBrand} {vehicleModel} and booking.
            </p>
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
              Ready to proceed with <br />
              {vehicleBrand} {vehicleModel}?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Compare available {vehicleModel} listings, connect with trusted rental companies, and book with confidence.
            </p>
            <Link href={`/search?model=${modelSlug}`}>
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-8 py-6 text-lg"
              >
                View Available {vehicleModel}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
