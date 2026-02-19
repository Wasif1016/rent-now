import { prisma } from "@/lib/prisma";
import { VehicleTable } from "@/components/admin/vehicle-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VehiclesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt((params.page as string) || "1");
  const vendorId = params.vendor as string | undefined;
  const cityId = params.city as string | undefined;
  const vehicleTypeId = params.type as string | undefined;
  const status = params.status as string | undefined;
  const search = params.search as string | undefined;
  const startDate = params.startDate as string | undefined;
  const endDate = params.endDate as string | undefined;

  const where: any = {};

  if (vendorId) {
    where.vendorId = vendorId;
  }

  if (cityId) {
    where.cityId = cityId;
  }

  if (vehicleTypeId) {
    where.vehicleTypeId = vehicleTypeId;
  }

  if (status) {
    where.status = status;
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate)
      where.createdAt.lte = new Date(
        new Date(endDate).setHours(23, 59, 59, 999)
      );
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
    ];
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        city: {
          select: {
            id: true,
            name: true,
          },
        },
        vehicleType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.vehicle.count({ where }),
  ]);

  // Get filter options
  const [cities, vehicleTypes, vendors] = await Promise.all([
    prisma.city.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.vehicleType.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.vendor.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
      take: 100, // Limit for dropdown
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Vehicle Operations Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            • Nationwide fleet oversight • Live marketplace control
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/vehicles/add">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </Link>
          <Link href="/admin/vehicles/import">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Import Vehicles
            </Button>
          </Link>
        </div>
      </div>

      {/* Vehicle Table */}
      <VehicleTable
        vehicles={vehicles}
        total={total}
        totalPages={Math.ceil(total / limit)}
        currentPage={page}
        cities={cities}
        vehicleTypes={vehicleTypes}
        vendors={vendors}
        filters={{
          vendorId,
          cityId,
          vehicleTypeId,
          status,
          search,
          startDate,
          endDate,
        }}
      />
    </div>
  );
}
