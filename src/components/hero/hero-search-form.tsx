'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'

interface City {
  id: string
  name: string
  slug: string
  province: string | null
}

interface VehicleModel {
  id: string
  name: string
  slug: string
  brand: {
    id: string
    name: string
    slug: string
  }
}

interface HeroSearchFormProps {
  cities: City[]
  vehicleModels: VehicleModel[]
}

export function HeroSearchForm({ cities, vehicleModels }: HeroSearchFormProps) {
  const router = useRouter()
  const [city, setCity] = useState('')
  const [town, setTown] = useState('')
  const [vehicle, setVehicle] = useState('')
  const [towns, setTowns] = useState<Array<{ id: string; name: string; slug: string }>>([])
  const [loadingTowns, setLoadingTowns] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch towns when city changes
  useEffect(() => {
    if (city) {
      const selectedCity = cities.find(c => c.slug === city)
      if (selectedCity) {
        setLoadingTowns(true)
        fetch(`/api/towns?cityId=${selectedCity.id}`)
          .then(res => res.json())
          .then(data => {
            setTowns(data)
            setLoadingTowns(false)
          })
          .catch(() => {
            setLoadingTowns(false)
          })
      } else {
        setTowns([])
      }
      setTown('') // Reset town when city changes
    } else {
      setTowns([])
      setTown('')
    }
  }, [city, cities])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!city) {
      newErrors.city = 'Please select a city'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Build search URL
    const params = new URLSearchParams()
    if (town) params.set('town', town)
    if (vehicle) params.set('vehicle', vehicle)

    const queryString = params.toString()
    const canonicalUrl = `/rent-cars/${city}${queryString ? `?${queryString}` : ''}`

    router.push(canonicalUrl)
  }

  const selectedCity = cities.find(c => c.slug === city)
  const selectedTown = towns.find(t => t.slug === town)
  const selectedVehicle = vehicleModels.find(v => v.slug === vehicle)
  
  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3 gap-4">
          {/* City Field */}
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-semibold text-gray-800">
              FROM (PICK-UP)
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 text-left justify-between bg-white text-gray-900 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors rounded-lg"
                >
                  <span className="truncate text-sm">
                    {selectedCity
                      ? `${selectedCity.name}${selectedCity.province ? ` (${selectedCity.province})` : ''}`
                      : 'Select City'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto">
                <DropdownMenuItem
                  onClick={() => setCity('')}
                  className="cursor-pointer"
                >
                  {!city ? (
                    <Image src={'/icons/checked-checkbox.svg'} alt="All cities" width={16} height={16} className="h-4 w-4" />
                  ) : (
                    <Image src={'/icons/unchecked-checkbox.svg'} alt="All cities" width={16} height={16} className="h-4 w-4" />
                  )}
                  <span>All Cities</span>
                </DropdownMenuItem>
                {cities.map((cityOption) => (
                  <DropdownMenuItem
                    key={cityOption.id}
                    onClick={() => setCity(cityOption.slug)}
                    className="cursor-pointer"
                  >
                    {city === cityOption.slug ? (
                      <Image src={'/icons/checked-checkbox.svg'} alt={cityOption.name} width={16} height={16} className="h-4 w-4" />
                    ) : (
                      <Image src={'/icons/unchecked-checkbox.svg'} alt={cityOption.name} width={16} height={16} className="h-4 w-4" />
                    )}
                    <span>
                      {cityOption.name} {cityOption.province && `(${cityOption.province})`}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {errors.city && (
              <p className="text-xs text-red-600 mt-1">{errors.city}</p>
            )}
          </div>

          {/* Town Field */}
          <div className="space-y-2">
            <Label htmlFor="town" className="text-sm font-semibold text-gray-800">
              TO (DROP-OFF)
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 text-left justify-between bg-white text-gray-900 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!city || loadingTowns}
                >
                  <span className="truncate text-sm">
                    {loadingTowns
                      ? 'Loading...'
                      : selectedTown
                      ? selectedTown.name
                      : 'Select City'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto">
                <DropdownMenuItem
                  onClick={() => setTown('')}
                  className="cursor-pointer"
                  disabled={!city}
                >
                  {!town ? (
                    <Image src={'/icons/checked-checkbox.svg'} alt="All towns" width={16} height={16} className="h-4 w-4" />
                  ) : (
                    <Image src={'/icons/unchecked-checkbox.svg'} alt="All towns" width={16} height={16} className="h-4 w-4" />
                  )}
                  <span>All Towns</span>
                </DropdownMenuItem>
                {towns.map((townOption) => (
                  <DropdownMenuItem
                    key={townOption.id}
                    onClick={() => setTown(townOption.slug)}
                    className="cursor-pointer"
                  >
                    {town === townOption.slug ? (
                      <Image src={'/icons/checked-checkbox.svg'} alt={townOption.name} width={16} height={16} className="h-4 w-4" />
                    ) : (
                      <Image src={'/icons/unchecked-checkbox.svg'} alt={townOption.name} width={16} height={16} className="h-4 w-4" />
                    )}
                    <span>{townOption.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Vehicle Field */}
          <div className="space-y-2 sm:col-span-2 lg:col-span-1 xl:col-span-1">
            <Label htmlFor="vehicle" className="text-sm font-semibold text-gray-800">
              VEHICLE TYPE
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 text-left justify-between bg-white text-gray-900 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors rounded-lg"
                >
                  <span className="truncate text-sm">
                    {selectedVehicle
                      ? `${selectedVehicle.brand.name} ${selectedVehicle.name}`
                      : 'Sedan / Hatchback'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto">
                <DropdownMenuItem
                  onClick={() => setVehicle('')}
                  className="cursor-pointer"
                >
                  {!vehicle ? (
                    <Image src={'/icons/checked-checkbox.svg'} alt="All vehicles" width={16} height={16} className="h-4 w-4" />
                  ) : (
                    <Image src={'/icons/unchecked-checkbox.svg'} alt="All vehicles" width={16} height={16} className="h-4 w-4" />
                  )}
                  <span>All Vehicles</span>
                </DropdownMenuItem>
                {vehicleModels.map((vehicleOption) => (
                  <DropdownMenuItem
                    key={vehicleOption.id}
                    onClick={() => setVehicle(vehicleOption.slug)}
                    className="cursor-pointer"
                  >
                    {vehicle === vehicleOption.slug ? (
                      <Image src={'/icons/checked-checkbox.svg'} alt={`${vehicleOption.brand.name} ${vehicleOption.name}`} width={16} height={16} className="h-4 w-4" />
                    ) : (
                      <Image src={'/icons/unchecked-checkbox.svg'} alt={`${vehicleOption.brand.name} ${vehicleOption.name}`} width={16} height={16} className="h-4 w-4" />
                    )}
                    <span>{vehicleOption.brand.name} {vehicleOption.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Book Now Button */}
        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base font-semibold bg-[#10b981] hover:bg-[#10b981]/90 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Book Now
            </span>
          </Button>
        </div>
      </form>
    </div>
  )
}
