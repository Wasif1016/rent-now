import { prisma, cache } from './prisma'

// Cached functions for per-request deduplication
export const getCitiesWithVehicles = cache(async () => {
  // First check if we have any vehicles at all
  const hasVehicles = await prisma.vehicle.count({
    where: { isAvailable: true },
  }) > 0

  if (hasVehicles) {
    // Only show cities that have available vehicles
    return await prisma.city.findMany({
      where: {
        isActive: true,
        vehicles: {
          some: {
            isAvailable: true,
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        province: true,
      },
      orderBy: {
        name: 'asc',
      },
    })
  }

  // If no vehicles exist yet, show all active cities
  return await prisma.city.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      province: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
})

// Get city by slug with vehicle count
export const getCityBySlug = cache(async (slug: string) => {
  const city = await prisma.city.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      province: true,
      isActive: true,
      _count: {
        select: {
          vehicles: {
            where: {
              isAvailable: true,
            },
          },
        },
      },
    },
  })

  return city
})

// Get town by slug
export const getTownBySlug = cache(async (slug: string, cityId?: string) => {
  const where: any = { slug }
  if (cityId) {
    where.cityId = cityId
  }

  const town = await prisma.town.findFirst({
    where,
    select: {
      id: true,
      name: true,
      slug: true,
      cityId: true,
      isActive: true,
      city: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          vehicles: {
            where: {
              isAvailable: true,
            },
          },
        },
      },
    },
  })

  return town
})

// Get towns by city
export const getTownsByCity = cache(async (cityId: string) => {
  return await prisma.town.findMany({
    where: {
      cityId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      cityId: true,
      _count: {
        select: {
          vehicles: {
            where: {
              isAvailable: true,
            },
          },
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })
})

// Search vehicles with filters
export const searchVehicles = cache(async (filters: {
  citySlug?: string
  townSlug?: string
  brandSlug?: string
  fuelType?: string
  transmission?: string
  sortBy?: 'date' | 'popularity'
  page?: number
  limit?: number
}) => {
  const {
    citySlug,
    townSlug,
    brandSlug,
    fuelType,
    transmission,
    sortBy = 'popularity',
    page = 1,
    limit = 12,
  } = filters

  const skip = (page - 1) * limit

  // Build where clause
  const where: any = {
    isAvailable: true,
  }

  // Filter by city
  if (citySlug) {
    where.city = {
      slug: citySlug,
    }
  }

  // Filter by town (if specified)
  if (townSlug) {
    where.town = {
      slug: townSlug,
    }
  }

  // Filter by brand (if specified)
  if (brandSlug) {
    where.vehicleModel = {
      vehicleBrand: {
        slug: brandSlug,
      },
    }
  }

  if (fuelType) {
    where.fuelType = fuelType
  }

  if (transmission) {
    where.transmission = transmission
  }

  // Build orderBy
  let orderBy: any = {}
  if (sortBy === 'date') {
    orderBy = { createdAt: 'desc' }
  } else {
    orderBy = { views: 'desc' }
  }

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        year: true,
        mileage: true,
        fuelType: true,
        transmission: true,
        seats: true,
        color: true,
        features: true,
        images: true,
        views: true,
        featured: true,
        city: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        town: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        vendor: {
          select: {
            id: true,
            name: true,
            slug: true,
            verificationStatus: true,
          },
        },
        vehicleModel: {
          select: {
            name: true,
            vehicleBrand: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.vehicle.count({ where }),
  ])

  return {
    vehicles,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
})

// Get all cities for static generation
export const getAllCitiesForStatic = cache(async () => {
  return await prisma.city.findMany({
    where: {
      isActive: true,
    },
    select: {
      slug: true,
    },
  })
})

// Get all towns for static generation (optional, for town-specific pages)
export const getAllTownsForStatic = cache(async () => {
  return await prisma.town.findMany({
    where: {
      isActive: true,
    },
    select: {
      slug: true,
      city: {
        select: {
          slug: true,
        },
      },
    },
  })
})

// Get vehicle brands with vehicles
export const getVehicleBrandsWithVehicles = cache(async () => {
  // First check if we have any vehicles at all
  const hasVehicles = await prisma.vehicle.count({
    where: { isAvailable: true },
  }) > 0

  if (hasVehicles) {
    // Only show brands that have available vehicles
    return await prisma.vehicleBrand.findMany({
      where: {
        isActive: true,
        vehicleModels: {
          some: {
            vehicles: {
              some: {
                isAvailable: true,
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: 'asc',
      },
    })
  }

  // If no vehicles exist yet, show all active brands
  return await prisma.vehicleBrand.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
})
