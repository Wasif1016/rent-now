'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, MapPin, CheckCircle2, XCircle, Eye, Power } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/contexts/auth-context'

interface RouteListItem {
  id: string
  fromCity: {
    id: string
    name: string
    slug: string
  }
  toCity: {
    id: string
    name: string
    slug: string
  }
  basePrice: number
  instantAvailability: boolean
  isActive: boolean
  vehicle: {
    id: string
    title: string
    slug: string
    images: string[] | null
  }
  createdAt: string
}

function VendorRoutesPageInner() {
  const { session, loading } = useAuth()
  const [routes, setRoutes] = useState<RouteListItem[]>([])
  const [loadingRoutes, setLoadingRoutes] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const message = searchParams.get('message')

  useEffect(() => {
    const fetchRoutes = async () => {
      if (!session) {
        setLoadingRoutes(false)
        return
      }

      try {
        const response = await fetch('/api/vendor/routes', {
          headers: {
            ...(session.access_token
              ? { Authorization: `Bearer ${session.access_token}` }
              : {}),
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load routes')
        }

        setRoutes(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load routes')
      } finally {
        setLoadingRoutes(false)
      }
    }

    fetchRoutes()
  }, [session])

  const handleToggleAvailability = async (route: RouteListItem) => {
    if (!session) return

    setActionError(null)

    try {
      const response = await fetch(`/api/vendor/routes/${route.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(session.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
        body: JSON.stringify({ isActive: !route.isActive }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update route availability')
      }

      setRoutes(prev =>
        prev.map(r =>
          r.id === route.id ? { ...r, isActive: data.isActive } : r,
        ),
      )
    } catch (err: any) {
      setActionError(err.message || 'Failed to update route availability')
    }
  }

  if (loading || loadingRoutes) {
    return (
      <div className="min-h-screen bg-muted px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center text-muted-foreground">Loading routes...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Service Routes</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your intercity service routes and pricing.
            </p>
          </div>
          <Link href="/vendor/routes/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Route
            </Button>
          </Link>
        </div>

        {message && (
          <div className="mb-4 rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
            {decodeURIComponent(message)}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {actionError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        )}

        {routes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No routes yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create your first service route to start receiving bookings.
              </p>
              <Link href="/vendor/routes/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Route
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {routes.map(route => {
              const vehicleImages = Array.isArray(route.vehicle.images) ? route.vehicle.images : []
              const vehicleImage = vehicleImages[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'

              return (
                <Card key={route.id} className="border-none bg-background shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Vehicle Image */}
                      <div className="relative h-24 w-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={vehicleImage}
                          alt={route.vehicle.title}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <MapPin className="h-5 w-5 text-primary" />
                              <div>
                                <h3 className="text-lg font-semibold">
                                  {route.fromCity.name} → {route.toCity.name}
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  Vehicle: {route.vehicle.title}
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Base Price:</span>{' '}
                                <span className="font-semibold">Rs. {route.basePrice.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Availability Toggle */}
                        <div className="mt-4 flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                          <div className="flex items-center gap-2">
                            <Power className={`h-4 w-4 ${route.isActive ? 'text-primary' : 'text-slate-400'}`} />
                            <span className="text-xs font-medium text-foreground">Available for Booking</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(route)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                              route.isActive ? 'bg-primary' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                route.isActive ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex items-center gap-2 pt-2 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[11px]"
                            onClick={() => {
                              const routeSlug = `${route.fromCity.slug}-to-${route.toCity.slug}`
                              window.open(`/routes/${routeSlug}`, '_blank')
                            }}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function VendorRoutesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-muted px-4 py-8">Loading...</div>}>
      <VendorRoutesPageInner />
    </Suspense>
  )
}

