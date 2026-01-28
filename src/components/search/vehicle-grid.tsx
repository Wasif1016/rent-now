import { VehicleCard } from './vehicle-card'

interface Vehicle {
  id: string
  title: string
  slug: string
  year?: number | null
  mileage?: number | null
  fuelType?: string | null
  transmission?: string | null
    seats?: number | null
    images: string[] | null
  city: { name: string; slug: string }
  vendor: {
    name: string
    verificationStatus?: string | null
  }
  vehicleModel?: {
    name: string
    capacity?: number | null
    vehicleBrand: {
      name: string
    }
  } | null
  featured?: boolean
}

interface VehicleGridProps {
  vehicles: Vehicle[]
}

export function VehicleGrid({ vehicles }: VehicleGridProps) {
  if (vehicles.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  )
}

