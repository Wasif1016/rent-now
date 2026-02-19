interface VehicleForSchema {
  title: string;
  description?: string | null;
  images: any;
  priceDaily?: number | null;
  priceWithinCity?: number | null;
  priceSelfDrive?: number | null;
  priceWithDriver?: number | null;
  vendor: {
    name: string;
  };
}

export function ListingSchema({ vehicle }: { vehicle: VehicleForSchema }) {
  const price =
    vehicle.priceDaily ||
    vehicle.priceWithinCity ||
    vehicle.priceSelfDrive ||
    vehicle.priceWithDriver;

  if (!price) return null;

  const images = Array.isArray(vehicle.images)
    ? (vehicle.images as string[])
    : [];
  const image =
    images[0] ||
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: vehicle.title,
    description: vehicle.description || vehicle.title,
    image: image,
    offers: {
      "@type": "Offer",
      price: price.toString(),
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: vehicle.vendor?.name || "RentNowPK",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
