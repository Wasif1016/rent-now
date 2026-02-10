import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

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

    // 1. Update Vendor Details
    const updatedVendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        name: vendorData.name,
        phone: vendorData.phone,
        whatsappPhone: vendorData.whatsappPhone,
        email: vendorData.email,
        address: vendorData.address,
        // cityId: vendorData.cityId // Assuming we might update this too if passed, but typically business city is fixed or requires more logic
      },
    });

    // 2. Create Vehicles
    const createdVehicles = [];

    for (const vehicleData of vehicles) {
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
              vehicleTypeId: vehicleData.type ? vehicleData.type : undefined,
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
          cityId: updatedVendor.cityId!, // Inherit city from vendor (or should we ask for it? Form didn't ask for city)
          // The form didn't ask for City per vehicle, but Vehicle requires City.
          // User said "Business details step... Only these car fields in its step."
          // So we MUST use Vendor's city.
          vehicleModelId: vehicleModelId,
          vehicleTypeId: vehicleData.type || null,
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
