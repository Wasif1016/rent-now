'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface City {
  id: string
  name: string
  slug: string
  province: string | null
}

export default function NewBusinessPage() {
  const router = useRouter()
  const { session } = useAuth()
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [personName, setPersonName] = useState('')
  const [cityId, setCityId] = useState('')
  const [town, setTown] = useState('')
  const [province, setProvince] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [googleMapsUrl, setGoogleMapsUrl] = useState('')

  useEffect(() => {
    const loadCities = async () => {
      try {
        const res = await fetch('/api/cities')
        if (res.ok) {
          const data = await res.json()
          setCities(data)
        }
      } catch {
        setCities([])
      }
    }
    loadCities()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Business name is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (!session?.access_token) {
        setError('You must be logged in to add a business')
        setLoading(false)
        return
      }

      const response = await fetch('/api/admin/businesses', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          personName: personName.trim() || undefined,
          cityId: cityId || undefined,
          town: town.trim() || undefined,
          province: province.trim() || undefined,
          address: address.trim() || undefined,
          description: description.trim() || undefined,
          googleMapsUrl: googleMapsUrl.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Your session may have expired. Please log in again.')
        }
        if (response.status === 403) {
          throw new Error('Admin access required.')
        }
        throw new Error(data.error || 'Failed to create business')
      }

      if (data.vendor?.id) {
        router.push(`/admin/businesses/${data.vendor.id}`)
      } else {
        router.push('/admin/businesses')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create business')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/businesses">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add Business</h1>
          <p className="text-muted-foreground mt-1">
            Create a new rental business (vendor) in the system
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business details</CardTitle>
          <CardDescription>
            Enter the business information. You can send credentials and complete setup from the business detail page after creation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Business name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Premium Car Rentals"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@business.com"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92-300-1234567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="personName">Contact person name</Label>
                <Input
                  id="personName"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder="Manager name"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cityId">City</Label>
                <select
                  id="cityId"
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Select city</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.province ? ` (${c.province})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="town">Town / area</Label>
                <Input
                  id="town"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  placeholder="e.g. Gulberg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <Input
                id="province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="e.g. Punjab"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full address"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short business description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
              <Input
                id="googleMapsUrl"
                type="url"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create business'}
              </Button>
              <Link href="/admin/businesses">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
