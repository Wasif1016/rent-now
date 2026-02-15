'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  MoreVertical,
  Edit,
  Trash2,
  MapPin,
  Compass,
  Car,
  Filter,
  Search,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Route {
  id: string
  basePrice: number
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
  vehicle: {
    id: string
    title: string
    vehicleType: {
      id: string
      name: string
    } | null
  }
  vendor: {
    id: string
    name: string
  }
}

interface RouteTableProps {
  routes: Route[]
  total: number
  totalPages: number
  currentPage: number
  cities: Array<{ id: string; name: string }>
  vehicleTypes: Array<{ id: string; name: string }>
  filters: {
    fromCityId?: string
    toCityId?: string
    vehicleTypeId?: string
  }
}

export function RouteTable({
  routes,
  total,
  totalPages,
  currentPage,
  cities,
  vehicleTypes,
  filters,
}: RouteTableProps) {
  const router = useRouter()

  const updateFilters = (newFilters: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    
    if (newFilters.fromCityId) params.set('fromCity', newFilters.fromCityId)
    if (newFilters.toCityId) params.set('toCity', newFilters.toCityId)
    if (newFilters.vehicleTypeId) params.set('type', newFilters.vehicleTypeId)
    if (currentPage > 1) params.set('page', currentPage.toString())

    router.push(`/admin/routes?${params.toString()}`)
  }

  const getCompatibleVehicles = (route: Route) => {
    const types: string[] = []
    if (route.vehicle.vehicleType) {
      types.push(route.vehicle.vehicleType.name)
    }
    return types
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 w-[200px]">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filters.fromCityId || 'all'}
              onValueChange={(value) => updateFilters({ ...filters, fromCityId: value !== 'all' ? value : undefined })}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All Departure Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departure Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 w-[200px]">
            <Compass className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filters.toCityId || 'all'}
              onValueChange={(value) => updateFilters({ ...filters, toCityId: value !== 'all' ? value : undefined })}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All Destination Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Destination Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 w-[180px]">
            <Car className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filters.vehicleTypeId || 'all'}
              onValueChange={(value) => updateFilters({ ...filters, vehicleTypeId: value !== 'all' ? value : undefined })}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" className="w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Apply Advanced Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-semibold text-sm">Route (FROM → TO)</th>
                <th className="text-left p-4 font-semibold text-sm">Distance</th>
                <th className="text-left p-4 font-semibold text-sm">Compatible Vehicles</th>
                <th className="text-left p-4 font-semibold text-sm">Price Range</th>
                <th className="text-right p-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => {
                const compatibleVehicles = getCompatibleVehicles(route)

                return (
                  <tr
                    key={route.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium">
                        {route.fromCity.name} → {route.toCity.name}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      <div className="text-sm">N/A</div>
                      <div className="text-xs">Motorway</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {compatibleVehicles.map((type, idx) => (
                          <Badge key={idx} variant="outline" className="bg-blue-500/10">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">Rs. {route.basePrice.toLocaleString()}</div>
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
                              <Link href={`/admin/routes/${route.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
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
              Showing {routes.length} of {total} nationwide corridors
            </div>
            <div className="flex gap-2">
              {currentPage > 1 && (
                <Link href={`/admin/routes?page=${currentPage - 1}`}>
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              <span className="flex items-center px-4 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <Link href={`/admin/routes?page=${currentPage + 1}`}>
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

