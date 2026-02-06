import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createVendorAccount } from "@/lib/services/vendor-account.service";

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAdmin(request);
    const { businessIds } = await request.json();

    if (
      !businessIds ||
      !Array.isArray(businessIds) ||
      businessIds.length === 0
    ) {
      return NextResponse.json(
        { error: "businessIds array is required" },
        { status: 400 }
      );
    }

    let success = 0;
    let failed = 0;
    const errors: Array<{ businessId: string; error: string }> = [];

    // Create accounts for each business
    for (const businessId of businessIds) {
      try {
        const result = await createVendorAccount({
          vendorId: businessId,
          adminUserId: user.id,
        });

        if (result.success) {
          success++;
        } else {
          failed++;
          errors.push({
            businessId,
            error: result.error || "Unknown error",
          });
        }
      } catch (error: any) {
        failed++;
        errors.push({
          businessId,
          error: error.message || "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success,
      failed,
      total: businessIds.length,
      errors,
    });
  } catch (error: any) {
    if (
      error.message === "Unauthorized" ||
      error.message.includes("Forbidden")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error creating bulk vendor accounts:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
