import { notFound } from 'next/navigation'
import { getVendorById } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function VendorDetailPage({ params }: PageProps) {
  const { id } = await params
  const vendor = await getVendorById(id)

  if (!vendor) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <Link href="/admin/vendors">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vendors
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-8">Vendor Details</h1>

        <div className="space-y-6">
          {/* Vendor Information */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Business Name</p>
                  <p className="font-semibold">{vendor.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="font-semibold">{vendor.personName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{vendor.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold">{vendor.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <p className="font-semibold">{vendor.whatsappPhone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verification Status</p>
                  <p className="font-semibold">{vendor.verificationStatus || 'PENDING'}</p>
                </div>
              </div>
              {vendor.address && (
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-semibold">{vendor.address}</p>
                </div>
              )}
              {vendor.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-semibold">{vendor.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vehicles */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicles ({vendor.vehicles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {vendor.vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{vehicle.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.isAvailable ? 'Available' : 'Not Available'}
                      </p>
                    </div>
                    <Link href={`/vehicles/${vehicle.slug}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

