import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface EmptyStateProps {
  city?: string;
}

export function EmptyState({ city }: EmptyStateProps) {
  const message = city
    ? `No cars found in ${city}.`
    : "No vehicles found matching your criteria.";

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Image
        src="/icons/no-results.svg"
        alt="No Results"
        width={100}
        height={100}
        className="h-16 w-16 text-muted-foreground mb-4"
      />
      <h2 className="text-2xl font-semibold mb-2">No Results Found</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link href="/view-all-vehicles">Browse All Vehicles</Link>
        </Button>
        {city && (
          <Button asChild>
            <Link
              href={`/rent-a-car/${city.toLowerCase().replace(/\s+/g, "-")}`}
            >
              View All in {city}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
