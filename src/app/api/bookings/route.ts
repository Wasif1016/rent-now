import { NextRequest, NextResponse } from 'next/server'
import { createBooking } from '@/lib/data'
import { sendBookingEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { vehicleId, vendorId, userName, userPhone, bookingDate, message, totalAmount } = body

    if (!vehicleId || !vendorId || !userName || !userPhone) {
      return NextResponse.json(
        { error: 'Missing required fields: vehicleId, vendorId, userName, userPhone' },
        { status: 400 }
      )
    }

    const booking = await createBooking({
      vehicleId,
      vendorId,
      userName,
      userPhone,
      userEmail: body.userEmail,
      bookingDate: bookingDate ? new Date(bookingDate) : undefined,
      message,
      totalAmount,
    })

    // Fire-and-forget email notification via Brevo SMTP (non-blocking)
    sendBookingEmail({
      vehicleId,
      vendorId,
      userName,
      userPhone,
      userEmail: body.userEmail,
      bookingDate,
      message,
      totalAmount,
    }).catch(() => {
      // Errors are logged inside the helper; we don't block the booking
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

 