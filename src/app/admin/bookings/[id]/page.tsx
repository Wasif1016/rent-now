import { notFound } from 'next/navigation'
import { getBookings } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function BookingDetailPage({ params }: PageProps) {
  const { id } = await params
  const { bookings } = await getBookings({ page: 1, limit: 1000 })
  const booking = bookings.find(b => b.id === id)

  if (!booking) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <Link href="/admin/bookings">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-8">Booking Details</h1>

        <div className="space-y-6">
          {/* Booking Information */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold">{booking.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Booking Date</p>
                  <p className="font-semibold">
                    {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-semibold">
                    {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-semibold">{booking.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold">{booking.userPhone}</p>
                </div>
                {booking.userEmail && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{booking.userEmail}</p>
                  </div>
                )}
              </div>
              {booking.message && (
                <div>
                  <p className="text-sm text-muted-foreground">Message</p>
                  <p className="font-semibold">{booking.message}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle</p>
                  <p className="font-semibold">{booking.vehicle.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">
                    {booking.vehicle.town?.name
                      ? `${booking.vehicle.town.name}, ${booking.vehicle.city.name}`
                      : booking.vehicle.city.name}
                  </p>
                </div>
                <Link href={`/vehicles/${booking.vehicle.slug}`}>
                  <Button variant="outline" className="mt-4">View Vehicle</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          {(booking.totalAmount || booking.commissionAmount) && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {booking.totalAmount && (
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">Rs. {booking.totalAmount.toLocaleString()}</p>
                  </div>
                )}
                {booking.commissionAmount && (
                  <div>
                    <p className="text-sm text-muted-foreground">Commission (20%)</p>
                    <p className="text-xl font-semibold text-green-600">
                      Rs. {booking.commissionAmount.toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

