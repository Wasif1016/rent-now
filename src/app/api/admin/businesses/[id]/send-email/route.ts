import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptPassword } from "@/lib/services/crypto.service";
import { sendVendorCredentialsEmail } from "@/lib/email";
import { logActivity } from "@/lib/services/activity-log.service";
import { replaceTemplateVariables } from "@/lib/services/template.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    // Get vendor
    const vendor = await prisma.vendor.findUnique({
      where: { id },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    if (!vendor.email) {
      return NextResponse.json(
        { error: "Vendor email is required" },
        { status: 400 }
      );
    }

    // Decrypt password if available
    let password = "Not Generated";
    if (vendor.temporaryPasswordEncrypted) {
      try {
        password = decryptPassword(vendor.temporaryPasswordEncrypted);
      } catch (decryptError: any) {
        console.error("Error decrypting password:", decryptError);
        // We can continue without password if it fails, or log warning
        password = "Error decrypting";
      }
    }

    // Prepare email variables
    const loginUrl = "https://www.rentnowpk.com/auth/login";
    const variables = {
      business_name: vendor.name,
      email: vendor.email,
      password,
      login_url: loginUrl,
      username: vendor.phone || vendor.email || "N/A",
    };

    // Get template if provided
    let emailSubject = body.subject;
    let emailBody = body.body;

    if (body.templateId) {
      const template = await prisma.emailTemplate.findUnique({
        where: { id: body.templateId },
      });

      if (template && template.isActive) {
        emailSubject = template.subject;
        emailBody = template.body;
      }
    }

    // Send email
    const emailResult = await sendVendorCredentialsEmail({
      to: vendor.email,
      businessName: vendor.name,
      email: vendor.email,
      password,
      loginUrl,
      subject: emailSubject,
      body: emailBody,
    });

    if (!emailResult.success) {
      // Provide more detailed error message
      let errorMessage = emailResult.error || "Failed to send email";

      if (
        errorMessage.includes("Authentication failed") ||
        errorMessage.includes("535")
      ) {
        errorMessage =
          "SMTP Authentication failed. Please check your BREVO_SMTP_USER and BREVO_SMTP_PASS in .env.local. Make sure you are using the SMTP password (not your account password) from Brevo dashboard. See BREVO_SMTP_SETUP.md for details.";
      }

      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    // Update vendor status
    await prisma.vendor.update({
      where: { id },
      data: {
        registrationStatus:
          vendor.registrationStatus === "ACCOUNT_CREATED"
            ? "EMAIL_SENT"
            : "EMAIL_SENT",
        emailSentAt: new Date(),
      },
    });

    // Log activity
    await logActivity({
      action: "EMAIL_SENT",
      entityType: "VENDOR",
      entityId: id,
      adminUserId: user.id,
      details: {
        email: vendor.email,
        vendorName: vendor.name,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error: any) {
    if (
      error.message === "Unauthorized" ||
      error.message.includes("Forbidden")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
