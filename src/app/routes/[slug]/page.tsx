import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MapPin, ArrowRight, Users } from 'lucide-react'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { generateRoutePageMetadata } from '@/lib/seo'
import { generateWhatsAppLink } from '@/lib/whatsapp'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const [fromSlug, toSlug] = slug.split('-to-')

  if (!fromSlug || !toSlug) {
    return {
      title: 'Route Not Found | Rent Now',
    }
  }

  const [fromCity, toCity] = await Promise.all([
    prisma.city.findUnique({
      where: { slug: fromSlug },
      select: { id: true, name: true, slug: true },
    }),
    prisma.city.findUnique({
      where: { slug: toSlug },
      select: { id: true, name: true, slug: true },
    }),
  ])

  if (!fromCity || !toCity) {
    return {
      title: 'Route Not Found | Rent Now',
    }
  }

  return generateRoutePageMetadata({ fromCity, toCity })
}

export default async function RouteDetailPage({ params }: PageProps) {
  const { slug } = await params

  // Parse slug format: "lahore-to-islamabad"
  const [fromSlug, toSlug] = slug.split('-to-')
  
  if (!fromSlug || !toSlug) {
    notFound()
  }

  // Find route by city slugs
  const route = await prisma.route.findFirst({
    where: {
      fromCity: {
        slug: fromSlug,
      },
      toCity: {
        slug: toSlug,
      },
      isActive: true,
    },
    include: {
      fromCity: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      toCity: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      vehicle: {
        select: {
          id: true,
          title: true,
          slug: true,
          images: true,
          seats: true,
          transmission: true,
          fuelType: true,
        },
      },
      vendor: {
        select: {
          id: true,
          name: true,
          verificationStatus: true,
        },
      },
    },
  })

  if (!route) {
    return (
      <div className="min-h-screen bg-background text-zinc-950 flex items-center justify-center"> <h1 className="text-2xl font-bold">This route is not found</h1> </div>
    )
  }

  const vehicleImages = Array.isArray(route.vehicle.images) ? route.vehicle.images : []
  const mainImage = (typeof vehicleImages[0] === 'string' ? vehicleImages[0] : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop')
  const otherImages = vehicleImages.slice(1).filter((img): img is string => typeof img === 'string')

  const vendorPhone = process.env.NEXT_PUBLIC_DEFAULT_VENDOR_PHONE || '923001234567'
  const cleanVendorPhone = vendorPhone.replace(/\D/g, '')
  const telHref = `tel:+${cleanVendorPhone}`

  const whatsappUrl = generateWhatsAppLink({
    title: `${route.fromCity.name} to ${route.toCity.name} - ${route.vehicle.title}`,
    city: { name: route.fromCity.name },
    town: null,
    vehicleModel: null,
  })

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: `${route.fromCity.name} to ${route.toCity.name}`, url: `/routes/${slug}` },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Route Header */}
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">
                    {route.fromCity.name} <ArrowRight className="inline h-6 w-6 mx-2" /> {route.toCity.name}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Intercity Route Service
                  </p>
                </div>
                {route.vendor.verificationStatus === 'VERIFIED' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <span className="text-sm font-medium">Verified Vendor</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>Starting from {route.fromCity.name}</span>
              </div>
            </Card>

            {/* Vehicle Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-zinc-100">
                <Image
                  src={mainImage}
                  alt={route.vehicle.title}
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
                        src={img as string}
                        alt={`${route.vehicle.title} ${idx + 2}`}
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
              <h2 className="text-2xl font-bold mb-4">Vehicle Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{route.vehicle.title}</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {route.vehicle.seats && (
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Capacity</p>
                        <p className="font-semibold">{route.vehicle.seats} Passengers</p>
                      </div>
                    </div>
                  )}
                  {route.vehicle.transmission && (
                    <div>
                      <p className="text-sm text-muted-foreground">Transmission</p>
                      <p className="font-semibold">{route.vehicle.transmission}</p>
                    </div>
                  )}
                  {route.vehicle.fuelType && (
                    <div>
                      <p className="text-sm text-muted-foreground">Fuel Type</p>
                      <p className="font-semibold">{route.vehicle.fuelType}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h2 className="text-2xl font-bold mb-4">Book This Route</h2>

              {/* Pricing */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-1">Starting Price</p>
                <p className="text-3xl font-bold">Rs. {route.basePrice.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">One-way trip</p>
              </div>

              {/* Booking actions */}
              <div className="mt-6 space-y-3">
                <Button
                  asChild
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <a href={telHref}>
                    Call for Booking
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
                <p className="font-semibold">{route.vendor.name}</p>
              </div>

              {/* View Vehicle Link */}
              <div className="mt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/vehicles/${route.vehicle.slug}`}>
                    View Vehicle Details
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

