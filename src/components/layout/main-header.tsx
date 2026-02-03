'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
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
import { User, LogOut, Settings, Menu, X, ChevronRight } from 'lucide-react'

const mainLinks = [
  { href: '/', label: 'Home' },
  { href: '/view-all-vehicles', label: 'View all Vehicles' },
  { href: '/rent-a-car/lahore', label: 'Rent in Lahore' },
]

export function MainHeader() {
  const { user, loading, signOut, session } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [vendorLogo, setVendorLogo] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const isDashboard = pathname.startsWith('/vendor') || pathname.startsWith('/admin')

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
    <header className={cn(
      "fixed w-full border-b top-0 z-40 transition-colors",
      isDashboard ? "hidden md:block" : "block",
      "bg-black md:bg-primary-foreground/90 md:backdrop-blur-md"
    )}>
      <div className="container mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="RentNow" width={100} height={100} className="h-8 w-auto" />
          <span className="text-2xl font-bold tracking-tight text-white md:text-background">RentNow</span>
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
                className="hidden md:flex text-black/90 bg-primary px-4 py-1 font-semibold hover:text-primary-foreground transition-colors"
              >
                List Your Vehicles
              </Link>
              <div className="hidden md:block">
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
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/signup"
                className="hidden md:flex text-primary-foreground/90 bg-primary px-4 py-1 font-semibold hover:text-primary-foreground transition-colors items-center gap-2 text-sm"
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

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={cn(
        "fixed inset-0 z-[100] bg-white transition-transform duration-300 ease-in-out md:hidden",
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex h-20 items-center justify-between bg-black px-6">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
            <Image src="/logo.svg" alt="RentNow" width={40} height={40} className="h-10 w-auto" />
            <span className="text-2xl font-bold tracking-tight text-white font-oranienbaum">RentNow</span>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-full p-2 text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col h-full overflow-y-auto px-6 py-6 scrollbar-hide">
          <nav className="space-y-1">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between py-4 border-b border-slate-100 group"
              >
                <span className="text-lg font-medium text-slate-900 group-hover:text-primary transition-colors">
                  {link.label}
                </span>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
              </Link>
            ))}
            
            {user ? (
              <>
                <Link
                  href="/vendor"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-4 border-b border-slate-100 group"
                >
                  <span className="text-lg font-medium text-slate-900">Dashboard</span>
                  <ChevronRight className="h-5 w-5 text-slate-300 transition-all group-hover:translate-x-1" />
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center justify-between w-full py-4 border-b border-slate-100 group text-red-600"
                >
                  <span className="text-lg font-medium">Sign Out</span>
                  <LogOut className="h-5 w-5 opacity-50" />
                </button>
              </>
            ) : (
              <Link
                href="/auth/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between py-5 mt-4 bg-primary px-6 rounded-2xl text-white group shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg text-black font-bold">List Your Vehicle</span>
                </div>
                <ChevronRight className="h-5 w-5 opacity-80" />
              </Link>
            )}
          </nav>

          <div className="mt-12 p-6 rounded-3xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Support & Info</p>
            <div className="space-y-4">
              <Link href="/contact" className="block text-sm font-medium text-slate-600 hover:text-slate-900">Contact Us</Link>
              <Link href="/privacy" className="block text-sm font-medium text-slate-600 hover:text-slate-900">Privacy Policy</Link>
              <Link href="/terms" className="block text-sm font-medium text-slate-600 hover:text-slate-900">Terms of Service</Link>
            </div>
          </div>
          
          <div className="mt-8 pb-32 text-center text-slate-400 text-xs">
            © {new Date().getFullYear()} RentNow. All rights reserved.
          </div>
        </div>
      </div>
    </header>
  )
}


