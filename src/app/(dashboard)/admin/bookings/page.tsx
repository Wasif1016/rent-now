import { getBookings } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

type AdminBooking = Awaited<ReturnType<typeof getBookings>>['bookings'][number]

export default async function BookingsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page as string) || 1
  const status = params.status as string | undefined

  const { bookings, total, totalPages } = await getBookings({
    page,
    limit: 20,
    status,
  })

  const statusColors: Record<string, string> = {
    PENDING: 'text-yellow-600',
    CONFIRMED: 'text-green-600',
    CANCELLED: 'text-red-600',
    COMPLETED: 'text-blue-600',
  }

  const statusIcons: Record<string, any> = {
    PENDING: Clock,
    CONFIRMED: CheckCircle2,
    CANCELLED: XCircle,
    COMPLETED: Calendar,
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Bookings</h1>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 mb-6">
          <Link href="/admin/bookings">
            <Button variant={!status ? 'default' : 'outline'}>All</Button>
          </Link>
          <Link href="/admin/bookings?status=PENDING">
            <Button variant={status === 'PENDING' ? 'default' : 'outline'}>Pending</Button>
          </Link>
          <Link href="/admin/bookings?status=CONFIRMED">
            <Button variant={status === 'CONFIRMED' ? 'default' : 'outline'}>Confirmed</Button>
          </Link>
          <Link href="/admin/bookings?status=CANCELLED">
            <Button variant={status === 'CANCELLED' ? 'default' : 'outline'}>Cancelled</Button>
          </Link>
          <Link href="/admin/bookings?status=COMPLETED">
            <Button variant={status === 'COMPLETED' ? 'default' : 'outline'}>Completed</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Bookings ({total})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.map((booking: AdminBooking) => {
                const StatusIcon = statusIcons[booking.status] || Clock
                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <StatusIcon className={`h-5 w-5 ${statusColors[booking.status]}`} />
                        <h3 className="font-semibold">{booking.vehicle.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[booking.status]}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <p className="font-medium">Customer</p>
                          <p>{booking.userName}</p>
                        </div>
                        <div>
                          <p className="font-medium">Phone</p>
                          <p>{booking.userPhone}</p>
                        </div>
                        <div>
                          <p className="font-medium">Total Amount</p>
                          <p>{booking.totalAmount ? `Rs. ${booking.totalAmount.toLocaleString()}` : 'N/A'}</p>
                        </div>
                      </div>
                      {booking.commissionAmount && (
                        <div className="mt-2 text-sm">
                          <span className="text-muted-foreground">Commission (20%): </span>
                          <span className="font-semibold">Rs. {booking.commissionAmount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    <Link href={`/admin/bookings/${booking.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {page > 1 && (
                  <Link href={`/admin/bookings?page=${page - 1}${status ? `&status=${status}` : ''}`}>
                    <Button variant="outline">Previous</Button>
                  </Link>
                )}
                <span className="flex items-center px-4">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link href={`/admin/bookings?page=${page + 1}${status ? `&status=${status}` : ''}`}>
                    <Button variant="outline">Next</Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

