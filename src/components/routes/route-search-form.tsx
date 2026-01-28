'use client'

import { useState, FormEvent, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { MapPin, Send, Search } from 'lucide-react'
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

interface RouteSearchFormProps {
  cities: City[]
}

export function RouteSearchForm({ cities }: RouteSearchFormProps) {
  const router = useRouter()
  const [fromCity, setFromCity] = useState('')
  const [toCity, setToCity] = useState('')
  
  // Modal states
  const [isFromCityModalOpen, setIsFromCityModalOpen] = useState(false)
  const [isToCityModalOpen, setIsToCityModalOpen] = useState(false)
  const [fromCitySearchQuery, setFromCitySearchQuery] = useState('')
  const [toCitySearchQuery, setToCitySearchQuery] = useState('')
  const [showAllFromCities, setShowAllFromCities] = useState(false)
  const [showAllToCities, setShowAllToCities] = useState(false)
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const selectedFromCity = cities.find(c => c.slug === fromCity)
  const selectedToCity = cities.find(c => c.slug === toCity)

  // Filtered cities for modals
  const filteredFromCities = useMemo(() => {
    if (!fromCitySearchQuery.trim()) return cities
    const query = fromCitySearchQuery.toLowerCase()
    return cities.filter(c =>
      c.name.toLowerCase().includes(query) ||
      (c.province && c.province.toLowerCase().includes(query))
    )
  }, [cities, fromCitySearchQuery])

  const filteredToCities = useMemo(() => {
    if (!toCitySearchQuery.trim()) return cities
    const query = toCitySearchQuery.toLowerCase()
    return cities.filter(c =>
      c.name.toLowerCase().includes(query) ||
      (c.province && c.province.toLowerCase().includes(query))
    )
  }, [cities, toCitySearchQuery])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!fromCity) {
      newErrors.fromCity = 'Please select a departure city'
    }

    if (!toCity) {
      newErrors.toCity = 'Please select a destination city'
    }

    if (fromCity && toCity && fromCity === toCity) {
      newErrors.toCity = 'Destination must be different from departure'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Navigate to routes page with query params for search
    const params = new URLSearchParams()
    params.set('fromCity', fromCity)
    params.set('toCity', toCity)
    
    router.push(`/routes?${params.toString()}`)
  }

  const displayedFromCities = showAllFromCities ? filteredFromCities : filteredFromCities.slice(0, 12)
  const displayedToCities = showAllToCities ? filteredToCities : filteredToCities.slice(0, 12)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Departure City */}
        <div className="space-y-2">
          <Label htmlFor="from-city" className="text-white">
            Departure
          </Label>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between h-14 bg-white/10 border-gray-600 text-white hover:bg-white/20"
            onClick={() => setIsFromCityModalOpen(true)}
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className={selectedFromCity ? 'text-white' : 'text-gray-400'}>
                {selectedFromCity ? selectedFromCity.name : 'Enter Departure City'}
              </span>
            </div>
          </Button>
          {errors.fromCity && (
            <p className="text-sm text-red-500">{errors.fromCity}</p>
          )}
        </div>

        {/* Destination City */}
        <div className="space-y-2">
          <Label htmlFor="to-city" className="text-white">
            Destination
          </Label>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between h-14 bg-white/10 border-gray-600 text-white hover:bg-white/20"
            onClick={() => setIsToCityModalOpen(true)}
          >
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              <span className={selectedToCity ? 'text-white' : 'text-gray-400'}>
                {selectedToCity ? selectedToCity.name : 'Enter Destination City'}
              </span>
            </div>
          </Button>
          {errors.toCity && (
            <p className="text-sm text-red-500">{errors.toCity}</p>
          )}
        </div>
      </div>

      {/* Find Routes Button */}
      <Button
        type="submit"
        className="w-full md:w-auto h-14 bg-primary hover:bg-primary/90 text-white px-8"
      >
        <Search className="h-5 w-5 mr-2" />
        Find Routes
      </Button>

      {/* From City Modal */}
      <Dialog open={isFromCityModalOpen} onOpenChange={setIsFromCityModalOpen}>
        <DialogContent className="max-w-md bg-[#1a1a1a] border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Select Departure City</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search cities..."
              value={fromCitySearchQuery}
              onChange={(e) => setFromCitySearchQuery(e.target.value)}
              className="bg-[#0f0f0f] border-gray-700 text-white"
            />
            <div className="max-h-[400px] overflow-y-auto space-y-1">
              {displayedFromCities.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => {
                    setFromCity(city.slug)
                    setIsFromCityModalOpen(false)
                    setFromCitySearchQuery('')
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#0f0f0f] text-left transition-colors"
                >
                  {fromCity === city.slug ? (
                    <Image src={'/icons/checked-checkbox.svg'} alt={city.name} width={20} height={20} className="h-5 w-5 shrink-0" />
                  ) : (
                    <Image src={'/icons/unchecked-checkbox.svg'} alt={city.name} width={20} height={20} className="h-5 w-5 shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-white font-medium">{city.name}</p>
                    {city.province && (
                      <p className="text-sm text-gray-400">{city.province}</p>
                    )}
                  </div>
                </button>
              ))}
              {filteredFromCities.length > 12 && !showAllFromCities && (
                <button
                  type="button"
                  onClick={() => setShowAllFromCities(true)}
                  className="w-full text-center py-2 text-primary hover:underline"
                >
                  Show all cities
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* To City Modal */}
      <Dialog open={isToCityModalOpen} onOpenChange={setIsToCityModalOpen}>
        <DialogContent className="max-w-md bg-[#1a1a1a] border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Select Destination City</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search cities..."
              value={toCitySearchQuery}
              onChange={(e) => setToCitySearchQuery(e.target.value)}
              className="bg-[#0f0f0f] border-gray-700 text-white"
            />
            <div className="max-h-[400px] overflow-y-auto space-y-1">
              {displayedToCities.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => {
                    setToCity(city.slug)
                    setIsToCityModalOpen(false)
                    setToCitySearchQuery('')
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#0f0f0f] text-left transition-colors"
                >
                  {toCity === city.slug ? (
                    <Image src={'/icons/checked-checkbox.svg'} alt={city.name} width={20} height={20} className="h-5 w-5 shrink-0" />
                  ) : (
                    <Image src={'/icons/unchecked-checkbox.svg'} alt={city.name} width={20} height={20} className="h-5 w-5 shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-white font-medium">{city.name}</p>
                    {city.province && (
                      <p className="text-sm text-gray-400">{city.province}</p>
                    )}
                  </div>
                </button>
              ))}
              {filteredToCities.length > 12 && !showAllToCities && (
                <button
                  type="button"
                  onClick={() => setShowAllToCities(true)}
                  className="w-full text-center py-2 text-primary hover:underline"
                >
                  Show all cities
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  )
}

