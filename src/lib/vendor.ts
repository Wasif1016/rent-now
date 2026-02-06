import { prisma } from "@/lib/prisma";
import type { User } from "@supabase/supabase-js";

/**
 * Get or create a vendor from Supabase user
 * This links the Supabase auth user to a Vendor record
 */
export async function getOrCreateVendor(user: User) {
  // Check if vendor already exists
  let vendor = await prisma.vendor.findUnique({
    where: { supabaseUserId: user.id },
  });

  if (!vendor) {
    // Create new vendor from user data
    const email = user.email || "";

    // Extract phone number from user metadata or dummy email
    let phone = (user.user_metadata?.phone_number as string) || null;
    let whatsappPhone = (user.user_metadata?.whatsapp_number as string) || null;

    // If no phone in metadata, try to extract from dummy email
    if (
      !phone &&
      email.includes("@rentnow.local") &&
      email.startsWith("phone-")
    ) {
      const phoneMatch = email.match(/^phone-(\d+)@rentnow\.local$/);
      if (phoneMatch && phoneMatch[1]) {
        const extractedPhone = phoneMatch[1];
        // Convert 923059991234 to +923059991234
        phone = extractedPhone.startsWith("92")
          ? `+${extractedPhone}`
          : extractedPhone;
        // Use same phone for WhatsApp if not provided
        whatsappPhone = whatsappPhone || phone;
      }
    }

    const name =
      (user.user_metadata?.full_name as string) ||
      email.split("@")[0] ||
      "Vendor";
    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Math.random().toString(36).substring(2, 9);

    vendor = await prisma.vendor.create({
      data: {
        name,
        slug,
        email,
        phone,
        whatsappPhone,
        supabaseUserId: user.id,
        verificationStatus: "PENDING",
        isActive: true,
      },
    });
  }

  return vendor;
}

/**
 * Get vendor by Supabase user ID
 */
export async function getVendorByUserId(userId: string) {
  return await prisma.vendor.findUnique({
    where: { supabaseUserId: userId },
  });
}
