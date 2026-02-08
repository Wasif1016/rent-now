import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Users, Gauge, Fuel, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { getVehicleDisplayTitle } from "@/lib/vehicle-utils";

interface VehicleCardProps {
  vehicle: {
    id: string;
    title: string;
    slug: string;
    year?: number | null;
    mileage?: number | null;
    fuelType?: string | null;
    transmission?: string | null;
    seats?: number | null;
    images: string[] | null;
    city: {
      name: string;
      slug: string;
    };
    town?: {
      name: string;
      slug: string;
    } | null;
    vendor: {
      name: string;
      verificationStatus?: string | null;
    };
    vehicleModel?: {
      name: string;
      capacity?: number | null;
      vehicleBrand: {
        name: string;
      };
    } | null;
    featured?: boolean;
  };
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const displayTitle = getVehicleDisplayTitle(vehicle);
  const imageUrl =
    vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0
      ? vehicle.images[0]
      : "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop";

  const isVerified = vehicle.vendor.verificationStatus === "VERIFIED";

  const locationText = vehicle.town
    ? `${vehicle.town.name}, ${vehicle.city.name}`
    : vehicle.city.name;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <Link href={`/listings/${vehicle.slug}`} className="block">
        <div className="relative aspect-video overflow-hidden bg-zinc-100">
          <Image
            src={imageUrl}
            alt={displayTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {vehicle.featured && (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
              Featured
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <Link href={`/listings/${vehicle.slug}`}>
              <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                {displayTitle}
              </h3>
            </Link>
            {vehicle.vehicleModel && vehicle.title !== displayTitle && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {vehicle.title}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3 text-xs text-muted-foreground">
          {(vehicle.vehicleModel?.capacity || vehicle.seats) && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {vehicle.vehicleModel?.capacity || vehicle.seats} Passengers
            </span>
          )}
          {vehicle.year && (
            <span className="flex items-center gap-1">
              <Gauge className="h-3 w-3" />
              {vehicle.year}
            </span>
          )}
          {vehicle.mileage && (
            <span>{vehicle.mileage.toLocaleString()} km</span>
          )}
          {vehicle.fuelType && (
            <span className="flex items-center gap-1">
              <Fuel className="h-3 w-3" />
              {vehicle.fuelType}
            </span>
          )}
          {vehicle.transmission && <span>{vehicle.transmission}</span>}
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4" />
          <span>{locationText}</span>
        </div>

        {/* Booking is now manual via vehicle detail page */}
        <div className="mt-auto rounded">
          <Button variant="default" className="w-full" asChild>
            <Link href={`/listings/${vehicle.slug}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
