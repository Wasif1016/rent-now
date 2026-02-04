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

/** Title-cases a string (e.g. "new york" → "New York"). */
function toTitleCase(s: string): string {
  return s.replace(
    /\w\S*/g,
    (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
  );
}

export type TownVehicleLandingPageProps = {
  /** Vehicle model/name (display form). */
  vehicleName: string;
  /** City name (display form). */
  city: string;
  /** Town name (display form). */
  town: string;
  /** Model slug for links. */
  modelSlug?: string;
};

export function TownVehicleLandingPage({
  vehicleName,
  city,
  town,
  modelSlug,
}: TownVehicleLandingPageProps) {
  const cityDisplay = toTitleCase(city);
  const heroHeading = `${vehicleName} for Rent in ${town}, ${cityDisplay}`;

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
              Looking to book {vehicleName} for rent in {town}, {cityDisplay}?
            </h2>
            <div className="space-y-4 text-lg md:text-xl text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">
                You&apos;re in the right place.
              </p>
              <p>
                Our platform helps you find local and verified rental businesses
                offering {vehicleName} in {town} and nearby areas, so you can
                book quickly without unnecessary delays or middlemen.
              </p>
              <p>
                Whether you need this vehicle for daily use, family travel,
                business purposes, tours, or special occasions, we connect you
                with trusted providers operating in {cityDisplay}.
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
                Why Book {vehicleName} in {town} Through Our Platform?
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                We focus on vehicle-specific and area-based listings, so you
                don&apos;t waste time searching through irrelevant options.
              </p>
              <ul className="grid gap-4 sm:grid-cols-2">
                {[
                  `Local vendors serving ${town}`,
                  `Verified rental businesses in ${cityDisplay}`,
                  `Well-maintained ${vehicleName} options`,
                  "With driver & self-drive availability",
                  "Transparent pricing shared by vendors",
                  "Faster response due to nearby availability",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-center text-gray-300">
                    <Check className="h-5 w-5 text-[#C0F11C] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-gray-400 italic">
                You contact the actual rental company, not an agent or
                middleman.
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#C0F11C] to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-[#1a2332] rounded-2xl p-8 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-6">
                  Common Use Cases for {vehicleName} in {town}
                </h3>
                <div className="space-y-4">
                  {[
                    "Daily office or personal commute",
                    `Family travel within ${cityDisplay}`,
                    "Airport pick & drop services",
                    "Business meetings and corporate use",
                    "City tours and intercity travel",
                    "Monthly or long-term vehicle usage",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 rounded-xl bg-[#0f1419] border border-gray-800 hover:border-[#C0F11C]/50 transition-colors"
                    >
                      <Sparkles className="h-5 w-5 text-[#C0F11C]" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-6">
                  This vehicle is popular due to its comfort, reliability, and
                  wide availability in the {town} area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases (Rental Options) */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
              Rental Options Available
            </h2>
            <p className="text-lg text-muted-foreground">
              Tailored {vehicleName} packages for every local need in {town}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Car, label: `${vehicleName} with driver` },
              { icon: ShieldCheck, label: `${vehicleName} (Self-drive)` },
              { icon: HelpCircle, label: "Hourly rental options" },
              { icon: Sparkles, label: "Daily rental packages" },
              { icon: ArrowRight, label: "Weekly & Monthly rentals" },
              { icon: CarFront, label: "Event & Wedding usage" },
            ].map(({ icon: Icon, label }, i) => (
              <div
                key={i}
                className="flex gap-4 p-6 rounded-2xl bg-muted/50 border border-transparent hover:border-[#C0F11C] transition-all"
              >
                <div className="h-2 w-2 rounded-full bg-[#C0F11C] mt-2.5 shrink-0" />
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6 text-[#C0F11C]" />
                  <span className="text-lg font-medium">{label}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-8 text-sm">
            Note: Specific availability and pricing depend on the rental
            provider serving {town}.
          </p>
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
                  `Browse available ${vehicleName} listings`,
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
                reliability and quality.
              </p>
              <div className="space-y-3">
                {[
                  "Verified business identity",
                  "Specific service areas",
                  "Up-to-date vehicle photos",
                  "Professional driver profiles",
                  "Direct contact transparency",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#C0F11C]" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-[#C0F11C] font-semibold">
                This helps you book {vehicleName} with total confidence.
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
                `${vehicleName} for rent in ${town}`,
                `${vehicleName} rental in ${cityDisplay}`,
                `Rent ${vehicleName} near me`,
                `Affordable ${vehicleName} rental`,
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
              This page is dedicated to helping you find the right local{" "}
              {vehicleName} options quickly.
            </p>
          </div>

          <h2 className="text-3xl font-extrabold mb-12 flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-[#C0F11C]" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {[
              {
                q: `Is ${vehicleName} available in ${town}?`,
                a: `Yes. We list vendors who specifically provide ${vehicleName} in ${town} and surrounding areas of ${cityDisplay}.`,
              },
              {
                q: `Can I rent ${vehicleName} with a driver?`,
                a: "Many vendors offer both with-driver and self-drive options. You can check specific listing details.",
              },
              {
                q: `What is the rental price of ${vehicleName} in ${cityDisplay}?`,
                a: "Prices vary based on duration, driver option, and vendor. Detailed pricing is available on each listing.",
              },
              {
                q: "Is advance payment required?",
                a: "Most local vendors require a small advance to confirm your booking and secure the vehicle.",
              },
              {
                q: "Can I book for long-term use?",
                a: "Yes. Weekly, monthly, and long-term rentals are commonly available for this vehicle model.",
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
            Ready to book {vehicleName} for rent in {town}, {cityDisplay}?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Compare local options, contact verified vendors directly, and book
            with confidence today.
          </p>
          <Button
            size="lg"
            className="bg-[#C0F11C] text-[#0f1419] hover:bg-[#A9D718] text-xl px-8 py-4 h-auto font-black rounded-full"
            asChild
          >
            <Link href="/view-all-vehicles">View Available {vehicleName}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
