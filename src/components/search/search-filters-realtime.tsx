'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { X } from 'lucide-react'

interface SearchFiltersRealtimeProps {
  cities: Array<{ id: string; name: string; slug: string }>
  towns: Array<{ id: string; name: string; slug: string; cityId: string }>
  vehicleTypes: Array<{ id: string; name: string; slug: string }>
  selectedCity: string
  selectedTown: string
  selectedVehicleType: string
  onCityChange: (citySlug: string) => void
  onTownChange: (townSlug: string) => void
  onVehicleTypeChange: (vehicleTypeSlug: string) => void
  onReset: () => void
  hasActiveFilters: boolean
}

export function SearchFiltersRealtime({
  cities,
  towns,
  vehicleTypes,
  selectedCity,
  selectedTown,
  selectedVehicleType,
  onCityChange,
  onTownChange,
  onVehicleTypeChange,
  onReset,
  hasActiveFilters,
}: SearchFiltersRealtimeProps) {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-7 text-xs text-gray-600 hover:text-gray-900"
            >
              <X className="h-3 w-3 mr-1" />
              Reset
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">Narrow your search</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* City Filter */}
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
            CITY
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between bg-white border-gray-300 text-gray-900"
              >
                <span className="truncate">
                  {selectedCity ? cities.find(c => c.slug === selectedCity)?.name || 'Select City' : 'Select City'}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto">
              <DropdownMenuItem
                onClick={() => onCityChange('')}
                className="cursor-pointer"
              >
                All Cities
              </DropdownMenuItem>
              {cities.map((city) => (
                <DropdownMenuItem
                  key={city.id}
                  onClick={() => onCityChange(city.slug)}
                  className="cursor-pointer"
                >
                  {city.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Town Filter */}
        {selectedCity && (
          <div className="space-y-2">
            <Label htmlFor="town" className="text-sm font-semibold text-gray-700">
              TOWN
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-white border-gray-300 text-gray-900"
                  disabled={towns.length === 0}
                >
                  <span className="truncate">
                    {selectedTown ? towns.find(t => t.slug === selectedTown)?.name || 'Select Town' : 'Select Town'}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              {towns.length > 0 && (
                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto">
                  <DropdownMenuItem
                    onClick={() => onTownChange('')}
                    className="cursor-pointer"
                  >
                    All Towns
                  </DropdownMenuItem>
                  {towns.map((town) => (
                    <DropdownMenuItem
                      key={town.id}
                      onClick={() => onTownChange(town.slug)}
                      className="cursor-pointer"
                    >
                      {town.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>
        )}

        {/* Vehicle Type Filter */}
        <div className="space-y-2">
          <Label htmlFor="vehicleType" className="text-sm font-semibold text-gray-700">
            VEHICLE TYPE
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between bg-white border-gray-300 text-gray-900"
              >
                <span className="truncate">
                  {selectedVehicleType ? vehicleTypes.find(vt => vt.slug === selectedVehicleType)?.name || 'Select Vehicle Type' : 'Select Vehicle Type'}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto">
              <DropdownMenuItem
                onClick={() => onVehicleTypeChange('')}
                className="cursor-pointer"
              >
                All Vehicle Types
              </DropdownMenuItem>
              {vehicleTypes.map((vehicleType) => (
                <DropdownMenuItem
                  key={vehicleType.id}
                  onClick={() => onVehicleTypeChange(vehicleType.slug)}
                  className="cursor-pointer"
                >
                  {vehicleType.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}

