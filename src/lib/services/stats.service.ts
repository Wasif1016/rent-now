import { prisma } from '@/lib/prisma'
import { RegistrationStatus } from '@prisma/client'

export async function getAdminStats() {
  const [
    totalBusinesses,
    notRegisteredCount,
    accountCreatedCount,
    emailSentCount,
    activeCount,
    suspendedCount,
    activeVendors,
    totalVehicles,
    vehiclesByCity,
    totalRoutes,
    citiesCovered,
    vendorsWithoutVehicles,
    recentBusinesses,
  ] = await Promise.all([
    // Total businesses
    prisma.vendor.count(),

    // Businesses by status - using individual counts instead of groupBy
    prisma.vendor.count({
      where: { registrationStatus: 'NOT_REGISTERED' },
    }),
    prisma.vendor.count({
      where: { registrationStatus: 'ACCOUNT_CREATED' },
    }),
    prisma.vendor.count({
      where: { registrationStatus: 'EMAIL_SENT' },
    }),
    prisma.vendor.count({
      where: { registrationStatus: 'ACTIVE' },
    }),
    prisma.vendor.count({
      where: { registrationStatus: 'SUSPENDED' },
    }),

    // Active vendors
    prisma.vendor.count({
      where: {
        isActive: true,
        registrationStatus: 'ACTIVE',
      },
    }),

    // Total vehicles
    prisma.vehicle.count({
      where: {
        status: 'PUBLISHED',
        isAvailable: true,
      },
    }),

    // Vehicles by city (top 10)
    prisma.vehicle.groupBy({
      by: ['cityId'],
      where: {
        status: 'PUBLISHED',
        isAvailable: true,
      },
      _count: {
        _all: true,
      },
    }).then((results) => {
      // Sort by count descending and take top 10
      return results
        .sort((a, b) => (b._count._all || 0) - (a._count._all || 0))
        .slice(0, 10)
    }),

    // Total routes
    prisma.vendorRouteOffer.count({
      where: {
        isActive: true,
      },
    }),

    // Cities covered
    prisma.city.count({
      where: {
        vehicles: {
          some: {
            status: 'PUBLISHED',
            isAvailable: true,
          },
        },
      },
    }),

    // Vendors without vehicles
    prisma.vendor.findMany({
      where: {
        vehicles: {
          none: {},
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      take: 10,
    }),

    // Recently added businesses (last 7 days)
    prisma.vendor.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        registrationStatus: true,
        createdAt: true,
      },
    }),
  ])

  // Get city names for vehicles by city
  const cityIds = vehiclesByCity.map((v) => v.cityId)
  const cities = await prisma.city.findMany({
    where: {
      id: {
        in: cityIds,
      },
    },
    select: {
      id: true,
      name: true,
    },
  })

  const vehiclesByCityWithNames = vehiclesByCity.map((v) => {
    const city = cities.find((c) => c.id === v.cityId)
    return {
      cityName: city?.name || 'Unknown',
      count: v._count._all || 0,
    }
  })

  // Find cities with low supply (< 5 vehicles)
  const lowSupplyCities = await prisma.city.findMany({
    where: {
      vehicles: {
        some: {
          status: 'PUBLISHED',
          isAvailable: true,
        },
      },
    },
    include: {
      _count: {
        select: {
          vehicles: {
            where: {
              status: 'PUBLISHED',
              isAvailable: true,
            },
          },
        },
      },
    },
  })

  const lowSupply = lowSupplyCities
    .filter((c) => c._count.vehicles < 5)
    .map((c) => ({
      name: c.name,
      count: c._count.vehicles,
    }))

  // Format businesses by status
  const statusBreakdown: Record<string, number> = {
    NOT_REGISTERED: notRegisteredCount,
    ACCOUNT_CREATED: accountCreatedCount,
    EMAIL_SENT: emailSentCount,
    ACTIVE: activeCount,
    SUSPENDED: suspendedCount,
  }

  return {
    totalBusinesses,
    businessesByStatus: statusBreakdown,
    activeVendors,
    totalVehicles,
    vehiclesByCity: vehiclesByCityWithNames,
    totalRoutes,
    citiesCovered,
    vendorsWithoutVehicles,
    lowSupplyCities: lowSupply,
    recentBusinesses,
  }
}

