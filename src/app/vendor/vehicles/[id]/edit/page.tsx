import { getCitiesWithVehicles, getVehicleFilters } from '@/lib/data'
import { prisma } from '@/lib/prisma'
import { VehicleForm } from '@/components/vendor/vehicle-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface EditVehiclePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
  const { id } = await params

  const [cities, vehicleFilters, vehicle] = await Promise.all([
    getCitiesWithVehicles(),
    getVehicleFilters(),
    prisma.vehicle.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        cityId: true,
        townId: true,
        transmission: true,
        seats: true,
        color: true,
        priceWithDriver: true,
        priceSelfDrive: true,
        priceWithinCity: true,
        priceOutOfCity: true,
        images: true,
        vehicleModelId: true,
      },
    }),
  ])

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-4xl">
          <Link href="/vendor/vehicles">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vehicles
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-4">Vehicle not found</h1>
          <p className="text-muted-foreground">
            The vehicle you are trying to edit could not be found.
          </p>
        </div>
      </div>
    )
  }

  const citiesData = cities.map(city => ({
    id: city.id,
    name: city.name,
    slug: city.slug,
  }))

  const vehicleModelsData = vehicleFilters.map(model => ({
    id: model.id,
    name: model.name,
    slug: model.slug,
    brand: {
      id: model.brand.id,
      name: model.brand.name,
      slug: model.brand.slug,
    },
  }))

  const initialData = {
    vehicleModelId: vehicle.vehicleModelId || '',
    cityId: vehicle.cityId || '',
    townId: vehicle.townId || '',
    title: vehicle.title || '',
    transmission: vehicle.transmission || '',
    seats: vehicle.seats ? String(vehicle.seats) : '',
    color: vehicle.color || '',
    priceWithDriver: vehicle.priceWithDriver ? String(vehicle.priceWithDriver) : '',
    priceSelfDrive: vehicle.priceSelfDrive ? String(vehicle.priceSelfDrive) : '',
    priceWithinCity: vehicle.priceWithinCity ? String(vehicle.priceWithinCity) : '',
    priceOutOfCity: vehicle.priceOutOfCity ? String(vehicle.priceOutOfCity) : '',
    images: vehicle.images || [],
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <Link href="/vendor/vehicles">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vehicles
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-8">Edit Vehicle</h1>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <VehicleForm
              cities={citiesData}
              vehicleModels={vehicleModelsData}
              vehicleId={vehicle.id}
              initialData={initialData}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


