import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA({
  vehicleBrand,
  vehicleModel,
  city,
  modelSlug,
  citySlug,
}: {
  vehicleBrand?: string;
  vehicleModel?: string;
  city?: string;
  modelSlug?: string;
  citySlug?: string;
}) {
  // Build descriptive phrase for the heading based on provided data
  let headerParts: string[] = [];
  if (vehicleBrand) headerParts.push(vehicleBrand);
  if (vehicleModel) headerParts.push(vehicleModel);
  const vehicleText = headerParts.join(" ");

  let heading;
  if (vehicleText && city) {
    heading = (
      <>
        Ready to proceed with <br />
        {vehicleText} in {city}?
      </>
    );
  } else if (vehicleText) {
    heading = (
      <>
        Ready to proceed with <br />
        {vehicleText}?
      </>
    );
  } else if (city) {
    heading = (
      <>
        Ready to proceed in <br />
        {city}?
      </>
    );
  } else {
    heading = (
      <>
        Ready to proceed?
      </>
    );
  }

  // Build description
  let description;
  if (city) {
    description =
      `Compare available vehicles, connect with trusted rental companies in ${city}, and book with confidence.`;
  } else {
    description =
      "Compare available vehicles, connect with trusted rental companies, and book with confidence.";
  }

  // Build search query string properly
  const queryParams = [];
  if (modelSlug) queryParams.push(`model=${encodeURIComponent(modelSlug)}`);
  if (citySlug) queryParams.push(`city=${encodeURIComponent(citySlug)}`);
  const linkHref = `/search${queryParams.length ? "?" + queryParams.join("&") : ""}`;

  return (
    <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center ">
          <h2 className="text-3xl lg:text-4xl font-bold leading-[130%] mb-4">
            {heading}
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-xl mx-auto">
            {description}
          </p>
          <Link href={linkHref}>
            <Button
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 font-semibold px-8 py-6 text-lg rounded-none"
            >
              View Available Vehicles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
