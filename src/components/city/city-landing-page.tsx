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
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

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
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
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
  /** Optional override for the hero H1 (e.g. "Toyota Corolla in Lahore – Book Trusted Vehicles"). */
  heroHeading?: string;
};

function replacePlaceholders(text: string, city: string, keywordNatural: string): string {
  return text.replace(/\{city\}/g, city).replace(/\{keywordNatural\}/g, keywordNatural);
}

export function CityLandingPage({ city, keyword, heroHeading: heroHeadingOverride }: CityLandingPageProps) {
  const keywordNatural = toTitleCase(humanizeKeyword(keyword));
  const cityDisplay = toTitleCase(humanizeCity(city));
  const heroHeading = heroHeadingOverride ?? `${keywordNatural} in ${cityDisplay} – Book Trusted Vehicles`;

  const whyChooseItems = WHY_CHOOSE_ITEMS.map((item) => replacePlaceholders(item, cityDisplay, keywordNatural));
  const useCases = USE_CASES.map((item) => replacePlaceholders(item, cityDisplay, keywordNatural));
  const trustItems = TRUST_ITEMS.map((item) => replacePlaceholders(item, cityDisplay, keywordNatural));
  const faqs = DEFAULT_FAQS.map(({ q, a }) => ({
    q: replacePlaceholders(q, cityDisplay, keywordNatural),
    a: replacePlaceholders(a, cityDisplay, keywordNatural),
  }));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection heading={heroHeading} />

      {/* Intro */}
      <section className="relative py-16 lg:py-24 overflow-hidden flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(34,197,94,0.12),_transparent_55%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl flex justify-center">
          <div className="space-y-4 flex flex-col items-center text-center w-full max-w-2xl">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-foreground tracking-tight">
              Looking for {keywordNatural} in {cityDisplay}?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Our platform helps you connect with trusted local vehicle rental services in {cityDisplay}, making booking simple and reliable.
            </p>
            <p className="text-normal md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Whether you need a vehicle for daily travel, family trips, business use, tours, or special occasions, you can explore verified rental options available within {cityDisplay} and nearby areas.
            </p>
            <p className="text-normal md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Instead of searching multiple places, you can compare vehicles, understand pricing, and book confidently through one platform.
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
              Why Choose {keywordNatural} in {cityDisplay} Through Us?
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Renting a vehicle locally offers better availability and faster coordination. That&apos;s why people prefer using our platform in {cityDisplay}:
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
                Our goal is to make {keywordNatural} in {cityDisplay} smooth, affordable, and dependable.
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
                Vehicles Available in {cityDisplay}
              </h3>
              <p className="text-gray-400 text-normal mb-4">
                Depending on availability, you can book the following vehicles in {cityDisplay}:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VEHICLE_TYPE_ITEMS.map(({ icon: Icon, label }, i) => (
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
                Vehicle availability may vary by area and rental provider within {cityDisplay}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases + How booking works */}
      <section className="relative py-16 lg:py-24 bg-background overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_55%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-800/50 bg-[#1a1a1a] p-8 space-y-5">
              <h3 className="text-xl font-bold text-white">
                Common Reasons People Book in {cityDisplay}
              </h3>
              <p className="text-normal text-gray-400">
                People choose {keywordNatural} in {cityDisplay} for many purposes, including:
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
                Local rental providers understand city routes, traffic, and timing better — making your experience smoother.
              </p>
            </div>

            <div className="rounded-2xl border border-primary bg-foreground p-8 space-y-5 shadow-primary">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
                Simple booking steps
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold text-white">
                How Booking Works in {cityDisplay}
              </h2>
              <p className="text-normal text-emerald-50/80">
                Booking a vehicle in {cityDisplay} is simple:
              </p>
              <ol className="mt-4 space-y-3 text-normal md:text-lg text-emerald-50/80">
                <li className="flex gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-normal shrink-0">1</span>
                  <span className="flex-1 self-center">Browse available vehicles in {cityDisplay}</span>
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
                  <span className="flex-1 self-center">Our team coordinates with the local rental provider</span>
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-normal shrink-0">5</span>
                  <span className="flex-1 self-center">Vehicle is arranged as per your requirement</span>
                </li>
              </ol>
              <p className="text-normal md:text-lg text-emerald-50/80 mt-3 leading-relaxed">
                This ensures clarity for both customers and rental businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted local + Pricing */}
      <section className="relative py-16 lg:py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1),_transparent_70%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-800/50 bg-[#1a1a1a] p-6 lg:p-8">
              <h3 className="text-xl font-bold text-white mb-3">
                Trusted Local Rental Businesses in {cityDisplay}
              </h3>
              <p className="text-gray-400 text-normal mb-3">
                We focus on listing genuine, locally operating rental businesses in {cityDisplay}.
              </p>
              <p className="text-gray-400 text-normal mb-3">
                Each business profile may include:
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
                This helps you compare options and book with confidence.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800/50 bg-[#1a1a1a] p-6 lg:p-8">
              <h3 className="text-xl font-bold text-white mb-3">
                Pricing &amp; Availability in {cityDisplay}
              </h3>
              <p className="text-gray-400 text-normal mb-3">
                Rental prices in {cityDisplay} depend on:
              </p>
              <ul className="space-y-1 text-normal text-gray-400 mb-4">
                {PRICING_FACTORS.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-gray-400 text-normal">
                You can find options ranging from budget-friendly rentals to premium vehicles, depending on your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO supporting paragraph */}
      <section className="relative py-16 lg:py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="rounded-2xl border border-gray-800/50 bg-[#1a1a1a] p-6 lg:p-8">
            <h3 className="text-xl font-bold text-white mb-3">
              Find {keywordNatural} in {cityDisplay}
            </h3>
            <p className="text-gray-400 text-normal mb-3">
              If you&apos;re searching for:
            </p>
            <ul className="space-y-1 text-normal text-gray-400 mb-4">
              <li>• {keywordNatural} near me in {cityDisplay}</li>
              <li>• best {keywordNatural} in {cityDisplay}</li>
              <li>• affordable vehicle rental in {cityDisplay}</li>
            </ul>
            <p className="text-gray-400 text-normal">
              This page helps you find reliable and verified rental options available locally.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="relative py-16 lg:py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-background mb-4">
              Frequently Asked Questions – {cityDisplay}
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
              Ready to proceed with {keywordNatural} in {cityDisplay}?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Compare vehicles, connect with trusted local rental businesses, and book your vehicle in {cityDisplay} today.
            </p>
            <Link href="/view-all-vehicles">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-8 py-6 text-lg"
              >
                View Available Vehicles in {cityDisplay}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
