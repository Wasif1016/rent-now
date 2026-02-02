'use client'

import { useState, FormEvent, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ChevronDown, X, Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Image from 'next/image'
import { Input } from '../ui/input'

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
  heading?: string
}

type TabType = 'vehicle' | 'route'

export function HeroSearchForm({ cities, vehicleModels, heading }: HeroSearchFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('vehicle')

  // Vehicle tab state
  const [city, setCity] = useState('')
  const [town, setTown] = useState('')
  const [towns, setTowns] = useState<Array<{ id: string; name: string; slug: string }>>([])
  const [loadingTowns, setLoadingTowns] = useState(false)

  // Route tab state
  const [fromCity, setFromCity] = useState('')
  const [toCity, setToCity] = useState('')

  // Modal states - Vehicle tab
  const [isCityModalOpen, setIsCityModalOpen] = useState(false)
  const [isTownModalOpen, setIsTownModalOpen] = useState(false)
  const [citySearchQuery, setCitySearchQuery] = useState('')
  const [townSearchQuery, setTownSearchQuery] = useState('')
  const [showAllCities, setShowAllCities] = useState(false)
  const [showAllTowns, setShowAllTowns] = useState(false)

  // Modal states - Route tab
  const [isFromCityModalOpen, setIsFromCityModalOpen] = useState(false)
  const [isToCityModalOpen, setIsToCityModalOpen] = useState(false)
  const [fromCitySearchQuery, setFromCitySearchQuery] = useState('')
  const [toCitySearchQuery, setToCitySearchQuery] = useState('')
  const [showAllFromCities, setShowAllFromCities] = useState(false)
  const [showAllToCities, setShowAllToCities] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch towns when city changes (for vehicle tab)
  useEffect(() => {
    if (city && activeTab === 'vehicle') {
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
  }, [city, cities, activeTab])

  // Reset modal state when modals close
  useEffect(() => {
    if (!isCityModalOpen) {
      setCitySearchQuery('')
      setShowAllCities(false)
    }
  }, [isCityModalOpen])

  useEffect(() => {
    if (!isTownModalOpen) {
      setTownSearchQuery('')
      setShowAllTowns(false)
    }
  }, [isTownModalOpen])

  useEffect(() => {
    if (!isFromCityModalOpen) {
      setFromCitySearchQuery('')
      setShowAllFromCities(false)
    }
  }, [isFromCityModalOpen])

  useEffect(() => {
    if (!isToCityModalOpen) {
      setToCitySearchQuery('')
      setShowAllToCities(false)
    }
  }, [isToCityModalOpen])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (activeTab === 'vehicle') {
      if (!city) {
        newErrors.city = 'Please select a city'
      }
    } else if (activeTab === 'route') {
      if (!fromCity) {
        newErrors.fromCity = 'Please select a from city'
      }
      if (!toCity) {
        newErrors.toCity = 'Please select a to city'
      }
      if (fromCity && toCity && fromCity === toCity) {
        newErrors.toCity = 'To city must be different from from city'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (activeTab === 'vehicle') {
      // Redirect to search results page with city and optional town
      const params = new URLSearchParams()
      params.set('city', city)
      if (town) params.set('town', town)

      const queryString = params.toString()
      router.push(`/search?${queryString}`)
    } else if (activeTab === 'route') {
      // Build route URL: /routes/{fromSlug}-to-{toSlug}
      const fromCityData = cities.find(c => c.slug === fromCity)
      const toCityData = cities.find(c => c.slug === toCity)

      if (fromCityData && toCityData) {
        const routeUrl = `/routes/${fromCityData.slug}-to-${toCityData.slug}`
        router.push(routeUrl)
      }
    }
  }

  const selectedCity = cities.find(c => c.slug === city)
  const selectedTown = towns.find(t => t.slug === town)
  const selectedFromCity = cities.find(c => c.slug === fromCity)
  const selectedToCity = cities.find(c => c.slug === toCity)

  // Filtered cities for modal
  const filteredCities = useMemo(() => {
    if (!citySearchQuery.trim()) return cities
    const query = citySearchQuery.toLowerCase()
    return cities.filter(c =>
      c.name.toLowerCase().includes(query) ||
      (c.province && c.province.toLowerCase().includes(query))
    )
  }, [cities, citySearchQuery])

  // Filtered towns for modal
  const filteredTowns = useMemo(() => {
    if (!townSearchQuery.trim()) return towns
    const query = townSearchQuery.toLowerCase()
    return towns.filter(t => t.name.toLowerCase().includes(query))
  }, [towns, townSearchQuery])

  // Filtered cities for route modals
  const filteredFromCities = useMemo(() => {
    if (!fromCitySearchQuery.trim()) return cities
    const query = fromCitySearchQuery.toLowerCase()
    return cities.filter(c =>
      c.name.toLowerCase().includes(query) ||
      (c.province && c.province.toLowerCase().includes(query))
    )
  }, [cities, fromCitySearchQuery])

  const filteredToCities = useMemo(() => {
    if (!toCitySearchQuery.trim()) return cities.filter(c => c.slug !== fromCity)
    const query = toCitySearchQuery.toLowerCase()
    return cities.filter(c =>
      c.slug !== fromCity &&
      (c.name.toLowerCase().includes(query) ||
        (c.province && c.province.toLowerCase().includes(query)))
    )
  }, [cities, toCitySearchQuery, fromCity])

  // Top cities (first 10)
  const topCities = filteredCities.slice(0, 10)
  const displayedCities = showAllCities ? filteredCities : topCities

  // Top towns (first 10)
  const topTowns = filteredTowns.slice(0, 10)
  const displayedTowns = showAllTowns ? filteredTowns : topTowns

  // Top route cities (first 10)
  const topFromCities = filteredFromCities.slice(0, 10)
  const displayedFromCities = showAllFromCities ? filteredFromCities : topFromCities

  const topToCities = filteredToCities.slice(0, 10)
  const displayedToCities = showAllToCities ? filteredToCities : topToCities

  const handleCitySelect = (citySlug: string) => {
    setCity(citySlug)
    setIsCityModalOpen(false)
    setCitySearchQuery('')
    setShowAllCities(false)
  }

  const handleTownSelect = (townSlug: string) => {
    setTown(townSlug)
    setIsTownModalOpen(false)
    setTownSearchQuery('')
    setShowAllTowns(false)
  }

  const handleFromCitySelect = (citySlug: string) => {
    setFromCity(citySlug)
    setIsFromCityModalOpen(false)
    setFromCitySearchQuery('')
    setShowAllFromCities(false)
    if (citySlug === toCity) {
      setToCity('')
    }
  }

  const handleToCitySelect = (citySlug: string) => {
    setToCity(citySlug)
    setIsToCityModalOpen(false)
    setToCitySearchQuery('')
    setShowAllToCities(false)
  }

  return (
    <div className="bg-primary p-6 ">
      {/* Tabs */}
      <div className="flex gap-0 mb-4">
        <button
          type="button"
          onClick={() => {
            setActiveTab('vehicle')
            setErrors({})
          }}
          className={`cursor-pointer bg-foreground/10 py-1.5 px-4 border text-xs font-semibold transition-colors border-b-2 ${activeTab === 'vehicle'
              ? 'border-primary-foreground text-primary-foreground'
              : 'border-transparent'
            }`}
        >
          Vehicle
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('route')
            setErrors({})
          }}
          className={`cursor-pointer bg-foreground/10 py-1.5 px-4 border text-xs font-semibold transition-colors border-b-2 ${activeTab === 'route'
              ? 'border-primary-foreground text-primary-foreground'
              : 'border-transparent'
            }`}
        >
          Route
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {activeTab === 'vehicle' ? (
          <>
            {/* Vehicle Tab Content */}
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl lg:text-2xl font-bold black leading-tight">
                {heading ?? 'Book Verified Cars, Hiace, Vans & Buses Across Pakistan'}
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Search by vehicles near you</p>
            </div>
            <div className="space-y-4">
              {/* City Field */}
              <div className="space-y-2">
                <Label htmlFor="city" className="text-xs font-semibold text-foreground">
                  Select city
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCityModalOpen(true)}
                  className="w-full h-10 text-left justify-between bg-background text-foreground  hover:bg-gray-50 hover:border-gray-400 transition-colors rounded-none"
                >
                  <span className="truncate text-sm">
                    {selectedCity
                      ? `${selectedCity.name}${selectedCity.province ? ` (${selectedCity.province})` : ''}`
                      : 'Select City'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500 shrink-0 ml-2" />
                </Button>
                {errors.city && (
                  <p className="text-xs text-red-600 mt-1">{errors.city}</p>
                )}
              </div>

              {/* City Selection Modal */}
              <Dialog open={isCityModalOpen} onOpenChange={setIsCityModalOpen}>
                <DialogContent className="max-w-xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col p-0 [&>button]:hidden">
                  <DialogHeader className="px-5 py-3 border-b">
                    <div className="flex items-center justify-between">
                      <DialogTitle className="text-xl font-bold">Choose City</DialogTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setIsCityModalOpen(false)
                          setCitySearchQuery('')
                          setShowAllCities(false)
                        }}
                        className="h-8 w-8 rounded-full hover:bg-gray-100"
                      >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                      </Button>
                    </div>
                  </DialogHeader>

                  <div className="px-5 pt-2 pb-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search for city"
                        value={citySearchQuery}
                        onChange={(e) => setCitySearchQuery(e.target.value)}
                        className="w-full pl-10 border-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 pb-6">
                    <h3 className="text-md font-semibold mb-1 text-muted-foreground mt-2">Top Cities</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {displayedCities.map((cityOption) => (
                        <button
                          key={cityOption.id}
                          type="button"
                          onClick={() => handleCitySelect(cityOption.slug)}
                          className="flex flex-col items-center p-4 border border-border/30 bg-primary/30 hover:bg-primary/40 transition-all cursor-pointer group"
                        >
                          <div className="w-10 h-10 mb-2 rounded-full bg-primary/70 group-hover:bg-primary/80 flex items-center justify-center">
                            <span className="text-md">{cityOption.name.charAt(0)}</span>
                          </div>
                          <span className="text-xs font-medium text-center">
                            {cityOption.name}
                          </span>
                          {/* {cityOption.province && (
                            <span className="text-xs text-gray-500 mt-1">
                              {cityOption.province}
                            </span>
                          )} */}
                        </button>
                      ))}
                    </div>

                    {filteredCities.length > 10 && !showAllCities && (
                      <button
                        type="button"
                        onClick={() => setShowAllCities(true)}
                        className="mt-6 w-full flex items-center justify-center gap-2 text-[#10b981] font-medium hover:text-[#059669] transition-colors"
                      >
                        View More
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    )}

                    {filteredCities.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No cities found matching "{citySearchQuery}"
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Town Field */}
              <div className="space-y-2">
                <Label htmlFor="town" className="text-xs font-semibold text-foreground">
                  Select Town
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsTownModalOpen(true)}
                  disabled={!city || loadingTowns}
                  className="w-full h-10 text-left justify-between bg-background text-foreground  hover:bg-gray-50 hover:border-gray-400 transition-colors rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="truncate text-sm">
                    {loadingTowns
                      ? 'Loading...'
                      : selectedTown
                        ? selectedTown.name
                        : 'Select Town'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500 shrink-0 ml-2" />
                </Button>
              </div>

              {/* Town Selection Modal */}
              <Dialog open={isTownModalOpen} onOpenChange={setIsTownModalOpen}>
                <DialogContent className="max-w-xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col p-0 [&>button]:hidden">
                  <DialogHeader className="px-5 py-3 border-b">
                    <div className="flex items-center justify-between">
                      <DialogTitle className="text-xl font-bold">Choose Town</DialogTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setIsTownModalOpen(false)
                          setTownSearchQuery('')
                          setShowAllTowns(false)
                        }}
                        className="h-8 w-8 rounded-full hover:bg-gray-100"
                      >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                      </Button>
                    </div>
                  </DialogHeader>

                  <div className="px-5 pt-2 pb-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search for town"
                        value={townSearchQuery}
                        onChange={(e) => setTownSearchQuery(e.target.value)}
                        className="w-full pl-10 border-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 pb-6">
                    <h3 className="text-md font-semibold mb-1 text-muted-foreground mt-2">Top Towns</h3>
                    {loadingTowns ? (
                      <div className="text-center py-8 text-gray-500">Loading towns...</div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {displayedTowns.map((townOption) => (
                            <button
                              key={townOption.id}
                              type="button"
                              onClick={() => handleTownSelect(townOption.slug)}
                              className="flex flex-col items-center p-4 border border-border/30 bg-primary/30 hover:bg-primary/40 transition-all cursor-pointer group"
                            >
                              <div className="w-10 h-10 mb-2 rounded-full bg-primary/70 group-hover:bg-primary/80 flex items-center justify-center">
                                <span className="text-md">{townOption.name.charAt(0)}</span>
                              </div>
                              <span className="text-xs font-medium text-center">
                                {townOption.name}
                              </span>
                            </button>
                          ))}
                        </div>

                        {filteredTowns.length > 10 && !showAllTowns && (
                          <button
                            type="button"
                            onClick={() => setShowAllTowns(true)}
                            className="mt-6 w-full flex items-center justify-center gap-2 text-[#10b981] font-medium hover:text-[#059669] transition-colors"
                          >
                            View More
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        )}

                        {filteredTowns.length === 0 && !loadingTowns && (
                          <div className="text-center py-8 text-gray-500">
                            {townSearchQuery ? `No towns found matching "${townSearchQuery}"` : 'No towns available'}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </>
        ) : (
          <>
            {/* Route Tab Content */}
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl lg:text-2xl font-bold black leading-tight">
                {heading ?? 'Book Verified Cars, Hiace, Vans & Buses Across Pakistan'}
              </h1>
            </div>
            <div className="space-y-4">
              {/* From City Field */}
              <div className="space-y-2">
                <Label htmlFor="fromCity" className="text-xs font-semibold text-foreground">
                  Select From
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFromCityModalOpen(true)}
                  className="w-full h-10 text-left justify-between bg-background text-foreground  hover:bg-gray-50 hover:border-gray-400 transition-colors rounded-none"
                >
                  <span className="truncate text-sm">
                    {selectedFromCity
                      ? `${selectedFromCity.name}${selectedFromCity.province ? ` (${selectedFromCity.province})` : ''}`
                      : 'Select From City'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500 shrink-0 ml-2" />
                </Button>
                {errors.fromCity && (
                  <p className="text-xs text-red-600 mt-1">{errors.fromCity}</p>
                )}
              </div>

              {/* From City Selection Modal */}
              <Dialog open={isFromCityModalOpen} onOpenChange={setIsFromCityModalOpen}>
                <DialogContent className="max-w-xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col p-0 [&>button]:hidden">
                  <DialogHeader className="px-5 py-3 border-b">
                    <div className="flex items-center justify-between">
                      <DialogTitle className="text-xl font-bold">Choose From City</DialogTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setIsFromCityModalOpen(false)
                          setFromCitySearchQuery('')
                          setShowAllFromCities(false)
                        }}
                        className="h-8 w-8 rounded-full hover:bg-gray-100"
                      >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                      </Button>
                    </div>
                  </DialogHeader>

                  <div className="px-5 pt-2 pb-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search for city"
                        value={fromCitySearchQuery}
                        onChange={(e) => setFromCitySearchQuery(e.target.value)}
                        className="w-full pl-10 border-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 pb-6">
                    <h3 className="text-md font-semibold mb-1 text-muted-foreground mt-2">Top Cities</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {displayedFromCities.map((cityOption) => (
                        <button
                          key={cityOption.id}
                          type="button"
                          onClick={() => handleFromCitySelect(cityOption.slug)}
                          className="flex flex-col items-center p-4 border border-border/30 bg-primary/30 hover:bg-primary/40 transition-all cursor-pointer group"
                        >
                          <div className="w-10 h-10 mb-2 rounded-full bg-primary/70 group-hover:bg-primary/80 flex items-center justify-center">
                            <span className="text-md">{cityOption.name.charAt(0)}</span>
                          </div>
                          <span className="text-xs font-medium text-center">
                            {cityOption.name}
                          </span>
                          {/* {cityOption.province && (
                            <span className="text-xs text-gray-500 mt-1">
                              {cityOption.province}
                            </span>
                          )} */}
                        </button>
                      ))}
                    </div>

                    {filteredFromCities.length > 10 && !showAllFromCities && (
                      <button
                        type="button"
                        onClick={() => setShowAllFromCities(true)}
                        className="mt-6 w-full flex items-center justify-center gap-2 text-[#10b981] font-medium hover:text-[#059669] transition-colors"
                      >
                        View More
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    )}

                    {filteredFromCities.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No cities found matching "{fromCitySearchQuery}"
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {/* To City Field */}
              <div className="space-y-2">
                <Label htmlFor="toCity" className="text-xs font-semibold text-foreground">
                  Select To
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsToCityModalOpen(true)}
                  className="w-full h-10 text-left justify-between bg-background text-foreground  hover:bg-gray-50 hover:border-gray-400 transition-colors rounded-none"
                >
                  <span className="truncate text-sm">
                    {selectedToCity
                      ? `${selectedToCity.name}${selectedToCity.province ? ` (${selectedToCity.province})` : ''}`
                      : 'Select To City'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500 shrink-0 ml-2" />
                </Button>
                {errors.toCity && (
                  <p className="text-xs text-red-600 mt-1">{errors.toCity}</p>
                )}
              </div>

              {/* To City Selection Modal */}
              <Dialog open={isToCityModalOpen} onOpenChange={setIsToCityModalOpen}>
                <DialogContent className="max-w-xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col p-0 [&>button]:hidden">
                  <DialogHeader className="px-5 py-3 border-b">
                    <div className="flex items-center justify-between">
                      <DialogTitle className="text-xl font-bold">Choose To City</DialogTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setIsToCityModalOpen(false)
                          setToCitySearchQuery('')
                          setShowAllToCities(false)
                        }}
                        className="h-8 w-8 rounded-full hover:bg-gray-100"
                      >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                      </Button>
                    </div>
                  </DialogHeader>

                  <div className="px-5 pt-2 pb-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search for city"
                        value={toCitySearchQuery}
                        onChange={(e) => setToCitySearchQuery(e.target.value)}
                        className="w-full pl-10 border-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 pb-6">
                    <h3 className="text-md font-semibold mb-1 text-muted-foreground mt-2">Top Cities</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {displayedToCities.map((cityOption) => (
                        <button
                          key={cityOption.id}
                          type="button"
                          onClick={() => handleToCitySelect(cityOption.slug)}
                          className="flex flex-col items-center p-4 border border-border/30 bg-primary/30 hover:bg-primary/40 transition-all cursor-pointer group"
                        >
                          <div className="w-10 h-10 mb-2 rounded-full bg-primary/70 group-hover:bg-primary/80 flex items-center justify-center">
                            <span className="text-md">{cityOption.name.charAt(0)}</span>
                          </div>
                          <span className="text-xs font-medium text-center">
                            {cityOption.name}
                          </span>
                          {/* {cityOption.province && (
                            <span className="text-xs text-gray-500 mt-1">
                              {cityOption.province}
                            </span>
                          )} */}
                        </button>
                      ))}
                    </div>

                    {filteredToCities.length > 10 && !showAllToCities && (
                      <button
                        type="button"
                        onClick={() => setShowAllToCities(true)}
                        className="mt-6 w-full flex items-center justify-center gap-2 text-[#10b981] font-medium hover:text-[#059669] transition-colors"
                      >
                        View More
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    )}

                    {filteredToCities.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No cities found matching "{toCitySearchQuery}"
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}

        {/* Search Button */}
        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            className="w-fit h-10 text-md font-semibold bg-foreground hover:bg-foreground/90 text-background rounded-none transition-all"
          >
            <Image src="/icons/car.svg" alt="Search" width={20} height={20} className="w-fit h-8" 
            style={{
              transform: 'scaleX(-1)',
            }}
            />
            Search
          </Button>
        </div>
      </form>
    </div>
  )
}
