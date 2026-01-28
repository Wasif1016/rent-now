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

    const routes = await prisma.route.findMany({
      where: {
        vendorId,
      },
      include: {
        fromCity: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        toCity: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            title: true,
            slug: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(routes, { status: 200 })
  } catch (error) {
    console.error('Error fetching routes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch routes' },
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
    const {
      fromCityId,
      toCityId,
      basePrice,
      vehicleId,
    } = body

    // Validate required fields
    const errors: string[] = []

    if (!fromCityId) errors.push('From city is required')
    if (!toCityId) errors.push('To city is required')
    if (!basePrice || isNaN(Number(basePrice)) || Number(basePrice) <= 0) {
      errors.push('Base price is required and must be greater than 0')
    }
    if (!vehicleId) errors.push('Vehicle is required')

    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      )
    }

    // Verify that the vehicle belongs to this vendor
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        vendorId,
      },
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found or does not belong to you' },
        { status: 404 }
      )
    }

    const route = await prisma.route.create({
      data: {
        vendorId,
        fromCityId,
        toCityId,
        vehicleId,
        basePrice: Number(basePrice),
        instantAvailability: false,
        isActive: true,
      },
      include: {
        fromCity: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        toCity: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            title: true,
            slug: true,
            images: true,
          },
        },
      },
    })

    return NextResponse.json(route, { status: 201 })
  } catch (error: any) {
    console.error('Error creating route:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create route' },
      { status: 500 }
    )
  }
}

