import Link from 'next/link'
import { getVehicleTypesWithVehicles } from '@/lib/data'
import { Car, Truck, Bus, Heart } from 'lucide-react'

const vehicleIcons: Record<string, typeof Car> = {
  cars: Car,
  hiace: Truck,
  vans: Truck,
  coaster: Bus,
  buses: Bus,
  'wedding-cars': Heart,
}

export async function BrowseByVehicleType() {
  const vehicleTypes = await getVehicleTypesWithVehicles()

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Choose a Vehicle Type
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {vehicleTypes.map((type) => {
            const Icon = vehicleIcons[type.slug] || Car
            return (
              <Link
                key={type.id}
                href={`/rent-a-car/${type.slug}`}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all hover:scale-105 border border-gray-200 group flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-green-accent/10 flex items-center justify-center mb-3 group-hover:bg-green-accent/20 transition-colors">
                  <Icon className="h-6 w-6 text-green-accent" />
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-green-accent transition-colors text-sm lg:text-base">
                  {type.name}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

