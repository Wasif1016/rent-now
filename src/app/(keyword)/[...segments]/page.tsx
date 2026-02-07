import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  resolveKeywordSegments,
  RESERVED_FIRST_SEGMENTS,
} from "@/lib/seo-resolver";
import { KeywordLandingPage } from "@/components/keyword/keyword-landing-page";
import { CityLandingPage } from "@/components/city/city-landing-page";
import { TownLandingPage } from "@/components/city/town-landing-page";
import { CityKeywordModelLandingPage } from "@/components/city/city-keyword-model-landing-page";
import { CityKeywordFilterLandingPage } from "@/components/city/city-keyword-filter-landing-page";
import { CityKeywordRouteLandingPage } from "@/components/route/city-keyword-route-landing-page";
import { CityKeywordRouteModelLandingPage } from "@/components/route/city-keyword-route-model-landing-page";
import { KeywordModelLandingPage } from "@/components/keyword/keyword-model-landing-page";
import { CategoryLandingPage } from "@/components/city/category-landing-page";
import { ModelLandingPage } from "@/components/city/model-landing-page";
import { TownVehicleLandingPage } from "@/components/city/town-vehicle-landing-page";
import {
  generateMetadataFromResolved,
  generateStructuredData,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ segments: string[] }>;
};

export default async function DynamicKeywordPage({ params }: PageProps) {
  const { segments } = await params;
  if (!segments?.length || RESERVED_FIRST_SEGMENTS.has(segments[0])) {
    notFound();
  }

  const resolved = await resolveKeywordSegments(segments);
  if (resolved.pageType === "not_found") {
    notFound();
  }

  const structuredData = generateStructuredData(resolved);

  let content: React.ReactNode = null;

  if (resolved.pageType === "keyword_only" && resolved.keyword) {
    content = <KeywordLandingPage keyword={resolved.keyword.slug} />;
  } else if (
    resolved.pageType === "keyword_model" &&
    resolved.keyword &&
    resolved.model
  ) {
    content = (
      <KeywordModelLandingPage
        keywordSlug={resolved.keyword.slug}
        modelSlug={resolved.model.slug}
        modelName={resolved.model.name}
        brandName={resolved.model.vehicleBrand.name}
        vehicleCategory={resolved.model.vehicleType?.name}
        seatingCapacity={resolved.model.capacity}
        driverOption="With Driver / Without Driver / Both"
      />
    );
  } else if (
    resolved.pageType === "keyword_city" &&
    resolved.keyword &&
    resolved.city
  ) {
    content = (
      <CityLandingPage
        city={resolved.city.slug}
        keyword={resolved.keyword.slug}
      />
    );
  } else if (
    resolved.pageType === "keyword_city_town" &&
    resolved.keyword &&
    resolved.city &&
    resolved.town
  ) {
    content = (
      <TownLandingPage
        city={resolved.city.slug}
        keyword={resolved.keyword.slug}
        town={resolved.town.name}
      />
    );
  } else if (
    resolved.pageType === "keyword_city_model" &&
    resolved.keyword &&
    resolved.city &&
    resolved.model
  ) {
    content = (
      <CityKeywordModelLandingPage
        citySlug={resolved.city.slug}
        cityName={resolved.city.name}
        keywordSlug={resolved.keyword.slug}
        modelSlug={resolved.model.slug}
        modelName={resolved.model.name}
        brandName={resolved.model.vehicleBrand.name}
        vehicleCategory={resolved.model.vehicleType?.name}
        seatingCapacity={resolved.model.capacity}
        driverOption="With Driver / Without Driver / Both"
      />
    );
  } else if (
    resolved.pageType === "keyword_filter_city" &&
    resolved.keyword &&
    resolved.city &&
    resolved.filterSlug
  ) {
    content = (
      <CityKeywordFilterLandingPage
        citySlug={resolved.city.slug}
        cityName={resolved.city.name}
        keywordSlug={resolved.keyword.slug}
        filterSlug={resolved.filterSlug}
        filterType={resolved.filterType}
        category={resolved.category}
        capacity={resolved.capacity}
      />
    );
  } else if (
    resolved.pageType === "keyword_route" &&
    resolved.keyword &&
    resolved.route
  ) {
    content = (
      <CityKeywordRouteLandingPage
        keywordSlug={resolved.keyword.slug}
        route={resolved.route}
      />
    );
  } else if (
    resolved.pageType === "keyword_route_model" &&
    resolved.keyword &&
    resolved.route &&
    resolved.model
  ) {
    content = (
      <CityKeywordRouteModelLandingPage
        keywordSlug={resolved.keyword.slug}
        route={resolved.route}
        modelSlug={resolved.model.slug}
        modelName={resolved.model.name}
        brandName={resolved.model.vehicleBrand.name}
        seatingCapacity={resolved.model.capacity}
      />
    );
  } else if (
    resolved.pageType === "keyword_filter_route" &&
    resolved.keyword &&
    resolved.route &&
    resolved.filterSlug
  ) {
    content = (
      <CityKeywordRouteLandingPage
        keywordSlug={resolved.keyword.slug}
        route={resolved.route}
      />
    );
  } else if (resolved.pageType === "vehicle_category" && resolved.category) {
    content = <CategoryLandingPage category={resolved.category} />;
  } else if (resolved.pageType === "vehicle_model" && resolved.model) {
    content = (
      <ModelLandingPage
        model={{
          id: resolved.model.id,
          name: resolved.model.name,
          slug: resolved.model.slug,
          vehicleBrand: resolved.model.vehicleBrand,
        }}
      />
    );
  } else if (
    resolved.pageType === "vehicle_model_city" &&
    resolved.model &&
    resolved.city
  ) {
    content = (
      <TownVehicleLandingPage
        vehicleName={`${resolved.model.vehicleBrand.name} ${resolved.model.name}`}
        city={resolved.city.name}
        town={resolved.city.name}
        modelSlug={resolved.model.slug}
      />
    );
  } else if (
    resolved.pageType === "vehicle_model_city_town" &&
    resolved.model &&
    resolved.city &&
    resolved.town
  ) {
    content = (
      <TownVehicleLandingPage
        vehicleName={`${resolved.model.vehicleBrand.name} ${resolved.model.name}`}
        city={resolved.city.name}
        town={resolved.town.name}
        modelSlug={resolved.model.slug}
      />
    );
  }

  if (!content) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {content}
    </>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { segments } = await params;
  if (!segments?.length || RESERVED_FIRST_SEGMENTS.has(segments[0])) {
    return { title: "Not Found" };
  }

  const resolved = await resolveKeywordSegments(segments);
  if (resolved.pageType === "not_found") {
    return { title: "Not Found" };
  }

  return generateMetadataFromResolved(resolved);
}
