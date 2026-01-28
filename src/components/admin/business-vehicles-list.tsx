'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'

interface Vehicle {
  id: string
  title: string
  slug: string
  status: string
  isAvailable: boolean | null
  images: any
  city: {
    name: string
  } | null
  vehicleType: {
    name: string
  } | null
}

interface BusinessVehiclesListProps {
  vendorId: string
  initialVehicles: Vehicle[]
}

export function BusinessVehiclesList({ vendorId, initialVehicles }: BusinessVehiclesListProps) {
  if (initialVehicles.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No vehicles listed yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {initialVehicles.map((vehicle) => {
        const images = Array.isArray(vehicle.images) ? vehicle.images : []
        const mainImage = typeof images[0] === 'string' ? images[0] : null

        return (
          <div
            key={vehicle.id}
            className="flex items-center gap-4 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            {mainImage && (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={mainImage}
                  alt={vehicle.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium truncate">{vehicle.title}</h4>
                <Badge variant={vehicle.status === 'PUBLISHED' ? 'default' : 'outline'}>
                  {vehicle.status}
                </Badge>
                {vehicle.isAvailable ? (
                  <Badge className="bg-green-500">Available</Badge>
                ) : (
                  <Badge variant="destructive">Unavailable</Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {vehicle.city && <span>{vehicle.city.name}</span>}
                {vehicle.vehicleType && <span>{vehicle.vehicleType.name}</span>}
              </div>
            </div>
            <Link href={`/admin/vehicles/${vehicle.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

