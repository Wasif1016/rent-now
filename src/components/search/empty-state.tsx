"use client";

import { SearchX, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface EmptyStateProps {
  city?: string;
}

export function EmptyState({ city }: EmptyStateProps) {
  const whatsappNumber = "923144174625";
  // Clean phone number for tel link (remove spaces, etc if needed, but here it is clean)
  const phoneNumber = "03144174625";

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      "Hi, I couldn't find a vehicle matching my criteria. Can you help me find one near me?"
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-2xl mx-auto">
      {/* <div className="mb-6 relative">
        <div className="absolute inset-0 bg-black rounded-full  transform scale-150"></div>
        <Image
          src="/icons/no-results.svg"
          alt="No Results"
          width={80}
          height={80}
          className="relative h-24 w-24 text-muted-foreground opacity-90"
        />
      </div> */}

   

      <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm w-full mb-8">
        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          It looks like we don't have a listing matching your exact criteria
          right now.
          <span className="block mt-2 font-medium text-foreground">
            But don't worry! We have a massive offline network of custom
            vehicles near you.
          </span>
          <span className="block mt-2">
            Please <strong>Call</strong> or <strong>WhatsApp</strong> us
            directly, and we will find the perfect ride for you within minutes.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-primary hover:bg-primary/80 text-black font-semibold text-lg h-12 px-8 shadow-md hover:shadow-lg transition-all"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            WhatsApp Us
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-primary/20 hover:bg-primary/5 hover:border-primary text-foreground font-semibold text-lg h-12 px-8"
            onClick={handleCall}
          >
            <Phone className="mr-2 h-5 w-5" />
            Call Now
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          Or try browsing all our available options
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            asChild
            variant="ghost"
            className="text-white bg-black hover:text-primary/80"
          >
            <Link href="/view-all-vehicles">Browse All Vehicles</Link>
          </Button>
          {city && (
            <Button
              asChild
              variant="ghost"
              className="text-primary hover:text-primary/80"
            >
              <Link
                href={`/rent-a-car/${city.toLowerCase().replace(/\s+/g, "-")}`}
              >
                View All in {city}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
