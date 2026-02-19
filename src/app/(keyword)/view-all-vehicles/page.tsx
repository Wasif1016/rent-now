import { Suspense } from "react";
import {
  getAllCitiesWithCounts,
  getTownsByCity,
  getVehicleTypesWithVehicles,
  getAllActiveVehicleTypes,
  searchVehicles,
} from "@/lib/data";
import { SearchPageInner } from "./search-page-inner";

interface Vehicle {
  id: string;
  title: string;
  slug: string;
  seats?: number | null;
  images: string[] | null;
  city: { name: string; slug: string };
  town?: { name: string; slug: string } | null;
  vehicleType?: { id: string; name: string; slug: string } | null;
  vehicleModel?: { name: string; vehicleBrand: { name: string } } | null;
  vendor: {
    name: string;
    verificationStatus?: string | null;
    phone?: string | null;
    whatsappPhone?: string | null;
  };
  priceWithinCity?: number | null;
  priceOutOfCity?: number | null;
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const citySlug = params.city as string | undefined;
  const townSlug = params.town as string | undefined;
  const vehicleTypeSlug = params.vehicleType as string | undefined;

  // Fetch all data needed for client-side filtering
  const [citiesData, vehicleTypesData, vehiclesData] = await Promise.all([
    getAllCitiesWithCounts(),
    getAllActiveVehicleTypes(),
    searchVehicles({
      citySlug,
      townSlug,
      vehicleTypeSlug,
      limit: 1000, // Get all vehicles for client-side filtering
    }),
  ]);

  const cities = citiesData.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));
  const vehicleTypes = vehicleTypesData.map((vt) => ({
    id: vt.id,
    name: vt.name,
    slug: vt.slug,
  }));

  // Get towns for selected city (if any)
  let towns: Array<{ id: string; name: string; slug: string; cityId: string }> =
    [];
  if (citySlug) {
    const city = citiesData.find((c) => c.slug === citySlug);
    if (city) {
      const townsData = await getTownsByCity(city.id);
      towns = townsData.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        cityId: t.cityId,
      }));
    }
  }

  // Transform vehicles to include pricing and contact info
  const vehicles: Vehicle[] = vehiclesData.vehicles.map((v: any) => ({
    id: v.id,
    title: v.title,
    slug: v.slug,
    seats: v.seats,
    images: Array.isArray(v.images) ? (v.images as string[]) : null,
    city: v.city,
    town: v.town,
    vehicleType: v.vehicleType,
    vehicleModel: v.vehicleModel
      ? { name: v.vehicleModel.name, vehicleBrand: v.vehicleModel.vehicleBrand }
      : null,
    vendor: {
      name: v.vendor.name,
      verificationStatus: v.vendor.verificationStatus,
      phone: v.vendor.phone,
      whatsappPhone: v.vendor.whatsappPhone,
    },
    priceWithinCity: v.priceWithinCity,
    priceOutOfCity: v.priceOutOfCity,
  }));

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
            <p className="mt-4 text-gray-600">Loading search results...</p>
          </div>
        </div>
      }
    >
      <SearchPageInner
        initialVehicles={vehicles}
        cities={cities}
        initialTowns={towns}
        vehicleTypes={vehicleTypes}
      />
    </Suspense>
  );
}
