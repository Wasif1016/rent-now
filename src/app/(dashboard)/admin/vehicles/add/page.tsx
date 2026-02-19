import { prisma } from "@/lib/prisma";
import { AddVehicleForm } from "@/components/admin/add-vehicle-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Add Vehicle | Admin Dashboard",
};

export default async function AddVehiclePage() {
  const [brands, types, cities, vendors] = await Promise.all([
    prisma.vehicleBrand.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.vehicleType.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.city.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.vendor.findMany({
      // where: { isActive: true }, // Maybe show all vendors?
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/vehicles">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Vehicle</h1>
          <p className="text-muted-foreground">
            Add a new vehicle to a vendor's fleet.
          </p>
        </div>
      </div>

      <AddVehicleForm
        brands={brands}
        types={types}
        cities={cities}
        vendors={vendors}
      />
    </div>
  );
}
