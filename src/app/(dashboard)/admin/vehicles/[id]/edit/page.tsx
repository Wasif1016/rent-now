import { getCities, getVehicleFilters } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface EditVehiclePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditVehiclePage({
  params,
}: EditVehiclePageProps) {
  const { id } = await params;

  const [cities, vehicleFilters, vehicle] = await Promise.all([
    getCities(),
    getVehicleFilters(),
    prisma.vehicle.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        cityId: true,
        townId: true,
        transmission: true,
        seats: true,
        seatingCapacity: true,
        driverOption: true,
        priceWithDriver: true,
        priceSelfDrive: true,
        priceDaily: true,
        priceHourly: true,
        priceMonthly: true,
        priceWithinCity: true,
        priceOutOfCity: true,
        images: true,
        vehicleModelId: true,
      },
    }),
  ]);

  if (!vehicle) {
    notFound();
  }

  const citiesData = cities.map((city) => ({
    id: city.id,
    name: city.name,
    slug: city.slug,
  }));

  const vehicleModelsData = vehicleFilters.map((model) => ({
    id: model.id,
    name: model.name,
    slug: model.slug,
    brand: {
      id: model.brand.id,
      name: model.brand.name,
      slug: model.brand.slug,
    },
  }));

  const initialData = {
    vehicleModelId: vehicle.vehicleModelId || "",
    cityId: vehicle.cityId || "",
    townId: vehicle.townId || "",
    title: vehicle.title || "",
    transmission: vehicle.transmission || "",
    seats: vehicle.seats ? String(vehicle.seats) : "",
    seatingCapacity: vehicle.seatingCapacity
      ? String(vehicle.seatingCapacity)
      : vehicle.seats
      ? String(vehicle.seats)
      : "",
    driverOption: vehicle.driverOption || "",
    priceWithDriver: vehicle.priceWithDriver
      ? String(vehicle.priceWithDriver)
      : "",
    priceSelfDrive: vehicle.priceSelfDrive
      ? String(vehicle.priceSelfDrive)
      : "",
    priceDaily: vehicle.priceDaily ? String(vehicle.priceDaily) : "",
    priceHourly: vehicle.priceHourly ? String(vehicle.priceHourly) : "",
    priceMonthly: vehicle.priceMonthly ? String(vehicle.priceMonthly) : "",
    priceWithinCity: vehicle.priceWithinCity
      ? String(vehicle.priceWithinCity)
      : "",
    priceOutOfCity: vehicle.priceOutOfCity
      ? String(vehicle.priceOutOfCity)
      : "",
    images: vehicle.images || [],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/vehicles">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Vehicle</h1>
          <p className="text-muted-foreground">
            Make changes to the vehicle listing.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleForm
            cities={citiesData}
            vehicleModels={vehicleModelsData}
            vehicleId={vehicle.id}
            initialData={initialData}
          />
        </CardContent>
      </Card>
    </div>
  );
}
