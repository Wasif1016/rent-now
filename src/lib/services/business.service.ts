import { prisma } from "@/lib/prisma";
import { RegistrationStatus } from "@prisma/client";

interface GetBusinessesParams {
  page?: number;
  limit?: number;
  status?: RegistrationStatus;
  city?: string;
  province?: string;
  search?: string;
  minVehicles?: number;
  maxVehicles?: number;
}

interface BusinessListResult {
  businesses: any[];
  total: number;
  totalPages: number;
  page: number;
}

/**
 * Get businesses (vendors) with filters and pagination
 */
export async function getBusinesses(
  params: GetBusinessesParams = {}
): Promise<BusinessListResult> {
  const {
    page = 1,
    limit = 20,
    status,
    city,
    province,
    search,
    minVehicles,
    maxVehicles,
  } = params;

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};

  if (status) {
    where.registrationStatus = status;
  }

  if (city) {
    where.cityId = city;
  }

  if (province) {
    where.province = { contains: province, mode: "insensitive" };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  // Add vehicle count filtering
  if (minVehicles !== undefined || maxVehicles !== undefined) {
    where.vehicles = {};
    // We'll filter after fetching since Prisma doesn't support count filtering in where clause
  }

  // If filtering by vehicle count, we need to fetch all matching records first
  // because Prisma doesn't support filtering by relation count in where clause easily
  const isVehicleFilterActive =
    minVehicles !== undefined || maxVehicles !== undefined;

  const [allBusinesses, totalCount] = await Promise.all([
    prisma.vendor.findMany({
      where,
      skip: isVehicleFilterActive ? undefined : skip,
      take: isVehicleFilterActive ? undefined : limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        city: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            vehicles: true,
            bookings: true,
          },
        },
      },
    }),
    prisma.vendor.count({ where }),
  ]);

  let businesses = allBusinesses;
  let finalTotal = totalCount;

  // Filter by vehicle count if specified
  if (isVehicleFilterActive) {
    businesses = allBusinesses.filter((business) => {
      const vehicleCount = business._count.vehicles;
      if (minVehicles !== undefined && vehicleCount < minVehicles) return false;
      if (maxVehicles !== undefined && vehicleCount > maxVehicles) return false;
      return true;
    });

    finalTotal = businesses.length;

    // Apply pagination manually
    const startIndex = (page - 1) * limit;
    businesses = businesses.slice(startIndex, startIndex + limit);
  }

  return {
    businesses,
    total: finalTotal,
    totalPages: Math.ceil(finalTotal / limit),
    page,
  };
}

/**
 * Get business by ID
 */
export async function getBusinessById(id: string) {
  return await prisma.vendor.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          vehicles: true,
          bookings: true,
          vendorRouteOffers: true,
        },
      },
      vehicles: {
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          city: true,
          vehicleType: true,
        },
      },
    },
  });
}

/**
 * Update business
 */
export async function updateBusiness(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    personName?: string;
    whatsappPhone?: string;
    address?: string;
    description?: string;
    town?: string;
    province?: string;
    googleMapsUrl?: string;
    isActive?: boolean;
  }
) {
  return await prisma.vendor.update({
    where: { id },
    data,
  });
}

/**
 * Suspend business
 */
export async function suspendBusiness(id: string) {
  return await prisma.vendor.update({
    where: { id },
    data: {
      isActive: false,
      registrationStatus: "SUSPENDED",
    },
  });
}

/**
 * Activate business
 */
export async function activateBusiness(id: string) {
  return await prisma.vendor.update({
    where: { id },
    data: {
      isActive: true,
      registrationStatus: "ACTIVE",
    },
  });
}
