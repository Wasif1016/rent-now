import { NextRequest, NextResponse } from 'next/server'
import { getAllVendors } from '@/lib/data'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const isActive = searchParams.get('isActive')
    const verificationStatus = searchParams.get('verificationStatus')

    const filters: any = {
      page,
      limit,
    }

    if (isActive !== null) {
      filters.isActive = isActive === 'true'
    }

    if (verificationStatus) {
      filters.verificationStatus = verificationStatus
    }

    const result = await getAllVendors(filters)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    )
  }
}

