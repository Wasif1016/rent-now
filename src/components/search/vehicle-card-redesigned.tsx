"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Users,
  MapPin,
  Phone,
  MessageCircle,
} from "lucide-react";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { getVehicleDisplayTitle } from "@/lib/vehicle-utils";
import { SVGIcon } from "../ui/svg-icon";

interface VehicleCardRedesignedProps {
  vehicle: {
    id: string;
    title: string;
    slug: string;
    seats?: number | null;
    images: string[] | null;
    city: { name: string; slug: string };
    town?: { name: string; slug: string } | null;
    vendor: {
      name: string;
      verificationStatus?: string | null;
      phone?: string | null;
      whatsappPhone?: string | null;
    };
    vehicleModel?: {
      name: string;
      vehicleBrand: { name: string };
    } | null;
    priceWithinCity?: number | null;
    priceOutOfCity?: number | null;
    priceSelfDrive?: number | null;
  };
}

export function VehicleCard({ vehicle }: VehicleCardRedesignedProps) {
  const imageUrl =
    vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0
      ? vehicle.images[0]
      : "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop";

  const isVerified = vehicle.vendor.verificationStatus === "VERIFIED";

  const locationText = vehicle.town
    ? `${vehicle.town.name}, ${vehicle.city.name}`
    : vehicle.city.name;

  // Format price
  const formatPrice = (price: number | null | undefined) => {
    if (!price) return "N/A";
    return `Rs. ${price.toLocaleString()}`;
  };

  // Generate WhatsApp link
  const whatsappUrl = generateWhatsAppLink({
    title: vehicle.title,
    city: { name: vehicle.city.name },
    town: vehicle.town ? { name: vehicle.town.name } : null,
    vehicleModel: vehicle.vehicleModel ?? undefined,
  });

  // Get WhatsApp number (prefer vendor's WhatsApp, fallback to phone, then default)
  // Note: The generateWhatsAppLink uses a default number, but we can override it
  const whatsappNumber = "923144174625";

  // Override WhatsApp URL with vendor's number if available
  const cleanWhatsAppNumber = whatsappNumber.replace(/\D/g, "");
  const displayTitle = getVehicleDisplayTitle(vehicle);
  const vehicleName = displayTitle;
  const location = vehicle.town
    ? `${vehicle.town.name}, ${vehicle.city.name}`
    : vehicle.city.name;
  const message = `Hi, I'm interested in booking ${vehicleName} in ${location}. Please confirm availability.`;
  const encodedMessage = encodeURIComponent(message);
  const finalWhatsAppUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodedMessage}`;

  // Get phone number for call
  const phoneNumber = "923144174625";
  const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");
  const telHref = `tel:+${cleanPhoneNumber}`;

  // Track click function
  const trackClick = async (type: "whatsapp" | "call") => {
    try {
      await fetch(`/api/vehicles/${vehicle.id}/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      });
    } catch (error) {
      // Silent fail - don't block user action
      console.error("Failed to track click:", error);
    }
  };

  const handleWhatsAppClick = () => {
    trackClick("whatsapp");
  };

  const handleCallClick = () => {
    trackClick("call");
  };

  return (
    <Card className="group overflow-hidden border-border/50 rounded-none bg-background hover:bg-foreground/5 transition-all duration-300 h-full flex flex-col ">
      <Link href={`/listings/${vehicle.slug}`} className="block relative">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={imageUrl}
            alt={displayTitle}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Vehicle Name */}
          <Link href={`/listings/${vehicle.slug}`}>
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 transition-colors">
              {displayTitle}
            </h3>
          </Link>

          {/* Seats */}
          {vehicle.seats && (
            <div className="flex items-center gap-1 text-sm ">
              <Users className="h-4 w-4" />
              <span>{vehicle.seats} Seats</span>
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-1 text-sm ">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{locationText}</span>
          </div>

          {/* Pricing */}
          <div className="mb-4 space-y-3">
            {vehicle.priceWithinCity && (
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <SVGIcon
                    src="/icons/price.svg"
                    className="h-4 w-4 text-foreground hover:text-foreground"
                  />
                  <span className="">Within City:</span>
                </div>
                <span className="font-semibold ">
                  {formatPrice(vehicle.priceWithinCity)}
                </span>
              </div>
            )}
            {vehicle.priceSelfDrive && (
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <SVGIcon
                    src="/icons/price.svg"
                    className="h-4 w-4 text-foreground hover:text-foreground"
                  />
                  <span className="">Self Drive:</span>
                </div>
                <span className="font-semibold ">
                  {formatPrice(vehicle.priceSelfDrive)}
                </span>
              </div>
            )}
            {vehicle.priceOutOfCity && (
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <SVGIcon
                    src="/icons/price.svg"
                    className="h-4 w-4 text-foreground hover:text-foreground"
                  />
                  <span className="">Out of City:</span>
                </div>
                <span className="font-semibold ">
                  {formatPrice(vehicle.priceOutOfCity)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-1">
          <Button
            asChild
            className="w-full text-foreground bg-[#004fd6]/5 border border-[#004fd6]/50 hover:border-[#004fd6] hover:bg-[#004fd6]/15 rounded-none h-11"
          >
            <Link
              href={telHref}
              className="flex items-center justify-center gap-2"
              onClick={handleCallClick}
            >
              <SVGIcon
                src="/icons/phone.svg"
                className="h-5 w-5 text-[#004fd6]"
              />
            </Link>
          </Button>
          <Button
            asChild
            className="w-full text-foreground bg-[#67C15E]/5 border border-[#67C15E]/50 hover:border-[#67C15E] hover:bg-[#67C15E]/20 rounded-none h-11"
          >
            <Link
              href={finalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
              onClick={handleWhatsAppClick}
            >
              <SVGIcon
                src="/icons/whatsapp.svg"
                className="h-5 w-5 text-[#67C15E]"
              />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
