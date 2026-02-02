import { prisma } from '@/lib/prisma'
import { RouteForm } from '@/components/admin/route-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function NewRoutePage() {
  const [cities, vehicles, vendors] = await Promise.all([
    prisma.city.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.vehicle.findMany({
      where: {
        status: 'PUBLISHED',
        isAvailable: true,
      },
      select: {
        id: true,
        title: true,
        city: {
          select: {
            name: true,
          },
        },
      },
      take: 100,
    }),
    prisma.vendor.findMany({
      where: {
        isActive: true,
        registrationStatus: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
      take: 100,
    }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/routes">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Route</h1>
          <p className="text-muted-foreground mt-1">
            Add a new inter-city route to the marketplace
          </p>
        </div>
      </div>

      <RouteForm cities={cities} vehicles={vehicles} vendors={vendors} />
    </div>
  )
}

