"use client";

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

      <div className="flex flex-col gap-4 items-center">
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

        <div className="mt-4 p-6 bg-primary/5 rounded-lg border border-primary/10 max-w-md w-full">
          <p className="text-sm text-center mb-3 font-medium">
            Can't find what you're looking for?
          </p>
          <Button
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
            onClick={() =>
              window.open(
                `https://wa.me/923144174625?text=${encodeURIComponent(
                  "Hi, I couldn't find a vehicle matching my criteria. Can you help me find one?"
                )}`,
                "_blank"
              )
            }
          >
            Chat with us on WhatsApp
          </Button>
          <p className="text-xs text-center mt-2 text-muted-foreground">
            or call us at +92 314 4174625
          </p>
        </div>
      </div>
    </div>
  );
}
