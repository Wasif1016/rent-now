import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone") || "92 305 9991234";

  // Normalize phone number (same logic as auth-context.tsx)
  let normalizedPhone = phone.replace(/\D/g, "");

  // Handle 0308... -> 92308...
  if (normalizedPhone.startsWith("0") && normalizedPhone.length === 11) {
    normalizedPhone = "92" + normalizedPhone.substring(1);
  }
  // Handle 92308... -> 92308...
  else if (normalizedPhone.startsWith("92") && normalizedPhone.length === 12) {
    normalizedPhone = normalizedPhone;
  }
  // Handle 308... -> 92308...
  else if (normalizedPhone.length === 10) {
    normalizedPhone = "92" + normalizedPhone;
  }

  const dummyEmail = `phone-${normalizedPhone}@rentnow.local`;

  return NextResponse.json({
    input: phone,
    normalized: normalizedPhone,
    email: dummyEmail,
    instructions: "Use this email format when logging in with phone numbers",
  });
}
