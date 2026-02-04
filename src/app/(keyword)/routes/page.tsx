import { RouteHeroSection } from "@/components/routes/route-hero-section";
import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleGrid } from "@/components/search/vehicle-grid";
import {
  getCityBySlug,
  getRoutesListGroupedByOrigin,
  getRoutesByCities,
  searchVehicles,
} from "@/lib/data";

const priorityCities = [
  "Lahore",
  "Islamabad",
  "Karachi",
  "Multan",
  "Peshawar",
  "Quetta",
];

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RoutesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const fromCitySlug = params.fromCity as string | undefined;
  const toCitySlug = params.toCity as string | undefined;

  const { routes: groupedRoutes, sortedCities: sortedCityNames } =
    await getRoutesListGroupedByOrigin();
  const sortedCities = [...sortedCityNames].sort((a, b) => {
    const aIndex = priorityCities.indexOf(a);
    const bIndex = priorityCities.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  let vehicles: any[] = [];
  let fromCityName = "";
  let toCityName = "";

  if (fromCitySlug && toCitySlug) {
    const fromCity = await getCityBySlug(fromCitySlug);
    const toCity = await getCityBySlug(toCitySlug);

    if (fromCity && toCity) {
      fromCityName = fromCity.name;
      toCityName = toCity.name;

      const route = await getRoutesByCities(fromCitySlug, toCitySlug);
      if (route && route.vehicles?.length) {
        vehicles = route.vehicles;
      } else {
        const result = await searchVehicles({
          citySlug: fromCitySlug,
          limit: 12,
        });
        vehicles = result.vehicles;
      }
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <RouteHeroSection />

      {/* Show vehicles if route search is performed */}
      {fromCitySlug && toCitySlug && vehicles.length > 0 && (
        <section className="py-8 lg:py-12 bg-[#0a0a0a]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                Available Vehicles for {fromCityName} to {toCityName}
              </h2>
              <p className="text-gray-400">
                {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""}{" "}
                available for this route
              </p>
            </div>
            <VehicleGrid
              vehicles={vehicles.map((v) => ({
                ...v,
                images: Array.isArray(v.images) ? (v.images as string[]) : null,
              }))}
            />
          </div>
        </section>
      )}

      {/* Show "No vehicles found" message if route search but no vehicles */}
      {fromCitySlug && toCitySlug && vehicles.length === 0 && (
        <section className="py-8 lg:py-12 bg-[#0a0a0a]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center py-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                No vehicles found for {fromCityName} to {toCityName}
              </h2>
              <p className="text-gray-400 mb-6">
                We don&apos;t have any vehicles available for this route at the
                moment.
              </p>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Link href="/routes">Browse All Routes</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Show routes grid if no search is performed */}
      {(!fromCitySlug || !toCitySlug) && (
        <section className="py-8 lg:py-12 bg-[#0a0a0a]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Routes Grid by City */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCities.map((city) => {
                const routes = groupedRoutes[city] ?? [];
                return (
                  <div
                    key={city}
                    className="bg-[#1a1a1a] rounded-xl border border-gray-800/50 overflow-hidden hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="bg-[#0f0f0f] px-6 py-4 border-b border-gray-800/50 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center border border-gray-800/50">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        From {city}
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-2">
                        {routes.map((route) => (
                          <Link
                            key={route.slug}
                            href={`/routes/${route.slug}`}
                            className="block text-gray-400 hover:text-primary transition-colors py-2"
                          >
                            {route.destinationCity.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Can't find your route? Section */}
      <section className="py-12 lg:py-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-[#1a1a1a] rounded-2xl p-8 lg:p-12 border border-gray-800/50">
            <div className="text-center mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Can&apos;t find your route?
              </h2>
              <p className="text-gray-400 text-base lg:text-lg max-w-2xl mx-auto">
                We offer custom inter-city car rentals tailored to your specific
                travel needs across Pakistan. Tell us your departure and
                destination, and we&apos;ll handle the rest.
              </p>
            </div>
            <div className="text-center">
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
              >
                <a
                  href={`https://wa.me/${
                    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(
                      /\D/g,
                      ""
                    ) || "923001234567"
                  }?text=${encodeURIComponent(
                    "Hi, I would like to request a custom route. Please provide details about your departure and destination cities."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Request Custom Route
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
