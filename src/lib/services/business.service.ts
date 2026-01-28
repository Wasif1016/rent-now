import { prisma } from '@/lib/prisma'
import { RegistrationStatus } from '@prisma/client'

interface GetBusinessesParams {
  page?: number
  limit?: number
  status?: RegistrationStatus
  city?: string
  province?: string
  search?: string
}

interface BusinessListResult {
  businesses: any[]
  total: number
  totalPages: number
  page: number
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
  } = params

  const skip = (page - 1) * limit

  // Build where clause
  const where: any = {}

  if (status) {
    where.registrationStatus = status
  }

  if (city) {
    // Note: This assumes city is stored as a string in vendor metadata or we need to join with City
    // For now, we'll search in the address or metadata
    where.OR = [
      { address: { contains: city, mode: 'insensitive' } },
      { metadata: { path: ['city'], equals: city } },
    ]
  }

  if (province) {
    where.province = { contains: province, mode: 'insensitive' }
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [businesses, total] = await Promise.all([
    prisma.vendor.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            vehicles: true,
            bookings: true,
          },
        },
      },
    }),
    prisma.vendor.count({ where }),
  ])

  return {
    businesses,
    total,
    totalPages: Math.ceil(total / limit),
    page,
  }
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
          routes: true,
        },
      },
      vehicles: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          city: true,
          vehicleType: true,
        },
      },
    },
  })
}

/**
 * Update business
 */
export async function updateBusiness(
  id: string,
  data: {
    name?: string
    email?: string
    phone?: string
    personName?: string
    whatsappPhone?: string
    address?: string
    description?: string
    town?: string
    province?: string
    googleMapsUrl?: string
    isActive?: boolean
  }
) {
  return await prisma.vendor.update({
    where: { id },
    data,
  })
}

/**
 * Suspend business
 */
export async function suspendBusiness(id: string) {
  return await prisma.vendor.update({
    where: { id },
    data: {
      isActive: false,
      registrationStatus: 'SUSPENDED',
    },
  })
}

/**
 * Activate business
 */
export async function activateBusiness(id: string) {
  return await prisma.vendor.update({
    where: { id },
    data: {
      isActive: true,
      registrationStatus: 'ACTIVE',
    },
  })
}

