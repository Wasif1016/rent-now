 'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface VehicleListItem {
  id: string
  title: string
  slug: string
  isAvailable: boolean | null
  city?: {
    name: string
  } | null
}

export default function VendorVehiclesPage() {
  const { session, loading } = useAuth()
  const [vehicles, setVehicles] = useState<VehicleListItem[]>([])
  const [loadingVehicles, setLoadingVehicles] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const message = searchParams.get('message')

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!session) {
        setLoadingVehicles(false)
        return
      }

      try {
        const response = await fetch('/api/vendor/vehicles', {
          headers: {
            ...(session.access_token
              ? { Authorization: `Bearer ${session.access_token}` }
              : {}),
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load vehicles')
        }

        setVehicles(
          data.map((v: any) => ({
            id: v.id,
            title: v.title,
            slug: v.slug,
            isAvailable: v.isAvailable,
            city: v.city,
          })),
        )
      } catch (err: any) {
        setError(err.message || 'Failed to load vehicles')
      } finally {
        setLoadingVehicles(false)
      }
    }

    fetchVehicles()
  }, [session])

  // Clear success message from URL after first render
  useEffect(() => {
    if (message) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('message')
      router.replace(`/vendor/vehicles${params.toString() ? `?${params.toString()}` : ''}`)
    }
  }, [message, router, searchParams])

  const isLoading = loading || loadingVehicles

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Vehicles</h1>
          <Link href="/vendor/vehicles/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </Link>
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Vehicles ({isLoading ? '...' : vehicles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 text-center text-muted-foreground">Loading vehicles...</div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No vehicles added yet</p>
                <Link href="/vendor/vehicles/new">
                  <Button>Add Your First Vehicle</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{vehicle.title}</div>
                      <div className="text-xs text-gray-500">
                        {vehicle.city?.name ? `Location: ${vehicle.city.name}` : 'Location not set'}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          vehicle.isAvailable
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {vehicle.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                      <Link href={`/vehicles/${vehicle.slug}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

