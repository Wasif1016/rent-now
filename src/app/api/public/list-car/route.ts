import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { vendor, vehicles } = body;

    if (!vendor || !vehicles || vehicles.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!vendor.cityId) {
      return NextResponse.json({ error: "City is required" }, { status: 400 });
    }

    // Check if vendor with email exists
    let existingVendor = null;
    if (vendor.email) {
      existingVendor = await prisma.vendor.findUnique({
        where: { email: vendor.email },
      });
    }

    if (existingVendor) {
      return NextResponse.json(
        {
          error:
            "A vendor with this email already exists. Please login to add vehicles.",
        },
        { status: 400 }
      );
    }

    // Create new vendor
    let baseSlug = vendor.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    if (!baseSlug) baseSlug = "vendor";
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.vendor.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newVendor = await prisma.vendor.create({
      data: {
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        whatsappPhone: vendor.whatsappPhone,
        address: vendor.address,
        cityId: vendor.cityId,
        slug,
        isActive: true,
        verificationStatus: "PENDING",
        registrationStatus: "FORM_SUBMITTED", // Matches logic for public listing
      },
    });

    // Create vehicles
    const createdVehicles = [];
    for (const v of vehicles) {
      // Generate slug for vehicle
      let vTitleSlug = v.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      if (!vTitleSlug) vTitleSlug = "vehicle";

      let vSlug = `${slug}-${vTitleSlug}`; // Vendor slug prefix helps uniqueness
      let vCounter = 1;
      while (await prisma.vehicle.findUnique({ where: { slug: vSlug } })) {
        vSlug = `${slug}-${vTitleSlug}-${vCounter}`;
        vCounter++;
      }

      const vehicle = await prisma.vehicle.create({
        data: {
          vendorId: newVendor.id,
          cityId: vendor.cityId,
          title: v.title,
          slug: vSlug,
          vehicleTypeId: v.type, // assuming type ID from form
          images: v.images, // Stored as Json array
          priceWithinCity: parseInt(v.priceWithinCity) || 0,
          priceOutOfCity: parseInt(v.priceOutOfCity) || 0,
          features: v.features,
          isAvailable: true,
          status: "PUBLISHED", // Show on listing immediately per request context implies
          metadata: { brandId: v.brand }, // Store brand ID for reference
        },
      });
      createdVehicles.push(vehicle);
    }

    return NextResponse.json({
      success: true,
      vendor: newVendor,
      vehicles: createdVehicles,
    });
  } catch (error: any) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
