import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { getOrCreateVendor } from '@/lib/vendor'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(
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

    const body = await request.json()
    const { isActive } = body

    // Verify that the route belongs to this vendor
    const route = await prisma.route.findFirst({
      where: {
        id,
        vendorId,
      },
    })

    if (!route) {
      return NextResponse.json(
        { error: 'Route not found or does not belong to you' },
        { status: 404 }
      )
    }

    const updatedRoute = await prisma.route.update({
      where: { id },
      data: {
        isActive: isActive !== undefined ? isActive : route.isActive,
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

    return NextResponse.json(updatedRoute, { status: 200 })
  } catch (error: any) {
    console.error('Error updating route:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update route' },
      { status: 500 }
    )
  }
}

