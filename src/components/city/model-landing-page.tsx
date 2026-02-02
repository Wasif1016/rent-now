import Link from "next/link";
import { HeroSection } from "@/components/hero/hero-section";
import { SeoFooter } from "@/components/home/seo-footer";
import { Button } from "@/components/ui/button";
import { searchVehicles } from "@/lib/data";
import { ArrowRight } from "lucide-react";

export type ModelLandingPageProps = {
  model: {
    id: string;
    name: string;
    slug: string;
    vehicleBrand: { name: string; slug: string };
  };
};

export async function ModelLandingPage({ model }: ModelLandingPageProps) {
  const displayName = `${model.vehicleBrand.name} ${model.name}`;
  const heroHeading = `Rent ${displayName} – Compare Prices & Book`;
  const { vehicles } = await searchVehicles({
    modelSlug: model.slug,
    limit: 6,
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection heading={heroHeading} />

      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_55%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
              {displayName} rental
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Find {displayName} listings across Pakistan. Filter by city and
              book with a small advance.
            </p>
          </div>
          {vehicles.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
              {vehicles.map((v) => (
                <Link
                  key={v.id}
                  href={`/listings/${v.slug}`}
                  className="rounded-xl border border-gray-800/50 bg-[#1a1a1a] p-4 hover:border-primary/50 transition-colors block"
                >
                  <p className="font-semibold text-white">{v.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {v.city.name}
                  </p>
                  {(v.priceDaily ?? v.priceWithDriver ?? v.priceSelfDrive) && (
                    <p className="text-sm text-primary mt-2">
                      Rs.{" "}
                      {(
                        v.priceDaily ??
                        v.priceWithDriver ??
                        v.priceSelfDrive
                      )?.toLocaleString()}
                      /day
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
          <div className="text-center">
            <Button asChild size="lg" className="font-semibold">
              <Link href={`/search?model=${model.slug}`}>
                View all {displayName} listings
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
