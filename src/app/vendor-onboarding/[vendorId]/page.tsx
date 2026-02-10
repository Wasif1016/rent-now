import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VendorOnboardingForm } from "@/components/vendor-onboarding/vendor-onboarding-form";

export const metadata = {
  title: "Vendor Onboarding | RentNowPK",
  description: "Complete your vendor profile and list your vehicles.",
};

export default async function VendorOnboardingPage({
  params,
}: {
  params: Promise<{ vendorId: string }>;
}) {
  const { vendorId } = await params;

  if (!vendorId) {
    notFound();
  }

  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      whatsappPhone: true,
      address: true,
      cityId: true,
      town: true,
    },
  });

  if (!vendor) {
    notFound();
  }

  const brands = await prisma.vehicleBrand.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const types = await prisma.vehicleType.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return <VendorOnboardingForm vendor={vendor} brands={brands} types={types} />;
}
