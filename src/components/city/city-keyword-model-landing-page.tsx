import Link from 'next/link'
import { HeroSection } from '@/components/hero/hero-section'
import { Button } from '@/components/ui/button'
import {
  Search,
  CreditCard,
  Phone,
  FileCheck,
  Car,
} from 'lucide-react'
import { CTA } from '../shared/cta'
import {
  IntroSection,
  WhyChooseSection,
  UseCasesAndBookingSection,
  TrustFindSection,
  FAQSection,
} from '../shared/landing-sections'

export type CityKeywordModelLandingPageProps = {
  citySlug: string
  cityName: string
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

export function CityKeywordModelLandingPage({
  citySlug,
  cityName,
  keywordSlug,
  modelSlug,
  modelName,
  brandName,
  vehicleCategory,
  seatingCapacity,
  driverOption = 'With Driver / Without Driver / Both',
}: CityKeywordModelLandingPageProps) {
  const keywordNatural = humanizeKeyword(keywordSlug)
  const city = cityName
  const vehicleBrand = brandName
  const vehicleModel = modelName
  const vehicle_category = vehicleCategory ?? 'car'
  const seating_capacity = seatingCapacity != null ? String(seatingCapacity) : '5'
  const driver_option = driverOption

  const h1 = `${keywordNatural} ${vehicleBrand} ${vehicleModel} in ${city}`

  const whyChooseItems = [
    `Comfortable seating for up to ${seating_capacity} passengers`,
    'Suitable for city and intercity travel',
    'Fuel-efficient and reliable',
    `Available ${driver_option}`,
    'Ideal for families, professionals, and tourists',
  ]

  const faqs = [
    {
      q: `Is ${vehicleBrand} ${vehicleModel} available with a driver in ${city}?`,
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

      <IntroSection
        heading={`Looking for ${keywordNatural} ${vehicleBrand} ${vehicleModel} in ${city}?`}
        paragraphs={[
          `Our platform helps you find trusted ${vehicleModel} rental options in ${city} without hassle.`,
          `Whether you need ${vehicleBrand} ${vehicleModel} for daily use, family travel, tours, business trips, or special occasions, you can compare verified rental companies and book with confidence.`,
          `We connect you directly with local rental businesses so you get better availability, fair pricing, and faster response.`,
        ]}
      />

      <WhyChooseSection
        title={`Why Choose Our ${keywordNatural} ${vehicleBrand} ${vehicleModel} in ${city}?`}
        subtitle="Verified partners, transparent pricing, and support every step of the way."
        trustCard={{
          title: "Trust & choice",
          items: whyChooseItems,
        }}
        vehiclesCard={{
          title: "Available vehicles",
          description: `You can book ${vehicleBrand} ${vehicleModel} and similar options depending on availability:`,
          items: USE_CASES,
          footerText: "Vehicle availability may vary by location and rental company.",
        }}
      />

      <UseCasesAndBookingSection
        useCases={{
          title: "Use cases & purposes",
          description: `People choose ${vehicleBrand} ${vehicleModel} in ${city} for many reasons:`,
          items: USE_CASES,
          footerText: "No matter the purpose, you'll find suitable rental options through verified providers.",
        }}
        booking={{
          subtitle: "Simple booking steps",
          title: "How booking works",
          steps: [
            { icon: Search, text: "Browse available vehicles" },
            { icon: FileCheck, text: "Submit your booking request" },
            { icon: CreditCard, text: "Pay a small advance to confirm" },
            { icon: Phone, text: "Our team coordinates with the rental company" },
            { icon: Car, text: "Vehicle is arranged as per your requirement" },
          ],
          footerText: "Simple, transparent, and reliable.",
        }}
      />

      <TrustFindSection
        trustCard={{
          title: "Trust & verification",
          description: "We focus on listing genuine rental businesses. Each profile includes:",
          items: TRUST_ITEMS,
        }}
        findCard={{
          title: `Find ${vehicleBrand} ${vehicleModel} in ${city}`,
          description: `Searching for ${vehicleModel} rent in ${city}, ${vehicleModel} with driver in ${city}, or affordable ${vehicleModel} rental in ${city}? This page helps you find reliable vehicle rental options quickly and easily.`,
        }}
      />

      <FAQSection
        title="Frequently Asked Questions"
        subtitle={`Quick answers about ${vehicleBrand} ${vehicleModel} and booking.`}
        faqs={faqs}
      />

      {/* Final CTA – single button (same as keyword-landing-page) */}
      <CTA vehicleBrand={vehicleBrand} vehicleModel={vehicleModel} city={city} modelSlug={modelSlug} citySlug={citySlug} />
    </main>
  )
} 
