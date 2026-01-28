import Link from 'next/link'
import Image from 'next/image'
import { getCitiesWithVehicles, getVehicleTypes } from '@/lib/data'
import { Award, Camera, Share2, MessageCircle, Check } from 'lucide-react'

export async function SeoFooter() {
  const [cities, vehicleTypes] = await Promise.all([
    getCitiesWithVehicles(),
    getVehicleTypes(),
  ])

  // Popular cities for footer links (top 7 as per reference)
  const topCities = cities.slice(0, 7)
  
  // Popular routes
  const popularRoutes = [
    { from: 'Lahore', to: 'Islamabad', fromSlug: 'lahore', toSlug: 'islamabad' },
    { from: 'Karachi', to: 'Hyderabad', fromSlug: 'karachi', toSlug: 'hyderabad' },
    { from: 'Islamabad', to: 'Murree', fromSlug: 'islamabad', toSlug: 'murree' },
    { from: 'Multan', to: 'Lahore', fromSlug: 'multan', toSlug: 'lahore' },
    { from: 'Lahore', to: 'Skardu', fromSlug: 'lahore', toSlug: 'skardu' },
  ]

  // Vehicle types (top 6 as per reference)
  const featuredVehicleTypes = vehicleTypes.slice(0, 6)

  return (
    <footer className="bg-[#1a2332] text-gray-300 py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Company Info Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image 
                src="/logo.svg" 
                alt="RentNow Pk" 
                width={40} 
                height={40} 
                className="h-10 w-auto" 
              />
              <span className="text-normal font-bold text-[#C0F11C] tracking-tight">
                RentNow Pk
              </span>
            </Link>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              Pakistan's most trusted nationwide car rental marketplace. Providing premium mobility solutions with a commitment to safety, reliability, and local expertise since 2018.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0f1419] flex items-center justify-center hover:bg-[#0f1419]/80 transition-colors cursor-pointer">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-[#0f1419] flex items-center justify-center hover:bg-[#0f1419]/80 transition-colors cursor-pointer">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-[#0f1419] flex items-center justify-center hover:bg-[#0f1419]/80 transition-colors cursor-pointer">
                <Share2 className="h-5 w-5 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-[#0f1419] flex items-center justify-center hover:bg-[#0f1419]/80 transition-colors cursor-pointer">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          {/* Top Cities Column */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">
              TOP CITIES
            </h3>
            <ul className="space-y-2 text-sm">
              {topCities.map((city) => (
                <li key={city.id}>
                  <Link
                    href={`/rent-a-car/${city.slug}`}
                    className="text-gray-300 hover:text-[#C0F11C] transition-colors"
                  >
                    Rent a Car in {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Routes Column */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">
              POPULAR ROUTES
            </h3>
            <ul className="space-y-2 text-sm">
              {popularRoutes.map((route, index) => (
                <li key={index}>
                  <Link
                    href={`/routes/${route.fromSlug}-to-${route.toSlug}`}
                    className="text-gray-300 hover:text-[#C0F11C] transition-colors"
                  >
                    {route.from} to {route.to}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/routes"
                  className="text-gray-300 hover:text-[#C0F11C] transition-colors"
                >
                  Inter-city Transfers
                </Link>
              </li>
            </ul>
          </div>

          {/* Vehicle Types Column */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">
              VEHICLE TYPES
            </h3>
            <ul className="space-y-2 text-sm">
              {featuredVehicleTypes.map((type) => (
                <li key={type.id}>
                  <Link
                    href={`/rent-a-car/${type.slug}`}
                    className="text-gray-300 hover:text-[#C0F11C] transition-colors"
                  >
                    {type.name} Rent
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Info Column */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">
              SUPPORT & INFO
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-[#C0F11C] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-[#C0F11C] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/list-your-car"
                  className="text-[#C0F11C] hover:text-[#C0F11C]/80 transition-colors font-semibold"
                >
                  List Your Vehicle (Vendor)
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-[#C0F11C] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-[#C0F11C] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-gray-300 hover:text-[#C0F11C] transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Middle Descriptive Paragraph */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <p className="text-sm text-gray-300 leading-relaxed max-w-5xl">
            RentNow Pk is the leading marketplace for premium car rental services across Pakistan. Whether you're looking for luxury wedding cars in Lahore, reliable inter-city travel from Islamabad to Murree, or group travel coasters in Karachi, our platform connects you with 100% verified vendors. We ensure transparent pricing and 24/7 customer support for all your travel needs within the country.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-300">
            © {new Date().getFullYear()} Pakistan Car Rental Marketplace. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            {/* Verified Vendors Badge */}
            <div className="flex items-center gap-2 px-4 py-2 border border-[#C0F11C] rounded bg-[#0f1419]">
              <Check className="h-4 w-4 text-[#C0F11C]" />
              <span className="text-sm font-semibold text-[#C0F11C]">
                100% VERIFIED VENDORS
              </span>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-600 rounded"></div>
              <div className="w-6 h-6 bg-gray-600 rounded"></div>
              <span className="text-sm text-gray-400">EN-PK</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

