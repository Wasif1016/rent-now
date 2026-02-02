import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/hero/hero-section";
import { SeoFooter } from "@/components/home/seo-footer";
import { Button } from "@/components/ui/button";
import {
  Check,
  Car,
  Truck,
  Bus,
  CarFront,
  ShieldCheck,
  Search,
  CreditCard,
  Phone,
  FileCheck,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

/** Converts slug form (e.g. "rent-a-car") to display form ("rent a car"). */
export function humanizeKeyword(keyword: string): string {
  return keyword.replace(/-/g, " ");
}

/** Title-cases a string (e.g. "best car rental" → "Best Car Rental"). */
function toTitleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}

/** Returns keyword in display form with first letter of each word capitalized. */
function keywordDisplay(keyword: string): string {
  return toTitleCase(humanizeKeyword(keyword));
}

/** Generates metadata for a keyword landing page. Use in the page's generateMetadata(). */
export function getKeywordPageMetadata(keyword: string): Metadata {
  const display = keywordDisplay(keyword);
  const title = `${display} Services Near You`;

  return {
    title,
    description: `Looking for ${display}? Our platform helps you find trusted car rental services near you without hassle.`,
    alternates: {
      canonical: `/${keyword}`,
    },
  };
}

const WHY_CHOOSE_ITEMS = [
  "Verified car rental businesses",
  "Multiple vehicle options available",
  "Easy booking with a small advance",
  "Transparent process — no hidden charges",
  "Local vendors for faster coordination",
  "Support for short-term and long-term needs",
];

const VEHICLE_TYPE_ITEMS = [
  { icon: Car, label: "Standard cars and sedans" },
  { icon: Truck, label: "SUVs and family cars" },
  { icon: CarFront, label: "Vans and Hiace" },
  { icon: Bus, label: "Coasters and buses" },
  { icon: Sparkles, label: "Event and wedding vehicles" },
];

const DEFAULT_FAQS = [
  { q: "What does {keyword} mean?", a: "{keyword} refers to booking a vehicle from a rental service for personal, family, or business use without owning the car." },
  { q: "How can I book using {keyword}?", a: "You can browse available vehicles, submit a booking request, and confirm by paying a small advance. Our team assists with coordination." },
  { q: "Are drivers included in {keyword}?", a: "Driver availability depends on the rental provider. Many businesses offer vehicles with drivers." },
  { q: "Is advance payment required?", a: "Yes, a small advance is required to confirm your booking. The remaining amount is paid directly to the rental company." },
  { q: "Are rental businesses verified?", a: "We list rental businesses operating locally. Verification level may vary, but we focus on genuine providers." },
  { q: "Can I book for long-term use?", a: "Yes, many rental companies offer both short-term and long-term rental options." },
];

const USE_CASES = [
  "Daily or monthly transportation",
  "Family trips and tours",
  "Wedding and event travel",
  "Corporate and business travel",
  "Airport pick and drop",
  "Intercity journeys",
];

const TRUST_ITEMS = ["Business details", "Available vehicles", "Service areas", "Contact information"];

export type KeywordLandingPageProps = {
  /** Keyword in slug form (e.g. "rent-a-car", "car-hire"). */
  keyword: string;
};

export function KeywordLandingPage({ keyword }: KeywordLandingPageProps) {
  const display = keywordDisplay(keyword);
  const heroHeading = `${display} – Book Trusted Car Rental Services Near You`;

  const faqs = DEFAULT_FAQS.map(({ q, a }) => ({
    q: q.replace(/\{keyword\}/g, display),
    a: a.replace(/\{keyword\}/g, display),
  }));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection heading={heroHeading} />

      {/* Intro section – homepage-style gradient background */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(34,197,94,0.12),_transparent_55%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[3fr,2fr] items-center">
            <div className="space-y-4 flex flex-col items-center text-center lg:items-start lg:text-left">
              <h2 className="text-3xl lg:text-5xl xl:text-5xl font-extrabold text-foreground tracking-tight">
                Looking for {display}?
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Our platform helps you find trusted car rental services near you without hassle.
              </p>
              <p className="text-normal md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Whether you need a vehicle for daily use, family travel, tours, business trips, or special occasions, you can compare verified rental companies and book with confidence.
              </p>
              <p className="text-normal md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                We connect you directly with local rental businesses so you get better availability, fair pricing, and faster response.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose + Vehicles – dark cards like WhyChooseUs */}
      <section className="relative py-16 lg:py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1),_transparent_70%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-5xl xl:text-5xl font-extrabold text-background mb-4">
              Why Choose Our {display} Service?
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
                {WHY_CHOOSE_ITEMS.map((item, i) => (
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
                You can book a wide range of vehicles depending on availability:
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
                Vehicle availability may vary by location and rental company.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 lg:py-24 bg-background overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_55%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-800/50 bg-[#1a1a1a] p-8 space-y-5">
              <h3 className="text-xl font-bold text-white">Use cases &amp; purposes</h3>
              <p className="text-normal text-gray-400">
                People choose {display} for many reasons:
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
              <p className="text-normal md:text-lg text-emerald-50/80 mt-3 leading-relaxed">
                Simple, transparent, and reliable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 lg:py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1),_transparent_70%)]" />
        </div>
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
              <h3 className="text-xl font-bold text-white mb-3">Find {display} near you</h3>
              <p className="text-gray-400 text-normal">
                Searching for {display} near me, best in Pakistan, or affordable services? This page helps you find reliable vehicle rental options quickly and easily.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 lg:py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-extrabold text-background mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Quick answers about {display} and booking.
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

      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Ready to proceed with <br /> {display}?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Compare vehicles, connect with trusted rental companies, and book your vehicle today with ease.
            </p>
            <Link href="/view-all-vehicles">
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
  );
}
