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
    <div className="flex flex-col min-h-screen w-full">
      {/* Hero Content Area */}
      <section className="relative flex-1 flex flex-col justify-center items-center overflow-hidden min-h-[85vh]">
        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/20 to-foreground/80 z-10 pointer-events-none" />

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

        <div className="relative z-20 text-center px-4 w-full mt-[-60px]">
          <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-background max-w-4xl leading-[120%] mx-auto drop-shadow-md">
            Car Rental Services in 100+ Cities Across Pakistan
          </h1>
        </div>
      </section>

      {/* Sticky Filters & Results Container */}
      <div className="relative">
        <div className="sticky top-0 z-50 w-full shadow-md">
          <HeroFiltersSection
            initialVehicles={vehicles}
            cities={cities}
            vehicleTypes={vehicleTypes}
            onFilteredVehiclesChange={setFilteredVehicles}
          />
        </div>

        <HeroResults filteredVehicles={filteredVehicles} />
      </div>
    </div>
  );
}
