import { prisma } from "@/lib/prisma";
import { VendorOnboardingForm } from "@/components/vendor-onboarding/vendor-onboarding-form";

export const metadata = {
  title: "List Your Car | RentNowPK",
  description: "List your car for rent without signing up.",
};

export default async function ListACarPage() {
  const brands = await prisma.vehicleBrand.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const types = await prisma.vehicleType.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const cities = await prisma.city.findMany({
    where: { isActive: true },
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  // Pass undefined for vendor since it's a new listing
  return <VendorOnboardingForm brands={brands} types={types} cities={cities} />;
}
