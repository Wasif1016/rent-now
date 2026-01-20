import { getCitiesWithVehicles, getVehicleFilters } from '@/lib/data'
import { VehicleForm } from '@/components/vendor/vehicle-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function NewVehiclePage() {
  const [cities, vehicleFilters] = await Promise.all([
    getCitiesWithVehicles(),
    getVehicleFilters(),
  ])

  // Get towns for each city (we'll fetch dynamically on client)
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

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <Link href="/vendor/vehicles">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vehicles
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-8">Add New Vehicle</h1>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <VehicleForm cities={citiesData} vehicleModels={vehicleModelsData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

