import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getVehicleBySlug } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Users, Gauge, Fuel, MapPin, Calendar } from 'lucide-react'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { generateWhatsAppLink } from '@/lib/whatsapp'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { slug } = await params
  const vehicle = await getVehicleBySlug(slug)

  if (!vehicle) {
    notFound()
  }

  const images = Array.isArray(vehicle.images) ? (vehicle.images as string[]) : []
  const mainImage = images[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'
  const otherImages = images.slice(1)

  const location = vehicle.town
    ? `${vehicle.town.name}, ${vehicle.city.name}`
    : vehicle.city.name

  const vehicleName = vehicle.vehicleModel
    ? `${vehicle.vehicleModel.vehicleBrand.name} ${vehicle.vehicleModel.name}`
    : vehicle.title

  const capacity = vehicle.seats

  // For now we use the vendor's phone number directly for manual bookings.
  // Fallback to a generic number if not set.
  const vendorPhone = process.env.NEXT_PUBLIC_DEFAULT_VENDOR_PHONE || '923001234567'

  const cleanVendorPhone = vendorPhone.replace(/\D/g, '')
  const telHref = `tel:+${cleanVendorPhone}`

  const whatsappUrl = generateWhatsAppLink({
    title: vehicle.title,
    city: { name: vehicle.city.name },
    town: vehicle.town ? { name: vehicle.town.name } : null,
    vehicleModel: vehicle.vehicleModel
      ? {
          name: vehicle.vehicleModel.name,
          vehicleBrand: {
            name: vehicle.vehicleModel.vehicleBrand.name,
          },
        }
      : null,
  })

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: vehicle.city.name, url: `/rent-cars/${vehicle.city.slug}` },
    { name: vehicle.title, url: `/vehicles/${vehicle.slug}` },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-zinc-100">
                <Image
                  src={mainImage}
                  alt={vehicle.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {otherImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 p-4">
                  {otherImages.slice(0, 4).map((img, idx) => (
                    <div key={idx} className="relative aspect-video bg-zinc-100 rounded overflow-hidden">
                      <Image
                        src={img}
                        alt={`${vehicle.title} ${idx + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Vehicle Details */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{vehicle.title}</h1>
                  {vehicle.vehicleModel && (
                    <p className="text-lg text-muted-foreground">
                      {vehicle.vehicleModel.vehicleBrand.name} {vehicle.vehicleModel.name}
                    </p>
                  )}
                </div>
                {vehicle.vendor.verificationStatus === 'VERIFIED' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>

              {vehicle.description && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{vehicle.description}</p>
                </div>
              )}

              {/* Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {capacity && (
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Capacity</p>
                      <p className="font-semibold">{capacity} Passengers</p>
                    </div>
                  </div>
                )}
                {vehicle.year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Year</p>
                      <p className="font-semibold">{vehicle.year}</p>
                    </div>
                  </div>
                )}
                {vehicle.mileage && (
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Mileage</p>
                      <p className="font-semibold">{vehicle.mileage.toLocaleString()} km</p>
                    </div>
                  </div>
                )}
                {vehicle.fuelType && (
                  <div className="flex items-center gap-2">
                    <Fuel className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Fuel Type</p>
                      <p className="font-semibold">{vehicle.fuelType}</p>
                    </div>
                  </div>
                )}
                {vehicle.transmission && (
                  <div>
                    <p className="text-sm text-muted-foreground">Transmission</p>
                    <p className="font-semibold">{vehicle.transmission}</p>
                  </div>
                )}
                {vehicle.color && (
                  <div>
                    <p className="text-sm text-muted-foreground">Color</p>
                    <p className="font-semibold">{vehicle.color}</p>
                  </div>
                )}
              </div>

              {/* Features */}
              {vehicle.features && Array.isArray(vehicle.features) && (vehicle.features as string[]).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {(vehicle.features as string[]).map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-muted rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="mt-6 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>{location}</span>
              </div>
            </Card>
          </div>

          {/* Sidebar - Contact Card (manual booking) */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h2 className="text-2xl font-bold mb-4">Quick Booking</h2>

              {/* Pricing (if available) */}
              {(vehicle.priceWithDriver || vehicle.priceSelfDrive) && (
                <div className="mb-6 space-y-3">
                  {vehicle.priceWithDriver && (
                    <div>
                      <p className="text-sm text-muted-foreground">With Driver</p>
                      <p className="text-2xl font-bold">Rs. {vehicle.priceWithDriver.toLocaleString()}/day</p>
                    </div>
                  )}
                  {vehicle.priceSelfDrive && (
                    <div>
                      <p className="text-sm text-muted-foreground">Self Drive</p>
                      <p className="text-2xl font-bold">Rs. {vehicle.priceSelfDrive.toLocaleString()}/day</p>
                    </div>
                  )}
                </div>
              )}

              {/* Manual booking actions */}
              <div className="mt-6 space-y-3">
                <Button
                  asChild
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <a href={telHref}>
                    Call for Quick Booking
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10"
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    WhatsApp Now
                  </a>
                </Button>
              </div>

              {/* Vendor Info */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-1">Vendor</p>
                <p className="font-semibold">{vehicle.vendor.name}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

