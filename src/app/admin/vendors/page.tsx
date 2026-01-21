import { getAllVendors } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function VendorsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page as string) || 1
  const isActive = params.isActive as string | undefined
  const verificationStatus = params.verificationStatus as string | undefined

  const { vendors, total, totalPages } = await getAllVendors({
    page,
    limit: 20,
    isActive: isActive ? isActive === 'true' : undefined,
    verificationStatus,
  })

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Vendors</h1>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Vendors ({total})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{vendor.name}</h3>
                      {vendor.verificationStatus === 'VERIFIED' && (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      )}
                      {vendor.verificationStatus === 'PENDING' && (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      )}
                      {vendor.verificationStatus === 'REJECTED' && (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <p className="font-medium">Contact Person</p>
                        <p>{vendor.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="font-medium">Phone</p>
                        <p>{vendor.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="font-medium">WhatsApp</p>
                        <p>{vendor.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="font-medium">Vehicles</p>
                        <p>{vendor._count.vehicles}</p>
                      </div>
                    </div>
                  </div>
                  <Link href={`/admin/vendors/${vendor.id}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {page > 1 && (
                  <Link href={`/admin/vendors?page=${page - 1}`}>
                    <Button variant="outline">Previous</Button>
                  </Link>
                )}
                <span className="flex items-center px-4">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link href={`/admin/vendors?page=${page + 1}`}>
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

