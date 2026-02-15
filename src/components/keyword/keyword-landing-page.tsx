import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/hero/hero-section";
import { SeoFooter } from "@/components/home/seo-footer";
import { Button } from "@/components/ui/button";
import {
  Car,
  Truck,
  Bus,
  CarFront,
  Search,
  CreditCard,
  Phone,
  FileCheck,
  Car as CarIcon,
  Sparkles,
} from "lucide-react";
import { CTA } from '../shared/cta'
import {
  IntroSection,
  WhyChooseSection,
  UseCasesAndBookingSection,
  TrustFindSection,
  FAQSection,
} from '../shared/landing-sections'

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

      <IntroSection
        heading={`Looking for ${display}?`}
        paragraphs={[
          "Our platform helps you find trusted car rental services near you without hassle.",
          "Whether you need a vehicle for daily use, family travel, tours, business trips, or special occasions, you can compare verified rental companies and book with confidence.",
          "We connect you directly with local rental businesses so you get better availability, fair pricing, and faster response.",
        ]}
        variant="left-aligned"
        showGradient={false}
      />

      <WhyChooseSection
        title={`Why Choose Our ${display} Service?`}
        subtitle="Verified partners, transparent pricing, and support every step of the way."
        trustCard={{
          title: "Trust & choice",
          items: WHY_CHOOSE_ITEMS,
        }}
        vehiclesCard={{
          title: "Available vehicles",
          description: "You can book a wide range of vehicles depending on availability:",
          items: VEHICLE_TYPE_ITEMS,
          footerText: "Vehicle availability may vary by location and rental company.",
        }}
      />

      <UseCasesAndBookingSection
        useCases={{
          title: "Use cases & purposes",
          description: `People choose ${display} for many reasons:`,
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
            { icon: CarIcon, text: "Vehicle is arranged as per your requirement" },
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
          title: `Find ${display} near you`,
          description: `Searching for ${display} near me, best in Pakistan, or affordable services? This page helps you find reliable vehicle rental options quickly and easily.`,
        }}
      />

      <FAQSection
        title="Frequently Asked Questions"
        subtitle={`Quick answers about ${display} and booking.`}
        faqs={faqs}
      />

    
      <CTA vehicleModel={display} />
    </main>
  );
}
