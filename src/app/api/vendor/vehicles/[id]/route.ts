import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { getOrCreateVendor } from '@/lib/vendor'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        city: true,
        town: true,
        vehicleModel: {
          include: {
            vehicleBrand: true,
          },
        },
        vehicleType: true,
      },
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(vehicle, { status: 200 })
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()

    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.vehicleModelId !== undefined) updateData.vehicleModelId = body.vehicleModelId
    if (body.vehicleTypeId !== undefined) updateData.vehicleTypeId = body.vehicleTypeId
    if (body.cityId !== undefined) updateData.cityId = body.cityId
    if (body.townId !== undefined) updateData.townId = body.townId
    if (body.year !== undefined) updateData.year = body.year
    if (body.mileage !== undefined) updateData.mileage = body.mileage
    if (body.fuelType !== undefined) updateData.fuelType = body.fuelType
    if (body.transmission !== undefined) updateData.transmission = body.transmission
    if (body.seats !== undefined) updateData.seats = body.seats
    if (body.color !== undefined) updateData.color = body.color
    if (body.images !== undefined) updateData.images = body.images
    if (body.priceWithDriver !== undefined) updateData.priceWithDriver = body.priceWithDriver
    if (body.priceSelfDrive !== undefined) updateData.priceSelfDrive = body.priceSelfDrive
    if (body.priceWithinCity !== undefined) updateData.priceWithinCity = body.priceWithinCity
    if (body.priceOutOfCity !== undefined) updateData.priceOutOfCity = body.priceOutOfCity
    if (body.isAvailable !== undefined) updateData.isAvailable = body.isAvailable
    if (body.status !== undefined) updateData.status = body.status

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(vehicle, { status: 200 })
  } catch (error) {
    console.error('Error updating vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const { user } = await getServerSession(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const vendor = await getOrCreateVendor(user)
    const vendorId = vendor.id

    // Verify that the vehicle belongs to this vendor
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id,
        vendorId,
      },
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found or does not belong to you' },
        { status: 404 }
      )
    }

    // Check for related records
    const [routeCount, bookingCount, inquiryCount] = await Promise.all([
      prisma.route.count({ where: { vehicleId: id } }),
      prisma.booking.count({ where: { vehicleId: id } }),
      prisma.inquiry.count({ where: { vehicleId: id } }),
    ])

    // Delete related routes first (they depend on vehicle)
    if (routeCount > 0) {
      await prisma.route.deleteMany({
        where: { vehicleId: id },
      })
    }

    // If there are bookings or inquiries, we should prevent deletion or handle them
    // For now, we'll prevent deletion if there are bookings (as they represent actual business)
    if (bookingCount > 0) {
      return NextResponse.json(
        { 
          error: `Cannot delete vehicle. It has ${bookingCount} booking(s) associated with it. Please cancel or complete the bookings first.` 
        },
        { status: 400 }
      )
    }

    // Delete inquiries (they're just inquiries, not actual bookings)
    if (inquiryCount > 0) {
      await prisma.inquiry.deleteMany({
        where: { vehicleId: id },
      })
    }

    // Now delete the vehicle
    await prisma.vehicle.delete({
      where: { id },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Error deleting vehicle:', error)
    
    // Check for foreign key constraint errors
    if (error.code === 'P2003' || error.message?.includes('Foreign key constraint')) {
      return NextResponse.json(
        { error: 'Cannot delete vehicle. It is being used in routes or has active bookings. Please remove all routes first.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to delete vehicle' },
      { status: 500 }
    )
  }
}

