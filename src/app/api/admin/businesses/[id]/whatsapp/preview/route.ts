import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptPassword } from "@/lib/services/crypto.service";
import { replaceTemplateVariables } from "@/lib/services/template.service";

function htmlToPlainText(html: string): string {
  const text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

const DEFAULT_PLAIN_MESSAGE = `Hi {{business_name}},

Your vendor account has been created. Use these credentials to log in:

Email: {{email}}
Password: {{password}}

Login: {{login_url}}

Please change your password after your first login.`;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    const vendor = await prisma.vendor.findUnique({
      where: { id },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    let password = "Not Generated";
    if (vendor.temporaryPasswordEncrypted) {
      try {
        password = decryptPassword(vendor.temporaryPasswordEncrypted);
      } catch (decryptError: unknown) {
        const message =
          decryptError instanceof Error
            ? decryptError.message
            : "Failed to decrypt password";
        console.error("Error decrypting password:", decryptError);
        password = "Error decrypting";
      }
    }

    const loginUrl = "https://www.rentnowpk.com/auth/login";
    const variables = {
      business_name: vendor.name,
      email: vendor.email || "",
      password,
      login_url: loginUrl,
      username: vendor.phone || vendor.email || "N/A",
    };

    let message: string;

    if (body.whatsappTemplateId) {
      const template = await prisma.whatsAppTemplate.findUnique({
        where: { id: body.whatsappTemplateId },
      });
      if (template && template.isActive) {
        // Plain text body: replace variables and preserve line breaks
        message = replaceTemplateVariables(template.body, variables);
      } else {
        const raw = body.customMessage || DEFAULT_PLAIN_MESSAGE;
        message = replaceTemplateVariables(raw, variables);
      }
    } else if (body.templateId) {
      const template = await prisma.emailTemplate.findUnique({
        where: { id: body.templateId },
      });
      if (template && template.isActive) {
        const withNewlines = template.body.replace(/\n/g, "<br>");
        const bodyWithVariables = replaceTemplateVariables(
          withNewlines,
          variables
        );
        message = htmlToPlainText(bodyWithVariables);
      } else {
        const raw = body.customMessage || DEFAULT_PLAIN_MESSAGE;
        message = replaceTemplateVariables(raw, variables);
      }
    } else if (body.customMessage && typeof body.customMessage === "string") {
      message = replaceTemplateVariables(body.customMessage, variables);
    } else {
      message = replaceTemplateVariables(DEFAULT_PLAIN_MESSAGE, variables);
    }

    return NextResponse.json({ message });
  } catch (error: unknown) {
    const err = error as { message?: string };
    if (
      err.message === "Unauthorized" ||
      String(err.message).includes("Forbidden")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error generating WhatsApp preview:", error);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
