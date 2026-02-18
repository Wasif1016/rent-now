import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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

    // Resolve Town Logic - Do this regardless of vendor existence
    let resolvedTownName: string | null = null;
    let resolvedTownId: string | null = null;
    if (vendor.townId) {
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          vendor.townId
        );
      if (isUuid) {
        const t = await prisma.town.findUnique({
          where: { id: vendor.townId },
        });
        if (t) {
          resolvedTownName = t.name;
          resolvedTownId = t.id;
        }
      } else {
        // It's a custom name
        const customName = vendor.townId;
        const slug = customName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        // Find or Create
        let t = await prisma.town.findFirst({
          where: {
            cityId: vendor.cityId,
            slug: slug,
          },
        });

        if (!t) {
          t = await prisma.town.create({
            data: {
              name: customName,
              slug: slug,
              cityId: vendor.cityId,
            },
          });
        }
        resolvedTownName = t.name;
        resolvedTownId = t.id;
      }
    }

    let targetVendor;

    let slug;

    if (existingVendor) {
      // Use existing vendor
      targetVendor = existingVendor;
      slug = targetVendor.slug;
    } else {
      // Create new vendor
      let baseSlug = vendor.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      if (!baseSlug) baseSlug = "vendor";
      slug = baseSlug;
      let counter = 1;
      while (await prisma.vendor.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      targetVendor = await prisma.vendor.create({
        data: {
          name: vendor.name,
          email: vendor.email,
          phone: vendor.phone,
          whatsappPhone: vendor.whatsappPhone,
          address: vendor.address,
          personName: vendor.ownerName, // Map ownerName to personName
          cityId: vendor.cityId,
          town: resolvedTownName, // Store resolved town name
          slug,
          isActive: true,
          verificationStatus: "PENDING",
          registrationStatus: "FORM_SUBMITTED", // Matches logic for public listing
        },
      });
    }

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

      // Resolve VehicleTypeId safely
      let vehicleTypeId: string | null = null;
      if (v.type) {
        // 1. Try treating as ID (if UUID format)
        const isUuid =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            v.type
          );
        if (isUuid) {
          const typeExists = await prisma.vehicleType.findUnique({
            where: { id: v.type },
          });
          if (typeExists) vehicleTypeId = typeExists.id;
        }

        // 2. If not found by ID, try by name/slug
        if (!vehicleTypeId) {
          const typeByName = await prisma.vehicleType.findFirst({
            where: {
              OR: [
                { name: { equals: v.type, mode: "insensitive" } },
                { slug: { equals: v.type.toLowerCase() } },
              ],
            },
          });
          if (typeByName) vehicleTypeId = typeByName.id;
        }
      }

      // Handle Vehicle Model
      let vehicleModelId: string | null = null;
      if (v.brand) {
        // Generate a slug for the model based on title
        let modelSlug = v.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        if (!modelSlug) modelSlug = "model";

        // Check if model exists with this name for this brand
        // We search by name/brand combo roughly, or just create if not exists
        // Since we don't have exact name match in findFirst easily without normalized name,
        // we'll rely on slug. OR more safely, we fetch by slug and valid brand.

        // Actually, let's try to find by specific criteria if possible, or just create.
        // Given this is user input, creating a new model for their specific title is safer for their listing
        // but we want to reuse if it's identical.

        // Let's search by slug first (assuming slug is derived from title)
        // Note: VehicleModel slug is globally unique.

        // To avoid collision with other brands, maybe prefix or suffix?
        // But for now let's just try to find unique slug.

        // Simplification: logic to get unique model slug
        let finalModelSlug = modelSlug;
        let mCounter = 1;

        // We check if a model with this slug exists.
        // If it does, we check if it belongs to the same brand.
        // If yes, reusing it might be okay if names match, but names might differ.
        // To be safe and simple: always find-or-create based on exact brand+slug?

        // Better strategy:
        // 1. Try to find model by `vehicleBrandId` and `name` (exact match).
        // 2. If found, use it.
        // 3. If not, create new with unique slug.

        const existingModel = await prisma.vehicleModel.findFirst({
          where: {
            vehicleBrandId: v.brand,
            name: {
              equals: v.title,
              mode: "insensitive", // precise match but case insensitive
            },
          },
        });

        if (existingModel) {
          vehicleModelId = existingModel.id;
        } else {
          // Create new
          while (
            await prisma.vehicleModel.findUnique({
              where: { slug: finalModelSlug },
            })
          ) {
            finalModelSlug = `${modelSlug}-${mCounter}`;
            mCounter++;
          }

          const newModel = await prisma.vehicleModel.create({
            data: {
              name: v.title,
              slug: finalModelSlug,
              vehicleBrandId: v.brand,
              vehicleTypeId: vehicleTypeId, // Use resolved safe ID
              isActive: true,
            },
          });
          vehicleModelId = newModel.id;
        }
      }

      const vehicle = await prisma.vehicle.create({
        data: {
          vendorId: targetVendor.id,
          vehicleModelId: vehicleModelId, // Linked!
          cityId: vendor.cityId,
          townId: resolvedTownId, // Link vehicle to resolved town ID
          title: v.title,
          slug: vSlug,
          vehicleTypeId: vehicleTypeId, // Use resolved safe ID
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

    revalidatePath("/");
    revalidatePath("/view-all-vehicles");

    return NextResponse.json({
      success: true,
      vendor: targetVendor,
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
