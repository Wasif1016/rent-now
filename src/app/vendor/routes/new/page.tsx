'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'

interface CityOption {
  id: string
  name: string
}

interface VehicleOption {
  id: string
  title: string
}

export default function VendorNewRoutePage() {
  const router = useRouter()
  const { session, user } = useAuth()

  const [cities, setCities] = useState<CityOption[]>([])
  const [vehicles, setVehicles] = useState<VehicleOption[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    fromCityId: '',
    toCityId: '',
    basePrice: '',
    vehicleId: '',
  })

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [citiesRes, vehiclesRes] = await Promise.all([
          fetch('/api/cities'),
          session
            ? fetch('/api/vendor/vehicles', {
                headers: {
                  ...(session.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
                },
              })
            : Promise.resolve(null),
        ])

        if (citiesRes.ok) {
          const cityData = await citiesRes.json()
          setCities(
            cityData.map((c: any) => ({
              id: c.id,
              name: c.name,
            })),
          )
        }

        if (vehiclesRes && vehiclesRes.ok) {
          const vehicleData = await vehiclesRes.json()
          setVehicles(
            vehicleData.map((v: any) => ({
              id: v.id,
              title: v.title,
            })),
          )
        }
      } finally {
        setLoadingMeta(false)
      }
    }

    loadMeta()
  }, [session])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!form.fromCityId) newErrors.fromCityId = 'From city is required'
    if (!form.toCityId) newErrors.toCityId = 'To city is required'
    if (!form.basePrice || Number(form.basePrice) <= 0) newErrors.basePrice = 'Base price is required'
    if (!form.vehicleId) newErrors.vehicleId = 'Please select a vehicle for this route'

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    try {
      const payload = {
        fromCityId: form.fromCityId,
        toCityId: form.toCityId,
        basePrice: Number(form.basePrice),
        vehicleId: form.vehicleId,
      }

      const response = await fetch('/api/vendor/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save route')
      }

      router.push('/vendor/routes?message=Route%20saved%20successfully')
      router.refresh()
    } catch (err: any) {
      setErrors({ general: err.message || 'Failed to save route' })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-muted px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              You must be logged in as a vendor to create routes.
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/vendor" className="text-sm text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-xs text-muted-foreground">/</span>
          <Link href="/vendor/routes/new" className="text-sm font-medium text-foreground">
            Add New Service Route
          </Link>
        </div>

        <h1 className="mb-2 text-2xl font-semibold tracking-tight">Add New Service Route</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Configure your new intercity route, pricing, and which vehicle it uses.
        </p>

        <Card className="border-none bg-background shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Route Details</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Set cities, pricing, compatible vehicles, and availability for this route.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {errors.general}
                </div>
              )}
              {/* Cities row */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="fromCity">From City</Label>
                  <select
                    id="fromCity"
                    value={form.fromCityId}
                    onChange={e => setForm(prev => ({ ...prev, fromCityId: e.target.value }))}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                    disabled={loadingMeta}
                  >
                    <option value="">{loadingMeta ? 'Loading cities...' : 'Select city'}</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {errors.fromCityId && (
                    <p className="text-xs text-red-600">{errors.fromCityId}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="toCity">To City</Label>
                  <select
                    id="toCity"
                    value={form.toCityId}
                    onChange={e => setForm(prev => ({ ...prev, toCityId: e.target.value }))}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                    disabled={loadingMeta}
                  >
                    <option value="">{loadingMeta ? 'Loading cities...' : 'Select city'}</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {errors.toCityId && <p className="text-xs text-red-600">{errors.toCityId}</p>}
                </div>
              </div>

              {/* Pricing row */}
              <div className="space-y-1">
                <Label htmlFor="basePrice">Base Price (Rs.)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={form.basePrice}
                  onChange={e => setForm(prev => ({ ...prev, basePrice: e.target.value }))}
                  placeholder="0.00"
                />
                {errors.basePrice && (
                  <p className="text-xs text-red-600">{errors.basePrice}</p>
                )}
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Starting price for one-way trips.
                </p>
              </div>

              {/* Vehicle selection */}
              <div className="rounded-xl border bg-muted/40 p-4">
                <p className="text-sm font-semibold">Assign Vehicle</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Choose which of your uploaded vehicles will be used by default for this route.
                </p>

                <div className="mt-4 space-y-1">
                  <Label htmlFor="vehicleId">Select Vehicle</Label>
                  <select
                    id="vehicleId"
                    value={form.vehicleId}
                    onChange={e => setForm(prev => ({ ...prev, vehicleId: e.target.value }))}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                    disabled={loadingMeta || vehicles.length === 0}
                  >
                    <option value="">
                      {loadingMeta
                        ? 'Loading your vehicles...'
                        : vehicles.length === 0
                        ? 'No vehicles found – add a vehicle first'
                        : 'Select a vehicle'}
                    </option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.title}
                      </option>
                    ))}
                  </select>
                  {errors.vehicleId && (
                    <p className="text-xs text-red-600">{errors.vehicleId}</p>
                  )}
                  {vehicles.length === 0 && !loadingMeta && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      You have no vehicles yet.{' '}
                      <Link href="/vendor/vehicles/new" className="text-primary underline">
                        Add a vehicle
                      </Link>{' '}
                      before creating routes.
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Route'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          <strong className="font-semibold">Note:</strong> Once saved, this route will be visible to
          potential customers. You can adjust individual vehicle pricing for this route later from
          your pricing settings.
        </div>
      </div>
    </div>
  )
}


