import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function VehicleBookingPage() {
  // This booking step UI is disabled in favour of a simple manual flow (call / WhatsApp).
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <Card className="max-w-lg w-full p-6 md:p-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-3">Online booking is disabled</h1>
        <p className="text-sm md:text-base text-muted-foreground mb-6">
          We now handle all bookings manually. Please go back to the vehicle details page and use
          the <span className="font-semibold">Call for Quick Booking</span> or{' '}
          <span className="font-semibold">WhatsApp Now</span> buttons to contact the vendor
          directly.
        </p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </Card>
    </div>
  )
}
