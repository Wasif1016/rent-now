import { prisma } from '@/lib/prisma'
import { RouteTable } from '@/components/admin/route-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function RoutesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt((params.page as string) || '1')
  const fromCityId = params.fromCity as string | undefined
  const toCityId = params.toCity as string | undefined
  const vehicleTypeId = params.type as string | undefined

  const where: any = {
    isActive: true,
  }

  if (fromCityId) {
    where.fromCityId = fromCityId
  }

  if (toCityId) {
    where.toCityId = toCityId
  }

  if (vehicleTypeId) {
    where.vehicle = {
      vehicleTypeId,
    }
  }

  const limit = 20
  const skip = (page - 1) * limit

  const [routes, total] = await Promise.all([
    prisma.route.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
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
        vehicle: {
          select: {
            id: true,
            title: true,
            vehicleType: {
              select: {
                id: true,
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
    }),
    prisma.route.count({ where }),
  ])

  // Get filter options
  const [cities, vehicleTypes] = await Promise.all([
    prisma.city.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.vehicleType.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Route & Corridor Management</h1>
          <p className="text-muted-foreground mt-1">
            Optimize nationwide travel corridors, inter-city distances, and dynamic pricing
          </p>
        </div>
        <Link href="/admin/routes/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Route
          </Button>
        </Link>
      </div>

      {/* Route Table */}
      <RouteTable
        routes={routes}
        total={total}
        totalPages={Math.ceil(total / limit)}
        currentPage={page}
        cities={cities}
        vehicleTypes={vehicleTypes}
        filters={{
          fromCityId,
          toCityId,
          vehicleTypeId,
        }}
      />
    </div>
  )
}

