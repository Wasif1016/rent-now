import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { resetVendorPassword } from "@/lib/services/vendor-account.service";

// Temporary debug version
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("--- Reset Password Request Started ---");

  try {
    const authHeader = request.headers.get("authorization");
    console.log("Auth Header present:", !!authHeader);

    if (!authHeader) {
      console.log("No Authorization header provided");
      return NextResponse.json(
        { error: "No Authorization header provided" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("Token length:", token.length);

    // Create a fresh supabase client for verification
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Supabase getUser error:", userError);
      return NextResponse.json(
        { error: `Auth Error: ${userError.message}` },
        { status: 401 }
      );
    }

    if (!user) {
      console.error("No user found for token");
      return NextResponse.json(
        { error: "Invalid token: User not found" },
        { status: 401 }
      );
    }

    console.log("User identified:", user.id, "Role:", user.user_metadata?.role);

    if (user.user_metadata?.role !== "admin") {
      console.error("User is not admin. Role:", user.user_metadata?.role);
      return NextResponse.json(
        {
          error: `Forbidden: Admin access required. Current role: ${
            user.user_metadata?.role || "none"
          }`,
        },
        { status: 403 }
      );
    }

    const { id } = await params;
    console.log("Processing reset for vendor ID:", id);

    const result = await resetVendorPassword(id, user.id);

    if (!result.success) {
      console.error("Service error:", result.error);
      return NextResponse.json(
        { error: result.error || "Failed to reset password" },
        { status: 400 }
      );
    }

    console.log("Password reset successful");
    return NextResponse.json({
      success: true,
      email: result.email,
      password: result.password,
    });
  } catch (error: any) {
    console.error("Unexpected error in reset-password route:", error);
    return NextResponse.json(
      { error: `Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
