import { NextRequest, NextResponse } from 'next/server'
import { getBookingStats } from '@/lib/data'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vendorId = searchParams.get('vendorId') || undefined
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const filters: any = {}
    if (vendorId) filters.vendorId = vendorId
    if (startDate) filters.startDate = new Date(startDate)
    if (endDate) filters.endDate = new Date(endDate)

    const stats = await getBookingStats(filters)

    return NextResponse.json(stats, { status: 200 })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

