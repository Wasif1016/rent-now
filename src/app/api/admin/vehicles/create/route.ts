import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      vendorId,
      cityId,
      townId,
      title,
      brandId,
      typeId,
      images,
      priceWithinCity,
      priceOutOfCity,
      features,
    } = body;

    if (
      !vendorId ||
      !cityId ||
      !title ||
      !brandId ||
      !typeId ||
      !images ||
      images.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Resolve Town
    let resolvedTownId: string | null = null;
    if (townId) {
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          townId
        );

      if (isUuid) {
        resolvedTownId = townId;
      } else {
        // Custom town name
        const slug = townId
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        let town = await prisma.town.findFirst({
          where: {
            cityId: cityId,
            slug: slug,
          },
        });

        if (!town) {
          town = await prisma.town.create({
            data: {
              name: townId,
              slug: slug,
              cityId: cityId,
            },
          });
        }
        resolvedTownId = town.id;
      }
    }

    // Resolve Vehicle Model
    let vehicleModelId: string | null = null;

    // Check if model exists for this brand with same name
    const existingModel = await prisma.vehicleModel.findFirst({
      where: {
        vehicleBrandId: brandId,
        name: {
          equals: title,
          mode: "insensitive",
        },
      },
    });

    if (existingModel) {
      vehicleModelId = existingModel.id;
    } else {
      // Create new model
      let modelSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      if (!modelSlug) modelSlug = "model";

      // Ensure unique slug
      let finalModelSlug = modelSlug;
      let counter = 1;
      while (
        await prisma.vehicleModel.findUnique({
          where: { slug: finalModelSlug },
        })
      ) {
        finalModelSlug = `${modelSlug}-${counter}`;
        counter++;
      }

      const newModel = await prisma.vehicleModel.create({
        data: {
          name: title,
          slug: finalModelSlug,
          vehicleBrandId: brandId,
          vehicleTypeId: typeId,
          isActive: true,
        },
      });
      vehicleModelId = newModel.id;
    }

    // Determine Vehicle Slug
    // We want unique slug for the vehicle listing
    // We don't have vendor slug readily available here to prefix, but we can query vendor or just use unique global slug.
    // Let's use title + random or counter.

    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    if (!baseSlug) baseSlug = "vehicle";

    // Maybe prefix with vendor id segment to help uniqueness?
    // Or just check global uniqueness.
    let vSlug = baseSlug;
    let vCounter = 1;
    while (await prisma.vehicle.findUnique({ where: { slug: vSlug } })) {
      vSlug = `${baseSlug}-${vCounter}`;
      vCounter++;
    }

    // Create Vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        vendorId: vendorId,
        vehicleModelId: vehicleModelId,
        cityId: cityId,
        townId: resolvedTownId,
        title: title,
        slug: vSlug,
        vehicleTypeId: typeId,
        images: images,
        priceWithinCity: parseInt(priceWithinCity) || 0,
        priceOutOfCity: parseInt(priceOutOfCity) || 0,
        features: features,
        isAvailable: true,
        status: "PUBLISHED",
        metadata: { brandId: brandId }, // Store brand ID for reference ease
        // Default values for fields not in form but required by schema?
        // Check schema requirements. But usually nullable or default.
        // Assuming other price fields (daily/hourly) are nullable.
      },
    });

    revalidatePath("/admin/vehicles");

    return NextResponse.json({ success: true, vehicle });
  } catch (error: any) {
    console.error("Error creating vehicle:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
