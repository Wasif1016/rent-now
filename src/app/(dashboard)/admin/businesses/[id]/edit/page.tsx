import { notFound } from "next/navigation";
import { getBusinessById } from "@/lib/services/business.service";
import { EditBusinessForm } from "@/components/admin/edit-business-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBusinessPage({ params }: PageProps) {
  const { id } = await params;
  const business = await getBusinessById(id);

  if (!business) {
    notFound();
  }

  return <EditBusinessForm business={business} />;
}
