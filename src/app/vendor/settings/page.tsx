'use client'

import { useState, useEffect, FormEvent, ChangeEvent, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/contexts/auth-context'

export default function VendorSettingsPage() {
  const router = useRouter()
  const { user, session } = useAuth()
  const supabase = useMemo(() => createClient(), [])

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    companyName: '',
    companyAddress: '',
    city: '',
    establishedYear: '',
    phoneNumber: '',
    whatsappNumber: '',
    email: '',
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/vendor/profile', {
          headers: {
            ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
          },
        })
        if (!res.ok) {
          return
        }
        const data = await res.json()
        setForm({
          companyName: data.name || '',
          companyAddress: data.address || '',
          city: data.city || '',
          establishedYear: data.establishedYear?.toString() || '',
          phoneNumber: data.phone || '',
          whatsappNumber: data.whatsappPhone || '',
          email: data.email || '',
        })
        if (data.logo) {
          setLogoUrl(data.logo)
          setAvatarPreview(data.logo)
        }
      } catch (e) {
        // ignore for now
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [session])

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setError(null)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}`
      const filePath = `vendor-${user.id}/logo-${fileName}.${fileExt}`

      const { error: uploadError } = await supabase
        .storage
        .from('vehicle-images')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase
        .storage
        .from('vehicle-images')
        .getPublicUrl(filePath)

      const publicUrl = data.publicUrl
      if (publicUrl) {
        setLogoUrl(publicUrl)
        setAvatarPreview(publicUrl)
      }
    } catch (uploadErr: any) {
      console.error('Error uploading vendor logo:', uploadErr)
      setError(
        uploadErr?.message || 'Failed to upload logo. Please check your connection and try again.',
      )
    }
  }

  const handleChange =
    (field: keyof typeof form) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: event.target.value }))
    }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const payload = {
        ...form,
        logoUrl,
      }

      const res = await fetch('/api/vendor/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save profile')
      }

      router.back()
    } catch (err: any) {
      setError(err.message || 'Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted px-4 py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Vendor Profile Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep your business details up to date so customers can trust and contact you easily.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}
          {/* Profile picture */}
          <Card className="border-none bg-background shadow-sm">
            <CardContent className="flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-full bg-muted">
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="Company profile" fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-muted-foreground">
                    Logo
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-semibold">Company Profile Picture</p>
                  <p className="text-xs text-muted-foreground">
                    Upload a high-quality logo or owner photo. JPG and PNG files are supported.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <label htmlFor="avatar" className="cursor-pointer">
                    <span className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
                      Change Photo
                    </span>
                    <input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                  {avatarPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setAvatarPreview(null)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business information */}
          <Card className="border-none bg-background shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold">Business Information</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                General information about your rental business.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={form.companyName}
                  onChange={handleChange('companyName')}
                  placeholder="Ahmad Rent a Car"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="companyAddress">Business Address *</Label>
                <Input
                  id="companyAddress"
                  value={form.companyAddress}
                  onChange={handleChange('companyAddress')}
                  placeholder="Office address for your rental business"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={handleChange('city')}
                    placeholder="Lahore"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="establishedYear">Established Year</Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    value={form.establishedYear}
                    onChange={handleChange('establishedYear')}
                    placeholder="2018"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact details */}
          <Card className="border-none bg-background shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold">Contact Details</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                How customers and our support team can reach you.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange('phoneNumber')}
                    placeholder="+92 3001234567"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
                  <Input
                    id="whatsappNumber"
                    value={form.whatsappNumber}
                    onChange={handleChange('whatsappNumber')}
                    placeholder="+92 3001234567"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="contact@yourcompany.com"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Footer actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Discard Changes
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}


