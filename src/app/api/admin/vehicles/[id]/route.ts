import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/services/activity-log.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        city: true,
        town: true,
        vehicleModel: {
          include: {
            vehicleBrand: true,
          },
        },
        vehicleType: true,
      },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch (error: any) {
    if (
      error.message === "Unauthorized" ||
      error.message.includes("Forbidden")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicle" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const updateData: any = {};
    const allowedFields = [
      "title",
      "subtitle",
      "description",
      "vehicleModelId",
      "vehicleTypeId",
      "cityId",
      "townId",
      "year",
      "mileage",
      "fuelType",
      "transmission",
      "seats",
      "seatingCapacity",
      "driverOption",
      "categoryId",
      "color",
      "images",
      "priceWithDriver",
      "priceSelfDrive",
      "priceDaily",
      "priceHourly",
      "priceMonthly",
      "priceWithinCity",
      "priceOutOfCity",
      "isAvailable",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: updateData,
    });

    await logActivity({
      action: "VEHICLE_UPDATED",
      entityType: "VEHICLE",
      entityId: id,
      adminUserId: user.id,
      details: {
        updatedFields: Object.keys(updateData),
      },
    });

    return NextResponse.json(vehicle);
  } catch (error: any) {
    if (
      error.message === "Unauthorized" ||
      error.message.includes("Forbidden")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error updating vehicle:", error);
    return NextResponse.json(
      { error: "Failed to update vehicle" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAdmin(request);
    const { id } = await params;

    // Fetch vehicle title for logging before deletion
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      select: { title: true },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Delete related records and vehicle in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Delete dependent relations (VehicleRoute, VendorRouteOffer)
      await tx.vehicleRoute.deleteMany({
        where: { vehicleId: id },
      });

      await tx.vendorRouteOffer.deleteMany({
        where: { vehicleId: id },
      });

      // 2. Delete inquiries
      await tx.inquiry.deleteMany({
        where: { vehicleId: id },
      });

      // 3. Delete bookings (CAUTION: specific requirement to allowing delete)
      await tx.booking.deleteMany({
        where: { vehicleId: id },
      });

      // 4. Delete the vehicle
      await tx.vehicle.delete({
        where: { id },
      });
    });

    // Log the deletion
    await logActivity({
      action: "VEHICLE_DELETED",
      entityType: "VEHICLE",
      entityId: id,
      adminUserId: user.id,
      details: {
        vehicleTitle: vehicle.title,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (
      error.message === "Unauthorized" ||
      error.message.includes("Forbidden")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error deleting vehicle:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
