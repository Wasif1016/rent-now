import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { RegistrationStatus } from "@prisma/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ vendorId: string }> }
) {
  try {
    const { vendorId } = await params;
    const body = await request.json();
    const { vendor: vendorData, vehicles } = body;

    if (!vendorId) {
      return NextResponse.json(
        { error: "Vendor ID is required" },
        { status: 400 }
      );
    }

    // 1. Fetch current vendor to check status
    const currentVendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!currentVendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    // Determine if we need to update status
    const statusUpdate =
      currentVendor.registrationStatus === RegistrationStatus.NOT_REGISTERED
        ? { registrationStatus: RegistrationStatus.FORM_SUBMITTED }
        : {};

    // 2. Update Vendor Details
    const updatedVendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        name: vendorData.name,
        phone: vendorData.phone,
        whatsappPhone: vendorData.whatsappPhone,
        email: vendorData.email,
        address: vendorData.address,
        personName: vendorData.ownerName,
        cityId: vendorData.cityId,
        town: vendorData.townId
          ? (
              await prisma.town.findUnique({ where: { id: vendorData.townId } })
            )?.name
          : null,
        ...statusUpdate,
      },
    });

    // 2. Create Vehicles
    const createdVehicles = [];

    for (const vehicleData of vehicles) {
      // Resolve VehicleTypeId safely
      let resolvedVehicleTypeId: string | null = null;
      if (vehicleData.type) {
        // 1. Try treating as ID (if UUID format)
        const isUuid =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            vehicleData.type
          );
        if (isUuid) {
          const typeExists = await prisma.vehicleType.findUnique({
            where: { id: vehicleData.type },
          });
          if (typeExists) resolvedVehicleTypeId = typeExists.id;
        }

        // 2. If not found by ID, try by name/slug
        if (!resolvedVehicleTypeId) {
          const typeByName = await prisma.vehicleType.findFirst({
            where: {
              OR: [
                { name: { equals: vehicleData.type, mode: "insensitive" } },
                { slug: { equals: vehicleData.type.toLowerCase() } },
              ],
            },
          });
          if (typeByName) resolvedVehicleTypeId = typeByName.id;
        }
      }

      // Logic to handle Vehicle Model linkage
      let vehicleModelId: string | null = null;

      // Try to find or create a model for the brand
      if (vehicleData.brand) {
        // We need a slug for the model.
        const modelSlug = slugify(`${vehicleData.title}-${vehicleData.brand}`);

        // Check if model exists
        let model = await prisma.vehicleModel.findFirst({
          where: {
            slug: modelSlug,
            vehicleBrandId: vehicleData.brand,
          },
        });

        if (!model) {
          // Create new model if it doesn't exist to ensure brand linkage
          // Note: This might create many models. Ideally we'd have a dropdown for models too.
          // However, to satisfy the requirement "Car title/name" input + "Brand" selector:
          model = await prisma.vehicleModel.create({
            data: {
              name: vehicleData.title, // Use title as model name
              slug: modelSlug,
              vehicleBrandId: vehicleData.brand,
              vehicleTypeId: resolvedVehicleTypeId,
            },
          });
        }
        vehicleModelId = model.id;
      }

      const newVehicle = await prisma.vehicle.create({
        data: {
          vendorId: vendorId,
          title: vehicleData.title, // User provided title
          slug: slugify(`${vehicleData.title}-${Date.now()}`), // Unique slug
          cityId: updatedVendor.cityId!, // Inherit city from vendor
          townId: vendorData.townId || null,
          // The form didn't ask for City per vehicle, but Vehicle requires City.
          // User said "Business details step... Only these car fields in its step."
          // So we MUST use Vendor's city.
          vehicleModelId: vehicleModelId,
          vehicleTypeId: resolvedVehicleTypeId,
          // Map prices
          priceWithinCity: vehicleData.priceWithinCity
            ? parseInt(vehicleData.priceWithinCity)
            : null,
          priceOutOfCity: vehicleData.priceOutOfCity
            ? parseInt(vehicleData.priceOutOfCity)
            : null,
          priceSelfDrive: null, // Not asked
          priceWithDriver: vehicleData.priceWithinCity
            ? parseInt(vehicleData.priceWithinCity)
            : null, // Fallback if they mean general price

          images: vehicleData.images, // JSON array of strings

          status: "PUBLISHED", // Or DRAFT? User didn't specify. "Submit button" implies publishing.
          isAvailable: true,
          features: vehicleData.features,
        },
      });
      createdVehicles.push(newVehicle);
    }

    revalidatePath("/");
    revalidatePath("/view-all-vehicles");

    return NextResponse.json({
      success: true,
      vendor: updatedVendor,
      vehiclesCount: createdVehicles.length,
    });
  } catch (error) {
    console.error("Error submitting vendor onboarding:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
