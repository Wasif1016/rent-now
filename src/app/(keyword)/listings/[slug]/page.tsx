import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { getVehicleBySlug } from "@/lib/data";
import { getVehicleDisplayTitle } from "@/lib/vehicle-utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  Users,
  Gauge,
  Fuel,
  MapPin,
  Calendar,
  Phone,
  MessageCircle,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString()}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    return {
      title: "Vehicle Not Found",
    };
  }

  const displayTitle = getVehicleDisplayTitle(vehicle);
  const images = Array.isArray(vehicle.images)
    ? (vehicle.images as string[])
    : [];
  const mainImage =
    images[0] ||
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop";

  const description = vehicle.description
    ? vehicle.description.slice(0, 160)
    : `Rent ${displayTitle} in ${vehicle.city.name}. Reliable car rental service with RentNowPK.`;

  return {
    title: `${displayTitle} for Rent | ${vehicle.city.name}`, // No need to append | RentNowPK as layout does it
    description,
    openGraph: {
      title: `${displayTitle} for Rent | ${vehicle.city.name}`,
      description,
      images: [mainImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayTitle} for Rent | ${vehicle.city.name}`,
      description,
      images: [mainImage],
    },
  };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const displayTitle = getVehicleDisplayTitle(vehicle);
  const images = Array.isArray(vehicle.images)
    ? (vehicle.images as string[])
    : [];
  const mainImage =
    images[0] ||
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop";
  const otherImages = images.slice(1);

  const location = vehicle.town
    ? `${vehicle.town.name}, ${vehicle.city.name}`
    : vehicle.city.name;

  const capacity = vehicle.seatingCapacity ?? vehicle.seats;

  // Use vendor phone/whatsapp with env fallback
  const vendorPhone =
    vehicle.vendor.phone ||
    vehicle.vendor.whatsappPhone ||
    process.env.NEXT_PUBLIC_DEFAULT_VENDOR_PHONE ||
    "923001234567";
  const vendorWhatsApp =
    vehicle.vendor.whatsappPhone ||
    vehicle.vendor.phone ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    vendorPhone;
  const cleanPhone = vendorPhone.replace(/\D/g, "");
  const cleanWhatsApp = vendorWhatsApp.replace(/\D/g, "");
  const telHref = `tel:+${cleanPhone}`;

  const vehicleName = displayTitle;
  const message = `Hi, I'm interested in booking ${vehicleName} in ${location}. Please confirm availability.`;
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    message
  )}`;

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: vehicle.city.name, url: `/rent-a-car/${vehicle.city.slug}` },
    { name: displayTitle, url: `/listings/${vehicle.slug}` },
  ];

  const hasAnyPrice =
    vehicle.priceWithDriver != null ||
    vehicle.priceSelfDrive != null ||
    vehicle.priceDaily != null ||
    vehicle.priceHourly != null ||
    vehicle.priceMonthly != null ||
    vehicle.priceWithinCity != null ||
    vehicle.priceOutOfCity != null;

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Top padding so content is not hidden under fixed header */}
      <div className="pt-24 pb-8 md:pt-28 md:pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />

          <div className="mt-4 md:mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <Card className="overflow-hidden border-0 shadow-md">
                <div className="relative aspect-video bg-zinc-200">
                  <Image
                    src={mainImage}
                    alt={displayTitle}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />

                  <div className="absolute bottom-2 left-2">
                    <p className="text-sm text-white">{vehicle.title}</p>
                  </div>
                </div>
                {otherImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 sm:p-4">
                    {otherImages.slice(0, 4).map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-video bg-zinc-100 rounded-md overflow-hidden"
                      >
                        <Image
                          src={img}
                          alt={`${displayTitle} ${idx + 2}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-4 sm:p-6 border-0 shadow-md bg-white">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1a2332] mb-1">
                      {displayTitle}
                    </h1>
                    {vehicle.vehicleModel && vehicle.title !== displayTitle && (
                      <p className="text-sm text-muted-foreground">
                        {vehicle.title}
                      </p>
                    )}
                  </div>
                  {vehicle.vendor.verificationStatus === "VERIFIED" && (
                    <div className="flex items-center gap-2 text-primary shrink-0">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  )}
                </div>

                {vehicle.description && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-[#1a2332] mb-2">
                      Description
                    </h2>
                    <p className="text-muted-foreground whitespace-pre-line text-sm sm:text-base">
                      {vehicle.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {capacity != null && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[#f5f5f5]">
                      <Users className="h-5 w-5 text-[#1a2332]" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Capacity
                        </p>
                        <p className="font-semibold text-[#1a2332]">
                          {capacity} Passengers
                        </p>
                      </div>
                    </div>
                  )}
                  {vehicle.year && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[#f5f5f5]">
                      <Calendar className="h-5 w-5 text-[#1a2332]" />
                      <div>
                        <p className="text-xs text-muted-foreground">Year</p>
                        <p className="font-semibold text-[#1a2332]">
                          {vehicle.year}
                        </p>
                      </div>
                    </div>
                  )}
                  {vehicle.mileage != null && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[#f5f5f5]">
                      <Gauge className="h-5 w-5 text-[#1a2332]" />
                      <div>
                        <p className="text-xs text-muted-foreground">Mileage</p>
                        <p className="font-semibold text-[#1a2332]">
                          {vehicle.mileage.toLocaleString()} km
                        </p>
                      </div>
                    </div>
                  )}
                  {vehicle.fuelType && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[#f5f5f5]">
                      <Fuel className="h-5 w-5 text-[#1a2332]" />
                      <div>
                        <p className="text-xs text-muted-foreground">Fuel</p>
                        <p className="font-semibold text-[#1a2332]">
                          {vehicle.fuelType}
                        </p>
                      </div>
                    </div>
                  )}
                  {vehicle.transmission && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[#f5f5f5]">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Transmission
                        </p>
                        <p className="font-semibold text-[#1a2332]">
                          {vehicle.transmission}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {vehicle.features &&
                  Array.isArray(vehicle.features) &&
                  (vehicle.features as string[]).length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-base font-semibold text-[#1a2332] mb-2">
                        Features
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(vehicle.features as string[]).map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-[#1a2332]/5 text-[#1a2332] rounded-full text-sm font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5 shrink-0" />
                  <span className="text-sm">{location}</span>
                </div>
              </Card>
            </div>

            {/* Sidebar: pricing + CTA */}
            <div className="lg:col-span-1">
              <Card className="p-4 sm:p-6 border-0 shadow-md bg-white sticky top-24">
                <h2 className="text-xl font-bold text-[#1a2332] mb-4">
                  Quick Booking
                </h2>

                {hasAnyPrice && (
                  <div className="mb-6 space-y-3">
                    {vehicle.priceWithinCity != null && (
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="text-sm text-muted-foreground">
                          Within City (With Driver)
                        </span>
                        <span className="font-bold text-[#1a2332]">
                          {formatPrice(vehicle.priceWithinCity)}/day
                        </span>
                      </div>
                    )}
                    {vehicle.priceSelfDrive != null && (
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="text-sm text-muted-foreground">
                          Within City (Self Drive)
                        </span>
                        <span className="font-bold text-[#1a2332]">
                          {formatPrice(vehicle.priceSelfDrive)}/day
                        </span>
                      </div>
                    )}
                    {vehicle.priceOutOfCity != null && (
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="text-sm text-muted-foreground">
                          Out of City (With Driver)
                        </span>
                        <span className="font-bold text-[#1a2332]">
                          {formatPrice(vehicle.priceOutOfCity)}/day
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-primary text-black hover:bg-black hover:text-white font-semibold h-12 rounded-lg shadow-md"
                  >
                    <a
                      href={telHref}
                      className="flex items-center justify-center gap-2"
                    >
                      <Phone className="h-5 w-5" />
                      Call for Quick Booking
                    </a>
                  </Button>
                  <Button
                    asChild
                    className="w-full text-white bg-black hover:bg-primary hover:text-black font-semibold h-12 rounded-lg shadow-md"
                  >
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-5 w-5" />
                      WhatsApp Now
                    </a>
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-muted-foreground mb-1">Vendor</p>
                  <p className="font-semibold text-[#1a2332]">
                    {vehicle.vendor.name}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
