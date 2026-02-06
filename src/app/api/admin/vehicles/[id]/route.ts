import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/services/activity-log.service";

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
