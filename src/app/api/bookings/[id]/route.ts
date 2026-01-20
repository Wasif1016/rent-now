import { NextRequest, NextResponse } from 'next/server'
import { updateBookingStatus } from '@/lib/data'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()

    const { status, totalAmount } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    const booking = await updateBookingStatus(id, status, totalAmount)

    return NextResponse.json(booking, { status: 200 })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

