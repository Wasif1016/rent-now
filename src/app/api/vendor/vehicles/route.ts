import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { getServerSession } from '@/lib/auth'
import { getOrCreateVendor } from '@/lib/vendor'

export async function GET(request: NextRequest) {
  try {
    const { user } = await getServerSession(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const vendor = await getOrCreateVendor(user)
    const vendorId = vendor.id

    const vehicles = await prisma.vehicle.findMany({
      where: {
        vendorId,
      },
      include: {
        city: {
          select: {
            name: true,
            slug: true,
          },
        },
        town: {
          select: {
            name: true,
            slug: true,
          },
        },
        vehicleModel: {
          include: {
            vehicleBrand: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(vehicles, { status: 200 })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await getServerSession(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const vendor = await getOrCreateVendor(user)
    const vendorId = vendor.id

    const body = await request.json()
    const { vehicleModelId, vehicleTypeId, cityId, townId, title, description, year, mileage, fuelType, transmission, seats, color, images, priceWithDriver, priceSelfDrive, priceWithinCity, priceOutOfCity } = body

    // Validate required fields
    const errors: string[] = []
    if (!cityId) errors.push('City is required')
    if (!title || title.trim() === '') errors.push('Title is required')
    if (!seats || isNaN(Number(seats))) errors.push('Seats (passengers) is required and must be a number')
    if (!transmission) errors.push('Transmission is required')

    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Math.random().toString(36).substring(2, 9)

    const vehicle = await prisma.vehicle.create({
      data: {
        vendorId,
        vehicleModelId: vehicleModelId || null,
        vehicleTypeId: vehicleTypeId || null,
        cityId,
        townId: townId || null,
        title: title.trim(),
        slug,
        description: description || null,
        year: year ? Number(year) : null,
        mileage: mileage ? Number(mileage) : null,
        fuelType: fuelType || null,
        transmission: transmission as 'MANUAL' | 'AUTOMATIC',
        seats: Number(seats),
        color: color || null,
        images:
          images && Array.isArray(images) && images.length > 0
            ? (images as Prisma.InputJsonValue)
            : undefined,
        priceWithDriver: priceWithDriver ? Number(priceWithDriver) : null,
        priceSelfDrive: priceSelfDrive ? Number(priceSelfDrive) : null,
        priceWithinCity: priceWithinCity ? Number(priceWithinCity) : null,
        priceOutOfCity: priceOutOfCity ? Number(priceOutOfCity) : null,
        isAvailable: true,
      },
    })

    return NextResponse.json(vehicle, { status: 201 })
  } catch (error: any) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create vehicle' },
      { status: 500 }
    )
  }
}

