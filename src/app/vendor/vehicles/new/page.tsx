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
  priceLocalDaily: string
  priceLocalHalfDay: string
  priceOutstationBase: string
  priceOutstationExtraKm: string
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
  priceLocalDaily: '',
  priceLocalHalfDay: '',
  priceOutstationBase: '',
  priceOutstationExtraKm: '',
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="title">Vehicle name</Label>
          <Input
            id="title"
            placeholder="e.g., Toyota Corolla Altis"
            value={draft.title}
            onChange={e => update({ title: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="year">Model year</Label>
          <Input
            id="year"
            type="number"
            placeholder="e.g., 2022"
            value={draft.year}
            onChange={e => update({ year: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="plate">License plate number</Label>
          <Input
            id="plate"
            placeholder="e.g., LEB-1234"
            value={draft.plateNumber}
            onChange={e => update({ plateNumber: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="city">City</Label>
          <select
            id="city"
            value={draft.cityId}
            onChange={e =>
              update({
                cityId: e.target.value,
                townId: '',
              })
            }
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            <option value="">{loadingCities ? 'Loading cities...' : 'Select city'}</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="town">Town</Label>
          <select
            id="town"
            value={draft.townId}
            onChange={e => update({ townId: e.target.value })}
            disabled={!draft.cityId || loadingTowns}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
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
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Vehicle type</Label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {vehicleTypes.map(type => {
            const active = draft.vehicleType === type
            return (
              <button
                key={type}
                type="button"
                onClick={() => update({ vehicleType: type })}
                className={`flex items-center justify-center rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                  active
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-border bg-background text-muted-foreground hover:border-emerald-300'
                }`}
              >
                {type}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Seating capacity</Label>
          <div className="inline-flex items-center rounded-full border bg-background px-3 py-1.5 text-sm">
            <button
              type="button"
              className="px-2 text-lg leading-none text-muted-foreground"
              onClick={() => adjustSeats(-1)}
            >
              −
            </button>
            <span className="mx-3 w-6 text-center font-semibold">{draft.seats}</span>
            <button
              type="button"
              className="px-2 text-lg leading-none text-muted-foreground"
              onClick={() => adjustSeats(1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="fuelType">Fuel type</Label>
          <select
            id="fuelType"
            value={draft.fuelType}
            onChange={e => update({ fuelType: e.target.value })}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            <option value="">Select fuel type</option>
            <option value="PETROL">Petrol</option>
            <option value="DIESEL">Diesel</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ELECTRIC">Electric</option>
          </select>
        </div>

        <div className="space-y-1">
          <Label>Transmission</Label>
          <div className="inline-flex rounded-full border bg-background p-1 text-xs">
            <button
              type="button"
              onClick={() => update({ transmission: 'MANUAL' })}
              className={`rounded-full px-3 py-1 font-medium ${
                draft.transmission === 'MANUAL'
                  ? 'bg-emerald-500 text-white'
                  : 'text-muted-foreground'
              }`}
            >
              Manual
            </button>
            <button
              type="button"
              onClick={() => update({ transmission: 'AUTOMATIC' })}
              className={`rounded-full px-3 py-1 font-medium ${
                draft.transmission === 'AUTOMATIC'
                  ? 'bg-emerald-500 text-white'
                  : 'text-muted-foreground'
              }`}
            >
              Automatic
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Comfort & tech features</Label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {comfortFeatures.map(feature => {
            const active = draft.features.includes(feature)
            return (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={`flex items-center justify-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-border bg-background text-muted-foreground hover:border-emerald-300'
                }`}
              >
                {feature}
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
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Local (Within City)</p>
            <p className="text-xs text-muted-foreground">
              Set daily and half-day rates for within-city trips.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="priceLocalDaily">Daily rent (with driver)</Label>
            <Input
              id="priceLocalDaily"
              type="number"
              placeholder="Rs. e.g., 5,000"
              value={draft.priceLocalDaily}
              onChange={e => update({ priceLocalDaily: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="priceLocalHalfDay">Half day rent (6 hours)</Label>
            <Input
              id="priceLocalHalfDay"
              type="number"
              placeholder="Rs. e.g., 3,000"
              value={draft.priceLocalHalfDay}
              onChange={e => update({ priceLocalHalfDay: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="font-semibold">Outstation (City to City)</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="priceOutstationBase">Base rate per day</Label>
            <Input
              id="priceOutstationBase"
              type="number"
              placeholder="Rs. e.g., 7,000"
              value={draft.priceOutstationBase}
              onChange={e => update({ priceOutstationBase: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="priceOutstationExtraKm">Extra km rate</Label>
            <div className="flex items-center gap-2">
              <Input
                id="priceOutstationExtraKm"
                type="number"
                placeholder="Rs. e.g., 45"
                value={draft.priceOutstationExtraKm}
                onChange={e => update({ priceOutstationExtraKm: e.target.value })}
              />
              <span className="text-xs text-muted-foreground">/ km</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border bg-muted/40 p-4">
        <p className="text-sm font-semibold">Driver charges</p>
        <p className="text-xs text-muted-foreground">
          Specify how the driver&apos;s logistics are handled for outstation trips.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={() => update({ driverChargesMode: 'INCLUDED' })}
            className={`rounded-xl border px-4 py-3 text-left text-xs transition-colors ${
              draft.driverChargesMode === 'INCLUDED'
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-border bg-background hover:border-emerald-300'
            }`}
          >
            <p className="font-semibold">Included in rent</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Vendor provides food and stay for driver.
            </p>
          </button>

          <button
            type="button"
            onClick={() => update({ driverChargesMode: 'SEPARATE' })}
            className={`rounded-xl border px-4 py-3 text-left text-xs transition-colors ${
              draft.driverChargesMode === 'SEPARATE'
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-border bg-background hover:border-emerald-300'
            }`}
          >
            <p className="font-semibold">Separate charges</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Customer pays for driver&apos;s food and stay separately.
            </p>
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
    <div className="space-y-4 text-sm">
      <p className="text-xs text-muted-foreground">
        Add clear photos of this vehicle from different angles. Upload high-quality images to help
        customers choose faster.
      </p>

      <div className="space-y-3">
        <Input
          id="photos"
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          disabled={uploading}
        />
        <p className="text-[11px] text-muted-foreground">
          JPG or PNG, up to a few MB each. You can upload multiple photos at once.
        </p>
      </div>

      {uploadError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {uploadError}
        </div>
      )}

      {draft.images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {draft.images.map((url, index) => (
            <div key={index} className="group relative overflow-hidden rounded-xl border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Vehicle photo ${index + 1}`} className="h-28 w-full object-cover" />
              <button
                type="button"
                className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => removeImage(index)}
              >
                Remove
              </button>
            </div>
          ))}
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
    if (!draft.priceLocalDaily.trim() && !draft.priceOutstationBase.trim()) {
      return 'Please provide at least one core price (local daily or outstation base rate).'
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
        priceWithDriver: draft.priceLocalDaily ? Number(draft.priceLocalDaily) : null,
        priceSelfDrive: null,
        priceWithinCity: draft.priceLocalDaily ? Number(draft.priceLocalDaily) : null,
        priceOutOfCity: draft.priceOutstationBase ? Number(draft.priceOutstationBase) : null,
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
        priceWithDriver: draft.priceLocalDaily ? Number(draft.priceLocalDaily) : null,
        priceSelfDrive: null,
        priceWithinCity: draft.priceLocalDaily ? Number(draft.priceLocalDaily) : null,
        priceOutOfCity: draft.priceOutstationBase ? Number(draft.priceOutstationBase) : null,
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
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span
                      className={`uppercase tracking-wide ${
                        isActive ? 'text-emerald-600' : 'text-muted-foreground'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {!isLast && (
                    <div className="mx-2 h-[2px] flex-1 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
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

