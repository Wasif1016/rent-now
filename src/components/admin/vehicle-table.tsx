'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  MoreVertical,
  Eye,
  Ban,
  CheckCircle,
  Search,
  MapPin,
  Tag,
  Filter,
  Car,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Vehicle {
  id: string
  title: string
  slug: string
  status: string
  isAvailable: boolean | null
  images: any
  vendor: {
    id: string
    name: string
    email: string | null
  }
  city: {
    id: string
    name: string
  } | null
  vehicleType: {
    id: string
    name: string
  } | null
}

interface VehicleTableProps {
  vehicles: Vehicle[]
  total: number
  totalPages: number
  currentPage: number
  cities: Array<{ id: string; name: string }>
  vehicleTypes: Array<{ id: string; name: string }>
  vendors: Array<{ id: string; name: string }>
  filters: {
    vendorId?: string
    cityId?: string
    vehicleTypeId?: string
    status?: string
    search?: string
  }
}

export function VehicleTable({
  vehicles,
  total,
  totalPages,
  currentPage,
  cities,
  vehicleTypes,
  vendors,
  filters,
}: VehicleTableProps) {
  const router = useRouter()
  const { session } = useAuth()
  const [searchTerm, setSearchTerm] = useState(filters.search || '')

  const updateFilters = (newFilters: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    
    if (newFilters.vendorId) params.set('vendor', newFilters.vendorId)
    if (newFilters.cityId) params.set('city', newFilters.cityId)
    if (newFilters.vehicleTypeId) params.set('type', newFilters.vehicleTypeId)
    if (newFilters.status) params.set('status', newFilters.status)
    if (newFilters.search) params.set('search', newFilters.search)
    if (currentPage > 1) params.set('page', currentPage.toString())

    router.push(`/admin/vehicles?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ ...filters, search: searchTerm || undefined })
  }

  const handleToggleAvailability = async (vehicleId: string, currentStatus: boolean | null) => {
    if (!session?.access_token) {
      alert('You must be logged in to perform this action')
      return
    }

    try {
      const response = await fetch(`/api/admin/vehicles/${vehicleId}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error toggling vehicle availability:', error)
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Plate or Model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-[180px]">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filters.cityId || 'all'}
              onChange={(e) => updateFilters({ ...filters, cityId: e.target.value !== 'all' ? e.target.value : undefined })}
              className="flex-1"
            >
              <option value="all">All Cities</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center gap-2 w-[180px]">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filters.vendorId || 'all'}
              onChange={(e) => updateFilters({ ...filters, vendorId: e.target.value !== 'all' ? e.target.value : undefined })}
              className="flex-1"
            >
              <option value="all">All Vendors</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center gap-2 w-[180px]">
            <Car className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filters.vehicleTypeId || 'all'}
              onChange={(e) => updateFilters({ ...filters, vehicleTypeId: e.target.value !== 'all' ? e.target.value : undefined })}
              className="flex-1"
            >
              <option value="all">All Types</option>
              {vehicleTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center gap-2 w-[180px]">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filters.status || 'all'}
              onChange={(e) => updateFilters({ ...filters, status: e.target.value !== 'all' ? e.target.value : undefined })}
              className="flex-1"
            >
              <option value="all">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </Select>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-semibold text-sm">Preview</th>
                <th className="text-left p-4 font-semibold text-sm">Vehicle Details</th>
                <th className="text-left p-4 font-semibold text-sm">Vendor Partner</th>
                <th className="text-left p-4 font-semibold text-sm">Current Status</th>
                <th className="text-left p-4 font-semibold text-sm">Marketplace Access</th>
                <th className="text-right p-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => {
                const images = Array.isArray(vehicle.images) ? vehicle.images : []
                const mainImage = typeof images[0] === 'string' ? images[0] : null

                return (
                  <tr
                    key={vehicle.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-4">
                      {mainImage ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={mainImage}
                            alt={vehicle.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                          <Car className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{vehicle.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {vehicle.city?.name || 'N/A'} • {vehicle.vehicleType?.name || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/admin/businesses/${vehicle.vendor.id}`}
                        className="text-primary hover:underline"
                      >
                        {vehicle.vendor.name}
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            vehicle.isAvailable
                              ? 'bg-green-500'
                              : vehicle.status === 'DRAFT'
                              ? 'bg-gray-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        <span className="text-sm">
                          {vehicle.isAvailable
                            ? 'Available'
                            : vehicle.status === 'DRAFT'
                            ? 'Draft'
                            : 'Booked'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {vehicle.status === 'PUBLISHED' ? (
                        <Badge className="bg-blue-500">ENABLED</Badge>
                      ) : (
                        <Badge variant="outline">DISABLED</Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/listings/${vehicle.slug}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleAvailability(vehicle.id, vehicle.isAvailable)}
                            >
                              {vehicle.isAvailable ? (
                                <>
                                  <Ban className="h-4 w-4 mr-2" />
                                  Disable
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Enable
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing {vehicles.length} of {total} results
            </div>
            <div className="flex gap-2">
              {currentPage > 1 && (
                <Link href={`/admin/vehicles?page=${currentPage - 1}`}>
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              <span className="flex items-center px-4 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <Link href={`/admin/vehicles?page=${currentPage + 1}`}>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

