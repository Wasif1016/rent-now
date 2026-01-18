'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Search, ChevronDown, CheckSquare, Square } from 'lucide-react'
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

interface Town {
  id: string
  name: string
  slug: string
  cityId: string
}

interface Brand {
  id: string
  name: string
  slug: string
}

interface HeroSearchFormProps {
  cities: City[]
  brands: Brand[]
}

export function HeroSearchForm({ cities, brands }: HeroSearchFormProps) {
  const router = useRouter()
  const [city, setCity] = useState('')
  const [town, setTown] = useState('')
  const [brand, setBrand] = useState('')
  const [towns, setTowns] = useState<Town[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch towns when city changes
  useEffect(() => {
    const fetchTowns = async () => {
      if (!city) {
        setTowns([])
        setTown('')
        return
      }

      const selectedCity = cities.find(c => c.slug === city)
      if (!selectedCity) return

      try {
        const response = await fetch(`/api/towns?cityId=${selectedCity.id}`)
        if (response.ok) {
          const data = await response.json()
          setTowns(data)
        }
      } catch (error) {
        console.error('Error fetching towns:', error)
      }
    }

    fetchTowns()
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

    // Build canonical URL
    if (city) {
      const params = new URLSearchParams()
      if (town) params.set('town', town)
      if (brand) params.set('brand', brand)

      const queryString = params.toString()
      const canonicalUrl = `/rent-cars/${city}${queryString ? `?${queryString}` : ''}`

      router.push(canonicalUrl)
    } else {
      // Fallback to search page with query params
      const params = new URLSearchParams()
      if (city) params.set('city', city)
      if (town) params.set('town', town)
      if (brand) params.set('brand', brand)

      router.push(`/search?${params.toString()}`)
    }
  }

  const selectedCity = cities.find(c => c.slug === city)
  const selectedTown = towns.find(t => t.slug === town)
  const selectedBrand = brands.find(b => b.slug === brand)

  return (
    <div className="bg-background/95 backdrop-blur-3xl rounded-md p-6 lg:p-8 shadow-2xl">
      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold mb-2 ">
          Looking for Best Car Rentals?
        </h2>
        <p className="text-sm lg:text-base /80">
          Book Self-Drive Car Rentals Across Pakistan
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* City Field */}
        <div className="">
          <Label htmlFor="city" className="text-sm text-foreground/80">
            City
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="mt-0.5 w-full text-base justify-between bg-background text-foreground "
              >
                <span className="truncate">
                  {selectedCity
                    ? `${selectedCity.name}${selectedCity.province ? ` (${selectedCity.province})` : ''}`
                    : 'Select city'}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) max-h-[300px] overflow-y-auto">
              {cities.map((cityOption) => (
                <DropdownMenuItem
                  key={cityOption.id}
                  onClick={() => {
                    setCity(cityOption.slug)
                    setTown('') // Reset town when city changes
                  }}
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
            <p className="text-xs text-destructive mt-1">{errors.city}</p>
          )}
        </div>

        {/* Town Field */}
        <div className="">
          <Label htmlFor="town" className="text-sm text-foreground/80">
            Location
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                disabled={!city || towns.length === 0}
                className="mt-0.5 w-full text-base justify-between bg-background text-foreground  disabled:opacity-50"
              >
                <span className="truncate">
                  {selectedTown
                    ? selectedTown.name
                    : !city
                      ? 'Select city first'
                      : towns.length === 0
                        ? 'No towns available'
                        : 'All towns'}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            {city && towns.length > 0 && (
              <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) max-h-[300px] overflow-y-auto">
                <DropdownMenuItem
                  onClick={() => setTown('')}
                  className="cursor-pointer"
                >
                  {!town ? (
                      <Image src={'/icons/checked-checkbox.svg'} alt="All towns" width={16} height={16} className="h-4 w-4" />
                  ) : (
                    <Image src={'/icons/unchecked-checkbox.svg'} alt="All towns" width={16} height={16} className="h-4 w-4" />
                  )}
                  <span>All towns</span>
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
            )}
          </DropdownMenu>
        </div>

        {/* Brand Field */}
        <div className="">
          <Label htmlFor="brand" className="text-sm text-foreground/80">
            Vehicle Brand
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="mt-0.5 w-full text-base justify-between bg-background text-foreground "
              >
                <span className="truncate">
                  {selectedBrand ? selectedBrand.name : 'All brands'}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) max-h-[300px] overflow-y-auto">
              <DropdownMenuItem
                onClick={() => setBrand('')}
                className="cursor-pointer"
              >
                {!brand ? (
                  <Image src={'/icons/checked-checkbox.svg'} alt="All brands" width={16} height={16} className="h-4 w-4" />
                ) : (
                  <Image src={'/icons/unchecked-checkbox.svg'} alt="All brands" width={16} height={16} className="h-4 w-4" />
                )}
                <span>All brands</span>
              </DropdownMenuItem>
              {brands.map((brandOption) => (
                <DropdownMenuItem
                  key={brandOption.id}
                  onClick={() => setBrand(brandOption.slug)}
                  className="cursor-pointer"
                >
                  {brand === brandOption.slug ? (
                    <Image src={'/icons/checked-checkbox.svg'} alt={brandOption.name} width={16} height={16} className="h-4 w-4" />
                  ) : (
                    <Image src={'/icons/unchecked-checkbox.svg'} alt={brandOption.name} width={16} height={16} className="h-4 w-4" />
                  )}
                  <span>{brandOption.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search Button */}
        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            className="w-full text-base font-semibold bg-primary hover:bg-primary/90  rounded-lg transition-all"
          >
            <Search className="h-5 w-5" />
            SEARCH
          </Button>
        </div>
      </form>
    </div>
  )
}
