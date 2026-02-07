import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { importVehiclesFromCSV } from "@/lib/services/vehicle-import.service";
import { logActivity } from "@/lib/services/activity-log.service";

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAdmin(request);

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const vendorId = formData.get("vendorId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!vendorId) {
      return NextResponse.json(
        { error: "Vendor ID is required" },
        { status: 400 }
      );
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "File must be a CSV" },
        { status: 400 }
      );
    }

    // Read file content
    const text = await file.text();

    // Import vehicles
    const result = await importVehiclesFromCSV(text, vendorId);

    // Log activity
    await logActivity({
      action: "VEHICLES_IMPORTED_BULK",
      entityType: "VEHICLE",
      entityId: "bulk",
      adminUserId: user.id,
      details: {
        success: result.success,
        total: result.total,
        errors: result.errors.length,
        fileName: file.name,
        targetVendorId: vendorId,
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }
    if (
      error.message?.includes("Forbidden") ||
      error.message?.includes("Admin access required")
    ) {
      return NextResponse.json(
        { error: "Admin access required", code: "FORBIDDEN" },
        { status: 403 }
      );
    }

    console.error("Error importing Vehicles CSV:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
