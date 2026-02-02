import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/services/activity-log.service'

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAdmin(request)
    const body = await request.json()

    const { fromCityId, toCityId, vehicleId, vendorId, basePrice, isActive } = body

    // Validate required fields
    if (!fromCityId || !toCityId || !vehicleId || !vendorId || !basePrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if route already exists
    const existing = await prisma.vendorRouteOffer.findFirst({
      where: {
        fromCityId,
        toCityId,
        vehicleId,
        vendorId,
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Route already exists for this combination' },
        { status: 400 }
      )
    }

    const route = await prisma.vendorRouteOffer.create({
      data: {
        fromCityId,
        toCityId,
        vehicleId,
        vendorId,
        basePrice: parseInt(basePrice),
        isActive: isActive !== false,
      },
    })

    await logActivity({
      action: 'ROUTE_CREATED',
      entityType: 'ROUTE',
      entityId: route.id,
      adminUserId: user.id,
      details: {
        fromCityId,
        toCityId,
        basePrice,
      },
    })

    return NextResponse.json(route, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.error('Error creating route:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

