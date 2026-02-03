'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CarFront, Settings2, BadgeDollarSign, Images } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { createClient } from '@/lib/supabase-client'
import type { ChangeEvent } from 'react'

type WizardStep = 1 | 2 | 3 | 4

interface VehicleDraft {
  title: string
  year: string
  plateNumber: string
  cityId: string
  townId: string
  vehicleType: string
  seats: number
  fuelType: string
  transmission: 'MANUAL' | 'AUTOMATIC' | ''
  features: string[]
  priceWithinCity: string
  priceSelfDrive: string
  priceOutOfCity: string
  driverChargesMode: 'INCLUDED' | 'SEPARATE'
  images: string[]
}

const initialDraft: VehicleDraft = {
  title: '',
  year: '',
  plateNumber: '',
  cityId: '',
  townId: '',
  vehicleType: '',
  seats: 4,
  fuelType: '',
  transmission: '',
  features: [],
  priceWithinCity: '',
  priceSelfDrive: '',
  priceOutOfCity: '',
  driverChargesMode: 'SEPARATE',
  images: [],
}

const vehicleTypes = ['Sedan', 'SUV', 'Hiace / Van', 'Bus']

const comfortFeatures = [
  'Air Conditioning',
  'Bluetooth',
  'USB Charging',
  'Leather Seats',
  'Sunroof',
  'Spacious Boot',
]

interface CityOption {
  id: string
  name: string
}

interface TownOption {
  id: string
  name: string
  cityId: string
}

