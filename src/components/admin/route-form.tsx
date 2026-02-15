'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
                value={formData.fromCityId}
                onValueChange={(value) => setFormData({ ...formData, fromCityId: value })}
                required
              >
                <SelectTrigger id="fromCityId" className="w-full">
                  <SelectValue placeholder="Select departure city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="toCityId">Destination City *</Label>
              <Select
                value={formData.toCityId}
                onValueChange={(value) => setFormData({ ...formData, toCityId: value })}
                required
              >
                <SelectTrigger id="toCityId" className="w-full">
                  <SelectValue placeholder="Select destination city" />
                </SelectTrigger>
                <SelectContent>
                  {cities
                    .filter((city) => city.id !== formData.fromCityId)
                    .map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendorId">Vendor *</Label>
              <Select
                value={formData.vendorId}
                onValueChange={(value) => setFormData({ ...formData, vendorId: value })}
                required
              >
                <SelectTrigger id="vendorId" className="w-full">
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleId">Vehicle *</Label>
              <Select
                value={formData.vehicleId}
                onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
                required
              >
                <SelectTrigger id="vehicleId" className="w-full">
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {filteredVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.title} {vehicle.city ? `(${vehicle.city.name})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
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
                value={formData.isActive ? 'true' : 'false'}
                onValueChange={(value) => setFormData({ ...formData, isActive: value === 'true' })}
              >
                <SelectTrigger id="isActive" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
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

