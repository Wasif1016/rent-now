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
import Image from "next/image";

// City icon mapping - using landmarks/symbols for each city
const cityIcons: Record<string, string> = {
  Lahore: "/cities/lahore.jpg", // Minar-e-Pakistan (using Landmark as tower/monument icon)
  Karachi: "/cities/karachi.jpg", // Gateway/Port city
  Islamabad: "/cities/islamabad.jpg", // Faisal Mosque (using Building for mosque/architecture)
  Peshawar: "/cities/peshawar.jpg",
  Faisalabad: "/cities/islamabad.jpg", // Industrial city
  Multan: "/cities/islamabad.jpg",
  Quetta: "/cities/islamabad.jpg", // Mountainous region
  Sialkot: "/cities/islamabad.jpg",
  Rawalpindi: "/cities/islamabad.jpg",
  Gujranwala: "/cities/islamabad.jpg",
  Hyderabad: "/cities/islamabad.jpg",
  Bahawalpur: "/cities/islamabad.jpg",
};

// Default icon for cities not in the mapping
const DefaultCityIcon = "/cities/islamabad.jpg";

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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {displayCities.map((city) => {
            const CityIcon = cityIcons[city.name] || DefaultCityIcon;
            const vehicleCount = city._count?.vehicles || 0;

            return (
              <Link
                key={city.id}
                href={`/rent-a-car/${city.slug}`}
                className="group relative bg-background p-5 transition-all duration-300 border border-foreground/10 aspect-video flex flex-col justify-between overflow-hidden"
              >
                {/* City Image Background */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={CityIcon}
                    alt={city.name}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* overlay */}
                <div className="absolute inset-0 bg-foreground/50 z-9" />
                {/* City Name */}
                <div className="flex flex-col justify-between text-background h-full gap-1 z-10">
                  <h3 className="text-lg font-bold transition-colors">
                    {city.name}
                  </h3>
                  <p className="font-semibold uppercase tracking-wide">
                    {vehicleCount}+{" "}
                    <span className="text-xs">Verified Vehicles Available</span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        <Link
          href="/cities"
          className="mt-8 inline-flex group relative bg-foreground/10 px-8 hover:px-10 py-3 transition-all duration-300 border border-foreground/10 items-center justify-center gap-2 text-sm font-bold"
        >
          <span className="flex items-center gap-3">
            View all cities
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </section>
  );
}
