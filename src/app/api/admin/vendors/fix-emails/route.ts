import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(request: NextRequest) {
  try {
    const results = {
      total: 0,
      updated: 0,
      alreadyCorrect: 0,
      errors: 0,
      details: [] as any[],
    };

    // Get all vendors with phone numbers and Supabase user IDs
    const vendors = await prisma.vendor.findMany({
      where: {
        phone: {
          not: null,
        },
        supabaseUserId: {
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        supabaseUserId: true,
      },
    });

    results.total = vendors.length;

    for (const vendor of vendors) {
      try {
        // Get the current Supabase user
        const { data: userData, error: getUserError } =
          await supabaseAdmin.auth.admin.getUserById(vendor.supabaseUserId!);

        if (getUserError || !userData?.user) {
          results.errors++;
          results.details.push({
            vendor: vendor.name,
            status: "error",
            message: getUserError?.message || "User not found",
          });
          continue;
        }

        const currentUser = userData.user;

        // Check if user already has a real email
        if (
          currentUser.email &&
          !currentUser.email.includes("@rentnow.local")
        ) {
          results.alreadyCorrect++;
          results.details.push({
            vendor: vendor.name,
            status: "skipped",
            message: `Already has real email: ${currentUser.email}`,
          });
          continue;
        }

        // Generate dummy email from phone number
        const normalizedPhone = vendor.phone!.replace(/\D/g, "");
        const dummyEmail = `phone-${normalizedPhone}@rentnow.local`;

        // Check if email needs updating
        if (currentUser.email === dummyEmail) {
          results.alreadyCorrect++;
          results.details.push({
            vendor: vendor.name,
            status: "already_correct",
            message: "Already has correct dummy email",
          });
          continue;
        }

        // Update the Supabase user with dummy email
        const { error: updateError } =
          await supabaseAdmin.auth.admin.updateUserById(
            vendor.supabaseUserId!,
            {
              email: dummyEmail,
              email_confirm: true,
            }
          );

        if (updateError) {
          results.errors++;
          results.details.push({
            vendor: vendor.name,
            status: "error",
            message: updateError.message,
          });
          continue;
        }

        results.updated++;
        results.details.push({
          vendor: vendor.name,
          phone: vendor.phone,
          email: dummyEmail,
          status: "updated",
          message: "Successfully updated",
        });
      } catch (error: any) {
        results.errors++;
        results.details.push({
          vendor: vendor.name,
          status: "error",
          message: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
