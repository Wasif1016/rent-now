'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

export function VendorProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        const redirect = pathname ? `/auth/login?redirect=${encodeURIComponent(pathname)}` : '/auth/login?redirect=/vendor'
        router.push(redirect)
        return
      }

      // Redirect admins to admin dashboard
      const role = user.user_metadata?.role
      if (role === 'admin') {
        router.push('/admin')
        return
      }
    }
  }, [user, loading, router, pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || user.user_metadata?.role === 'admin') {
    return null
  }

  return <>{children}</>
}
