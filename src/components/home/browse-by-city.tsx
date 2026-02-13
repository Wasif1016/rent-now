import Link from "next/link";
import { getPopularCities } from "@/lib/data";
import {
  ArrowRight,
  Landmark,
  Building2,
  Mountain,
  Factory,
  Building,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// City icon mapping - using landmarks/symbols for each city
const cityIcons: Record<string, LucideIcon> = {
  Lahore: Landmark, // Minar-e-Pakistan (using Landmark as tower/monument icon)
  Karachi: Building2, // Gateway/Port city
  Islamabad: Building, // Faisal Mosque (using Building for mosque/architecture)
  Peshawar: Building2,
  Faisalabad: Factory, // Industrial city
  Multan: Building2,
  Quetta: Mountain, // Mountainous region
  Sialkot: Building2,
  Rawalpindi: Building2,
  Gujranwala: Building2,
  Hyderabad: Building2,
  Bahawalpur: Building2,
};

// Default icon for cities not in the mapping
const DefaultCityIcon = Building2;

export async function BrowseByCity() {
  const cities = await getPopularCities(8);

  // Priority cities matching the reference image
  const priorityCities = [
    "Lahore",
    "Karachi",
    "Islamabad",
    "Peshawar",
    "Faisalabad",
    "Multan",
    "Quetta",
    "Sialkot",
  ];

  // Sort cities: priority first, then by vehicle count
  const sortedCities = [...cities].sort((a, b) => {
    const aIndex = priorityCities.indexOf(a.name);
    const bIndex = priorityCities.indexOf(b.name);

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return (b._count?.vehicles || 0) - (a._count?.vehicles || 0);
  });

  // Take top 8 cities
  const displayCities = sortedCities.slice(0, 8);

  return (
    <section className="py-16 lg:py-24 bg-foreground/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground tracking-tight mb-2">
              Book Car Rentals in Your City
            </h2>
            <p className="text-base lg:text-lg text-foreground/80">
              Available across all major transportation hubs
            </p>
          </div>
        </div>

        {/* City Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
          {displayCities.map((city) => {
            const CityIcon = cityIcons[city.name] || DefaultCityIcon;
            const vehicleCount = city._count?.vehicles || 0;

            return (
              <Link
                key={city.id}
                href={`/rent-a-car/${city.slug}`}
                className="group relative bg-primary p-5 transition-all duration-300 border border-foreground/10 "
              >
                {/* City Icon */}
                <div className="flex mb-2">
                  <CityIcon className="h-6 w-6" />
                </div>

                {/* City Name */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold transition-colors">
                    {city.name}
                  </h3>
                  <p className="font-semibold uppercase tracking-wide">
                    {vehicleCount}+ <span className="text-xs">Verified Vehicles Available</span>
                  </p>
                </div>
              </Link>
            );
          })}
          <Link
            href="/cities"
            className="inline-flex group relative bg-primary px-4 py-2 transition-all duration-300 border border-foreground/10 items-center gap-2 text-lg font-bold"
          >
            View all cities
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </section>
  );
}
