import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { encryptPassword, generatePassword } from "./crypto.service";
import { logActivity } from "./activity-log.service";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase environment variables are not set");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface CreateAccountParams {
  vendorId: string;
  adminUserId?: string;
}

interface CreateAccountResult {
  success: boolean;
  email: string;
  password: string;
  error?: string;
}

/**
 * Create a vendor account with Supabase authentication
 * Generates password, creates Supabase user, encrypts and stores password
 */
export async function createVendorAccount(
  params: CreateAccountParams
): Promise<CreateAccountResult> {
  const { vendorId, adminUserId } = params;

  // Get vendor
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
  });

  if (!vendor) {
    return {
      success: false,
      email: "",
      password: "",
      error: "Vendor not found",
    };
  }

  // Check if vendor has email or phone
  if (!vendor.email && !vendor.phone) {
    return {
      success: false,
      email: "",
      password: "",
      error: "Vendor email or phone number is required",
    };
  }

  if (vendor.supabaseUserId) {
    return {
      success: false,
      email: vendor.email || "",
      password: "",
      error: "Account already exists",
    };
  }

  // Generate strong password
  const password = generatePassword(16);

  try {
    // Check if user already exists in Supabase
    const { data: existingUsers, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();

    let existingUser = null;
    if (!listError && existingUsers?.users) {
      // Check by email or phone
      existingUser = existingUsers.users.find(
        (u) =>
          (vendor.email && u.email === vendor.email) ||
          (vendor.phone && u.phone === vendor.phone)
      );
    }

    let authData: { user: any } | null = null;
    let authError: any = null;

    if (existingUser) {
      // User already exists - link it to the vendor and update password
      const { data: updatedUser, error: updateError } =
        await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
          password,
          user_metadata: {
            role: "vendor",
            vendor_id: vendorId,
          },
        });

      if (updateError) {
        authError = updateError;
      } else if (updatedUser?.user) {
        authData = { user: updatedUser.user };
      }
    } else {
      // Create new Supabase user with email or phone
      const createUserData: any = {
        password,
        email_confirm: true,
        user_metadata: {
          role: "vendor",
          vendor_id: vendorId,
          full_name: vendor.name,
        },
      };

      // Use email if available, otherwise use phone
      if (vendor.email) {
        createUserData.email = vendor.email;
      } else if (vendor.phone) {
        createUserData.phone = vendor.phone;
        // Supabase requires an email even for phone-based auth
        // Generate a dummy email using the phone number
        const normalizedPhone = vendor.phone.replace(/\D/g, "");
        createUserData.email = `phone-${normalizedPhone}@rentnow.local`;
      }

      const result = await supabaseAdmin.auth.admin.createUser(createUserData);

      authData = result.data;
      authError = result.error;
    }

    if (authError || !authData?.user) {
      return {
        success: false,
        email: vendor.email || vendor.phone || "",
        password: "",
        error: authError?.message || "Failed to create/update user",
      };
    }

    // Encrypt password
    const encryptedPassword = encryptPassword(password);

    // Update vendor with Supabase user ID and encrypted password
    await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        supabaseUserId: authData.user.id,
        temporaryPasswordEncrypted: encryptedPassword,
        registrationStatus: "ACCOUNT_CREATED",
        accountCreatedAt: new Date(),
      },
    });

    // Log activity
    await logActivity({
      action: "ACCOUNT_CREATED",
      entityType: "VENDOR",
      entityId: vendorId,
      adminUserId,
      details: {
        email: vendor.email || vendor.phone || "",
        vendorName: vendor.name,
        linkedExistingAccount: !!existingUser,
      },
    });

    return {
      success: true,
      email: vendor.email || vendor.phone || "",
      password, // Return plain password for admin display
    };
  } catch (error: any) {
    return {
      success: false,
      email: vendor.email || vendor.phone || "",
      password: "",
      error: error.message || "Unknown error",
    };
  }
}

/**
 * Reset vendor password
 */
export async function resetVendorPassword(
  vendorId: string,
  adminUserId?: string
): Promise<CreateAccountResult> {
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
  });

  if (!vendor || !vendor.supabaseUserId) {
    return {
      success: false,
      email: vendor?.email || "",
      password: "",
      error: "Vendor account not found",
    };
  }

  // Generate new password
  const password = generatePassword(16);

  try {
    // Update password in Supabase
    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(vendor.supabaseUserId, {
        password,
      });

    if (updateError) {
      return {
        success: false,
        email: vendor.email || "",
        password: "",
        error: updateError.message,
      };
    }

    // Encrypt and store new password
    const encryptedPassword = encryptPassword(password);

    await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        temporaryPasswordEncrypted: encryptedPassword,
        accountCreatedAt: new Date(), // Update timestamp
      },
    });

    // Log activity
    await logActivity({
      action: "PASSWORD_RESET",
      entityType: "VENDOR",
      entityId: vendorId,
      adminUserId,
      details: {
        email: vendor.email,
      },
    });

    return {
      success: true,
      email: vendor.email || "",
      password,
    };
  } catch (error: any) {
    return {
      success: false,
      email: vendor.email || "",
      password: "",
      error: error.message || "Unknown error",
    };
  }
}
