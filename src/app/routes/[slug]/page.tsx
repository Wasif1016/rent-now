import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRouteBySlug } from "@/lib/data";
import { RouteLandingPage } from "@/components/route/route-landing-page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = await getRouteBySlug(slug);
  if (!route) {
    return { title: "Route Not Found | Rent Now" };
  }
  const origin = route.originCity.name;
  const destination = route.destinationCity.name;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Rent Now";
  return {
    title: `${origin} to ${destination} Car Rental | ${siteName}`,
    description: `Book reliable vehicles with drivers for the ${origin} to ${destination} route. Compare vendors, capacity, and prices before confirming your booking.`,
    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://www.rentnowpk.com"
      }/routes/${slug}`,
    },
  };
}

export default async function RoutePage({ params }: PageProps) {
  const { slug } = await params;
  const route = await getRouteBySlug(slug);
  if (!route) notFound();
  return <RouteLandingPage route={route} />;
}
