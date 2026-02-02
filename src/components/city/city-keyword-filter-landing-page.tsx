import Link from 'next/link'
import { HeroSection } from '@/components/hero/hero-section'
import { SeoFooter } from '@/components/home/seo-footer'
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
import type { FilterType } from '@/lib/seo-resolver'

export type CityKeywordFilterLandingPageProps = {
  citySlug: string
  cityName: string
  keywordSlug: string
  /** Second segment (e.g. with-driver, 7-seater, suv). */
  filterSlug: string
  /** DRIVER | SEATING | PRICE for filter-context paragraph. */
  filterType?: FilterType
  category?: { id: string; name: string; slug: string }
  capacity?: number
  minPrice?: string
  maxPrice?: string
}

function toTitleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase())
}

function humanizeSlug(slug: string): string {
  return toTitleCase(slug.replace(/-/g, ' '))
}

const USE_CASES = [
  'Daily or short-term travel',
  'Family trips and tours',
  'Business and office use',
  'Events, weddings, and functions',
  'Airport pick and drop',
]

const TRUST_ITEMS = [
  'Business information',
  'Vehicle details',
  'Pricing structure',
  'Service coverage',
]

function getFilterContextParagraph(
  filterType: FilterType | undefined,
  filterNatural: string
): string {
  switch (filterType) {
    case 'DRIVER':
      return `This page shows vehicles available ${filterNatural}, making it ideal for users who prefer convenience, long trips, or do not want to drive themselves.`
    case 'SEATING':
      return `This page lists vehicles with ${filterNatural} capacity, suitable for families, groups, tours, and business travel.`
    case 'PRICE':
      return 'This page highlights rental options within a specific budget range, helping users find vehicles that match their affordability.'
    default:
      return `This page lists vehicles matching your filter (${filterNatural}), helping you find options that suit your needs.`
  }
}

export function CityKeywordFilterLandingPage({
  citySlug,
  cityName,
  keywordSlug,
  filterSlug,
  filterType,
  category,
  capacity,
}: CityKeywordFilterLandingPageProps) {
  const keywordNatural = humanizeSlug(keywordSlug)
  const city = cityName
  const filterNatural =
    capacity != null
      ? `${capacity} seater`
      : category
        ? humanizeSlug(category.name)
        : humanizeSlug(filterSlug)

  const h1 = `${keywordNatural} ${filterNatural} in ${city}`

  const whyChooseItems = [
    'Local availability and faster coordination',
    'Flexible rental durations',
    'Transparent pricing',
    'Verified rental providers',
    'Suitable for city and intercity travel',
  ]

  const faqs = [
    {
      q: `Is ${filterNatural} available in ${city}?`,
      a: `Yes, many rental providers in ${city} offer vehicles matching this requirement.`,
    },
    {
      q: 'Can I book instantly?',
      a: 'You can submit a booking request instantly. Confirmation depends on vehicle availability.',
    },
    {
      q: 'Is advance payment required?',
      a: 'Yes, a small advance is required to confirm your booking.',
    },
    {
      q: 'Are vendors verified?',
      a: 'We focus on listing genuine local rental businesses.',
    },
  ]

  const filterContextParagraph = getFilterContextParagraph(filterType, filterNatural)

  const searchParams = new URLSearchParams()
  searchParams.set('city', citySlug)
  if (capacity != null) searchParams.set('seating', String(capacity))
  if (category) searchParams.set('category', category.slug)
  if (filterSlug === 'with-driver') searchParams.set('driver', 'with')
  if (filterSlug === 'without-driver') searchParams.set('driver', 'without')
  const searchHref = `/search?${searchParams.toString()}`

  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection heading={h1} />

      {/* Intro – content centered */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(34,197,94,0.12),_transparent_55%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl flex justify-center items-center">
          <div className="space-y-4 flex flex-col items-center text-center">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-foreground tracking-tight">
              Looking for {keywordNatural} {filterNatural} in {city}?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Our platform helps you connect with verified local rental businesses offering vehicles that match your exact requirements.
            </p>
            <p className="text-normal md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Whether you need a vehicle for travel, family use, business, or events, you can compare options, check availability, and book confidently.
            </p>
            <p className="text-normal md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              We connect you directly with local rental businesses so you get better availability, fair pricing, and faster response.
            </p>
          </div>
        </div>
      </section>


      {/* Why this option + Filter context – dark cards */}
      <section className="relative py-16 lg:py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1),_transparent_70%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-background mb-4">
              Why This Option in {city}
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              People prefer {keywordNatural} {filterNatural} in {city} because:
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
                Filter context
              </h3>
              <p className="text-gray-400 text-normal">
                {filterContextParagraph}
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
                People usually book these vehicles for:
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
                    Browse vehicles matching your filter
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
                    Confirm with a small advance payment
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
                Simple, fast, and reliable.
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
                We focus on listing genuine rental businesses operating in {city}. Each listing includes:
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
                This ensures transparency and trust.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800/50 bg-[#1a1a1a] p-6 lg:p-8">
              <h3 className="text-xl font-bold text-white mb-3">Find {keywordNatural} {filterNatural} in {city}</h3>
              <p className="text-gray-400 text-normal mb-3">
                If you&apos;re searching for:
              </p>
              <ul className="text-gray-400 text-normal space-y-1 mb-3">
                <li>• {keywordNatural} {filterNatural} near me in {city}</li>
                <li>• Best {keywordNatural} {filterNatural} in {city}</li>
                <li>• Affordable vehicle rental options in {city}</li>
              </ul>
              <p className="text-gray-400 text-normal">
                this page is designed to help you find reliable options quickly.
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
              Quick answers about {keywordNatural} {filterNatural} in {city} and booking.
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

      {/* Final CTA – two buttons */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to book {keywordNatural} {filterNatural} in {city}?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Compare vehicles and connect with trusted rental companies in {city}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={searchHref}>
                <Button
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-8 py-6 text-lg w-full sm:w-auto"
                >
                  View Available Vehicles
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href={searchHref}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8 py-6 text-lg w-full sm:w-auto"
                >
                  Start Booking Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SeoFooter />
    </main>
  )
}
