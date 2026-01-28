'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

interface HorizontalFiltersProps {
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

export function HorizontalFilters({
  citySlug,
  townSlug: initialTownSlug,
  brandSlug: initialBrandSlug,
  vehicleSlug: initialVehicleSlug,
  fuelType: initialFuelType,
  transmission: initialTransmission,
  towns = [],
  brands = [],
  vehicleModels = [],
}: HorizontalFiltersProps) {
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
    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800/50">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
        {/* Filters Label */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <span className="text-white font-semibold">Filters</span>
        </div>

        {/* Horizontal Filter Fields */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Town Filter */}
          {citySlug && towns.length > 0 && (
            <div className="flex items-center gap-2">
              <Label htmlFor="town" className="text-sm text-gray-400 whitespace-nowrap">
                Location:
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 min-w-[150px] justify-between bg-[#0f0f0f] text-white border-gray-800/50 hover:bg-[#1a1a1a]"
                  >
                    <span className="truncate text-sm">
                      {selectedTown ? selectedTown.name : 'All towns'}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto bg-[#1a1a1a] border-gray-800">
                  <DropdownMenuItem
                    onClick={() => setTownSlug('')}
                    className="cursor-pointer text-white hover:bg-[#0f0f0f]"
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
                      className="cursor-pointer text-white hover:bg-[#0f0f0f]"
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
            <div className="flex items-center gap-2">
              <Label htmlFor="brand" className="text-sm text-gray-400 whitespace-nowrap">
                Brand:
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 min-w-[150px] justify-between bg-[#0f0f0f] text-white border-gray-800/50 hover:bg-[#1a1a1a]"
                  >
                    <span className="truncate text-sm">
                      {selectedBrand ? selectedBrand.name : 'All brands'}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto bg-[#1a1a1a] border-gray-800">
                  <DropdownMenuItem
                    onClick={() => {
                      setBrandSlug('')
                      setVehicleSlug('')
                    }}
                    className="cursor-pointer text-white hover:bg-[#0f0f0f]"
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
                        setVehicleSlug('')
                      }}
                      className="cursor-pointer text-white hover:bg-[#0f0f0f]"
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
            <div className="flex items-center gap-2">
              <Label htmlFor="vehicle" className="text-sm text-gray-400 whitespace-nowrap">
                Model:
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 min-w-[150px] justify-between bg-[#0f0f0f] text-white border-gray-800/50 hover:bg-[#1a1a1a] disabled:opacity-50"
                    disabled={!brandSlug && brands.length > 0}
                  >
                    <span className="truncate text-sm">
                      {selectedVehicle ? selectedVehicle.name : 'All models'}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto bg-[#1a1a1a] border-gray-800">
                  <DropdownMenuItem
                    onClick={() => setVehicleSlug('')}
                    className="cursor-pointer text-white hover:bg-[#0f0f0f]"
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
                      className="cursor-pointer text-white hover:bg-[#0f0f0f]"
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
          <div className="flex items-center gap-2">
            <Label htmlFor="fuel-type" className="text-sm text-gray-400 whitespace-nowrap">
              Fuel:
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 min-w-[150px] justify-between bg-[#0f0f0f] text-white border-gray-800/50 hover:bg-[#1a1a1a]"
                >
                  <span className="truncate text-sm">
                    {fuelType || 'All fuel types'}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-[#1a1a1a] border-gray-800">
                <DropdownMenuItem
                  onClick={() => setFuelType('')}
                  className="cursor-pointer text-white hover:bg-[#0f0f0f]"
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
                    className="cursor-pointer text-white hover:bg-[#0f0f0f]"
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
          <div className="flex items-center gap-2">
            <Label htmlFor="transmission" className="text-sm text-gray-400 whitespace-nowrap">
              Transmission:
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 min-w-[150px] justify-between bg-[#0f0f0f] text-white border-gray-800/50 hover:bg-[#1a1a1a]"
                >
                  <span className="truncate text-sm">
                    {transmission || 'All transmissions'}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-[#1a1a1a] border-gray-800">
                <DropdownMenuItem
                  onClick={() => setTransmission('')}
                  className="cursor-pointer text-white hover:bg-[#0f0f0f]"
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
                    className="cursor-pointer text-white hover:bg-[#0f0f0f]"
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
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
          <Button onClick={applyFilters} className="h-9 bg-primary hover:bg-primary/90 text-white" size="sm">
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}

