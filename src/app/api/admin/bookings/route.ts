import { NextRequest, NextResponse } from 'next/server'
import { getBookings } from '@/lib/data'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const vendorId = searchParams.get('vendorId') || undefined
    const vehicleId = searchParams.get('vehicleId') || undefined
    const status = searchParams.get('status') || undefined

    const result = await getBookings({
      vendorId,
      vehicleId,
      status,
      page,
      limit,
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

