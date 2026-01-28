'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Search, MapPin, Eye, Power } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface VehicleListItem {
  id: string
  title: string
  slug: string
  isAvailable: boolean | null
  plateNumber?: string | null
  status?: 'DRAFT' | 'PUBLISHED'
  images?: string[] | null
  city?: {
    name: string
  } | null
}

function VendorVehiclesPageInner() {
  const { session, loading } = useAuth()
  const [vehicles, setVehicles] = useState<VehicleListItem[]>([])
  const [loadingVehicles, setLoadingVehicles] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'active' | 'inactive'>('all')
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
            plateNumber: v.plateNumber ?? v.registrationNumber ?? null,
            status: v.status,
            images: v.images && Array.isArray(v.images) ? v.images : null,
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

  const handleDelete = async (id: string) => {
    if (!session) return

    const confirmed = window.confirm('Are you sure you want to delete this vehicle?')
    if (!confirmed) return

    setActionError(null)

    try {
      const response = await fetch(`/api/vendor/vehicles/${id}`, {
        method: 'DELETE',
        headers: {
          ...(session.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete vehicle')
      }

      setVehicles(prev => prev.filter(v => v.id !== id))
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete vehicle')
    }
  }

  const handleToggleAvailability = async (vehicle: VehicleListItem) => {
    if (!session) return

    setActionError(null)

    try {
      const response = await fetch(`/api/vendor/vehicles/${vehicle.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(session.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
        body: JSON.stringify({ isAvailable: !vehicle.isAvailable }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update availability')
      }

      setVehicles(prev =>
        prev.map(v =>
          v.id === vehicle.id ? { ...v, isAvailable: data.isAvailable } : v,
        ),
      )
    } catch (err: any) {
      setActionError(err.message || 'Failed to update availability')
    }
  }

  // Clear success message from URL after first render
  useEffect(() => {
    if (message) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('message')
      router.replace(`/vendor/vehicles${params.toString() ? `?${params.toString()}` : ''}`)
    }
  }, [message, router, searchParams])

  const isLoading = loading || loadingVehicles

  const filteredVehicles = useMemo(() => {
    let list = [...vehicles]

    if (availabilityFilter !== 'all') {
      const shouldBeAvailable = availabilityFilter === 'active'
      list = list.filter(v => Boolean(v.isAvailable) === shouldBeAvailable)
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      list = list.filter(v =>
        v.title.toLowerCase().includes(q) ||
        (v.plateNumber ?? '').toLowerCase().includes(q),
      )
    }

    return list
  }, [availabilityFilter, searchTerm, vehicles])

  return (
    <div className="min-h-screen bg-muted px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Manage Fleet</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Keep your vehicles up to date so customers always see what&apos;s available.
            </p>
          </div>
          <Link href="/vendor/vehicles/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Vehicle
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

        {actionError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {actionError}
          </div>
        )}

        <Card className="border-none bg-background shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Vehicles ({isLoading ? '...' : filteredVehicles.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filters row */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 flex-col gap-3 md:flex-row">
                <div className="flex-1 md:max-w-xs">
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Availability
                  </label>
                  <select
                    value={availabilityFilter}
                    onChange={e =>
                      setAvailabilityFilter(e.target.value as 'all' | 'active' | 'inactive')
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <option value="all">All status</option>
                    <option value="active">Active only</option>
                    <option value="inactive">Inactive only</option>
                  </select>
                </div>
              </div>

              <div className="relative w-full md:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by plate or name"
                  className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Loading vehicles...
              </div>
            ) : vehicles.length === 0 ? (
              <div className="py-12 text-center">
                <p className="mb-4 text-sm text-muted-foreground">No vehicles added yet.</p>
                <Link href="/vendor/vehicles/new">
                  <Button>Add your first vehicle</Button>
                </Link>
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No vehicles match your filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredVehicles.map(vehicle => {
                  const imageUrl = vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0
                    ? vehicle.images[0]
                    : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'
                  
                  return (
                  <div
                    key={vehicle.id}
                    className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
                  >
                    {/* Vehicle Image */}
                    <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={imageUrl}
                        alt={vehicle.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {vehicle.status === 'DRAFT' ? (
                        <span className="absolute right-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                          Draft
                        </span>
                      ) : vehicle.isAvailable ? (
                        <span className="absolute right-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                          Active
                        </span>
                      ) : (
                        <span className="absolute right-4 top-4 rounded-full bg-slate-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                          Inactive
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col gap-3 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h2 className="text-sm font-semibold leading-snug">{vehicle.title}</h2>
                          <div className="mt-2 space-y-1.5">
                            {vehicle.plateNumber ? (
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-medium text-muted-foreground uppercase">Plate:</span>
                                <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
                                  {vehicle.plateNumber}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-medium text-muted-foreground uppercase">Plate:</span>
                                <span className="text-[11px] text-muted-foreground italic">No plate</span>
                              </div>
                            )}
                            {vehicle.city?.name && (
                              <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {vehicle.city.name}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Availability Toggle - Prominent */}
                      {vehicle.status !== 'DRAFT' && (
                        <div className="mt-2 flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                          <div className="flex items-center gap-2">
                            <Power className={`h-4 w-4 ${vehicle.isAvailable ? 'text-emerald-600' : 'text-slate-400'}`} />
                            <span className="text-xs font-medium text-foreground">Available for Rent</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(vehicle)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                              vehicle.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                vehicle.isAvailable ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-auto flex items-center gap-2 pt-2 border-t">
                        <Link href={`/vendor/vehicles/${vehicle.id}/edit`}>
                          <Button variant="outline" size="sm" className="flex-1 text-[11px]">
                            <Pencil className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-[11px]"
                          onClick={() => window.open(`/vehicles/${vehicle.slug}`, '_blank')}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          Preview
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="text-[11px]"
                          onClick={() => handleDelete(vehicle.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function VendorVehiclesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background p-8">
          <div className="container mx-auto">
            <div className="text-center text-muted-foreground">Loading your vehicles...</div>
          </div>
        </div>
      }
    >
      <VendorVehiclesPageInner />
    </Suspense>
  )
}

