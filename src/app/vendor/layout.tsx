'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  LayoutDashboard,
  CalendarCheck,
  Car,
  Map,
  Star,
  Wallet,
  Settings,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/vendor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/vendor/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/vendor/vehicles', label: 'Fleet', icon: Car },
  { href: '/vendor/routes', label: 'Routes', icon: Map },
]

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut, session, loading } = useAuth()
  const [vendorLogo, setVendorLogo] = useState<string | null>(null)

  // Redirect admins away from vendor dashboard
  useEffect(() => {
    if (!loading && user) {
      const role = user.user_metadata?.role
      if (role === 'admin') {
        router.push('/admin')
        return
      }
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchVendorLogo = async () => {
      if (!user || !session) return

      // Don't fetch if user is admin
      const role = user.user_metadata?.role
      if (role === 'admin') return

      try {
        const res = await fetch('/api/vendor/profile', {
          headers: {
            ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
          },
        })
        if (res.ok) {
          const data = await res.json()
          if (data.logo) {
            setVendorLogo(data.logo)
          }
        }
      } catch (error) {
        // Ignore errors
      }
    }

    if (user) {
      fetchVendorLogo()
    }
  }, [user, session])

  const handleLogout = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden w-60 flex-col border-r bg-white/95 px-4 py-6 shadow-sm md:flex">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white overflow-hidden">
            {vendorLogo ? (
              <Image src={vendorLogo} alt="Vendor logo" fill className="object-cover" />
            ) : (
              user?.email?.charAt(0).toUpperCase() ?? 'V'
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Vendor Admin</span>
            <span className="text-[11px] text-muted-foreground">
              {user?.email ?? 'Your vendor account'}
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 text-sm">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive =
              pathname === item.href || (item.href !== '/vendor' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-muted-foreground hover:bg-slate-50 hover:text-foreground',
                )}
              >
                <Icon className={cn('h-4 w-4', isActive && 'text-emerald-600')} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Settings and Logout at bottom */}
        <div className="mt-auto space-y-1 border-t pt-4">
          <Link
            href="/vendor/settings"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
              pathname === '/vendor/settings'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-muted-foreground hover:bg-slate-50 hover:text-foreground',
            )}
          >
            <Settings className={cn('h-4 w-4', pathname === '/vendor/settings' && 'text-emerald-600')} />
            <span>Settings</span>
          </Link>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-slate-50 hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>

        <div className="mt-auto hidden text-[11px] text-muted-foreground md:block">
          <p className="px-2">
            Need help?{' '}
            <Link href="/contact" className="font-medium text-emerald-600 hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        {/* Mobile header / nav could go here later */}
        {children}
      </main>
    </div>
  )
}