function BasicDetailsStep({
  draft,
  update,
}: {
  draft: VehicleDraft
  update: (partial: Partial<VehicleDraft>) => void
}) {
  const [cities, setCities] = useState<CityOption[]>([])
  const [towns, setTowns] = useState<TownOption[]>([])
  const [loadingCities, setLoadingCities] = useState(false)
  const [loadingTowns, setLoadingTowns] = useState(false)

  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoadingCities(true)
        const res = await fetch('/api/cities')
        if (!res.ok) return
        const data = await res.json()
        setCities(data)
      } finally {
        setLoadingCities(false)
      }
    }
    loadCities()
  }, [])

  useEffect(() => {
    const loadTowns = async () => {
      if (!draft.cityId) {
        setTowns([])
        return
      }
      try {
        setLoadingTowns(true)
        const res = await fetch(`/api/towns?cityId=${draft.cityId}`)
        if (!res.ok) return
        const data = await res.json()
        setTowns(data)
      } finally {
        setLoadingTowns(false)
      }
    }
    loadTowns()
  }, [draft.cityId])

  return (
    <div className="space-y-8">
      {/* General Information Section */}
      <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 md:p-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-base bg-primary px-2 py-1 rounded-lg font-bold text-slate-800">General Information</h3>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Enter the basic details about your vehicle.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-700 font-medium">Vehicle name</Label>
            <Input
              id="title"
              placeholder="e.g., Toyota Corolla Altis"
              className="h-11 ring-offset-background transition-all focus-visible:ring-primary"
              value={draft.title}
              onChange={e => update({ title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year" className="text-slate-700 font-medium">Model year</Label>
            <Input
              id="year"
              type="number"
              placeholder="e.g., 2022"
              className="h-11 ring-offset-background transition-all focus-visible:ring-primary"
              value={draft.year}
              onChange={e => update({ year: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plate" className="text-slate-700 font-medium">License plate number</Label>
            <Input
              id="plate"
              placeholder="e.g., LEB-1234"
              className="h-11 ring-offset-background transition-all focus-visible:ring-primary"
              value={draft.plateNumber}
              onChange={e => update({ plateNumber: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 md:p-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-base bg-primary px-2 py-1 rounded-lg font-bold text-slate-800">Location</h3>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Where is this vehicle located for bookings?
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-slate-700 font-medium">City</Label>
            <select
              id="city"
              value={draft.cityId}
              onChange={e =>
                update({
                  cityId: e.target.value,
                  townId: '',
                })
              }
              className="h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">{loadingCities ? 'Loading cities...' : 'Select city'}</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="town" className="text-slate-700 font-medium">Town</Label>
            <select
              id="town"
              value={draft.townId}
              onChange={e => update({ townId: e.target.value })}
              disabled={!draft.cityId || loadingTowns}
              className="h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">
                {!draft.cityId ? 'Select city first' : loadingTowns ? 'Loading towns...' : 'All towns'}
              </option>
              {towns.map(town => (
                <option key={town.id} value={town.id}>
                  {town.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeaturesStep({
  draft,
  update,
}: {
  draft: VehicleDraft
  update: (partial: Partial<VehicleDraft>) => void
}) {
  const toggleFeature = (feature: string) => {
    const hasFeature = draft.features.includes(feature)
    update({
      features: hasFeature
        ? draft.features.filter(f => f !== feature)
        : [...draft.features, feature],
    })
  }

  const adjustSeats = (delta: number) => {
    const next = Math.max(1, draft.seats + delta)
    update({ seats: next })
  }

  return (
    <div className="space-y-8">
      {/* Vehicle Category Section */}
      <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 md:p-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-base bg-primary px-2 py-1 rounded-lg font-bold text-slate-800">Vehicle Category</h3>
          </div>
          <p className="text-xs leading- text-muted-foreground">
            What type of vehicle are you listing?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {vehicleTypes.map(type => {
            const active = draft.vehicleType === type
            return (
              <button
                key={type}
                type="button"
                onClick={() => update({ vehicleType: type })}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all duration-200 ${
                  active
                    ? 'border-primary bg-white text-primary shadow-md shadow-primary/10 ring-1 ring-primary'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                <span className="text-sm font-bold">{type}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Specifications Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Seating Capacity */}
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
          <Label className="text-slate-700 font-bold">Seating capacity</Label>
          <div className="flex items-center justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-lg transition-colors hover:bg-slate-100 disabled:opacity-30"
              onClick={() => adjustSeats(-1)}
              disabled={draft.seats <= 1}
            >
              −
            </button>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-slate-800">{draft.seats}</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Seats</span>
            </div>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-lg transition-colors hover:bg-slate-100"
              onClick={() => adjustSeats(1)}
            >
              +
            </button>
          </div>
        </div>

        {/* Fuel Type */}
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
          <Label htmlFor="fuelType" className="text-slate-700 font-bold">Fuel type</Label>
          <select
            id="fuelType"
            value={draft.fuelType}
            onChange={e => update({ fuelType: e.target.value })}
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm ring-offset-background transition-all focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select fuel</option>
            <option value="PETROL">Petrol</option>
            <option value="DIESEL">Diesel</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ELECTRIC">Electric</option>
          </select>
        </div>

        {/* Transmission */}
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
          <Label className="text-slate-700 font-bold">Transmission</Label>
          <div className="flex h-12 w-full items-stretch overflow-hidden rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => update({ transmission: 'MANUAL' })}
              className={`flex flex-1 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                draft.transmission === 'MANUAL'
                  ? 'bg-primary text-black shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Manual
            </button>
            <button
              type="button"
              onClick={() => update({ transmission: 'AUTOMATIC' })}
              className={`flex flex-1 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                draft.transmission === 'AUTOMATIC'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Auto
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 md:p-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-lg bg-primary p-2 rounded-lg  font-bold text-primary-foreground md:text-slate-800">Comfort & Tech Features</h3>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Select the extra features available in your vehicle.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {comfortFeatures.map(feature => {
            const active = draft.features.includes(feature)
            return (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={`flex items-center justify-between rounded-xl border p-3.5 text-xs font-bold transition-all duration-200 ${
                  active
                    ? 'border-blue-500 bg-white text-blue-700 shadow-md shadow-blue-50 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:bg-blue-50/10'
                }`}
              >
                <span>{feature}</span>
                {active && <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function PricingStep({
  draft,
  update,
}: {
  draft: VehicleDraft
  update: (partial: Partial<VehicleDraft>) => void
}) {
  return (
    <div className="space-y-8 text-sm">
      {/* Within City Section */}
      <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 md:p-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-base bg-primary rounded-lg p-2 font-bold text-primary-foreground md:text-slate-800">Within City</h3>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Set daily and half-day rates for trips within the city limits.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="priceWithinCity" className="text-slate-700 font-medium">Daily rent (with driver)</Label>
            <div className="group relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary">
                <span className="text-xs font-semibold">Rs.</span>
              </div>
              <Input
                id="priceWithinCity"
                type="number"
                placeholder="e.g., 5,000"
                className="h-11 pl-11 ring-offset-background transition-all focus-visible:ring-primary"
                value={draft.priceWithinCity}
                onChange={e => update({ priceWithinCity: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priceSelfDrive" className="text-slate-700 font-medium">Daily Rent (Self Drive)</Label>
            <div className="group relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary">
                <span className="text-xs font-semibold">Rs.</span>
              </div>
              <Input
                id="priceSelfDrive"
                type="number"
                placeholder="e.g., 3,000"
                className="h-11 pl-11 ring-offset-background transition-all focus-visible:ring-primary"
                value={draft.priceSelfDrive}
                onChange={e => update({ priceSelfDrive: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Outstation Section */}
      <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 md:p-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-base bg-primary rounded-lg p-2 font-bold text-primary-foreground md:text-slate-800">Outstation (Out of City)</h3>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Set rates for inter-city travel and long-distance journeys.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="priceOutOfCity" className="text-slate-700 font-medium">Daily rent (with driver)</Label>
            <div className="group relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500">
                <span className="text-xs font-semibold">Rs.</span>
              </div>
              <Input
                id="priceOutOfCity"
                type="number"
                placeholder="e.g., 7,000"
                className="h-11 pl-11 ring-offset-background transition-all focus-visible:ring-blue-500"
                value={draft.priceOutOfCity}
                onChange={e => update({ priceOutOfCity: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Driver Charges Section */}
      <div className="space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4 md:p-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-base bg-primary rounded-lg p-2 font-bold text-primary-foreground md:text-slate-800">Driver Charges</h3>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            How are the driver&apos;s logistics handled for outstation trips?
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => update({ driverChargesMode: 'INCLUDED' })}
            className={`flex flex-col gap-2 rounded-xl border p-4 text-left transition-all duration-200 ${
              draft.driverChargesMode === 'INCLUDED'
                ? 'border-primary bg-white shadow-md shadow-primary/10 ring-1 ring-primary'
                : 'border-slate-200 bg-white hover:border-primary/50 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800">Included in rent</span>
              {draft.driverChargesMode === 'INCLUDED' && (
                <div className="h-2 w-2 rounded-full bg-primary" />
              )}
            </div>
            <span className="text-[11px] leading-relaxed text-muted-foreground">
              Vendor provides food and stay for driver.
            </span>
          </button>

          <button
            type="button"
            onClick={() => update({ driverChargesMode: 'SEPARATE' })}
            className={`flex flex-col gap-2 rounded-xl border p-4 text-left transition-all duration-200 ${
              draft.driverChargesMode === 'SEPARATE'
                ? 'border-primary bg-white shadow-md shadow-primary/10 ring-1 ring-primary'
                : 'border-slate-200 bg-white hover:border-primary/50 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800">Separate charges</span>
              {draft.driverChargesMode === 'SEPARATE' && (
                <div className="h-2 w-2 rounded-full bg-primary" />
              )}
            </div>
            <span className="text-[11px] leading-relaxed text-muted-foreground">
              Customer pays for driver&apos;s food and stay separately.
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

function PhotosStep({
  draft,
  update,
}: {
  draft: VehicleDraft
  update: (partial: Partial<VehicleDraft>) => void
}) {
  const { user } = useAuth()
  const supabase = useMemo(() => createClient(), [])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return

    if (!user) {
      setUploadError('You must be logged in to upload images.')
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      const uploadedUrls: string[] = []

      for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}`
        const filePath = `vendor-${user.id}/${fileName}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('vehicle-images')
          .upload(filePath, file)

        if (uploadError) {
          throw uploadError
        }

        const { data } = supabase.storage.from('vehicle-images').getPublicUrl(filePath)
        const publicUrl = data.publicUrl
        if (publicUrl) {
          uploadedUrls.push(publicUrl)
        }
      }

      if (uploadedUrls.length) {
        update({ images: [...draft.images, ...uploadedUrls] })
      }
    } catch (error: any) {
      console.error('Error uploading vehicle images:', error)
      const message =
        typeof error?.message === 'string'
          ? error.message
          : 'Failed to upload images. Please try again.'
      setUploadError(message)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const next = draft.images.filter((_, i) => i !== index)
    update({ images: next })
  }

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 md:p-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <h3 className="text-base font-bold text-slate-800">Vehicle Photos</h3>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Upload high-quality images to help customers choose your vehicle faster.
          </p>
        </div>

        <div className="relative">
          <label
            htmlFor="photos"
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 ${
              uploading
                ? 'border-slate-200 bg-slate-50 opacity-60'
                : 'border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/20'
            } min-h-[160px] p-6 text-center`}
          >
            <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${uploading ? 'bg-slate-100' : 'bg-emerald-100'}`}>
              <Images className={`h-6 w-6 ${uploading ? 'text-slate-400' : 'text-primary'}`} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-700">
                {uploading ? 'Uploading images...' : 'Click to upload photos'}
              </p>
              <p className="text-xs text-slate-400">
                JPG, PNG or WebP. Up to 5MB per file.
              </p>
            </div>
            <Input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {uploadError && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600">
            {uploadError}
          </div>
        )}
      </div>

      {/* Preview Section */}
      {draft.images.length > 0 && (
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-700">Uploaded Photos ({draft.images.length})</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {draft.images.map((url, index) => (
              <div key={index} className="group relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Vehicle photo ${index + 1}`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <button
                  type="button"
                  className="absolute right-2 top-2 z-10 rounded-lg bg-red-500 px-2 py-1.5 text-[10px] font-bold text-white shadow-lg transition-all duration-200 hover:bg-red-600 active:scale-95"
                  onClick={() => removeImage(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function validateStep(step: WizardStep, draft: VehicleDraft): string | null {
  if (step === 1) {
    if (!draft.title.trim()) return 'Please enter a vehicle name.'
    if (!draft.year.trim()) return 'Please enter the model year.'
    if (!draft.plateNumber.trim()) return 'Please enter the license plate number.'
    if (!draft.cityId) return 'Please select a city.'
  }

  if (step === 2) {
    if (!draft.vehicleType) return 'Please select a vehicle type.'
    if (!draft.fuelType) return 'Please select a fuel type.'
    if (!draft.transmission) return 'Please choose a transmission.'
  }

  if (step === 3) {
    if (!draft.priceWithinCity.trim() && !draft.priceOutOfCity.trim()) {
      return 'Please provide at least one core price (local daily or outstation daily rent).'
    }
  }

  if (step === 4) {
    if (draft.images.length === 0 || draft.images.every(url => !url.trim())) {
      return 'Please add at least one photo URL before publishing.'
    }
  }

  return null
}

function WizardInner() {
  const [step, setStep] = useState<WizardStep>(1)
  const [draft, setDraft] = useState<VehicleDraft>(initialDraft)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { session } = useAuth()
  const router = useRouter()

  const progress = step * 25

  const updateDraft = (partial: Partial<VehicleDraft>) => {
    setDraft(prev => ({ ...prev, ...partial }))
  }

  const goNext = () => setStep(prev => (prev < 4 ? ((prev + 1) as WizardStep) : prev))
  const goBack = () => setStep(prev => (prev > 1 ? ((prev - 1) as WizardStep) : prev))

  const saveDraft = async () => {
    if (!session) return
    setSaving(true)
    setError(null)
    try {
      const payload = {
        cityId: draft.cityId,
        townId: draft.townId || null,
        title: draft.title.trim() || 'Untitled vehicle',
        year: draft.year ? Number(draft.year) : null,
        mileage: null,
        fuelType: draft.fuelType || null,
        transmission: draft.transmission || null,
        seats: draft.seats || null,
        color: null,
        images: draft.images,
        priceWithDriver: draft.priceWithinCity ? Number(draft.priceWithinCity) : null,
        priceSelfDrive: draft.priceSelfDrive ? Number(draft.priceSelfDrive) : null,
        priceWithinCity: draft.priceWithinCity ? Number(draft.priceWithinCity) : null,
        priceOutOfCity: draft.priceOutOfCity ? Number(draft.priceOutOfCity) : null,
        features: draft.features,
        status: 'DRAFT',
      }

      const response = await fetch('/api/vendor/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save draft')
      }

      router.push('/vendor/vehicles?message=Draft%20saved')
    } catch (err: any) {
      setError(err.message || 'Failed to save draft')
    } finally {
      setSaving(false)
    }
  }

  const publish = async () => {
    if (!session) return
    setPublishing(true)
    setError(null)
    try {
      const payload = {
        cityId: draft.cityId,
        townId: draft.townId || null,
        title: draft.title.trim(),
        year: draft.year ? Number(draft.year) : null,
        mileage: null,
        fuelType: draft.fuelType || null,
        transmission: draft.transmission || null,
        seats: draft.seats || null,
        color: null,
        images: draft.images,
        priceWithDriver: draft.priceWithinCity ? Number(draft.priceWithinCity) : null,
        priceSelfDrive: draft.priceSelfDrive ? Number(draft.priceSelfDrive) : null,
        priceWithinCity: draft.priceWithinCity ? Number(draft.priceWithinCity) : null,
        priceOutOfCity: draft.priceOutOfCity ? Number(draft.priceOutOfCity) : null,
        features: draft.features,
        status: 'PUBLISHED',
      }

      const response = await fetch('/api/vendor/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create vehicle')
      }

      router.push('/vendor/vehicles?message=Vehicle%20added%20successfully')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to create vehicle')
    } finally {
      setPublishing(false)
    }
  }

  const handleContinue = () => {
    const validationError = validateStep(step, draft)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)

    if (step < 4) {
      goNext()
    } else {
      publish()
    }
  }

  return (
    <div className="min-h-screen bg-muted px-4 py-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Add New Vehicle</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Expand your fleet and reach more customers in Pakistan.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push('/vendor/vehicles')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to fleet
          </Button>
        </div>

        {/* Stepper */}
        <div className="rounded-2xl border border-slate-100 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            {[
              { id: 1, label: 'Basic', icon: CarFront },
              { id: 2, label: 'Features', icon: Settings2 },
              { id: 3, label: 'Pricing', icon: BadgeDollarSign },
              { id: 4, label: 'Photos', icon: Images },
            ].map(({ id, label, icon: Icon }, index, arr) => {
              const isActive = step === id
              const isCompleted = step > id
              const isLast = index === arr.length - 1

              return (
                <div key={label} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors ${
                        isCompleted || isActive
                          ? 'border-primary bg-primary text-black'
                          : 'border-slate-200 bg-slate-50 text-slate-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span
                        className={`uppercase tracking-wide ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {!isLast && (
                    <div className="mx-2 h-[2px] flex-1 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width:
                            step > id ? '100%' : step === id ? '50%' : '0%',
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <Card className="border-none bg-background shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">
                  {step === 1 && 'Step 1: Basic Details'}
                  {step === 2 && 'Step 2: Category & Features'}
                  {step === 3 && 'Step 3: Pricing'}
                  {step === 4 && 'Step 4: Photos'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  General information about your vehicle.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold">{progress}%</span>
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && <BasicDetailsStep draft={draft} update={updateDraft} />}
            {step === 2 && <FeaturesStep draft={draft} update={updateDraft} />}
            {step === 3 && <PricingStep draft={draft} update={updateDraft} />}
            {step === 4 && <PhotosStep draft={draft} update={updateDraft} />}

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={step === 1 ? () => router.push('/vendor/vehicles') : goBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={saveDraft}
                >
                  {saving ? 'Saving…' : 'Save as draft'}
                </Button>
                <Button type="button" onClick={handleContinue} disabled={publishing}>
                  {step < 4 ? 'Continue' : publishing ? 'Publishing…' : 'Publish vehicle'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function NewVehiclePage() {
  return (
    <Suspense fallback={null}>
      <WizardInner />
    </Suspense>
  )
}

