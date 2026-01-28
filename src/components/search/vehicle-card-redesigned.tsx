'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Users, MapPin, Phone, MessageCircle } from 'lucide-react'
import { generateWhatsAppLink } from '@/lib/whatsapp'

interface VehicleCardRedesignedProps {
  vehicle: {
    id: string
    title: string
    slug: string
    seats?: number | null
    images: string[] | null
    city: { name: string; slug: string }
    town?: { name: string; slug: string } | null
    vendor: {
      name: string
      verificationStatus?: string | null
      phone?: string | null
      whatsappPhone?: string | null
    }
    priceWithinCity?: number | null
    priceOutOfCity?: number | null
  }
}

export function VehicleCard({ vehicle }: VehicleCardRedesignedProps) {
  const imageUrl = vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0
    ? vehicle.images[0]
    : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'

  const isVerified = vehicle.vendor.verificationStatus === 'VERIFIED'

  const locationText = vehicle.town
    ? `${vehicle.town.name}, ${vehicle.city.name}`
    : vehicle.city.name

  // Format price
  const formatPrice = (price: number | null | undefined) => {
    if (!price) return 'N/A'
    return `Rs. ${price.toLocaleString()}`
  }

  // Generate WhatsApp link
  const whatsappUrl = generateWhatsAppLink({
    title: vehicle.title,
    city: { name: vehicle.city.name },
    town: vehicle.town ? { name: vehicle.town.name } : null,
    vehicleModel: null, // We don't have vehicleModel in the card props
  })

  // Get WhatsApp number (prefer vendor's WhatsApp, fallback to phone, then default)
  // Note: The generateWhatsAppLink uses a default number, but we can override it
  const whatsappNumber = vehicle.vendor.whatsappPhone || 
    vehicle.vendor.phone || 
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || 
    '923001234567'
  
  // Override WhatsApp URL with vendor's number if available
  const cleanWhatsAppNumber = whatsappNumber.replace(/\D/g, '')
  const vehicleName = vehicle.title
  const location = vehicle.town
    ? `${vehicle.town.name}, ${vehicle.city.name}`
    : vehicle.city.name
  const message = `Hi, I'm interested in booking ${vehicleName} in ${location}. Please confirm availability.`
  const encodedMessage = encodeURIComponent(message)
  const finalWhatsAppUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodedMessage}`

  // Get phone number for call
  const phoneNumber = vehicle.vendor.phone || whatsappNumber
  const cleanPhoneNumber = phoneNumber.replace(/\D/g, '')
  const telHref = `tel:+${cleanPhoneNumber}`

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col bg-white border-gray-200">
      <Link href={`/vehicles/${vehicle.slug}`} className="block relative">
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={vehicle.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {isVerified && (
            <div className="absolute top-2 left-2 bg-primary text-foreground text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              VERIFIED VENDOR
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        {/* Vehicle Name */}
        <Link href={`/vehicles/${vehicle.slug}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors text-gray-900">
            {vehicle.title}
          </h3>
        </Link>

        {/* Seats */}
        {vehicle.seats && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <Users className="h-4 w-4" />
            <span>{vehicle.seats} Seats</span>
          </div>
        )}

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{locationText}</span>
        </div>

        {/* Pricing */}
        <div className="mb-4 space-y-1">
          {vehicle.priceWithinCity && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Within City:</span>
              <span className="font-semibold text-gray-900">{formatPrice(vehicle.priceWithinCity)}</span>
            </div>
          )}
          {vehicle.priceOutOfCity && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Out of City:</span>
              <span className="font-semibold text-gray-900">{formatPrice(vehicle.priceOutOfCity)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto space-y-2">
          <Button
            asChild
            className="w-full bg-primary hover:bg-foreground text-foreground"
          >
            <a
              href={finalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Now
            </a>
          </Button>
          <Button
            variant="outline"
            asChild
            className="w-full border-primary text-foreground hover:bg-primary hover:text-foreground"
          >
            <a
              href={telHref}
              className="flex items-center justify-center gap-2"
            >
              <Phone className="h-4 w-4 text-foreground" />
              Call Now
            </a>
          </Button>
        </div>
      </div>
    </Card>
  )
}

