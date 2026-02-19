import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveVehiclesSegments } from "@/lib/seo-resolver";
import { CategoryLandingPage } from "@/components/city/category-landing-page";
import { ModelLandingPage } from "@/components/city/model-landing-page";
import { TownVehicleLandingPage } from "@/components/city/town-vehicle-landing-page";
import { getMinPriceForConfig } from "@/lib/data";
import { Prisma } from "@prisma/client";

interface PageProps {
  params: Promise<{ segments: string[] }>;
}

export default async function VehiclesSegmentsPage({ params }: PageProps) {
  const { segments } = await params;
  const resolved = await resolveVehiclesSegments(segments);

  if (resolved.pageType === "not_found") {
    notFound();
  }

  if (resolved.pageType === "vehicle_category" && resolved.category) {
    return <CategoryLandingPage category={resolved.category} />;
  }

  if (resolved.pageType === "vehicle_model" && resolved.model) {
    return (
      <ModelLandingPage
        model={{
          id: resolved.model.id,
          name: resolved.model.name,
          slug: resolved.model.slug,
          vehicleBrand: resolved.model.vehicleBrand,
        }}
      />
    );
  }

  if (
    resolved.pageType === "vehicle_model_city_town" &&
    resolved.model &&
    resolved.city &&
    resolved.town
  ) {
    return (
      <TownVehicleLandingPage
        vehicleName={`${resolved.model.vehicleBrand.name} ${resolved.model.name}`}
        city={resolved.city.name}
        town={resolved.town.name}
        modelSlug={resolved.model.slug}
      />
    );
  }

  // Fallback for model_city if we want to show something later, for now just 404 or show generic
  if (
    resolved.pageType === "vehicle_model_city" &&
    resolved.model &&
    resolved.city
  ) {
    return (
      <TownVehicleLandingPage
        vehicleName={`${resolved.model.vehicleBrand.name} ${resolved.model.name}`}
        city={resolved.city.name}
        town={resolved.city.name} // Generic city-level
        modelSlug={resolved.model.slug}
      />
    );
  }

  notFound();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { segments } = await params;
  const resolved = await resolveVehiclesSegments(segments);

  if (resolved.pageType === "not_found") {
    return { title: "Not Found" };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.rentnowpk.com";
  const path = segments.join("/");
  const canonical = `${baseUrl}/vehicles/${path}`;

  // Helper to fetch min price
  const getPriceText = async (where: Prisma.VehicleWhereInput) => {
    const minPrice = await getMinPriceForConfig(where);
    if (minPrice) {
      return ` - From Rs. ${minPrice.toLocaleString()}`;
    }
    return "";
  };

  if (resolved.pageType === "vehicle_category" && resolved.category) {
    const priceText = await getPriceText({ categoryId: resolved.category.id });
    const name = resolved.category.name.replace(/-/g, " ");
    const title = `${
      name.charAt(0).toUpperCase() + name.slice(1)
    } Rental${priceText} | RentNowPk`;
    return {
      title,
      description: `Rent ${resolved.category.name} vehicles${priceText}. Compare prices and book with trusted vendors across Pakistan.`,
      alternates: { canonical },
    };
  }

  if (resolved.pageType === "vehicle_model" && resolved.model) {
    const priceText = await getPriceText({ vehicleModelId: resolved.model.id });
    const displayName = `${resolved.model.vehicleBrand.name} ${resolved.model.name}`;
    return {
      title: `Rent ${displayName}${priceText} | Compare Prices | RentNowPk`,
      description: `Find ${displayName} rental listings${priceText}. Compare vendors and book with a small advance.`,
      alternates: { canonical },
    };
  }

  if (
    resolved.pageType === "vehicle_model_city_town" &&
    resolved.model &&
    resolved.city &&
    resolved.town
  ) {
    const priceText = await getPriceText({
      vehicleModelId: resolved.model.id,
      townId: resolved.town.id,
    });
    const displayName = `${resolved.model.vehicleBrand.name} ${resolved.model.name}`;
    return {
      title: `${displayName} for Rent in ${resolved.town.name}, ${resolved.city.name}${priceText} | RentNowPk`,
      description: `Book ${displayName} in ${resolved.town.name}, ${resolved.city.name}${priceText}. Reliable local rental businesses. Pay a small advance to confirm.`,
      alternates: { canonical },
    };
  }

  if (
    resolved.pageType === "vehicle_model_city" &&
    resolved.model &&
    resolved.city
  ) {
    const priceText = await getPriceText({
      vehicleModelId: resolved.model.id,
      cityId: resolved.city.id,
    });
    const displayName = `${resolved.model.vehicleBrand.name} ${resolved.model.name}`;
    return {
      title: `${displayName} for Rent in ${resolved.city.name}${priceText} | Best Deals | RentNowPk`,
      description: `Find ${displayName} for rent in ${resolved.city.name}${priceText}. verified vendors and transparent pricing.`,
      alternates: { canonical },
    };
  }

  return { title: "Not Found" };
}
