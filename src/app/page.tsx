import { Metadata } from "next";
import { HeroSection } from "@/components/hero/hero-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { BrowseByCity } from "@/components/home/browse-by-city";
// import { BrowseByVehicleType } from '@/components/home/browse-by-vehicle-type'
// import { PopularRoutes } from '@/components/home/popular-routes'
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { PopularRoutesSection } from "@/components/home/popular-routes-section";
import { ListYourCar } from "@/components/home/list-your-car";

export const metadata: Metadata = {
  title: "Best Car Rental Service in Pakistan",
  description:
    "Rent a car in Pakistan with RentNowPK. We offer self-drive and with-driver options at the best rates. Book online today!",
  alternates: {
    canonical: "https://www.rentnowpk.com",
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentNowPK",
    url: "https://www.rentnowpk.com",
    potentialAction: {
      "@type": "SearchAction",
      target:
        "https://www.rentnowpk.com/view-all-vehicles?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RentNowPK",
    url: "https://www.rentnowpk.com",
    logo: "https://www.rentnowpk.com/logo.svg",
    sameAs: [
      "https://www.facebook.com/rentnowpk",
      "https://twitter.com/rentnowpk",
      "https://www.instagram.com/rentnowpk",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+923144174625",
      contactType: "customer service",
      email: "help@rentnowpk.com",
      areaServed: "PK",
      availableLanguage: "English",
    },
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <HeroSection />
      <HowItWorks />
      <BrowseByCity />
      {/* <BrowseByVehicleType /> */}
      {/* <PopularRoutes /> */}
      <WhyChooseUs />
      {/* <PopularRoutesSection /> */}
      <ListYourCar />
    </main>
  );
}
