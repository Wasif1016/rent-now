import { prisma, cache } from './prisma'

/** All active cities (for hero dropdown, cities page, API). */
export const getCities = cache(async () => {
  return await prisma.city.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      province: true,
    },
    orderBy: { name: 'asc' },
  })
})

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

// Aggregate city stats (vehicles, vendors, routes) by slug
export const getCityStatsBySlug = cache(async (slug: string) => {
  const city = await getCityBySlug(slug)

  if (!city) {
    return null
  }

  const [vendorsCount, routesCount] = await Promise.all([
    prisma.vendor.count({
      where: {
        isActive: true,
        vehicles: {
          some: {
            isAvailable: true,
            city: {
              slug,
            },
          },
        },
      },
    }),
    prisma.vendorRouteOffer.count({
      where: {
        isActive: true,
        fromCity: {
          slug,
        },
      },
    }),
  ])

  return {
    city,
    vehiclesCount: city._count.vehicles,
    vendorsCount,
    routesCount,
  }
})

// Limited vendor list for a city
export const getCityVendors = cache(async (slug: string, limit: number = 6) => {
  const vendors = await prisma.vendor.findMany({
    where: {
      isActive: true,
      vehicles: {
        some: {
          isAvailable: true,
          city: {
            slug,
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      verificationStatus: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })

  return vendors
})

// Intercity routes starting from a given city
export const getCityRoutes = cache(async (slug: string, limit: number = 6) => {
  const routes = await prisma.vendorRouteOffer.findMany({
    where: {
      isActive: true,
      fromCity: {
        slug,
      },
    },
    select: {
      id: true,
      fromCity: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      toCity: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })

  return routes
})

// ============================================
// SEO Route (new Route model) – slug-based, many vehicles per route
// ============================================

const routeIncludeWithVehicles = {
  originCity: {
    select: { id: true, name: true, slug: true },
  },
  destinationCity: {
    select: { id: true, name: true, slug: true },
  },
  routeType: {
    select: { id: true, name: true, slug: true },
  },
  routeCategory: {
    select: { id: true, name: true, slug: true },
  },
  vehicles: {
    select: {
      vehicle: {
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          seats: true,
          seatingCapacity: true,
          driverOption: true,
          images: true,
          priceDaily: true,
          priceWithDriver: true,
          priceSelfDrive: true,
          priceOutOfCity: true,
          priceWithinCity: true,
          category: {
            select: { id: true, name: true, slug: true },
          },
          vehicleModel: {
            select: {
              id: true,
              name: true,
              slug: true,
              vehicleBrand: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      },
    },
  },
} as const

export const getRouteBySlug = cache(async (slug: string) => {
  const route = await prisma.route.findUnique({
    where: { slug },
    include: routeIncludeWithVehicles,
  })
  if (!route) return null
  return {
    ...route,
    vehicles: route.vehicles.map((vr) => vr.vehicle).filter((v) => v != null),
  }
})

export const getRoutesByCity = cache(async (citySlug: string, limit: number = 12) => {
  const routes = await prisma.route.findMany({
    where: {
      OR: [
        { originCity: { slug: citySlug } },
        { destinationCity: { slug: citySlug } },
      ],
    },
    include: routeIncludeWithVehicles,
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
  return routes.map((r) => ({
    ...r,
    vehicles: r.vehicles.map((vr) => vr.vehicle).filter((v) => v != null),
  }))
})

export const getRoutesByCities = cache(async (originSlug: string, destinationSlug: string) => {
  const route = await prisma.route.findFirst({
    where: {
      originCity: { slug: originSlug },
      destinationCity: { slug: destinationSlug },
    },
    include: routeIncludeWithVehicles,
  })
  if (!route) return null
  return {
    ...route,
    vehicles: route.vehicles.map((vr) => vr.vehicle).filter((v) => v != null),
  }
})

export const getRoutesForSitemap = cache(async () => {
  const routes = await prisma.route.findMany({
    where: {
      vehicles: {
        some: {},
      },
    },
    select: {
      slug: true,
      originCity: { select: { slug: true } },
      destinationCity: { select: { slug: true } },
    },
  })
  return routes
})

/** All routes (with or without vehicles) for routes index page, grouped by origin city. */
export const getRoutesListGroupedByOrigin = cache(async () => {
  const routes = await prisma.route.findMany({
    select: {
      slug: true,
      originCity: { select: { id: true, name: true, slug: true } },
      destinationCity: { select: { id: true, name: true, slug: true } },
    },
    orderBy: [{ originCity: { name: 'asc' } }, { destinationCity: { name: 'asc' } }],
  })
  const grouped = new Map<string, typeof routes>()
  for (const r of routes) {
    const key = r.originCity.name
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(r)
  }
  return { routes: Object.fromEntries(grouped), sortedCities: Array.from(grouped.keys()).sort() }
})

export const getVehiclesByRoute = cache(async (routeId: number) => {
  const rows = await prisma.vehicleRoute.findMany({
    where: { routeId },
    select: {
      vehicle: {
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          seats: true,
          seatingCapacity: true,
          driverOption: true,
          images: true,
          priceDaily: true,
          priceWithDriver: true,
          priceSelfDrive: true,
          priceOutOfCity: true,
          priceWithinCity: true,
          category: {
            select: { id: true, name: true, slug: true },
          },
          vehicleModel: {
            select: {
              id: true,
              name: true,
              slug: true,
              vehicleBrand: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      },
    },
  })
  return rows.map((r) => r.vehicle).filter((v) => v != null)
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
  vehicleSlug?: string
  modelSlug?: string
  vehicleTypeSlug?: string
  categorySlug?: string
  categoryId?: string
  typeId?: string
  driverOption?: 'WITH_DRIVER' | 'WITHOUT_DRIVER' | 'BOTH'
  seatingCapacity?: number
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
    vehicleSlug,
    modelSlug,
    vehicleTypeSlug,
    categorySlug,
    categoryId,
    typeId,
    driverOption,
    seatingCapacity,
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
      ...(typeof where.vehicleModel === 'object' ? where.vehicleModel : {}),
      vehicleBrand: {
        slug: brandSlug,
      },
    }
  }

  // Filter by model slug (VehicleModel.slug, e.g. toyota-corolla) or listing slug
  const slugFilter = modelSlug ?? vehicleSlug
  if (slugFilter) {
    const modelBranch: any = {
      vehicleModel: {
        slug: slugFilter,
        ...(brandSlug ? { vehicleBrand: { slug: brandSlug } } : {}),
      },
    }
    where.OR = [modelBranch, { slug: slugFilter }]
  }

  // Filter by vehicle type (if specified)
  if (vehicleTypeSlug) {
    where.vehicleType = {
      slug: vehicleTypeSlug,
    }
  }

  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    }
  }
  if (categoryId) {
    where.categoryId = categoryId
  }
  if (typeId) {
    where.vehicleTypeId = typeId
  }
  if (driverOption) {
    where.driverOption = driverOption
  }
  if (seatingCapacity != null) {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      {
        OR: [
          { seatingCapacity },
          { seats: seatingCapacity },
        ],
      },
    ]
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
            phone: true,
            whatsappPhone: true,
          },
        },
        priceWithinCity: true,
        priceOutOfCity: true,
        priceDaily: true,
        priceHourly: true,
        priceMonthly: true,
        priceWithDriver: true,
        priceSelfDrive: true,
        seatingCapacity: true,
        driverOption: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        vehicleType: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        vehicleModel: {
          select: {
            id: true,
            name: true,
            slug: true,
            vehicleBrand: {
              select: {
                id: true,
                name: true,
                slug: true,
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

// Vehicle taxonomy: categories
// Use raw queries so this works even when PrismaClient was cached before VehicleCategory existed (restart dev server after: bunx prisma generate)
type VehicleCategoryRow = { id: string; name: string; slug: string }

export const getVehicleCategoryBySlug = cache(async (slug: string) => {
  const rows = await prisma.$queryRaw<VehicleCategoryRow[]>`
    SELECT id, name, slug FROM "VehicleCategory" WHERE slug = ${slug} LIMIT 1
  `
  return rows[0] ?? null
})

export const getVehicleCategories = cache(async () => {
  return await prisma.$queryRaw<VehicleCategoryRow[]>`
    SELECT id, name, slug FROM "VehicleCategory" ORDER BY name ASC
  `
})

export const getCategorySlugs = cache(async () => {
  const rows = await prisma.$queryRaw<{ slug: string }[]>`SELECT slug FROM "VehicleCategory"`
  return rows.map((r: { slug: string }) => r.slug)
})

// Vehicle taxonomy: types by category
export const getVehicleTypesByCategoryId = cache(async (categoryId: string) => {
  return await prisma.vehicleType.findMany({
    where: { categoryId, isActive: true },
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' },
  })
})

export const getVehicleTypesByCategorySlug = cache(async (categorySlug: string) => {
  return await prisma.vehicleType.findMany({
    where: { category: { slug: categorySlug }, isActive: true },
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' },
  })
})

// Vehicle model by globally unique slug (e.g. toyota-corolla)
export const getVehicleModelBySlug = cache(async (slug: string) => {
  return await prisma.vehicleModel.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      capacity: true,
      vehicleBrandId: true,
      vehicleTypeId: true,
      vehicleBrand: {
        select: { id: true, name: true, slug: true },
      },
      vehicleType: {
        select: { id: true, name: true, slug: true },
      },
    },
  })
})

export const getModelSlugs = cache(async () => {
  const rows = await prisma.vehicleModel.findMany({
    where: { isActive: true },
    select: { slug: true },
  })
  return rows.map((r) => r.slug)
})

// Keyword (SeoDimension type=keyword) for dynamic SEO URLs
export const getKeywordBySlug = cache(async (slug: string) => {
  return await prisma.seoDimension.findUnique({
    where: {
      slug_type: { slug, type: 'keyword' },
    },
    select: {
      id: true,
      slug: true,
      type: true,
      basePattern: true,
      defaultH1Template: true,
      defaultTitleTemplate: true,
      defaultMetaDescriptionTemplate: true,
    },
  })
})

export const getKeywordSlugs = cache(async () => {
  const rows = await prisma.seoDimension.findMany({
    where: { type: 'keyword' },
    select: { slug: true },
  })
  return rows.map((r) => r.slug)
})

// Get all cities for sitemap (id + slug)
export const getCitiesForSitemap = cache(async () => {
  return await prisma.city.findMany({
    where: { isActive: true },
    select: { id: true, slug: true },
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

// Get all vehicle types
export const getVehicleTypes = cache(async () => {
  return await prisma.vehicleModel.findMany({
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

// Get vehicle types with vehicles (from VehicleType table)
export const getVehicleTypesWithVehicles = cache(async () => {
  // First check if we have any vehicles at all
  const hasVehicles = await prisma.vehicle.count({
    where: { isAvailable: true },
  }) > 0

  if (hasVehicles) {
    // Only show vehicle types that have available vehicles
    return await prisma.vehicleType.findMany({
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
      },
      orderBy: {
        name: 'asc',
      },
    })
  }

  // If no vehicles exist yet, show all active vehicle types
  return await prisma.vehicleType.findMany({
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

// Get popular cities for homepage (cities with most vehicles)
export const getPopularCities = cache(async (limit: number = 8) => {
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
      vehicles: {
        _count: 'desc',
      },
    },
    take: limit,
  })
})

// Get all cities with vehicle counts for cities directory page
export const getAllCitiesWithCounts = cache(async () => {
  return await prisma.city.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      province: true,
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

/**
 * Vehicle filters helper
 *
 * Returns a unified list of vehicle options for dropdowns and filters:
 * - All active predefined vehicle models
 * - All custom vehicles (without a vehicleModel), mapped as \"Custom\" brand entries
 */
export const getVehicleFilters = cache(async () => {
  // 1) Start with all active vehicle models (predefined)
  const models = await prisma.vehicleModel.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      vehicleBrand: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: [
      {
        vehicleBrand: {
          name: 'asc',
        },
      },
      {
        name: 'asc',
      },
    ],
  })

  // 2) Fetch all available vehicles to capture custom ones
  const vehicles = await prisma.vehicle.findMany({
    where: {
      isAvailable: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      vehicleModel: {
        select: {
          id: true,
        },
      },
    },
  })

  // 3) Build a map of filter options
  const filterMap = new Map<string, {
    id: string
    name: string
    slug: string
    brand: {
      id: string
      name: string
      slug: string
    }
  }>()

  // Add predefined models
  for (const model of models) {
    const key = `model-${model.id}`
    if (!filterMap.has(key)) {
      filterMap.set(key, {
        id: model.id,
        name: model.name,
        slug: model.slug,
        brand: {
          id: model.vehicleBrand.id,
          name: model.vehicleBrand.name,
          slug: model.vehicleBrand.slug,
        },
      })
    }
  }

  // Add custom vehicles (those without a vehicleModel)
  for (const vehicle of vehicles) {
    if (!vehicle.vehicleModel) {
      const key = `custom-${vehicle.slug}`
      if (!filterMap.has(key)) {
        filterMap.set(key, {
          id: vehicle.id,
          name: vehicle.title,
          slug: vehicle.slug,
          brand: {
            id: 'custom',
            name: 'Custom',
            slug: 'custom',
          },
        })
      }
    }
  }

  return Array.from(filterMap.values())
})

// Get vehicle (listing) by slug
export const getVehicleBySlug = cache(async (slug: string) => {
  return await prisma.vehicle.findUnique({
    where: { slug },
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
      seatingCapacity: true,
      driverOption: true,
      color: true,
      features: true,
      images: true,
      priceWithDriver: true,
      priceSelfDrive: true,
      priceDaily: true,
      priceHourly: true,
      priceMonthly: true,
      priceWithinCity: true,
      priceOutOfCity: true,
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
      category: {
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
          phone: true,
          whatsappPhone: true,
        },
      },
      vehicleModel: {
        select: {
          id: true,
          name: true,
          slug: true,
          vehicleBrand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  })
})

// Booking functions
export const createBooking = async (data: {
  vehicleId: string
  vendorId: string
  userName: string
  userPhone: string
  userEmail?: string
  bookingDate?: Date
  message?: string
  totalAmount?: number
}) => {
  // Platform commission is 2% of the total booking amount
  const commissionAmount = data.totalAmount ? Math.round(data.totalAmount * 0.02) : null

  return await prisma.booking.create({
    data: {
      vehicleId: data.vehicleId,
      vendorId: data.vendorId,
      userName: data.userName,
      userPhone: data.userPhone,
      userEmail: data.userEmail,
      bookingDate: data.bookingDate,
      message: data.message,
      totalAmount: data.totalAmount,
      commissionAmount,
      status: 'PENDING',
    },
  })
}

export const getBookings = async (filters: {
  vendorId?: string
  vehicleId?: string
  status?: string
  page?: number
  limit?: number
}) => {
  const { vendorId, vehicleId, status, page = 1, limit = 20 } = filters
  const skip = (page - 1) * limit

  // Safety guard in case Prisma Client was generated without the Booking model
  const anyPrisma = prisma as any
  if (!anyPrisma.booking) {
    return {
      bookings: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    }
  }

  const where: any = {}
  if (vendorId) where.vendorId = vendorId
  if (vehicleId) where.vehicleId = vehicleId
  if (status) where.status = status

  const [bookings, total] = await Promise.all([
    anyPrisma.booking.findMany({
      where,
      include: {
        vehicle: {
          select: {
            id: true,
            title: true,
            slug: true,
            city: {
              select: {
                name: true,
              },
            },
            town: {
              select: {
                name: true,
              },
            },
          },
        },
        vendor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    anyPrisma.booking.count({ where }),
  ])

  return {
    bookings,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export const updateBookingStatus = async (
  id: string,
  status: string,
  totalAmount?: number
) => {
  const updateData: any = { status: status as any }
  if (totalAmount !== undefined) {
    updateData.totalAmount = totalAmount
    // Keep commission in sync with the 2% business rule
    updateData.commissionAmount = Math.round(totalAmount * 0.02)
  }

  return await prisma.booking.update({
    where: { id },
    data: updateData,
  })
}

// Admin functions for vendor management
export const getAllVendors = async (filters: {
  isActive?: boolean
  verificationStatus?: string
  page?: number
  limit?: number
}) => {
  const { isActive, verificationStatus, page = 1, limit = 20 } = filters
  const skip = (page - 1) * limit

  const where: any = {}
  if (isActive !== undefined) where.isActive = isActive
  if (verificationStatus) where.verificationStatus = verificationStatus

  const [vendors, total] = await Promise.all([
    prisma.vendor.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        phone: true,
        whatsappPhone: true,
        address: true,
        verificationStatus: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            vehicles: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.vendor.count({ where }),
  ])

  return {
    vendors,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export const getVendorById = async (id: string) => {
  return await prisma.vendor.findUnique({
    where: { id },
    include: {
      vehicles: {
        select: {
          id: true,
          title: true,
          slug: true,
          isAvailable: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })
}

// Get booking statistics
export const getBookingStats = async (filters: {
  vendorId?: string
  startDate?: Date
  endDate?: Date
}) => {
  // Safety guard in case Prisma Client was generated without the Booking model
  const anyPrisma = prisma as any
  if (!anyPrisma.booking) {
    return {
      total: 0,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
      totalCommission: 0,
    }
  }

  const { vendorId, startDate, endDate } = filters

  const where: any = {}
  if (vendorId) where.vendorId = vendorId
  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) where.createdAt.gte = startDate
    if (endDate) where.createdAt.lte = endDate
  }

  const [total, pending, confirmed, cancelled, completed] = await Promise.all([
    anyPrisma.booking.count({ where }),
    anyPrisma.booking.count({ where: { ...where, status: 'PENDING' } }),
    anyPrisma.booking.count({ where: { ...where, status: 'CONFIRMED' } }),
    anyPrisma.booking.count({ where: { ...where, status: 'CANCELLED' } }),
    anyPrisma.booking.count({ where: { ...where, status: 'COMPLETED' } }),
  ])

  const totalCommission = await anyPrisma.booking.aggregate({
    where: {
      ...where,
      commissionAmount: { not: null },
    },
    _sum: {
      commissionAmount: true,
    },
  })

  return {
    total,
    pending,
    confirmed,
    cancelled,
    completed,
    totalCommission: totalCommission._sum.commissionAmount || 0,
  }
}