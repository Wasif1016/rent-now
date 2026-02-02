'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { VehicleCard } from '@/components/search/vehicle-card-redesigned'
import { SearchFiltersRealtime } from '@/components/search/search-filters-realtime'
import { EmptyState } from '@/components/search/empty-state'

interface Vehicle {
  id: string
  title: string
  slug: string
  seats?: number | null
  images: string[] | null
  city: { name: string; slug: string }
  town?: { name: string; slug: string } | null
  vehicleType?: { id: string; name: string; slug: string } | null
  vehicleModel?: { name: string; vehicleBrand: { name: string } } | null
  vendor: {
    name: string
    verificationStatus?: string | null
    phone?: string | null
    whatsappPhone?: string | null
  }
  priceWithinCity?: number | null
  priceOutOfCity?: number | null
}

interface SearchPageInnerProps {
  initialVehicles: Vehicle[]
  cities: Array<{ id: string; name: string; slug: string }>
  initialTowns: Array<{ id: string; name: string; slug: string; cityId: string }>
  vehicleTypes: Array<{ id: string; name: string; slug: string }>
}

export function SearchPageInner({ initialVehicles, cities, initialTowns, vehicleTypes }: SearchPageInnerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles)
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(initialVehicles)
  const [towns, setTowns] = useState<Array<{ id: string; name: string; slug: string; cityId: string }>>(initialTowns)

  // Filter states - initialize from URL params
  const [selectedCity, setSelectedCity] = useState<string>(searchParams.get('city') || '')
  const [selectedTown, setSelectedTown] = useState<string>(searchParams.get('town') || '')
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>(searchParams.get('vehicleType') || '')

  // Sync state when URL or server data changes (e.g. "Browse All Vehicles" → /search)
  useEffect(() => {
    setVehicles(initialVehicles)
    setFilteredVehicles(initialVehicles)
  }, [initialVehicles])

  // Sync filter state from URL when URL changes (e.g. after "Browse All Vehicles" → /search)
  const paramsString = searchParams.toString()
  useEffect(() => {
    setSelectedCity(searchParams.get('city') || '')
    setSelectedTown(searchParams.get('town') || '')
    setSelectedVehicleType(searchParams.get('vehicleType') || '')
  }, [paramsString, searchParams])

  // Load towns when city changes via API
  useEffect(() => {
    const loadTowns = async () => {
      if (!selectedCity) {
        setTowns([])
        setSelectedTown('') // Reset town when city is cleared
        return
      }

      const city = cities.find(c => c.slug === selectedCity)
      if (!city) {
        setTowns([])
        return
      }

      try {
        // Fetch towns from API route instead of importing server-side code
        const response = await fetch(`/api/towns?cityId=${city.id}`)
        if (response.ok) {
          const townsData = await response.json()
          setTowns(townsData.map((t: any) => ({
            id: t.id,
            name: t.name,
            slug: t.slug,
            cityId: t.cityId,
          })))
          // Reset town selection if it's not in the new city's towns
          if (selectedTown && !townsData.find((t: any) => t.slug === selectedTown)) {
            setSelectedTown('')
          }
        }
      } catch (error) {
        console.error('Error loading towns:', error)
        setTowns([])
      }
    }

    loadTowns()
  }, [selectedCity, cities, selectedTown])

  // Filter vehicles in real-time
  useEffect(() => {
    let filtered = [...vehicles]

    // Filter by city
    if (selectedCity) {
      filtered = filtered.filter(v => v.city.slug === selectedCity)
    }

    // Filter by town
    if (selectedTown) {
      filtered = filtered.filter(v => v.town?.slug === selectedTown)
    }

    // Filter by vehicle type
    if (selectedVehicleType) {
      filtered = filtered.filter(v => v.vehicleType?.slug === selectedVehicleType)
    }

    setFilteredVehicles(filtered)
  }, [selectedCity, selectedTown, selectedVehicleType, vehicles])

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCity) params.set('city', selectedCity)
    if (selectedTown) params.set('town', selectedTown)
    if (selectedVehicleType) params.set('vehicleType', selectedVehicleType)
    
    const newUrl = params.toString() ? `?${params.toString()}` : ''
    router.replace(`/view-all-vehicles${newUrl}`, { scroll: false })
  }, [selectedCity, selectedTown, selectedVehicleType, router])

  const handleResetFilters = () => {
    setSelectedCity('')
    setSelectedTown('')
    setSelectedVehicleType('')
  }

  const hasActiveFilters = !!(selectedCity || selectedTown || selectedVehicleType)

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1 lg:sticky lg:top-8 lg:self-start">
            <SearchFiltersRealtime
              cities={cities}
              towns={towns}
              vehicleTypes={vehicleTypes}
              selectedCity={selectedCity}
              selectedTown={selectedTown}
              selectedVehicleType={selectedVehicleType}
              onCityChange={setSelectedCity}
              onTownChange={setSelectedTown}
              onVehicleTypeChange={setSelectedVehicleType}
              onReset={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {filteredVehicles.length} {filteredVehicles.length === 1 ? 'Vehicle' : 'Vehicles'} found
                {selectedCity && ` in ${cities.find(c => c.slug === selectedCity)?.name || ''}`}
              </h1>
              <p className="text-gray-600 text-sm">Nationwide verified rentals for every journey.</p>
            </div>

            {filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

