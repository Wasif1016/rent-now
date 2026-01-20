import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    await prisma.vehicle.delete({
      where: { id },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    )
  }
}

