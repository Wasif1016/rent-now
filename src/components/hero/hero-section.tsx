import {
  getAllCitiesWithCounts,
  getAllActiveVehicleTypes,
  searchVehicles,
} from "@/lib/data";
import type { Vehicle } from "@/types";
import { HeroSectionClient } from "./hero-section-client";

interface HeroSectionProps {
  heading?: string;
}

export async function HeroSection({ heading }: HeroSectionProps) {
  // Fetch all data needed for filtering
  const [citiesData, vehicleTypesData, vehiclesData] = await Promise.all([
    getAllCitiesWithCounts(),
    getAllActiveVehicleTypes(),
    searchVehicles({
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

  // Transform vehicles to include pricing and contact info
  const vehicles: Vehicle[] = vehiclesData.vehicles.map((v: any) => ({
    id: v.id,
    title: v.title,
    slug: v.slug,
    seats: v.seats,
    seatingCapacity: v.seatingCapacity,
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
    <HeroSectionClient
      vehicles={vehicles}
      cities={cities}
      vehicleTypes={vehicleTypes}
    />
  );
}
