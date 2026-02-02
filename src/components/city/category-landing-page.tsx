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

export type CategoryLandingPageProps = {
  category: { id: string; name: string; slug: string }
  /** e.g. "With Driver / Without Driver / Both" */
  driverOption?: string
  /** e.g. "2" */
  minSeating?: string
  /** e.g. "7" */
  maxSeating?: string
}

function toTitleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase())
}

const USE_CASES = [
  'Daily city travel',
  'Family trips and tours',
  'Business and office use',
  'Airport pick & drop',
  'Events and special occasions',
]

const TRUST_ITEMS = [
  'Rental company details',
  'Available vehicles',
  'Pricing structure',
  'Service areas',
]

export function CategoryLandingPage({
  category,
  driverOption = 'With Driver / Without Driver / Both',
  minSeating = '2',
  maxSeating = '7',
}: CategoryLandingPageProps) {
  const vehicleCategory = toTitleCase(category.name.replace(/-/g, ' '))
  const vehicleCategorySlug = category.slug

  const h1 = `${vehicleCategory} Rental Services in Pakistan`

  const whyChooseItems = [
    'Comfortable and practical travel experience',
    `Flexible seating options (${minSeating} to ${maxSeating} passengers)`,
    `Availability ${driverOption}`,
    'Suitable for short-term and long-term use',
    'Wide availability across cities',
  ]

  const faqs = [
    {
      q: `Can I rent a ${vehicleCategory} with driver?`,
      a: `Yes, many rental providers offer ${vehicleCategory} vehicles with driver, depending on availability.`,
    },
    {
      q: `Are ${vehicleCategory} rentals available for long-term use?`,
      a: 'Yes, short-term and long-term rental options are available from selected vendors.',
    },
    {
      q: 'Is advance payment required?',
      a: 'A small advance payment is required to confirm bookings.',
    },
  ]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection heading={h1} />

      {/* Intro – same layout as city-keyword-model-landing-page */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(34,197,94,0.12),_transparent_55%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[3fr,2fr] items-center">
            <div className="space-y-4 flex flex-col items-center text-center lg:items-start lg:text-left">
              <h2 className="text-3xl lg:text-5xl xl:text-5xl font-extrabold text-foreground tracking-tight">
                Looking for {vehicleCategory} rental services in Pakistan?
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Our platform helps you find verified {vehicleCategory} rental providers offering reliable vehicles for personal, family, business, and travel needs.
              </p>
              <p className="text-normal md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Whether you need a {vehicleCategory} for a few hours, a full day, or long-term use, you can explore multiple options, compare prices, and book with confidence.
              </p>
              <p className="text-normal md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                We connect you directly with local rental businesses so you get better availability, fair pricing, and faster response.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Rent a {{vehicle_category}} + Available types – dark cards */}
      <section className="relative py-16 lg:py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1),_transparent_70%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-5xl xl:text-5xl font-extrabold text-background mb-4">
              Why Rent a {vehicleCategory}?
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              {vehicleCategory} vehicles are commonly chosen because they offer:
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
                Why choose {vehicleCategory}
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
                Available {vehicleCategory} types
              </h3>
              <p className="text-gray-400 text-normal mb-4">
                On this page, you can explore multiple {vehicleCategory} options, including different brands and models offered by local rental companies.
              </p>
              <p className="text-xs text-gray-500 mt-3">
                Vehicle availability may vary based on location and rental provider.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases + How booking works – two columns */}
      <section className="relative py-16 lg:py-24 bg-background overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_55%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-800/50 bg-[#1a1a1a] p-8 space-y-5">
              <h3 className="text-xl font-bold text-white">Use cases &amp; purposes</h3>
              <p className="text-normal text-gray-400">
                People typically book {vehicleCategory} rentals for:
              </p>
              <ul className="mt-3 grid gap-2 text-normal text-gray-400">
                {USE_CASES.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-normal md:text-lg text-muted-foreground mt-3 leading-relaxed">
                No matter the purpose, you&apos;ll find suitable rental options through verified providers.
              </p>
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
                    Browse available {vehicleCategory} listings
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-normal">
                    <FileCheck className="h-5 w-5 text-primary" />
                  </span>
                  <span className="flex-1 self-center">
                    Select a vehicle that fits your needs
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-normal">
                    <FileCheck className="h-5 w-5 text-primary" />
                  </span>
                  <span className="flex-1 self-center">
                    Submit a booking request
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
                    Coordinate directly with the rental provider
                  </span>
                </li>
              </ol>
              <p className="text-normal md:text-lg text-emerald-50/80 mt-3 leading-relaxed">
                Simple, transparent, and reliable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust + SEO – two cards */}
      <section className="relative py-16 lg:py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1),_transparent_70%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-800/50 bg-[#1a1a1a] p-6 lg:p-8">
              <h3 className="text-xl font-bold text-white mb-3">Trust &amp; verification</h3>
              <p className="text-gray-400 text-normal mb-3">
                We list genuine rental businesses operating locally across Pakistan. Each listing includes:
              </p>
              <ul className="space-y-1 text-normal text-gray-400">
                {TRUST_ITEMS.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-gray-400 text-normal mt-3">
                This ensures you can book with confidence and avoid unreliable vendors.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800/50 bg-[#1a1a1a] p-6 lg:p-8">
              <h3 className="text-xl font-bold text-white mb-3">Find {vehicleCategory} rental near you</h3>
              <p className="text-gray-400 text-normal">
                If you&apos;re searching for {vehicleCategory.toLowerCase()} rental near me, affordable {vehicleCategory} rental in Pakistan, or best {vehicleCategory} rental service, this category page helps you discover trusted rental options quickly and easily.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="relative py-16 lg:py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-extrabold text-background mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Quick answers about {vehicleCategory} rental and booking.
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

      {/* Final CTA – two buttons: View Available {{vehicle_category}} Vehicles + Compare & Book Now */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Looking to book a {vehicleCategory} rental?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Compare {vehicleCategory} vehicles and connect with trusted rental companies across Pakistan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={`/search?category=${vehicleCategorySlug}`}>
                <Button
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-8 py-6 text-lg w-full sm:w-auto"
                >
                  View Available {vehicleCategory} Vehicles
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/view-all-vehicles">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8 py-6 text-lg w-full sm:w-auto"
                >
                  Compare &amp; Book Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
