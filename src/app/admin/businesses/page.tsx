import { getBusinesses } from '@/lib/services/business.service'
import { RegistrationStatus } from '@prisma/client'
import { BusinessTable } from '@/components/admin/business-table'
import { Button } from '@/components/ui/button'
import { Plus, Upload } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BusinessesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt((params.page as string) || '1')
  const status = params.status as RegistrationStatus | undefined
  const city = params.city as string | undefined
  const search = params.search as string | undefined

  const result = await getBusinesses({
    page,
    limit: 20,
    status,
    city,
    search,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Business Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage rental businesses and vendor accounts
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/businesses/import">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
          </Link>
          <Link href="/admin/businesses/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Business
            </Button>
          </Link>
        </div>
      </div>

      {/* Business Table */}
      <BusinessTable
        businesses={result.businesses}
        total={result.total}
        totalPages={result.totalPages}
        currentPage={page}
      />
    </div>
  )
}

