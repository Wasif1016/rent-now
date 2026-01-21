import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Car } from 'lucide-react'

export default function VendorDashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Vendor Dashboard</h1>

        {/* Simple manual workflow for now: focus on vehicles only */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Your Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Add and manage the vehicles you list on Rent Now. Customers will contact you directly
                via call or WhatsApp for bookings.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/vendor/vehicles/new">
                  <Button>Add a Vehicle</Button>
                </Link>
                <Link href="/vendor/vehicles">
                  <Button variant="outline">View All Vehicles</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

