'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface RouteFormProps {
  cities: Array<{ id: string; name: string }>
  vehicles: Array<{ id: string; title: string; city: { name: string } | null }>
  vendors: Array<{ id: string; name: string }>
  route?: {
    id: string
    fromCityId: string
    toCityId: string
    vehicleId: string
    vendorId: string
    basePrice: number
    isActive: boolean
  }
}

export function RouteForm({ cities, vehicles, vendors, route }: RouteFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fromCityId: route?.fromCityId || '',
    toCityId: route?.toCityId || '',
    vehicleId: route?.vehicleId || '',
    vendorId: route?.vendorId || '',
    basePrice: route?.basePrice || 0,
    isActive: route?.isActive ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = route
        ? `/api/admin/routes/${route.id}`
        : '/api/admin/routes'
      const method = route ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save route')
      }

      router.push('/admin/routes')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save route')
    } finally {
      setLoading(false)
    }
  }

  // Filter vehicles by selected vendor
  const filteredVehicles = formData.vendorId
    ? vehicles.filter((v) => true) // You might want to add vendorId to vehicle relation
    : vehicles

  return (
    <Card>
      <CardHeader>
        <CardTitle>{route ? 'Edit Route' : 'Create Route'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fromCityId">Departure City *</Label>
              <Select
                id="fromCityId"
                value={formData.fromCityId}
                onChange={(e) => setFormData({ ...formData, fromCityId: e.target.value })}
                required
              >
                <option value="">Select departure city</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="toCityId">Destination City *</Label>
              <Select
                id="toCityId"
                value={formData.toCityId}
                onChange={(e) => setFormData({ ...formData, toCityId: e.target.value })}
                required
              >
                <option value="">Select destination city</option>
                {cities
                  .filter((city) => city.id !== formData.fromCityId)
                  .map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendorId">Vendor *</Label>
              <Select
                id="vendorId"
                value={formData.vendorId}
                onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                required
              >
                <option value="">Select vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleId">Vehicle *</Label>
              <Select
                id="vehicleId"
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                required
              >
                <option value="">Select vehicle</option>
                {filteredVehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.title} {vehicle.city ? `(${vehicle.city.name})` : ''}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price (Rs.) *</Label>
              <Input
                id="basePrice"
                type="number"
                min="0"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isActive">Status</Label>
              <Select
                id="isActive"
                value={formData.isActive ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : route ? 'Update Route' : 'Create Route'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

