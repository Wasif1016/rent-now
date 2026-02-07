import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/services/activity-log.service";

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAdmin(req);
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No vehicle IDs provided" },
        { status: 400 }
      );
    }

    // Get count of vehicles to be deleted for logging
    const vehiclesToDelete = await prisma.vehicle.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        title: true,
      },
    });

    const result = await prisma.vehicle.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    // Log the activity
    await logActivity({
      action: "VEHICLE_DELETED_BULK",
      entityType: "VEHICLE",
      entityId: "bulk", // Generic bulk ID
      adminUserId: user.id,
      details: {
        count: result.count,
        vehicleIds: ids,
        vehicleTitles: vehiclesToDelete.map((v) => v.title),
      },
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `Successfully deleted ${result.count} vehicles`,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error bulk deleting vehicles:", error);
    return NextResponse.json(
      { error: "Failed to delete vehicles" },
      { status: 500 }
    );
  }
}
