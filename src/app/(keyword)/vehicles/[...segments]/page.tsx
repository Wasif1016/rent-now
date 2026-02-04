import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveVehiclesSegments } from "@/lib/seo-resolver";
import { CategoryLandingPage } from "@/components/city/category-landing-page";
import { ModelLandingPage } from "@/components/city/model-landing-page";
import { TownVehicleLandingPage } from "@/components/city/town-vehicle-landing-page";

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

  if (resolved.pageType === "vehicle_category" && resolved.category) {
    const name = resolved.category.name.replace(/-/g, " ");
    const title = `${
      name.charAt(0).toUpperCase() + name.slice(1)
    } Rental | RentNowPk`;
    return {
      title,
      description: `Rent ${resolved.category.name} vehicles. Compare prices and book with trusted vendors across Pakistan.`,
      alternates: { canonical },
    };
  }

  if (resolved.pageType === "vehicle_model" && resolved.model) {
    const displayName = `${resolved.model.vehicleBrand.name} ${resolved.model.name}`;
    return {
      title: `Rent ${displayName} | Compare Prices | RentNowPk`,
      description: `Find ${displayName} rental listings. Compare vendors and book with a small advance.`,
      alternates: { canonical },
    };
  }

  if (
    resolved.pageType === "vehicle_model_city_town" &&
    resolved.model &&
    resolved.city &&
    resolved.town
  ) {
    const displayName = `${resolved.model.vehicleBrand.name} ${resolved.model.name}`;
    return {
      title: `${displayName} for Rent in ${resolved.town.name}, ${resolved.city.name} | RentNowPk`,
      description: `Book ${displayName} in ${resolved.town.name}, ${resolved.city.name}. Reliable local rental businesses. Pay a small advance to confirm.`,
      alternates: { canonical },
    };
  }

  if (
    resolved.pageType === "vehicle_model_city" &&
    resolved.model &&
    resolved.city
  ) {
    const displayName = `${resolved.model.vehicleBrand.name} ${resolved.model.name}`;
    return {
      title: `${displayName} for Rent in ${resolved.city.name} | Best Deals | RentNowPk`,
      description: `Find ${displayName} for rent in ${resolved.city.name}. verified vendors and transparent pricing.`,
      alternates: { canonical },
    };
  }

  return { title: "Not Found" };
}
