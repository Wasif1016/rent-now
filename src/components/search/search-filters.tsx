'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import Image from 'next/image'

interface SearchFiltersProps {
  citySlug?: string
  townSlug?: string
  brandSlug?: string
  vehicleSlug?: string
  fuelType?: string
  transmission?: string
  towns?: Array<{ id: string; name: string; slug: string }>
  brands?: Array<{ id: string; name: string; slug: string }>
  vehicleModels?: Array<{ id: string; name: string; slug: string; brandSlug: string }>
}

export function SearchFilters({
  citySlug,
  townSlug: initialTownSlug,
  brandSlug: initialBrandSlug,
  vehicleSlug: initialVehicleSlug,
  fuelType: initialFuelType,
  transmission: initialTransmission,
  towns = [],
  brands = [],
  vehicleModels = [],
}: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [townSlug, setTownSlug] = useState(initialTownSlug || '')
  const [brandSlug, setBrandSlug] = useState(initialBrandSlug || '')
  const [vehicleSlug, setVehicleSlug] = useState(initialVehicleSlug || '')
  const [fuelType, setFuelType] = useState(initialFuelType || '')
  const [transmission, setTransmission] = useState(initialTransmission || '')

  useEffect(() => {
    setTownSlug(initialTownSlug || '')
    setBrandSlug(initialBrandSlug || '')
    setVehicleSlug(initialVehicleSlug || '')
    setFuelType(initialFuelType || '')
    setTransmission(initialTransmission || '')
  }, [initialTownSlug, initialBrandSlug, initialVehicleSlug, initialFuelType, initialTransmission])

  const selectedTown = towns.find(t => t.slug === townSlug)
  const selectedBrand = brands.find(b => b.slug === brandSlug)
  const selectedVehicle = vehicleModels.find(v => v.slug === vehicleSlug)
  
  // Filter vehicle models by selected brand
  const filteredVehicleModels = brandSlug
    ? vehicleModels.filter(vm => vm.brandSlug === brandSlug)
    : vehicleModels

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (townSlug) {
      params.set('town', townSlug)
    } else {
      params.delete('town')
    }

    if (brandSlug) {
      params.set('brand', brandSlug)
    } else {
      params.delete('brand')
    }

    if (vehicleSlug) {
      params.set('vehicle', vehicleSlug)
    } else {
      params.delete('vehicle')
    }

    if (fuelType) {
      params.set('fuelType', fuelType)
    } else {
      params.delete('fuelType')
    }

    if (transmission) {
      params.set('transmission', transmission)
    } else {
      params.delete('transmission')
    }

    params.delete('page') // Reset to first page

    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => {
    setTownSlug('')
    setBrandSlug('')
    setVehicleSlug('')
    setFuelType('')
    setTransmission('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('town')
    params.delete('brand')
    params.delete('vehicle')
    params.delete('fuelType')
    params.delete('transmission')
    params.delete('page')
    router.push(`?${params.toString()}`)
  }

  const hasActiveFilters = townSlug || brandSlug || vehicleSlug || fuelType || transmission

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Town Filter */}
        {citySlug && towns.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="town" className="text-sm font-semibold">
              Location
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-background text-foreground"
                >
                  <span className="truncate">
                    {selectedTown ? selectedTown.name : 'All towns'}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) max-h-[300px] overflow-y-auto">
                <DropdownMenuItem
                  onClick={() => setTownSlug('')}
                  className="cursor-pointer"
                >
                  {!townSlug ? (
                    <Image src={'/icons/checked-checkbox.svg'} alt="All towns" width={16} height={16} className="h-4 w-4 mr-2" />
                  ) : (
                    <Image src={'/icons/unchecked-checkbox.svg'} alt="All towns" width={16} height={16} className="h-4 w-4 mr-2" />
                  )}
                  <span>All towns</span>
                </DropdownMenuItem>
                {towns.map((town) => (
                  <DropdownMenuItem
                    key={town.id}
                    onClick={() => setTownSlug(town.slug)}
                    className="cursor-pointer"
                  >
                    {townSlug === town.slug ? (
                      <Image src={'/icons/checked-checkbox.svg'} alt={town.name} width={16} height={16} className="h-4 w-4 mr-2" />
                    ) : (
                      <Image src={'/icons/unchecked-checkbox.svg'} alt={town.name} width={16} height={16} className="h-4 w-4 mr-2" />
                    )}
                    <span>{town.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Brand Filter */}
        {brands.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="brand" className="text-sm font-semibold">
              Vehicle Brand
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-background text-foreground"
                >
                  <span className="truncate">
                    {selectedBrand ? selectedBrand.name : 'All brands'}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) max-h-[300px] overflow-y-auto">
                <DropdownMenuItem
                  onClick={() => {
                    setBrandSlug('')
                    setVehicleSlug('') // Reset vehicle when brand changes
                  }}
                  className="cursor-pointer"
                >
                  {!brandSlug ? (
                    <Image src={'/icons/checked-checkbox.svg'} alt="All brands" width={16} height={16} className="h-4 w-4 mr-2" />
                  ) : (
                    <Image src={'/icons/unchecked-checkbox.svg'} alt="All brands" width={16} height={16} className="h-4 w-4 mr-2" />
                  )}
                  <span>All brands</span>
                </DropdownMenuItem>
                {brands.map((brand) => (
                  <DropdownMenuItem
                    key={brand.id}
                    onClick={() => {
                      setBrandSlug(brand.slug)
                      setVehicleSlug('') // Reset vehicle when brand changes
                    }}
                    className="cursor-pointer"
                  >
                    {brandSlug === brand.slug ? (
                      <Image src={'/icons/checked-checkbox.svg'} alt={brand.name} width={16} height={16} className="h-4 w-4 mr-2" />
                    ) : (
                      <Image src={'/icons/unchecked-checkbox.svg'} alt={brand.name} width={16} height={16} className="h-4 w-4 mr-2" />
                    )}
                    <span>{brand.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Vehicle Model Filter */}
        {vehicleModels.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="vehicle" className="text-sm font-semibold">
              Vehicle Model
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-background text-foreground"
                  disabled={!brandSlug && brands.length > 0}
                >
                  <span className="truncate">
                    {selectedVehicle ? selectedVehicle.name : 'All models'}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) max-h-[300px] overflow-y-auto">
                <DropdownMenuItem
                  onClick={() => setVehicleSlug('')}
                  className="cursor-pointer"
                >
                  {!vehicleSlug ? (
                    <Image src={'/icons/checked-checkbox.svg'} alt="All models" width={16} height={16} className="h-4 w-4 mr-2" />
                  ) : (
                    <Image src={'/icons/unchecked-checkbox.svg'} alt="All models" width={16} height={16} className="h-4 w-4 mr-2" />
                  )}
                  <span>All models</span>
                </DropdownMenuItem>
                {filteredVehicleModels.map((vehicle) => (
                  <DropdownMenuItem
                    key={vehicle.id}
                    onClick={() => setVehicleSlug(vehicle.slug)}
                    className="cursor-pointer"
                  >
                    {vehicleSlug === vehicle.slug ? (
                      <Image src={'/icons/checked-checkbox.svg'} alt={vehicle.name} width={16} height={16} className="h-4 w-4 mr-2" />
                    ) : (
                      <Image src={'/icons/unchecked-checkbox.svg'} alt={vehicle.name} width={16} height={16} className="h-4 w-4 mr-2" />
                    )}
                    <span>{vehicle.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Fuel Type Filter */}
        <div className="space-y-2">
          <Label htmlFor="fuel-type">Fuel Type</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between bg-background text-foreground"
              >
                <span className="truncate">
                  {fuelType || 'All fuel types'}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
              <DropdownMenuItem
                onClick={() => setFuelType('')}
                className="cursor-pointer"
              >
                {!fuelType ? (
                  <Image src={'/icons/checked-checkbox.svg'} alt="All fuel types" width={16} height={16} className="h-4 w-4 mr-2" />
                ) : (
                  <Image src={'/icons/unchecked-checkbox.svg'} alt="All fuel types" width={16} height={16} className="h-4 w-4 mr-2" />
                )}
                <span>All fuel types</span>
              </DropdownMenuItem>
              {['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'CNG'].map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => setFuelType(type)}
                  className="cursor-pointer"
                >
                  {fuelType === type ? (
                    <Image src={'/icons/checked-checkbox.svg'} alt={type} width={16} height={16} className="h-4 w-4 mr-2" />
                  ) : (
                    <Image src={'/icons/unchecked-checkbox.svg'} alt={type} width={16} height={16} className="h-4 w-4 mr-2" />
                  )}
                  <span>{type}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Transmission Filter */}
        <div className="space-y-2">
          <Label htmlFor="transmission">Transmission</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between bg-background text-foreground"
              >
                <span className="truncate">
                  {transmission || 'All transmissions'}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
              <DropdownMenuItem
                onClick={() => setTransmission('')}
                className="cursor-pointer"
              >
                {!transmission ? (
                  <Image src={'/icons/checked-checkbox.svg'} alt="All transmissions" width={16} height={16} className="h-4 w-4 mr-2" />
                ) : (
                  <Image src={'/icons/unchecked-checkbox.svg'} alt="All transmissions" width={16} height={16} className="h-4 w-4 mr-2" />
                )}
                <span>All transmissions</span>
              </DropdownMenuItem>
              {['MANUAL', 'AUTOMATIC'].map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => setTransmission(type)}
                  className="cursor-pointer"
                >
                  {transmission === type ? (
                    <Image src={'/icons/checked-checkbox.svg'} alt={type} width={16} height={16} className="h-4 w-4 mr-2" />
                  ) : (
                    <Image src={'/icons/unchecked-checkbox.svg'} alt={type} width={16} height={16} className="h-4 w-4 mr-2" />
                  )}
                  <span>{type}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>


        <Button onClick={applyFilters} className="w-full" size="sm">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  )
}
