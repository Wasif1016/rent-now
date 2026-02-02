'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut, Settings } from 'lucide-react'

const mainLinks = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Search' },
  { href: '/rent-a-car/lahore', label: 'Rent in Lahore' },
]

export function MainHeader() {
  const { user, loading, signOut, session } = useAuth()
  const router = useRouter()
  const [vendorLogo, setVendorLogo] = useState<string | null>(null)

  useEffect(() => {
    const fetchVendorLogo = async () => {
      if (!user || !session) return

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

    if (!loading && user) {
      fetchVendorLogo()
    }
  }, [user, session, loading])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="fixed w-full border-b bg-primary-foreground/90 backdrop-blur-md top-0 z-40">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="RentNow" width={100} height={100} className='h-8 w-auto' />
          <span className="text-2xl text-background font-bold tracking-tight">RentNow</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          {mainLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-background/90 font-semibold hover:text-background transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-8 w-20 bg-primary animate-pulse" />
          ) : user ? (
            <>
              <Link
                href="/vendor"
                className="text-primary-foreground/90 bg-primary px-4 py-1 font-semibold hover:text-primary-foreground transition-colors"
              >
                List Your Vehicles
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors">
                    <div className="relative w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold overflow-hidden">
                      {vendorLogo ? (
                        <Image src={vendorLogo} alt="Vendor logo" fill className="object-cover" />
                      ) : (
                        user.email?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <span className="hidden sm:inline text-sm text-gray-700">
                      {user.email?.split('@')[0] || 'User'}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">My Account</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/vendor" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                href="/auth/signup"
                className="text-primary-foreground/90 bg-primary px-4 py-1 font-semibold hover:text-primary-foreground transition-colors flex items-center gap-2 text-sm"
              >
                <Image src="/icons/car.svg" alt="Car" width={20} height={20} className="w-auto h-7"
                  style={{
                    // x flip
                    transform: 'scaleX(-1)',
                  }}
                />
                List a vehicle
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}


