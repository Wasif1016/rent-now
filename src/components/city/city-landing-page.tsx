import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/hero/hero-section";
import { Button } from "@/components/ui/button";
import {
  Check,
  Car,
  Truck,
  Bus,
  CarFront,
  Sparkles,
} from "lucide-react";
import { CTA } from '../shared/cta'
import {
  IntroSection,
  WhyChooseSection,
  UseCasesAndBookingSection,
  FAQSection,
} from '../shared/landing-sections'

/** Converts slug form (e.g. "lahore", "new-york") to display form with spaces. */
export function humanizeCity(city: string): string {
  return city.replace(/-/g, " ");
}

/** Converts slug form (e.g. "rent-a-car") to natural form ("rent a car"). */
export function humanizeKeyword(keyword: string): string {
  return keyword.replace(/-/g, " ");
}

/** Title-cases a string (e.g. "new york" → "New York"). */
function toTitleCase(s: string): string {
  return s.replace(
    /\w\S*/g,
    (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
  );
}

/** Generates metadata for a city+keyword landing page. Use in the page's generateMetadata(). */
export function getCityPageMetadata(city: string, keyword: string): Metadata {
  const cityDisplay = toTitleCase(humanizeCity(city));
  const keywordNatural = toTitleCase(humanizeKeyword(keyword));
  const title = `${keywordNatural} in ${cityDisplay}`;

  return {
    title,
    description: `Looking for ${keywordNatural} in ${cityDisplay}? Our platform helps you connect with trusted local vehicle rental services in ${cityDisplay}, making booking simple and reliable.`,
    alternates: {
      canonical: `/${keyword}/${city}`,
    },
  };
}

const WHY_CHOOSE_ITEMS = [
  "Local rental businesses operating in {city}",
  "Multiple vehicle options based on city demand",
  "Transparent pricing with no hidden charges",
  "Easy booking with a small advance",
  "Faster response due to local coordination",
  "Options for short-term and long-term rentals",
];

const VEHICLE_TYPE_ITEMS = [
  { icon: Car, label: "Standard cars and sedans" },
  { icon: Truck, label: "SUVs and family vehicles" },
  { icon: CarFront, label: "Vans and Hiace" },
  { icon: Bus, label: "Coasters and buses" },
  { icon: Sparkles, label: "Wedding and event vehicles" },
];

const USE_CASES = [
  "Daily or monthly transportation",
  "Family visits and local travel",
  "Tours and sightseeing around {city}",
  "Corporate and business travel",
  "Airport pick and drop services",
  "Events, weddings, and group travel",
];

const TRUST_ITEMS = [
  "Business name and contact details",
  "Available vehicles",
  "Service areas within {city}",
  "Rental options (with or without driver)",
];

const PRICING_FACTORS = [
  "Vehicle type",
  "Rental duration",
  "Distance and usage",
  "Driver inclusion",
];

const DEFAULT_FAQS = [
  {
    q: "What does {keywordNatural} in {city} mean?",
    a: "It refers to booking a vehicle from a rental provider operating within {city} for personal, family, or business use.",
  },
  {
    q: "Can I book vehicles available specifically in {city}?",
    a: "Yes, the listings shown are from rental businesses serving {city} and nearby areas.",
  },
  {
    q: "Is a driver included in {city} rentals?",
    a: "Some providers in {city} offer vehicles with drivers, while others offer self-drive options.",
  },
  {
    q: "Is advance payment required?",
    a: "Yes, a small advance is required to confirm bookings in {city}.",
  },
  {
    q: "Can I book for long-term use in {city}?",
    a: "Yes, many rental businesses in {city} offer both short-term and long-term options.",
  },
];

export type CityLandingPageProps = {
  /** City in slug form (e.g. "karachi", "lahore"). */
  city: string;
  /** Keyword in slug form (e.g. "Rent-a-car", "car-hire"). */
  keyword: string;
  /** Optional town name for hyper-local pages. */
  town?: string;
  /** Optional override for the hero H1 (e.g. "Toyota Corolla in Lahore – Book Trusted Vehicles"). */
  heroHeading?: string;
};

function replacePlaceholders(
  text: string,
  city: string,
  keywordNatural: string,
  town?: string
): string {
  let result = text
    .replace(/\{city\}/g, city)
    .replace(/\{keywordNatural\}/g, keywordNatural);
  if (town) {
    result = result.replace(/\{town\}/g, town);
  }
  return result;
}

export function CityLandingPage({
  city,
  keyword,
  town,
  heroHeading: heroHeadingOverride,
}: CityLandingPageProps) {
  const keywordNatural = toTitleCase(humanizeKeyword(keyword));
  const cityDisplay = toTitleCase(humanizeCity(city));

  const locationDisplay = town ? `${town}, ${cityDisplay}` : cityDisplay;
  const heroHeading =
    heroHeadingOverride ??
    `${keywordNatural} in ${locationDisplay} – Book Trusted Vehicles`;

  const whyChooseItems = WHY_CHOOSE_ITEMS.map((item) =>
    replacePlaceholders(item, cityDisplay, keywordNatural, town)
  );
  const useCases = USE_CASES.map((item) =>
    replacePlaceholders(item, cityDisplay, keywordNatural, town)
  );
  const trustItems = TRUST_ITEMS.map((item) =>
    replacePlaceholders(item, cityDisplay, keywordNatural, town)
  );
  const faqs = DEFAULT_FAQS.map(({ q, a }) => ({
    q: replacePlaceholders(q, cityDisplay, keywordNatural, town),
    a: replacePlaceholders(a, cityDisplay, keywordNatural, town),
  }));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection heading={heroHeading} />

      <IntroSection
        heading={`Looking for ${keywordNatural} in ${cityDisplay}?`}
        paragraphs={[
          `Our platform helps you connect with trusted local vehicle rental services in ${cityDisplay}, making booking simple and reliable.`,
          `Whether you need a vehicle for daily travel, family trips, business use, tours, or special occasions, you can explore verified rental options available within ${cityDisplay} and nearby areas.`,
          `Instead of searching multiple places, you can compare vehicles, understand pricing, and book confidently through one platform.`,
        ]}
      />

      <WhyChooseSection
        title={`Why Choose ${keywordNatural} in ${cityDisplay} Through Us?`}
        subtitle={`Renting a vehicle locally offers better availability and faster coordination. That's why people prefer using our platform in ${cityDisplay}:`}
        trustCard={{
          items: whyChooseItems,
          footerText: `Our goal is to make ${keywordNatural} in ${cityDisplay} smooth, affordable, and dependable.`,
        }}
        vehiclesCard={{
          title: `Vehicles Available in ${cityDisplay}`,
          description: `Depending on availability, you can book the following vehicles in ${cityDisplay}:`,
          items: VEHICLE_TYPE_ITEMS,
          footerText: `Vehicle availability may vary by area and rental provider within ${cityDisplay}.`,
        }}
      />

      <UseCasesAndBookingSection
        useCases={{
          title: `Common Reasons People Book in ${cityDisplay}`,
          description: `People choose ${keywordNatural} in ${cityDisplay} for many purposes, including:`,
          items: useCases,
          footerText: "Local rental providers understand city routes, traffic, and timing better — making your experience smoother.",
        }}
        booking={{
          subtitle: "Simple booking steps",
          title: `How Booking Works in ${cityDisplay}`,
          description: `Booking a vehicle in ${cityDisplay} is simple:`,
          steps: [
            { number: 1, icon: Car, text: `Browse available vehicles in ${cityDisplay}` },
            { number: 2, icon: Car, text: "Submit your booking request" },
            { number: 3, icon: Car, text: "Pay a small advance to confirm" },
            { number: 4, icon: Car, text: "Our team coordinates with the local rental provider" },
            { number: 5, icon: Car, text: "Vehicle is arranged as per your requirement" },
          ],
          footerText: "This ensures clarity for both customers and rental businesses.",
        }}
        variant="numbers"
      />

      {/* Trusted local + Pricing */}
      <section className="relative py-16 lg:py-24 bg-background overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-background p-6 lg:p-8 border-2 border-foreground/20 hover:border-foreground/40 transition-all duration-500 ease-in-out flex flex-col">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Trusted Local Rental Businesses in {cityDisplay}
              </h3>
              <p className="text-base text-foreground/70 mb-3">
                We focus on listing genuine, locally operating rental businesses
                in {cityDisplay}.
              </p>
              <p className="text-base text-foreground/70 mb-3">
                Each business profile may include:
              </p>
              <ul className="space-y-1 text-base text-foreground/70">
                {trustItems.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-foreground/60 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-base text-foreground/70 mt-3">
                This helps you compare options and book with confidence.
              </p>
            </div>

            <div className="bg-background p-6 lg:p-8 border-2 border-foreground/20 hover:border-foreground/40 transition-all duration-500 ease-in-out flex flex-col">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Pricing &amp; Availability in {cityDisplay}
              </h3>
              <p className="text-base text-foreground/70 mb-3">
                Rental prices in {cityDisplay} depend on:
              </p>
              <ul className="space-y-1 text-base text-foreground/70 mb-4">
                {PRICING_FACTORS.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-foreground/60 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-base text-foreground/70">
                You can find options ranging from budget-friendly rentals to
                premium vehicles, depending on your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO supporting paragraph */}
      <section className="relative py-16 lg:py-24 bg-foreground/5 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="bg-background p-6 lg:p-8 border-2 border-foreground/20 hover:border-foreground/40 transition-all duration-500 ease-in-out">
            <h3 className="text-xl font-bold text-foreground mb-3">
              Find {keywordNatural} in {cityDisplay}
            </h3>
            <p className="text-base text-foreground/70 mb-3">
              If you&apos;re searching for:
            </p>
            <ul className="space-y-1 text-base text-foreground/70 mb-4">
              <li>
                • {keywordNatural} near me in {cityDisplay}
              </li>
              <li>
                • best {keywordNatural} in {cityDisplay}
              </li>
              <li>• affordable vehicle rental in {cityDisplay}</li>
            </ul>
            <p className="text-base text-foreground/70">
              This page helps you find reliable and verified rental options
              available locally.
            </p>
          </div>
        </div>
      </section>

      <FAQSection
        title={`Frequently Asked Questions – ${cityDisplay}`}
        faqs={faqs}
      />

      <CTA city={cityDisplay} />
    </main>
  );
}
