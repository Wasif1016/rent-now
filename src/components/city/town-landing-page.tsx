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
function humanizeCity(city: string): string {
  return city.replace(/-/g, " ");
}

/** Converts slug form (e.g. "rent-a-car") to natural form ("rent a car"). */
function humanizeKeyword(keyword: string): string {
  return keyword.replace(/-/g, " ");
}

/** Title-cases a string (e.g. "new york" → "New York"). */
function toTitleCase(s: string): string {
  return s.replace(
    /\w\S*/g,
    (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
  );
}

export type TownLandingPageProps = {
  /** City in slug form (e.g. "karachi", "lahore"). */
  city: string;
  /** Keyword in slug form (e.g. "Rent-a-car", "car-hire"). */
  keyword: string;
  /** Town name (display form). */
  town: string;
};

export function TownLandingPage({ city, keyword, town }: TownLandingPageProps) {
  const keywordNatural = toTitleCase(humanizeKeyword(keyword));
  const cityDisplay = toTitleCase(humanizeCity(city));
  const heroHeading = `${keywordNatural} in ${town}, ${cityDisplay}`;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection heading={heroHeading} />

      {/* Intro */}
      <section className="relative py-16 lg:py-24 overflow-hidden flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(192,241,28,0.15),_transparent_55%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl flex justify-center">
          <div className="space-y-6 flex flex-col items-center text-center w-full max-w-3xl">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-foreground tracking-tight">
              Looking for {keywordNatural} in {town}, {cityDisplay}?
            </h2>
            <div className="space-y-4 text-lg md:text-xl text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">
                You&apos;re in the right place.
              </p>
              <p>
                Our platform helps you find trusted and verified car rental
                services operating in {town} and nearby areas of {cityDisplay},
                making it easier to book a vehicle without unnecessary calls or
                confusion.
              </p>
              <p>
                Whether you need a car for daily use, family travel, office
                commute, tours, events, or airport transfers, we connect you
                with local rental providers who serve {town} directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Book */}
      <section className="relative py-16 lg:py-24 bg-[#0f1419] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(192,241,28,0.08),_transparent_70%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-6">
                Why Book {keywordNatural} in {town} Through Our Platform?
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                Finding a reliable rental service in a specific area can be
                difficult. That&apos;s why we focus on location-based listings.
              </p>
              <ul className="grid gap-4 sm:grid-cols-2">
                {[
                  `Local rental businesses serving ${town}`,
                  `Verified vendors from ${cityDisplay}`,
                  "Multiple vehicle options available",
                  "With driver & self-drive options",
                  "Clear pricing shared by vendors",
                  "Faster response due to local availability",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-center text-gray-300">
                    <Check className="h-5 w-5 text-[#C0F11C] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-gray-400 italic">
                You deal directly with the rental provider, not a middleman.
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#C0F11C] to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-[#1a2332] rounded-2xl p-8 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-6">
                  Vehicles Commonly Available in {town}, {cityDisplay}
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: Car, label: "Cars for daily and personal use" },
                    { icon: Truck, label: "Family cars and SUVs" },
                    { icon: CarFront, label: "Vans and Hiace" },
                    { icon: Bus, label: "Coasters and buses" },
                    { icon: Sparkles, label: "Wedding and event vehicles" },
                  ].map(({ icon: Icon, label }, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 rounded-xl bg-[#0f1419] border border-gray-800 hover:border-[#C0F11C]/50 transition-colors"
                    >
                      <Icon className="h-6 w-6 text-[#C0F11C]" />
                      <span className="text-gray-300">{label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-6">
                  Vehicle options vary by vendor, but all listed providers serve{" "}
                  {town} or nearby areas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
              Popular Use Cases in {town}
            </h2>
            <p className="text-lg text-muted-foreground">
              Local solutions for all your transportation needs
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Daily office or business travel",
              "Family outings and city tours",
              "Weddings and event transportation",
              "Airport pick & drop",
              `Intercity travel from ${cityDisplay}`,
              "Monthly or long-term usage",
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-4 p-6 rounded-2xl bg-muted/50 border border-transparent hover:border-[#C0F11C] transition-all"
              >
                <div className="h-2 w-2 rounded-full bg-[#C0F11C] mt-2.5 shrink-0" />
                <span className="text-lg font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 lg:py-24 bg-[#C0F11C] text-[#0f1419]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6">How Booking Works</h2>
              <div className="space-y-8">
                {[
                  "Browse available vehicles",
                  "Submit your booking request",
                  "Pay a small advance (if required)",
                  "Vendor contacts you directly",
                  "Vehicle is arranged as agreed",
                ].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <span className="text-5xl font-black opacity-20">
                      {i + 1}
                    </span>
                    <p className="text-xl font-bold self-center">{step}</p>
                  </div>
                ))}
              </div>
              <p className="mt-12 text-lg font-medium opacity-80">
                Simple, transparent, and local.
              </p>
            </div>
            <div className="bg-[#0f1419] rounded-3xl p-8 lg:p-12 text-white shadow-2xl">
              <ShieldCheck className="h-16 w-16 text-[#C0F11C] mb-8" />
              <h3 className="text-2xl font-bold mb-4">
                Local Trust & Verification
              </h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                We focus on real rental businesses operating in {town} and{" "}
                {cityDisplay}. Each vendor profile is checked to ensure
                reliability.
              </p>
              <div className="space-y-3">
                {[
                  "Business name",
                  "Service areas",
                  "Vehicle details",
                  "Driver availability",
                  "Contact information",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#C0F11C]" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-[#C0F11C] font-semibold">
                This helps you book with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO & FAQ */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="mb-16 p-8 rounded-2xl bg-muted/30 border border-muted text-center">
            <h3 className="text-xl font-bold mb-6 italic opacity-70">
              If you&apos;re searching for:
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                `${keywordNatural} in ${town}`,
                `${keywordNatural} near me`,
                `Affordable ${keywordNatural} in ${cityDisplay}`,
                `Trusted car rental services in ${town}`,
              ].map((tag, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full bg-muted border font-medium text-muted-foreground whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-8 text-muted-foreground">
              This page is designed to help you find the right local option
              quickly.
            </p>
          </div>

          <h2 className="text-3xl font-extrabold mb-12 flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-[#C0F11C]" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {[
              {
                q: `Can I book ${keywordNatural} specifically in ${town}?`,
                a: `Yes. We list rental vendors who serve ${town} and surrounding areas of ${cityDisplay}.`,
              },
              {
                q: "Are drivers included?",
                a: "Some vendors offer cars with driver, others provide self-drive. Availability depends on the rental company.",
              },
              {
                q: "Is advance payment required?",
                a: "Most vendors require a small advance to confirm booking. Payment terms are shared before confirmation.",
              },
              {
                q: "Can I book for long-term use?",
                a: "Yes. Daily, weekly, and monthly rental options are commonly available.",
              },
              {
                q: "How do I contact the rental company?",
                a: "You can contact vendors directly through their listing details.",
              },
            ].map((faq, i) => (
              <div key={i} className="group">
                <h3 className="text-xl font-bold mb-3 group-hover:text-[#C0F11C] transition-colors">
                  {faq.q}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[#0f1419] border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Ready to book {keywordNatural} in {town}, {cityDisplay}?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Compare vehicles, contact local rental businesses, and book with
            confidence today.
          </p>
          <Button
            size="lg"
            className="bg-[#C0F11C] text-[#0f1419] hover:bg-[#A9D718] text-xl px-8 py-4 h-auto font-black rounded-full"
            asChild
          >
            <Link href="/view-all-vehicles">
              View Available Vehicles
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
