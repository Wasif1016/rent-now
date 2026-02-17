"use client";

import { useState } from "react";
import Image from "next/image";
import { HeroFiltersSection, HeroResults } from "./hero-filters-section";
import type { Vehicle, LocationOption } from "@/types";

interface HeroSectionClientProps {
  vehicles: Vehicle[];
  cities: LocationOption[];
  vehicleTypes: Array<{ id: string; name: string; slug: string }>;
}

export function HeroSectionClient({
  vehicles,
  cities,
  vehicleTypes,
}: HeroSectionClientProps) {
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(vehicles);

  return (
    <>
      <section className="relative bg-background h-screen overflow-hidden">
        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/20 to-foreground/80 z-10" />
        {/* Desktop Image */}
        <div className="absolute inset-0 w-full h-full lg:block hidden">
          <Image
            src="/home/hero-desktop.webp"
            alt="Car rental service"
            fill
            className="object-cover object-top"
            priority
            quality={100}
            sizes="100vw"
          />
        </div>
        {/* Mobile Image */}
        <div className="absolute inset-0 w-full h-full block lg:hidden">
          <Image
            src="/home/hero-mobile.webp"
            alt="Car rental service"
            fill
            className="object-cover object-top"
            priority
            quality={100}
            sizes="100vw"
          />
        </div>

        <div className="absolute top-[60%] w-full z-10">
          <h1 className="text-2xl lg:text-5xl xl:text-6xl font-bold text-background max-w-4xl leading-[120%] w-full text-center mx-auto">
            Car Rental Services in 100+ Cities Across Pakistan
          </h1>
        </div>

        {/* Filters Section - Positioned at bottom of hero */}
        <HeroFiltersSection
          initialVehicles={vehicles}
          cities={cities}
          vehicleTypes={vehicleTypes}
          onFilteredVehiclesChange={setFilteredVehicles}
        />
      </section>

      {/* Results Section - Below hero */}
      <HeroResults filteredVehicles={filteredVehicles} />
    </>
  );
}
