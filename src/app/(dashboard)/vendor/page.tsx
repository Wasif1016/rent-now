'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2, Lock, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export default function VendorDashboard() {
  const { session, loading: authLoading, user } = useAuth()
  const router = useRouter()
  const [profileComplete, setProfileComplete] = useState(false)
  const [hasVehicles, setHasVehicles] = useState(false)
  const [hasRoutes, setHasRoutes] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)

  // Redirect admins to admin dashboard
  useEffect(() => {
    if (!authLoading && user) {
      const role = user.user_metadata?.role
      if (role === 'admin') {
        router.push('/admin')
        return
      }
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchProgress = async () => {
      if (!session) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/vendor/dashboard', {
          headers: {
            ...(session.access_token
              ? { Authorization: `Bearer ${session.access_token}` }
              : {}),
          },
        })

        if (response.ok) {
          const data = await response.json()
          setProfileComplete(data.profileComplete)
          setHasVehicles(data.hasVehicles)
          setHasRoutes(data.hasRoutes)
          setProgress(data.progress)
        }
      } catch (error) {
        console.error('Error fetching dashboard progress:', error)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      fetchProgress()
    }
  }, [session, authLoading])

  const completedSteps = [profileComplete, hasVehicles, hasRoutes].filter(Boolean).length
  const totalSteps = 3

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-muted px-4 py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
          <div className="text-center text-muted-foreground">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted px-4 py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        {/* Page heading */}
        <div>
          <p className="text-sm font-medium text-muted-foreground">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Welcome, <span className="text-primary">Vendor</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Let&apos;s get your business road-ready. Complete these steps to start receiving bookings.
          </p>
        </div>

        {/* Main onboarding card */}
        <Card className="overflow-hidden border-none bg-background shadow-sm">
          <CardContent className="flex flex-col gap-10 p-6 md:flex-row md:items-center md:justify-between md:p-10">
            {/* Progress section */}
            <div className="flex flex-col items-center gap-4 md:w-1/3">
              <div
                className="relative flex h-32 w-32 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(var(--primary) 0deg, var(--primary) ${
                    (progress / 100) * 360
                  }deg, var(--muted) ${(progress / 100) * 360}deg, var(--muted) 360deg)`,
                }}
              >
                <div className="absolute inset-3 rounded-full bg-background" />
                <div className="relative text-center">
                  <span className="text-3xl font-semibold">{progress}%</span>
                  <p className="mt-1 text-xs text-muted-foreground">Complete</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">Account Setup Progress</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Almost there! Complete {totalSteps - completedSteps} more steps to go live.
                </p>
              </div>
            </div>

            {/* Steps list */}
            <div className="flex-1 space-y-4">
              {/* Step 1 - Profile Setup */}
              <div className={`flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center md:justify-between ${
                profileComplete 
                  ? 'bg-emerald-50/70 text-emerald-900' 
                  : 'border bg-background'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    profileComplete 
                      ? 'bg-emerald-600 text-white' 
                      : 'border'
                  }`}>
                    1
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      {profileComplete && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                      Set up Profile
                    </p>
                    <p className={`mt-1 text-xs ${
                      profileComplete ? 'text-emerald-900/80' : 'text-muted-foreground'
                    }`}>
                      Complete all fields: Company name, address, city, phone, WhatsApp, email, and logo.
                    </p>
                    {!profileComplete && (
                      <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        ~4 mins to complete
                      </p>
                    )}
                  </div>
                </div>
                {profileComplete ? (
                  <span className="mt-1 text-xs font-semibold tracking-wide text-emerald-700 md:mt-0">
                    COMPLETED
                  </span>
                ) : (
                  <Link href="/vendor/settings">
                    <Button className="w-full md:w-auto">Continue</Button>
                  </Link>
                )}
              </div>

              {/* Step 2 - Add Vehicles */}
              <div className={`flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center md:justify-between ${
                hasVehicles 
                  ? 'bg-emerald-50/70 text-emerald-900' 
                  : 'border bg-background'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    hasVehicles 
                      ? 'bg-emerald-600 text-white' 
                      : 'border'
                  }`}>
                    2
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      {hasVehicles && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                      Add Vehicles
                    </p>
                    <p className={`mt-1 text-xs ${
                      hasVehicles ? 'text-emerald-900/80' : 'text-muted-foreground'
                    }`}>
                      Add at least one vehicle to your fleet.
                    </p>
                    {!hasVehicles && (
                      <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        ~10 mins to complete
                      </p>
                    )}
                  </div>
                </div>
                {hasVehicles ? (
                  <span className="mt-1 text-xs font-semibold tracking-wide text-emerald-700 md:mt-0">
                    COMPLETED
                  </span>
                ) : (
                  <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-3">
                    <Link href="/vendor/vehicles/new">
                      <Button className="w-full md:w-auto">Continue</Button>
                    </Link>
                    <Link href="/vendor/vehicles">
                      <Button variant="outline" className="w-full md:w-auto text-xs">
                        View all vehicles
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Step 3 - Add Routes */}
              <div className={`flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center md:justify-between ${
                hasRoutes 
                  ? 'bg-emerald-50/70 text-emerald-900' 
                  : 'border bg-background'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    hasRoutes 
                      ? 'bg-emerald-600 text-white' 
                      : 'border'
                  }`}>
                    3
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      {hasRoutes && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                      {!hasRoutes && <Lock className="h-4 w-4" />}
                      Add Routes
                    </p>
                    <p className={`mt-1 text-xs ${
                      hasRoutes ? 'text-emerald-900/80' : 'text-muted-foreground'
                    }`}>
                      Add at least one route to define your service areas.
                    </p>
                    {!hasRoutes && (
                      <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        ~5 mins to complete
                      </p>
                    )}
                  </div>
                </div>
                {hasRoutes ? (
                  <span className="mt-1 text-xs font-semibold tracking-wide text-emerald-700 md:mt-0">
                    COMPLETED
                  </span>
                ) : (
                  <Link href="/vendor/routes/new">
                    <Button variant="outline" size="sm" className="md:w-auto">
                      Add route
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support footer */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Need help?</span>
          <Link href="/contact" className="font-medium text-primary hover:underline">
            Contact vendor support
          </Link>
        </div>
      </div>
    </div>
  )
}

